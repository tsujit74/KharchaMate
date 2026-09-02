export interface ParsedReceipt {
  amount: number | null;
  description: string;
  date: string | null;
  currency?: string | null;
  merchant?: string | null;
  taxAmount?: number | null;
  paymentMethod?: string | null;
  confidence?: {
    amount: "high" | "medium" | "low";
    date: "high" | "medium" | "low";
    description: "high" | "medium" | "low";
  };
}

//Main parser

export function parseReceiptText(text: string): ParsedReceipt {
  const normalizedText = normalizeText(text);

  const amount = extractAmount(normalizedText);
  const date = extractDate(normalizedText);
  const description = extractDescription(normalizedText);
  const currency = extractCurrency(normalizedText);
  const merchant = extractMerchant(normalizedText);
  const taxAmount = extractTaxAmount(normalizedText);
  const paymentMethod = extractPaymentMethod(normalizedText);

  return {
    amount,
    description,
    date,
    currency,
    merchant,
    taxAmount,
    paymentMethod,
    confidence: {
      amount: assessAmountConfidence(amount, normalizedText),
      date: assessDateConfidence(date, normalizedText),
      description: assessDescriptionConfidence(description),
    },
  };
}

//Normalize OCR text

function normalizeText(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[ \t]+/g, " ")
    .replace(/[|]{2,}/g, "|")
    .trim();
}

//Amount Extraction

function extractAmount(text: string): number | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  /*
    Priority 1:
    Final total lines.

    Examples:
      TOTAL 465.00
      TOTAL AMOUNT (₹) 630.00
      GRAND TOTAL $252.00
      AMOUNT PAYABLE ₹1,250
      TOTAL DUE 850
  */

  const totalPatterns = [
    /GRAND\s+TOTAL/i,
    /TOTAL\s+AMOUNT/i,
    /AMOUNT\s+PAYABLE/i,
    /AMOUNT\s+DUE/i,
    /TOTAL\s+DUE/i,
    /BALANCE\s+DUE/i,
    /FINAL\s+AMOUNT/i,
    /TOTAL\s+BILL/i,
    /BILL\s+AMOUNT/i,
    /TOTAL\s+VALUE/i,
    /^TOTAL\b/i,
    /TOTAL\s*[:\-]/i,
  ];

  for (const line of lines) {
    if (!totalPatterns.some((pattern) => pattern.test(line))) {
      continue;
    }

    const amounts = extractNumbers(line);

    if (amounts.length > 0) {
      /*
        On a total line, the last number is normally
        the actual final amount.

        Example:
        TOTAL AMOUNT (₹) 630.00

        OCR may read ₹ as 3, so:
        [3, 630.00]

        We return 630.00.
      */
      return amounts[amounts.length - 1];
    }
  }

  /*
    Priority 2:
    Paid amount.
  */

  const paidPatterns = [/AMOUNT\s+PAID/i, /PAID\s+AMOUNT/i, /PAYMENT\s+OF/i];

  for (const line of lines) {
    if (!paidPatterns.some((pattern) => pattern.test(line))) {
      continue;
    }

    const amounts = extractNumbers(line);

    if (amounts.length > 0) {
      return amounts[amounts.length - 1];
    }
  }

  /*
    Priority 3:
    Currency amount.

    Useful for documents like:

      $849.00 Redlands, Cal...

    where there is no "TOTAL" label.
  */

  const currencyValues = extractMoneyValues(text);

  if (currencyValues.length > 0) {
    /*
      For normal receipts, the final currency value is
      generally the final amount.

      However, for a currency-first document such as:

        $849.00 Redlands, Cal...

      the first value is the actual document amount.

      Detect currency-first documents separately.
    */

    const firstLine = lines[0] ?? "";

    if (/^\s*[$₹€£]/.test(firstLine)) {
      return currencyValues[0];
    }

    return currencyValues[currencyValues.length - 1];
  }

  /*
    Priority 4:
    Labeled amount without currency.
  */

  const amountLabelPatterns = [
    /(?:AMOUNT|PRICE|VALUE|SUM|PAYABLE|DUE|PAID)\s*[:\-]?\s*[\$₹€£]?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+(?:\.\d{1,2})?)\s+only\b/i,
  ];

  for (const pattern of amountLabelPatterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      const amount = parseMoney(match[1]);

      if (amount !== null) {
        return amount;
      }
    }
  }

  return null;
}

function assessAmountConfidence(
  amount: number | null,
  text: string,
): "high" | "medium" | "low" {
  if (amount === null) {
    return "low";
  }

  const hasTotalLabel =
    /(?:GRAND\s+TOTAL|TOTAL\s+AMOUNT|^TOTAL\b|AMOUNT\s+PAYABLE|TOTAL\s+DUE)/im.test(
      text,
    );

  const hasCurrency = /(?:[$₹€£]|(?:Rs\.?|INR)\b)/i.test(text);

  if (hasTotalLabel && hasCurrency) {
    return "high";
  }

  if (hasTotalLabel || hasCurrency) {
    return "medium";
  }

  return "low";
}

//Currency

function extractCurrency(text: string): string | null {
  if (/₹|\b(?:Rs\.?|INR)\b/i.test(text)) {
    return "INR";
  }

  if (/\$|\bUSD\b/i.test(text)) {
    return "USD";
  }

  if (/€|\bEUR\b/i.test(text)) {
    return "EUR";
  }

  if (/£|\bGBP\b/i.test(text)) {
    return "GBP";
  }

  if (/¥|\bJPY\b/i.test(text)) {
    return "JPY";
  }

  return null;
}

//Tax

function extractTaxAmount(text: string): number | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (!/\b(?:GST|TAX|CGST|SGST|IGST|VAT|SALES\s+TAX)\b/i.test(line)) {
      continue;
    }

    const numbers = extractNumbers(line);

    if (numbers.length === 0) {
      continue;
    }

    return numbers[numbers.length - 1];
  }

  return null;
}

//Merchant

function extractMerchant(text: string): string | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  /*
    Explicit merchant labels.
  */

  const merchantPatterns = [
    /^(?:STORE|SHOP|MERCHANT|VENDOR|SELLER|RESTAURANT|HOTEL)\s*[:\-]\s*(.+)$/i,
    /(?:STORE|SHOP|MERCHANT|VENDOR|SELLER)\s*[:\-]\s*(.+)$/i,
  ];

  for (const pattern of merchantPatterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return cleanText(match[1]).slice(0, 100);
    }
  }

  for (const line of lines.slice(0, 6)) {
    if (
      line.length > 2 &&
      line.length < 100 &&
      /[A-Za-z]/.test(line) &&
      !isMetadataLine(line) &&
      !isSummaryLine(line) &&
      !/\d{5,}/.test(line)
    ) {
      return cleanText(line);
    }
  }

  return null;
}
//Payement method

function extractPaymentMethod(text: string): string | null {
  const labeledPatterns = [
    /(?:PAYMENT\s+METHOD|PAYMENT\s+MODE|PAID\s+BY|MODE\s+OF\s+PAYMENT)\s*[:\-]?\s*([A-Za-z][A-Za-z ]{1,30})/i,
  ];

  for (const pattern of labeledPatterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      const method = cleanText(match[1]).toUpperCase();

      if (method && method.length < 40 && !isSummaryLine(method)) {
        return method;
      }
    }
  }

  const standaloneMethods = [
    "UPI",
    "CASH",
    "CARD",
    "ONLINE",
    "NET BANKING",
    "WALLET",
    "CHEQUE",
    "CHECK",
    "CREDIT CARD",
    "DEBIT CARD",
  ];

  for (const method of standaloneMethods) {
    const escaped = method.replace(" ", "\\s+");

    if (new RegExp(`\\b${escaped}\\b`, "i").test(text)) {
      return method;
    }
  }

  return null;
}
//Money numbers

function extractMoneyValues(text: string): number[] {
  const matches =
    text.match(
      /(?:[$₹€£]\s*\d[\d,]*(?:\.\d{1,2})?|(?:Rs\.?|INR)\s*\d[\d,]*(?:\.\d{1,2})?)/gi,
    ) ?? [];

  return matches
    .map((value) => {
      const numberMatch = value.match(/\d[\d,]*(?:\.\d{1,2})?/);

      return numberMatch ? parseMoney(numberMatch[0]) : null;
    })
    .filter((value): value is number => value !== null);
}

function extractNumbers(text: string): number[] {
  const matches = text.match(/\d[\d,]*(?:\.\d{1,2})?/g) ?? [];

  return matches
    .map(parseMoney)
    .filter((value): value is number => value !== null);
}

function parseMoney(value: string): number | null {
  const cleaned = value.replace(/[^\d.]/g, "");

  if (!cleaned) {
    return null;
  }

  const amount = Number(cleaned);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return amount;
}

//Date Extractoin

function extractDate(text: string): string | null {
  /*
    First preference:
    date next to a date-related label.
  */

  const labeledPatterns = [
    /(?:DATE|BILL\s+DATE|INVOICE\s+DATE|RECEIPT\s+DATE|TRANSACTION\s+DATE|PURCHASE\s+DATE|ORDER\s+DATE|DUE\s+DATE|PAYMENT\s+DATE)\s*[:\-]?\s*(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]{3,9}\s+\d{2,4})/i,

    /(?:DATE|BILL\s+DATE|INVOICE\s+DATE|RECEIPT\s+DATE|TRANSACTION\s+DATE|PURCHASE\s+DATE|ORDER\s+DATE|DUE\s+DATE|PAYMENT\s+DATE)\s*[:\-]?\s*([A-Za-z]{3,9}\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{2,4})/i,

    /(?:DATE|BILL\s+DATE|INVOICE\s+DATE|RECEIPT\s+DATE|TRANSACTION\s+DATE|PURCHASE\s+DATE|ORDER\s+DATE|DUE\s+DATE|PAYMENT\s+DATE)\s*[:\-]?\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i,

    /(?:DATE|BILL\s+DATE|INVOICE\s+DATE|RECEIPT\s+DATE)\s*[:\-]?\s*(\d{4}-\d{1,2}-\d{1,2})/i,
  ];

  for (const pattern of labeledPatterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      const result = normalizeDate(match[1]);

      if (result) {
        return result;
      }
    }
  }

  /*
    Month-name dates.

    Examples:
      02 Sep 2025
      2 September 2025
      Sep 02, 2025
      June 14th, 2025
  */

  const monthNamePatterns = [
    /\b(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]{3,9}\s+\d{2,4})\b/i,

    /\b([A-Za-z]{3,9}\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{2,4})\b/i,

    /\b(\d{1,2}-[A-Za-z]{3,9}-\d{2,4})\b/i,
  ];

  for (const pattern of monthNamePatterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      const result = normalizeDate(match[1]);

      if (result) {
        return result;
      }
    }
  }

  /*
    ISO date anywhere.
  */

  const isoMatch = text.match(/\b(\d{4}-\d{1,2}-\d{1,2})\b/);

  if (isoMatch?.[1]) {
    return normalizeDate(isoMatch[1]);
  }

  /*
    Indian numeric format.

    02/09/2025 = DD/MM/YYYY
  */

  const numericMatch = text.match(/\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})\b/);

  if (numericMatch?.[1]) {
    return normalizeDate(numericMatch[1]);
  }

  return null;
}

function assessDateConfidence(
  date: string | null,
  text: string,
): "high" | "medium" | "low" {
  if (date === null) {
    return "low";
  }

  const hasDateLabel =
    /\b(?:DATE|BILL\s+DATE|INVOICE\s+DATE|RECEIPT\s+DATE|TRANSACTION\s+DATE|PURCHASE\s+DATE)\b/i.test(
      text,
    );

  return hasDateLabel ? "high" : "medium";
}

//Normalize Date

function normalizeDate(date: string): string | null {
  const cleaned = date
    .replace(/,/g, "")
    .replace(/\b(st|nd|rd|th)\b/gi, "")
    .trim();

  /*
    YYYY-MM-DD
  */

  let match = cleaned.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    return buildDate(day, month, year);
  }

  /*
    DD Month YYYY
  */

  match = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{2,4})$/i);

  if (match) {
    const day = Number(match[1]);
    const month = getMonthNumber(match[2]);

    let year = Number(match[3]);

    if (match[3].length === 2) {
      year += 2000;
    }

    return buildDate(day, month, year);
  }

  /*
    Month DD YYYY
  */

  match = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2})\s+(\d{2,4})$/i);

  if (match) {
    const month = getMonthNumber(match[1]);
    const day = Number(match[2]);

    let year = Number(match[3]);

    if (match[3].length === 2) {
      year += 2000;
    }

    return buildDate(day, month, year);
  }

  /*
    DD-Mon-YYYY
  */

  match = cleaned.match(/^(\d{1,2})-([A-Za-z]{3,9})-(\d{2,4})$/i);

  if (match) {
    const day = Number(match[1]);
    const month = getMonthNumber(match[2]);

    let year = Number(match[3]);

    if (match[3].length === 2) {
      year += 2000;
    }

    return buildDate(day, month, year);
  }

  /*
    DD/MM/YYYY
  */

  const parts = cleaned.split(/[\/\-.]/);

  if (parts.length === 3) {
    const day = Number(parts[0]);
    const month = Number(parts[1]);

    let year = Number(parts[2]);

    if (parts[2].length === 2) {
      year += 2000;
    }

    return buildDate(day, month, year);
  }

  return null;
}

//DESCRIPTION / ITEMS

function extractDescription(text: string): string {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const products: string[] = [];

  let itemSectionStarted = false;
  let lastProductIndex = -1;

  for (const line of lines) {
    /*
      Financial/payment section means the item table is over.
    */

    if (isSummaryLine(line)) {
      if (itemSectionStarted) {
        break;
      }

      continue;
    }

    /*
      Ignore metadata before item section.
    */

    if (!itemSectionStarted && isMetadataLine(line)) {
      continue;
    }

    if (isItemHeader(line)) {
      itemSectionStarted = true;
      continue;
    }

    /*
      Try strict item-row detection.
    */

    const product = parseItemRow(line);

    if (product) {
      itemSectionStarted = true;

      addProduct(products, product);

      lastProductIndex = products.length - 1;

      continue;
    }

    /*
      Support multiline product names.

      Example:

        7. Biscuits 1 20.00 20.00
        (Parle-G)

      => Biscuits (Parle-G)
    */

    if (
      itemSectionStarted &&
      lastProductIndex >= 0 &&
      isItemContinuation(line)
    ) {
      const continuation = cleanContinuation(line);

      if (continuation) {
        products[lastProductIndex] =
          `${products[lastProductIndex]} ${continuation}`.trim();
      }
    }
  }

  /*
    If we found products, return ONLY products.

    This is the most important protection against
    random OCR text entering the description.
  */

  if (products.length > 0) {
    return products.join(", ");
  }

  /*
    No item table found.

    Try explicit description/product/service.
  */

  const labeledDescription = extractLabeledDescription(lines);

  if (labeledDescription) {
    return labeledDescription;
  }

  /*
    Bill of Sale / vehicle / asset fallback.
  */

  return extractDocumentAsset(lines);
}

//   DESCRIPTION CONFIDENCE

function assessDescriptionConfidence(
  description: string,
): "high" | "medium" | "low" {
  if (!description) {
    return "low";
  }

  const itemCount = description
    .split(",")
    .filter((value) => value.trim()).length;

  if (itemCount >= 2) {
    return "high";
  }

  if (itemCount === 1 && description.length > 5) {
    return "medium";
  }

  return "low";
}

//Item header

function isItemHeader(line: string): boolean {
  const normalized = line
    .replace(/[|;{}[\]:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const hasItemWord =
    /\bITEM\b|\bITEM\s+NAME\b|\bDESCRIPTION\b|\bPRODUCT\b|\bPARTICULARS\b|\bDETAILS\b/i.test(
      normalized,
    );

  const hasQtyWord = /\bQTY\b|\bQUANTITY\b/i.test(normalized);

  const hasAmountWord = /\bAMOUNT\b|\bPRICE\b|\bRATE\b|\bTOTAL\b/i.test(
    normalized,
  );

  return (
    (hasItemWord && hasQtyWord) ||
    (hasItemWord && hasAmountWord) ||
    (hasQtyWord && hasAmountWord)
  );
}

//STRICT ITEM ROW PARSER

function parseItemRow(line: string): string | null {
  const rawLine = line.trim();

  if (!rawLine) {
    return null;
  }

  if (isSummaryLine(rawLine)) {
    return null;
  }

  if (isMetadataLine(rawLine)) {
    return null;
  }

  /*
    --------------------------------------------------
    STRUCTURAL CHECK
    --------------------------------------------------

    We do NOT simply accept any line containing numbers.

    Valid examples:

      1. Milk 1 60.00 60.00
      2. Rice 1 60.00
      Milk 1 60.00
      Product A 45.00 90.00

    Invalid examples:

      Main Market, Civil Lines Bill No-1258
      Phone: 9876543210
      Date: 02/09/2025
      Customer Name: Rahul
  */

  const hasLeadingSerial = /^(?:\d+|[IiLl])[\s.|;:{}[\]]+(?=[A-Za-z(])/i.test(
    rawLine,
  );

  // Count numeric tokens

  const numberMatches = rawLine.match(/\d[\d,]*(?:\.\d{1,2})?/g) ?? [];

  //Do not treat a single long number as an item

  const hasMultipleNumericColumns = numberMatches.length >= 2;

  //Quantity + amount structure

  const hasQuantityAmountStructure =
    /\s(?:\d+|[iIlLqQ][iIlLqQ]?|[0-9]+[,.:])\s+(?:[$₹€£]\s*)?\d[\d,]*(?:\.\d{1,2})?/i.test(
      rawLine,
    );

  //A serial number by itself isn't enough

  if (
    !hasQuantityAmountStructure &&
    !(hasLeadingSerial && hasMultipleNumericColumns)
  ) {
    return null;
  }

  //CLEAN TABLE SEPARATORS

  let cleaned = rawLine
    .replace(/[|;{}[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  //Final amount

  const finalAmountMatch = cleaned.match(
    /(?:[$₹€£]\s*)?\d[\d,]*(?:\.\d{1,2})?\s*$/,
  );

  if (!finalAmountMatch || finalAmountMatch.index === undefined) {
    return null;
  }

  cleaned = cleaned.slice(0, finalAmountMatch.index).trim();

  //REMOVE RATE / UNIT PRICE

  cleaned = cleaned
    .replace(/\s+(?:[$₹€£]\s*)?\d[\d,]*(?:\.\d{1,2})?\s*$/, "")
    .trim();

  //REMOVE QUANTITY

  cleaned = cleaned
    .replace(/\s+(?:\d+|[iIlLqQ][iIlLqQ]?|[0-9]+[,.:])\s*$/, "")
    .trim();

  // REMOVE SERIAL NUMBER

  cleaned = cleaned
    .replace(/^(?:\d+|[IiLl])[\s.]*[|;,:-]?\s*(?=[A-Za-z(])/, "")
    .trim();

  //CLEAN REMAINING OCR PUNCTUATION

  cleaned = cleaned
    .replace(/^[|;{}[\].,:-]+/, "")
    .replace(/[|;{}[\].,:-]+$/, "")
    .replace(/\s+/g, " ")
    .trim();

  //must contain letters

  if (!/[A-Za-z]/.test(cleaned)) {
    return null;
  }

  //  Avoid extremely long metadata/sentence lines.

  if (cleaned.length > 120) {
    return null;
  }

  /*
    Reject obvious headers.
  */

  if (
    /^(ITEM|ITEM NAME|DESCRIPTION|PRODUCT|PARTICULARS|DETAILS|QTY|QUANTITY|AMOUNT|PRICE|UNIT PRICE|RATE|TOTAL)$/i.test(
      cleaned,
    )
  ) {
    return null;
  }

  /*
    Reject metadata.
  */

  if (isMetadataLine(cleaned)) {
    return null;
  }

  return cleaned;
}

/* ITEM CONTINUATION */

function isItemContinuation(line: string): boolean {
  if (!line) {
    return false;
  }

  /*
    Never attach summary/payment lines.
  */

  if (isSummaryLine(line) || isMetadataLine(line)) {
    return false;
  }

  /*
    If it is another valid item row,
    it is NOT a continuation.
  */

  if (parseItemRow(line)) {
    return false;
  }

  /*
    Do not attach lines ending in a money value.
    This protects against accidentally attaching
    another table row.
  */

  if (/(?:[$₹€£]\s*)?\d[\d,]*(?:\.\d{1,2})?\s*$/.test(line)) {
    return false;
  }

  /*
    Typical continuation:

      (Parle-G)
      Premium Quality
      Brown Bread
  */

  return /^[A-Za-z(]/.test(line);
}

//clean continuaiton

function cleanContinuation(line: string): string {
  return line
    .replace(/^[|;{}[\]\s]+/, "")
    .replace(/[|;{}[\]\s]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

//Add product

function addProduct(products: string[], product: string): void {
  const cleaned = cleanText(product);

  if (!cleaned) {
    return;
  }

  /*
    Prevent duplicate products caused by OCR.
  */

  if (!products.some((item) => item.toLowerCase() === cleaned.toLowerCase())) {
    products.push(cleaned);
  }
}

//labeled description fall back

function extractLabeledDescription(lines: string[]): string {
  const patterns = [
    /^(?:DESCRIPTION|ITEM|PRODUCT|SERVICE)\s*[:\-]\s*(.+)$/i,

    /(?:DESCRIPTION|ITEM|PRODUCT|SERVICE)\s*[:\-]\s*(.+)$/i,
  ];

  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);

      if (match?.[1]) {
        const value = cleanText(match[1]);

        if (value && !isSummaryLine(value)) {
          return value;
        }
      }
    }
  }

  return "";
}
//bill of slae

function extractDocumentAsset(lines: string[]): string {
  //support doc such like normal text like automobile

  const assetWords =
    "(automobile|vehicle|car|truck|motorcycle|scooter|equipment|machinery|property|boat|trailer)";

  const patterns = [
    new RegExp(`\\b(?:one|a|an)\\.?\\s+(.+?\\s+${assetWords})\\b`, "i"),

    new RegExp(`\\b([A-Za-z0-9][A-Za-z0-9 .,'()/-]*\\s+${assetWords})\\b`, "i"),
  ];

  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);

      if (match?.[1]) {
        const value = cleanText(match[1])
          .replace(/[.,]+$/, "")
          .trim();

        if (value.length >= 3) {
          return value;
        }
      }
    }
  }

  return "";
}

//summary line

function isSummaryLine(line: string): boolean {
  const normalized = line.replace(/^[|;{}[\]\s]+/, "").trim();

  return /^(SUBTOTAL|TOTAL|GRAND\s+TOTAL|TOTAL\s+AMOUNT|TAX|SALES\s+TAX|GST|CGST|SGST|IGST|DISCOUNT|AMOUNT\s+PAID|PAID\s+AMOUNT|PAYMENT|PAYMENT\s+METHOD|BALANCE|CHANGE|ROUND\s+OFF|NET\s+AMOUNT|AMOUNT\s+PAYABLE|AMOUNT\s+DUE|TOTAL\s+DUE|BALANCE\s+DUE|AMOUNT\s+IN\s+WORDS)\b/i.test(
    normalized,
  );
}

//metadata

function isMetadataLine(line: string): boolean {
  return /^(SMART\s+MART|RECEIPT|BILL\s+OF\s+SALE|BILL|INVOICE|PHONE|PH\.?|DATE|TIME|CASHIER|CUSTOMER|CUSTOMER\s+NAME|BILL\s+NO|BILL\s+NO\.|RECEIPT\s+NO|RECEIPT\s+NO\.|GSTIN|ADDRESS|PAYMENT|PAYMENT\s+MODE|PAID|THANK\s+YOU|THANK|VISIT\s+AGAIN|VALUE\s+RECEIVED|FOR\s+AND\s+IN\s+CONSIDERATION|TRANSACTION\s+ID|ORDER\s+ID|CONSUMER\s+NO|BILL\s+PERIOD)\b/i.test(
    line.trim(),
  );
}

//clean text
function cleanText(value: string): string {
  return value
    .replace(/[|;{}[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

//month

function getMonthNumber(month: string): number | null {
  const months: Record<string, number> = {
    jan: 1,
    january: 1,

    feb: 2,
    february: 2,

    mar: 3,
    march: 3,

    apr: 4,
    april: 4,

    may: 5,

    jun: 6,
    june: 6,

    jul: 7,
    july: 7,

    aug: 8,
    august: 8,

    sep: 9,
    sept: 9,
    september: 9,

    oct: 10,
    october: 10,

    nov: 11,
    november: 11,

    dec: 12,
    december: 12,
  };

  return months[month.toLowerCase()] ?? null;
}

//validate date

function buildDate(
  day: number,
  month: number | null,
  year: number,
): string | null {
  if (month === null || !Number.isInteger(day) || !Number.isInteger(year)) {
    return null;
  }

  if (day < 1 || day > 31) {
    return null;
  }

  if (month < 1 || month > 12) {
    return null;
  }

  if (year < 2000 || year > 2100) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  //invalid date

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${String(month).padStart(
    2,
    "0",
  )}-${String(day).padStart(2, "0")}`;
}

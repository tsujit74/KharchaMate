"use client";

import { useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import { parseReceiptText } from "@/app/utils/receiptParser";

type ScanResult = {
  amount: number | null;
  description: string;
  date: string | null;
};

type Props = {
  onScanStart: () => void;
  onScanComplete: (data: ScanResult) => void;
};


const preprocessImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      try {
        // Keep the image large enough for OCR,
        // but avoid processing extremely large phone photos.
        const maxDimension = 2200;

        const scale = Math.min(
          1,
          maxDimension / Math.max(image.width, image.height),
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.max(
          1,
          Math.round(image.width * scale),
        );

        canvas.height = Math.max(
          1,
          Math.round(image.height * scale),
        );

        const ctx = canvas.getContext("2d", {
          willReadFrequently: true,
        });

        if (!ctx) {
          reject(
            new Error("Could not create canvas context."),
          );
          return;
        }

        // Draw the original image onto the canvas.
        ctx.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        // Get image pixels.
        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        const data = imageData.data;

       
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Standard luminance calculation.
          const gray =
            0.299 * r +
            0.587 * g +
            0.114 * b;

          // Moderate contrast enhancement.
          const contrast = 1.25;

          const enhanced =
            (gray - 128) * contrast + 128;

          const value = Math.max(
            0,
            Math.min(255, enhanced),
          );

          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert processed image back to PNG.
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error(
                  "Could not create processed image.",
                ),
              );
              return;
            }

            resolve(blob);
          },
          "image/png",
          1,
        );
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image."));
    };

    image.src = objectUrl;
  });
};

export default function ScanBill({
  onScanStart,
  onScanComplete,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Used to identify the latest OCR request.
  const scanIdRef = useRef(0);

  // Stores the current preview URL so it can be revoked.
  const imageUrlRef = useRef<string | null>(null);

  // Stores the active Tesseract worker.
  const workerRef =
    useRef<Awaited<ReturnType<typeof createWorker>> | null>(
      null,
    );

  const [image, setImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  /**
   * Revoke the current preview URL.
   */
  const revokeImageUrl = () => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }
  };

  /**
   * Reset the current scan.
   */
  const resetScan = async () => {
    // Invalidate any currently running OCR operation.
    scanIdRef.current += 1;

    // Stop active OCR worker if possible.
    if (workerRef.current) {
      try {
        await workerRef.current.terminate();
      } catch (err) {
        console.error(
          "Failed to terminate OCR worker:",
          err,
        );
      } finally {
        workerRef.current = null;
      }
    }

    revokeImageUrl();

    setImage(null);
    setOcrText("");
    setError("");
    setProgress(0);
    setLoading(false);

    // Allow selecting the same image again.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clear amount, description and warning in parent.
    onScanStart();
  };

  /**
   * Handle image selection.
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // A new file was actually selected,
    // so now clear previous OCR data/warning.
    onScanStart();

    // Invalidate any previous OCR request.
    const currentScanId = ++scanIdRef.current;

    setError("");
    setOcrText("");
    setProgress(0);
    setLoading(false);

    // Clean up previous preview URL.
    revokeImageUrl();

    // Validate file type.
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImage(null);
      setError(
        "Please upload a JPG, PNG, or WebP image.",
      );

      // Allow selecting the same file again.
      event.target.value = "";

      return;
    }

    // Validate file size.
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setImage(null);
      setError(
        "Image size must be less than 10 MB.",
      );

      event.target.value = "";

      return;
    }

    // Create preview URL using the original image.
    const imageUrl = URL.createObjectURL(file);

    imageUrlRef.current = imageUrl;
    setImage(imageUrl);

    await runOCR(file, currentScanId);
  };

  /**
   * Run OCR on the selected image.
   */
  const runOCR = async (
    file: File,
    currentScanId: number,
  ) => {
    setLoading(true);
    setError("");
    setProgress(0);

    let worker:
      | Awaited<ReturnType<typeof createWorker>>
      | null = null;

    try {
      /*
       * Create Tesseract worker.
       */
      worker = await createWorker("eng", 1, {
        logger: (message) => {
          // Ignore progress from an old scan.
          if (
            currentScanId !== scanIdRef.current
          ) {
            return;
          }

          if (
            message.status === "recognizing text"
          ) {
            setProgress(
              Math.round(
                message.progress * 100,
              ),
            );
          }
        },
      });

      /*
       * A newer scan may have started while
       * Tesseract was initializing.
       */
      if (
        currentScanId !== scanIdRef.current
      ) {
        await worker.terminate();
        return;
      }

      workerRef.current = worker;

      
      const processedImage =
        await preprocessImage(file);

      
      if (
        currentScanId !== scanIdRef.current
      ) {
        return;
      }

      /*
       * Run OCR on the processed image.
       */
      const {
        data: { text },
      } = await worker.recognize(
        processedImage,
      );

    
      if (
        currentScanId !== scanIdRef.current
      ) {
        return;
      }

      setOcrText(text);

      /*
       * Parse OCR text using your existing parser.
       */
      const parsed = parseReceiptText(text);

      console.log("OCR result:", text);
      console.log(
        "Parsed receipt:",
        parsed,
      );

      /*
       * Send result to parent.
       */
      onScanComplete({
        amount: parsed.amount ?? null,
        description:
          parsed.description ?? "",
        date: parsed.date ?? null,
      });

      setProgress(100);
    } catch (err) {
      console.error("OCR error:", err);

      /*
       * Don't show an error from an old scan.
       */
      if (
        currentScanId !== scanIdRef.current
      ) {
        return;
      }

      setOcrText("");
      setProgress(0);

      setError(
        "Unable to read the bill. Please try another image.",
      );

      /*
       * Clear form values because OCR failed.
       */
      onScanComplete({
        amount: null,
        description: "",
        date: null,
      });
    } finally {
      /*
       * Always terminate the worker.
       */
      if (worker) {
        try {
          await worker.terminate();
        } catch (err) {
          console.error(
            "Failed to terminate OCR worker:",
            err,
          );
        }
      }

      /*
       * Only update loading state if this
       * is still the latest scan.
       */
      if (
        currentScanId === scanIdRef.current
      ) {
        workerRef.current = null;
        setLoading(false);
      }
    }
  };

  
  const openFilePicker = () => {
    // Clear the input first.
    // This allows selecting the same image again.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    fileInputRef.current?.click();
  };

  
  useEffect(() => {
    return () => {
      // Invalidate any running OCR.
      scanIdRef.current += 1;

      revokeImageUrl();

      if (workerRef.current) {
        workerRef.current
          .terminate()
          .catch((err) => {
            console.error(
              "Failed to terminate OCR worker:",
              err,
            );
          });

        workerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {!image && (
        <button
          type="button"
          onClick={openFilePicker}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium transition hover:bg-gray-50"
        >
          📷 Scan Bill
        </button>
      )}

      {image && (
        <>
          {/* Preview */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Bill Preview
            </p>

            <img
              src={image}
              alt="Bill preview"
              className="max-h-64 w-full rounded-lg border bg-white object-contain"
            />
          </div>

          {/* Progress */}
          {loading && (
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>
                  Extracting text...
                </span>

                <span>
                  {progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {!loading &&
            ocrText &&
            !error && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                ✓ Bill scanned successfully.
                Details have been added to the
                expense form.
              </div>
            )}

          {/* Debug OCR */}
          {ocrText && (
            <details className="rounded-lg border bg-gray-50 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                View extracted text
              </summary>

              <textarea
                value={ocrText}
                readOnly
                rows={8}
                className="mt-3 w-full rounded-lg border bg-white p-3 text-xs"
              />
            </details>
          )}

          {/* Scan another bill */}
          {!loading && (
            <button
              type="button"
              onClick={resetScan}
              className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Scan Another Bill
            </button>
          )}
        </>
      )}
    </div>
  );
}
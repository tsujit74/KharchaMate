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

export default function ScanBill({ onScanStart, onScanComplete }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanIdRef = useRef(0);

  const imageUrlRef = useRef<string | null>(null);

  const workerRef = useRef<Awaited<ReturnType<typeof createWorker>> | null>(
    null,
  );

  const [image, setImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const revokeImageUrl = () => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }
  };

  const resetScan = async () => {
    // Invalidate any currently running OCR operation.
    scanIdRef.current += 1;

    // Stop active OCR worker if possible.
    if (workerRef.current) {
      try {
        await workerRef.current.terminate();
      } catch (err) {
        console.error("Failed to terminate OCR worker:", err);
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

    // Clear amount, description and warning in the parent.
    onScanStart();
  };

  //Handle image selection
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Start a completely new scan.
    // This clears the previous warning and form values.
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
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setImage(null);
      setError("Please upload a JPG, PNG, or WebP image.");

      // Reset input so the same invalid file can be selected again.
      event.target.value = "";

      return;
    }

    // Validate file size.
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setImage(null);
      setError("Image size must be less than 10 MB.");

      event.target.value = "";

      return;
    }

    // Create preview URL.
    const imageUrl = URL.createObjectURL(file);

    imageUrlRef.current = imageUrl;
    setImage(imageUrl);

    await runOCR(file, currentScanId);
  };

  //Run OCR on the selected image.
  const runOCR = async (file: File, currentScanId: number) => {
    setLoading(true);
    setError("");
    setProgress(0);

    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

    try {
      worker = await createWorker("eng", 1, {
        logger: (message) => {
          // Ignore progress from an old scan.
          if (currentScanId !== scanIdRef.current) {
            return;
          }

          if (message.status === "recognizing text") {
            setProgress(Math.round(message.progress * 100));
          }
        },
      });

      // If a newer scan started while worker was loading,
      // stop this worker and ignore this scan.
      if (currentScanId !== scanIdRef.current) {
        await worker.terminate();
        return;
      }

      workerRef.current = worker;

      const {
        data: { text },
      } = await worker.recognize(file);

      // Ignore result if this is no longer the latest scan.
      if (currentScanId !== scanIdRef.current) {
        return;
      }

      setOcrText(text);

      // Parse OCR text.
      const parsed = parseReceiptText(text);

      console.log("OCR result:", text);
      console.log("Parsed receipt:", parsed);

      // Send result to parent.
      onScanComplete({
        amount: parsed.amount ?? null,
        description: parsed.description ?? "",
        date: parsed.date ?? null,
      });

      setProgress(100);
    } catch (err) {
      console.error("OCR error:", err);

      // Don't show an error from an old scan.
      if (currentScanId !== scanIdRef.current) {
        return;
      }

      setOcrText("");
      setProgress(0);

      setError("Unable to read the bill. Please try another image.");

      // Clear form values because OCR failed.
      onScanComplete({
        amount: null,
        description: "",
        date: null,
      });
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (err) {
          console.error("Failed to terminate OCR worker:", err);
        }
      }

      // Only update state if this is still the current scan.
      if (currentScanId === scanIdRef.current) {
        workerRef.current = null;
        setLoading(false);
      }
    }
  };

  //file picker
  const openFilePicker = () => {
    onScanStart();

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
        workerRef.current.terminate().catch((err) => {
          console.error("Failed to terminate OCR worker:", err);
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
                <span>Extracting text...</span>
                <span>{progress}%</span>
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
          {!loading && ocrText && !error && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              ✓ Bill scanned successfully. Details have been added to the
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

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);
  const redirected = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (seconds <= 0 && !redirected.current) {
      redirected.current = true;
      router.replace("/");
    }
  }, [seconds, router]);

  const handleRedirect = () => {
    if (!redirected.current) {
      redirected.current = true;
      router.replace("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4 text-center">
      
      <div className="bg-white dark:bg-gray-900 p-10 max-w-md w-full border dark:border-gray-700">
        
        <AlertTriangle className="mx-auto mb-4 h-14 w-14 text-red-500" />

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          404
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Oops! The page you're looking for doesn't exist.
        </p>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Redirecting to Home in{" "}
          <span className="font-semibold">{seconds}</span> seconds...
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          
          <button
            onClick={handleRedirect}
            className="flex items-center justify-center gap-2 rounded-xl bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 hover:opacity-90 transition"
          >
            <Home size={18} />
            Go Home Now
          </button>

          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-5 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>
      </div>
    </div>
  );
}
"use client";

import React from "react";

export default function ErrorDisplay({ error }: { error: string }) {
  if (!error) return null;

  return (
    <div className="text-red-600 bg-red-50 border border-red-200 p-3 text-sm rounded">
      {error}
    </div>
  );
}
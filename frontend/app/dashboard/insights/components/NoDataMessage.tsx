"use client";

import React from "react";

export default function NoDataMessage() {
  return (
    <div className="bg-white border border-gray-200 p-10 text-center rounded">
      <p className="text-gray-500 text-sm">
        No spending data available for this period.
      </p>
    </div>
  );
}
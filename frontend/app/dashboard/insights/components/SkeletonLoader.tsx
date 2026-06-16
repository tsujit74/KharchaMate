"use client";

import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
      <div className="h-72 sm:h-96 bg-gray-200 rounded" />
    </div>
  );
}
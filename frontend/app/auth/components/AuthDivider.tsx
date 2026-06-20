"use client";

import React from "react";

const AuthDivider: React.FC = () => {
  return (
    <div className="my-6 flex items-center justify-center">
      <div className="flex-auto border-t border-gray-300" />
      <span className="bg-white px-4 text-xs text-gray-400 uppercase font-semibold">
        OR
      </span>
      <div className="flex-auto border-t border-gray-300" />
    </div>
  );
};

export default AuthDivider;
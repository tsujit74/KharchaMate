"use client";

import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main className="min-h-screen w-full flex bg-gray-50 overflow-x-hidden bg-[#FCFCFD]">
      {children}
    </main>
  );
};

export default AuthLayout;
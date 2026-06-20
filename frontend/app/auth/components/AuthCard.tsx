"use client";

import React from "react";

const AuthCard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full transition-all duration-300">
      {children}
    </div>
  );
};

export default AuthCard;
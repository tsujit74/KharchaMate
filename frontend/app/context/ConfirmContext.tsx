"use client";

import { createContext, useContext, useState } from "react";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger" | "warning";
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [request, setRequest] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setRequest({
        options,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    request?.resolve(true);
    setRequest(null);
  };

  const handleCancel = () => {
    request?.resolve(false);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <ConfirmModal
        isOpen={!!request}
        title={request?.options.title ?? ""}
        message={request?.options.message ?? ""}
        confirmText={request?.options.confirmText ?? "Confirm"}
        cancelText={request?.options.cancelText ?? "Cancel"}
        variant={request?.options.variant ?? "default"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }

  return context;
}
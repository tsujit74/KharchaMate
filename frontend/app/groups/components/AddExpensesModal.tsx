"use client";

import AddExpenseForm from "./AddExpenseForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess: () => void;
};

export default function AddExpenseModal({
  isOpen,
  onClose,
  groupId,
  onSuccess,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md p-6 rounded-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4">Add Expense</h2>

        <AddExpenseForm
          groupId={groupId}
          onSuccess={() => {
            onSuccess(); 
            onClose();  
          }}
        />
      </div>
    </div>
  );
}
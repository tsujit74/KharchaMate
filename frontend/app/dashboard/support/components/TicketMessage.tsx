"use client";

interface Props {
  message: string;
  role: "USER" | "ADMIN";
  createdAt?: string;
}

export default function TicketMessage({ message, role, createdAt }: Props) {
  const isUser = role === "USER";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
          isUser
            ? "bg-gray-900 text-white rounded-br-md"
            : "bg-white border text-gray-800 rounded-bl-md"
        }`}
      >
        <p className="leading-relaxed">{message}</p>

        {createdAt && (
          <p className="text-[10px] mt-1 opacity-60">
            {new Date(createdAt).toLocaleString()}
          </p>
        )}
      </div>

    </div>
  );
}
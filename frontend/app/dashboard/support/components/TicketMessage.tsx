"use client";

interface Props {
  message: string;
  role: "USER" | "ADMIN";
  createdAt?: string;
}

export default function TicketMessage({ message, role, createdAt }: Props) {
  const isUser = role === "USER";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ring-1 sm:max-w-[70%] ${
          isUser
            ? "rounded-br-md bg-slate-950 text-white ring-slate-900/10"
            : "rounded-bl-md bg-white text-slate-800 ring-slate-200"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message}</p>

        <div
          className={`mt-2 flex items-center justify-between gap-3 text-[10px] ${
            isUser ? "text-slate-300" : "text-slate-400"
          }`}
        >
          <span>{isUser ? "You" : "Support"}</span>
          {createdAt && (
            <span>{new Date(createdAt).toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
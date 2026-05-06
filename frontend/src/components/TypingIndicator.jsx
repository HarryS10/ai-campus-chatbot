import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sea text-white shadow-sm">
        <Bot size={18} aria-hidden="true" />
      </div>
      <div className="message-bubble border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-6 items-center gap-1.5">
          <span className="typing-dot" />
          <span className="typing-dot delay-150" />
          <span className="typing-dot delay-300" />
        </div>
      </div>
    </div>
  );
}

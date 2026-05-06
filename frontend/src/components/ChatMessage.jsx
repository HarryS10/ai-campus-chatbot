import { Bot, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <article className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sea text-white shadow-sm">
          <Bot size={18} aria-hidden="true" />
        </div>
      )}

      <div
        className={`message-bubble ${
          isUser
            ? "bg-ink text-white dark:bg-white dark:text-ink"
            : "border border-gray-200 bg-white text-ink dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        }`}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>

      {isUser && (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-white shadow-sm">
          <UserRound size={18} aria-hidden="true" />
        </div>
      )}
    </article>
  );
}

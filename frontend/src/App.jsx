import {
  BriefcaseBusiness,
  GraduationCap,
  Home,
  IndianRupee,
  Mic,
  MicOff,
  Moon,
  Send,
  Sun,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { sendChatMessage } from "./api/chat.js";
import ChatMessage from "./components/ChatMessage.jsx";
import SuggestionButton from "./components/SuggestionButton.jsx";
import TypingIndicator from "./components/TypingIndicator.jsx";

const storageKey = "nist-campus-chat-messages";
const themeKey = "nist-campus-chat-theme";

const suggestions = [
  {
    label: "Admissions",
    query: "What are the admission requirements and process for NIST University?",
    icon: GraduationCap,
  },
  {
    label: "Fees",
    query: "What is the fee structure and scholarship support at NIST University?",
    icon: IndianRupee,
  },
  {
    label: "Hostel",
    query: "Tell me about hostel facilities, fees and mess charges at NIST University.",
    icon: Home,
  },
  {
    label: "Placements",
    query: "What placement information is available for NIST University?",
    icon: BriefcaseBusiness,
  },
];

const initialMessages = [
  {
    id: createId(),
    role: "assistant",
    content: "Hi, I am NIST Assistant. What would you like to know today?",
  },
];

function createId() {
  return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
}

function loadStoredMessages() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return initialMessages;
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMessages;
  } catch {
    return initialMessages;
  }
}

export default function App() {
  const [messages, setMessages] = useState(loadStoredMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(themeKey) === "dark");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const supportsSpeech = useMemo(
    () => "SpeechRecognition" in window || "webkitSpeechRecognition" in window,
    []
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(themeKey, isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  async function submitMessage(nextMessage = input) {
    const trimmed = nextMessage.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(trimmed);
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content:
            error.response?.data?.reply ||
            "I could not reach the campus assistant right now. Please try again shortly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitMessage();
  }

  function clearChat() {
    setMessages(initialMessages);
  }

  function toggleVoiceInput() {
    if (!supportsSpeech || isLoading) {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setInput((current) => [current, transcript].filter(Boolean).join(" "));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  return (
    <main className="min-h-screen bg-gray-100 text-ink transition-colors dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-sea text-sm font-bold text-white shadow-sm">
              N
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-normal sm:text-xl">
                NIST Campus Assistant
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDark((current) => !current)}
              className="icon-button"
              title={isDark ? "Light mode" : "Dark mode"}
              aria-label={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              onClick={clearChat}
              className="icon-button"
              title="Clear chat"
              aria-label="Clear chat"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        <section className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-wrap gap-2 py-4">
            {suggestions.map((suggestion) => (
              <SuggestionButton
                key={suggestion.label}
                {...suggestion}
                onSelect={submitMessage}
              />
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3 shadow-soft dark:border-gray-800 dark:bg-gray-950 sm:p-5">
            <div className="space-y-5">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pt-4">
            <div className="flex items-end gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-sm focus-within:border-sea focus-within:ring-2 focus-within:ring-sea/20 dark:border-gray-800 dark:bg-gray-900">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage();
                  }
                }}
                rows={1}
                placeholder="Message NIST Assistant"
                className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-ink outline-none placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-500"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={!supportsSpeech || isLoading}
                className={`icon-button mb-0.5 ${
                  isListening ? "border-berry text-berry dark:text-rose-300" : ""
                }`}
                title={supportsSpeech ? "Voice input" : "Voice input unavailable"}
                aria-label={supportsSpeech ? "Voice input" : "Voice input unavailable"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="mb-0.5 inline-grid h-10 w-10 shrink-0 place-items-center rounded-md bg-sea text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-sea/30 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-800"
                title="Send"
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

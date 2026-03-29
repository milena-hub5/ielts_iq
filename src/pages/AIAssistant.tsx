import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMessages, sendMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Send, BookOpen, Mic, PenSquare, HelpCircle, CheckCircle2 } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

type Mode = "general" | "explain" | "speaking" | "writing" | "quiz" | "check";

const quickPrompts: {
  label: string;
  icon: any;
  mode: Mode;
  prompt: string;
}[] = [
  {
    label: "Explain a Word",
    icon: BookOpen,
    mode: "explain",
    prompt: "Explain the word 'significant' with meaning, collocations, and an IELTS example.",
  },
  {
    label: "Practice Speaking",
    icon: Mic,
    mode: "speaking",
    prompt: "Give me 3 IELTS Speaking questions about education and a high-band sample answer for one of them.",
  },
  {
    label: "Improve Writing",
    icon: PenSquare,
    mode: "writing",
    prompt: "Help me improve this sentence for IELTS Writing.",
  },
  {
    label: "Quiz Me",
    icon: HelpCircle,
    mode: "quiz",
    prompt: "Quiz me on IELTS vocabulary related to environment.",
  },
  {
    label: "Check Sentence",
    icon: CheckCircle2,
    mode: "check",
    prompt: "Check this sentence and correct the mistakes:",
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedMode, setSelectedMode] = useState<Mode>("general");
  const [assistantStatus, setAssistantStatus] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast({
        title: "Could not load chat",
        description: "The assistant history could not be loaded from the backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (
    customText?: string,
    customMode?: Mode
  ) => {
    const text = (customText ?? input).trim();
    const mode = customMode ?? selectedMode;

    if (!text || sending) return;

    try {
      setSending(true);
      setAssistantStatus("Thinking...");

      const result = await sendMessage(text, mode);

      setMessages((prev) => [
        ...prev,
        result.userMessage,
        result.botMessage,
      ]);

      if (!customText) {
        setInput("");
      }
      setAssistantStatus("Reply ready");
    } catch (error) {
      console.error("Failed to send message:", error);
      setAssistantStatus("Assistant unavailable");
      toast({
        title: "Assistant request failed",
        description:
          "The AI response could not be generated. Check the backend and OpenAI quota if needed.",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading AI Assistant...</div>;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          AI tools
        </h2>

        <div className="space-y-3">
          {quickPrompts.map((item) => {
            const Icon = item.icon;
            const active = selectedMode === item.mode;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setSelectedMode(item.mode);
                  handleSend(item.prompt, item.mode);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-white"
                }`}
              >
                <div
                  className={`rounded-xl p-2 ${
                    active ? "bg-white/10" : "bg-white ring-1 ring-slate-200"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-white" : "text-slate-700"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-[75vh] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Assistant
          </h1>
          <p className="mt-1 text-slate-500">
            Ask about vocabulary, usage, writing, or speaking practice.
          </p>
          {assistantStatus && (
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              {assistantStatus}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="space-y-3 text-slate-500">
              <p>
                No messages yet. Try one of the tools on the left or type your own
                question.
              </p>
              <p className="text-sm">
                Good first prompts:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSend("Explain the word 'reliable' with a simple IELTS example.", "explain")}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  Explain a word
                </button>
                <button
                  onClick={() => handleSend("Check this sentence: People is spending too much time online.", "check")}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  Check a sentence
                </button>
                <Link
                  to="/topics"
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  Open topics first
                </Link>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  msg.role === "user"
                    ? "ml-auto bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                {msg.content}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-2 text-xs text-slate-500">
            Current mode: <span className="font-medium text-slate-700">{selectedMode}</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask anything about IELTS..."
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
            <Button onClick={() => handleSend()} disabled={sending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "As-salāmu ʿalaykum 👋 Je suis l'assistant de l'Institut Al-Irtiqā'. Posez-moi vos questions sur les cours, la méthode, les tarifs ou l'inscription.",
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const next: Msg[] = [
      ...messages,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const conversation = next.slice(0, -1).filter((m) => m.content.length > 0);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });

      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const line = evt.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === "delta") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + payload.text,
                  };
                }
                return updated;
              });
            } else if (payload.type === "error") {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: payload.message,
                };
                return updated;
              });
            }
          } catch {
            // ignore malformed event
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            "Désolé, une erreur réseau est survenue. Réessayez dans un instant.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-nuit text-dore shadow-[0_10px_40px_rgba(10,26,63,0.35)] ring-1 ring-dore/40 transition hover:scale-105 hover:shadow-[0_14px_48px_rgba(201,169,97,0.35)] sm:h-16 sm:w-16"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="open"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M16 9c-2-1.5-5-2.5-9-2.5v17c4 0 7 1 9 2.5" />
              <path d="M16 9c2-1.5 5-2.5 9-2.5v17c-4 0-7 1-9 2.5" />
              <path d="M16 9v17" />
              <path d="M9 11.5h4" opacity="0.7" />
              <path d="M9 14.5h4" opacity="0.7" />
              <path d="M9 17.5h4" opacity="0.7" />
              <path d="M19 11.5h4" opacity="0.7" />
              <path d="M19 14.5h4" opacity="0.7" />
              <path d="M19 17.5h4" opacity="0.7" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 bottom-24 z-50 flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-dore/30 bg-creme shadow-[0_24px_60px_rgba(10,26,63,0.35)] sm:inset-x-auto sm:bottom-24 sm:right-5 sm:h-[560px] sm:max-h-[80vh] sm:w-[380px]"
          >
            <header className="relative bg-nuit px-5 py-4 text-creme">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
              />
              <p className="font-display text-[10px] uppercase tracking-[0.4em] text-dore">
                Assistant
              </p>
              <h2 className="mt-1 font-display text-lg">Institut Al-Irtiqā&apos;</h2>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-creme px-4 py-5"
            >
              <ul className="space-y-3">
                {messages.map((m, i) => (
                  <li
                    key={i}
                    className={
                      m.role === "user" ? "flex justify-end" : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[85%] rounded-2xl rounded-br-sm bg-nuit px-4 py-2.5 text-sm leading-relaxed text-creme"
                          : "max-w-[85%] rounded-2xl rounded-bl-sm border border-dore/25 bg-white px-4 py-2.5 text-sm leading-relaxed text-nuit"
                      }
                    >
                      {m.content || (
                        <span className="inline-flex gap-1">
                          <Dot delay={0} />
                          <Dot delay={0.15} />
                          <Dot delay={0.3} />
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <form
              onSubmit={send}
              className="border-t border-dore/20 bg-white px-3 py-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(e);
                    }
                  }}
                  rows={1}
                  maxLength={2000}
                  placeholder="Posez votre question…"
                  disabled={streaming}
                  className="min-h-[40px] max-h-32 flex-1 resize-none rounded-xl border border-nuit/15 bg-creme px-3 py-2 text-sm text-nuit placeholder:text-nuit/40 focus:border-dore/60 focus:outline-none focus:ring-2 focus:ring-dore/20 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  aria-label="Envoyer"
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-nuit text-dore transition hover:bg-nuit-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 12L21 4l-4 16-4-7-7-1z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeInOut" }}
      className="inline-block h-1.5 w-1.5 rounded-full bg-nuit/40"
    />
  );
}

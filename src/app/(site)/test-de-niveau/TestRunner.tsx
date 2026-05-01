"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

type PublicQuestion = {
  id: string;
  type: "qcm" | "vf";
  enonce: string;
  arabe: string | null;
  choix: string[];
};

type RunState =
  | { kind: "intro" }
  | { kind: "loading" }
  | {
      kind: "running";
      attempt_id: string;
      question: PublicQuestion;
      question_number: number;
      max_questions: number;
      selected: number | null;
      submitting: boolean;
    }
  | { kind: "error"; message: string };

const STORAGE_KEY = "alirtiqa_test_attempt";

type StoredAttempt = {
  attempt_id: string;
  question: PublicQuestion;
  question_number: number;
  max_questions: number;
};

export function TestRunner() {
  const router = useRouter();
  const [state, setState] = useState<RunState>({ kind: "intro" });
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as StoredAttempt;
      if (parsed?.attempt_id && parsed?.question) {
        setHasResume(true);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function persist(s: StoredAttempt) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }
  }

  function clearStorage() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  async function start() {
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/test/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setState({
          kind: "error",
          message: data?.error ?? "Impossible de démarrer le test.",
        });
        return;
      }
      const stored: StoredAttempt = {
        attempt_id: data.attempt_id,
        question: data.question,
        question_number: data.question_number,
        max_questions: data.max_questions,
      };
      persist(stored);
      setState({
        kind: "running",
        ...stored,
        selected: null,
        submitting: false,
      });
    } catch {
      setState({
        kind: "error",
        message: "Connexion impossible. Vérifiez votre réseau.",
      });
    }
  }

  function resume() {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      start();
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredAttempt;
      setState({
        kind: "running",
        ...parsed,
        selected: null,
        submitting: false,
      });
    } catch {
      clearStorage();
      start();
    }
  }

  function startOver() {
    clearStorage();
    setHasResume(false);
    start();
  }

  const submit = useCallback(
    async (choice: number) => {
      if (state.kind !== "running" || state.submitting) return;
      setState({ ...state, selected: choice, submitting: true });

      try {
        const res = await fetch("/api/test/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attempt_id: state.attempt_id,
            question_id: state.question.id,
            choix: choice,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setState({
            kind: "error",
            message:
              data?.error ?? "Erreur lors de l'enregistrement de la réponse.",
          });
          return;
        }
        if (data.finished) {
          clearStorage();
          router.push(`/test-de-niveau/resultat/${data.attempt_id}`);
          return;
        }
        const stored: StoredAttempt = {
          attempt_id: state.attempt_id,
          question: data.question,
          question_number: data.question_number,
          max_questions: data.max_questions,
        };
        persist(stored);
        setState({
          kind: "running",
          ...stored,
          selected: null,
          submitting: false,
        });
      } catch {
        setState({
          kind: "error",
          message: "Connexion perdue pendant l'envoi de la réponse.",
        });
      }
    },
    [state, router],
  );

  if (state.kind === "intro") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-nuit/10 bg-white p-8 sm:p-10">
        <h2 className="font-display text-2xl text-nuit">Avant de commencer</h2>
        <ul className="mt-5 space-y-3 text-sm text-nuit/75">
          <li className="flex gap-3">
            <span aria-hidden className="text-dore-700">
              ✓
            </span>
            <span>
              Le test s&apos;adapte à vos réponses : si vous répondez juste, la
              question suivante est plus difficile, et inversement.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="text-dore-700">
              ✓
            </span>
            <span>
              <strong>15 questions maximum</strong>. Le test peut s&apos;arrêter
              avant si votre niveau se stabilise.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="text-dore-700">
              ✓
            </span>
            <span>
              Une seule réponse par question. Pas de retour arrière. Répondez
              honnêtement, sans aide extérieure.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="text-dore-700">
              ✓
            </span>
            <span>
              Durée estimée : <strong>5 à 10 minutes</strong>. Aucune
              inscription requise pour passer le test.
            </span>
          </li>
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          {hasResume ? (
            <>
              <button
                type="button"
                onClick={resume}
                className="inline-flex items-center justify-center rounded-full bg-dore px-6 py-3 text-sm font-medium text-nuit transition-colors hover:bg-dore-300"
              >
                ↻ Reprendre mon test en cours
              </button>
              <button
                type="button"
                onClick={startOver}
                className="inline-flex items-center justify-center rounded-full border border-nuit/15 bg-white px-6 py-3 text-sm font-medium text-nuit/70 transition-colors hover:bg-nuit/5"
              >
                Recommencer à zéro
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center justify-center rounded-full bg-nuit px-8 py-3 text-sm font-medium text-creme transition-colors hover:bg-nuit-400"
            >
              Commencer le test →
            </button>
          )}
        </div>
      </div>
    );
  }

  if (state.kind === "loading") {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center rounded-2xl border border-nuit/10 bg-white p-12">
        <div className="flex items-center gap-3 text-sm text-nuit/65">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 animate-spin"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" opacity="0.25" />
            <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
          </svg>
          Préparation du test…
        </div>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-white p-8 text-center">
        <p className="text-sm text-rose-700">{state.message}</p>
        <button
          type="button"
          onClick={() => setState({ kind: "intro" })}
          className="mt-4 inline-flex items-center rounded-full border border-nuit/15 bg-white px-5 py-2 text-xs font-medium text-nuit/70 hover:bg-nuit/5"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <QuestionScreen
      question={state.question}
      questionNumber={state.question_number}
      maxQuestions={state.max_questions}
      selected={state.selected}
      submitting={state.submitting}
      onSubmit={submit}
    />
  );
}

function QuestionScreen({
  question,
  questionNumber,
  maxQuestions,
  selected,
  submitting,
  onSubmit,
}: {
  question: PublicQuestion;
  questionNumber: number;
  maxQuestions: number;
  selected: number | null;
  submitting: boolean;
  onSubmit: (choice: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (submitting) return;
      const num = parseInt(e.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= question.choix.length) {
        e.preventDefault();
        onSubmit(num - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question.choix.length, onSubmit, submitting]);

  const progress = (questionNumber / maxQuestions) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between text-xs text-nuit/60">
        <span>
          Question <strong className="text-nuit">{questionNumber}</strong> /{" "}
          {maxQuestions} max
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-nuit/40">
          Astuce : touches 1-{question.choix.length} pour répondre
        </span>
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-nuit/10">
        <motion.div
          className="h-full bg-dore"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          ref={containerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="rounded-2xl border border-nuit/10 bg-white p-7 sm:p-9"
        >
          <p className="font-display text-lg leading-relaxed text-nuit sm:text-xl">
            {question.enonce}
          </p>

          {question.arabe && (
            <p
              dir="rtl"
              lang="ar"
              className="mt-5 rounded-xl bg-creme/60 px-5 py-4 text-right text-2xl leading-loose text-nuit sm:text-3xl"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {question.arabe}
            </p>
          )}

          <ul className="mt-7 space-y-2.5">
            {question.choix.map((c, i) => {
              const isSelected = selected === i;
              const isArabic = /[؀-ۿ]/.test(c);
              return (
                <li key={i}>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => onSubmit(i)}
                    className={cn(
                      "group flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-all",
                      isSelected
                        ? "border-dore bg-dore/5 shadow-[0_4px_18px_rgba(201,169,97,0.15)]"
                        : "border-nuit/15 bg-white hover:border-dore/40 hover:bg-creme/30",
                      submitting && "cursor-wait",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold transition-colors",
                        isSelected
                          ? "bg-dore text-nuit"
                          : "bg-nuit/5 text-nuit/55 group-hover:bg-nuit/10",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-sm text-nuit sm:text-base",
                        isArabic && "text-right text-lg sm:text-xl",
                      )}
                      dir={isArabic ? "rtl" : "ltr"}
                      lang={isArabic ? "ar" : undefined}
                      style={
                        isArabic ? { fontFamily: "Amiri, serif" } : undefined
                      }
                    >
                      {c}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

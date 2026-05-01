"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Niveau } from "@/lib/niveaux";
import type { QuestionCategorie } from "@/lib/db";

const CATEGORIE_LABEL: Record<QuestionCategorie, string> = {
  vocabulaire: "Vocabulaire",
  grammaire: "Grammaire",
  sarf: "Sarf / Conjugaison",
  lecture: "Lecture / Voyellation",
  comprehension: "Compréhension",
  coran: "Coran / Hadith",
};

type Scores = Record<
  QuestionCategorie,
  { correct: number; total: number; pct: number } | undefined
>;

export function ResultatClient({
  attemptId,
  niveau,
  niveauInfo,
  scores,
  correctTotal,
  totalAnswers,
  identityCaptured,
}: {
  attemptId: string;
  niveau: number;
  niveauInfo: Niveau | null;
  scores: Scores;
  correctTotal: number;
  totalAnswers: number;
  identityCaptured: boolean;
}) {
  const cycleColor =
    niveauInfo?.cycle === "Initiation"
      ? "from-emerald-500/20 to-emerald-500/5"
      : niveauInfo?.cycle === "Préparation"
        ? "from-sky-500/20 to-sky-500/5"
        : "from-dore/30 to-dore/5";

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-arabesque bg-[length:520px] opacity-[0.05]"
        />
        <div className="container-prose relative py-14 sm:py-20">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-dore">
            Résultat
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-3xl leading-tight sm:text-5xl">
            Votre niveau estimé est{" "}
            <span className="text-dore">{niveauInfo?.titre ?? `Niveau ${niveau}`}</span>
          </h1>
          {niveauInfo && (
            <p className="mt-3 text-creme/70">
              Cycle <strong className="text-dore">{niveauInfo.cycle}</strong>{" "}
              — Niveau {niveau} sur 15 dans la méthode Al-Furqan
            </p>
          )}
        </div>
      </section>

      <section className="bg-creme py-10 sm:py-14">
        <div className="container-prose grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "rounded-2xl border border-nuit/10 bg-gradient-to-br p-7 sm:p-9",
                cycleColor,
              )}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.25em] text-nuit/55">
                    Programme correspondant
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-nuit sm:text-3xl">
                    {niveauInfo?.titre ?? `Niveau ${niveau}`}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl text-nuit sm:text-4xl">
                    {correctTotal}/{totalAnswers}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-nuit/55">
                    bonnes réponses
                  </p>
                </div>
              </div>
              {niveauInfo && (
                <p className="mt-5 text-sm text-nuit/75 sm:text-base">
                  {niveauInfo.resume}
                </p>
              )}
            </motion.div>

          </div>

          <aside>
            <div className="sticky top-24 space-y-4">
              {!identityCaptured && (
                <CaptureForm attemptId={attemptId} niveau={niveau} />
              )}

              <div className="rounded-2xl border border-dore/40 bg-white p-6">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-dore-700">
                  Prochaine étape
                </p>
                <h3 className="mt-2 font-display text-lg text-nuit">
                  S&apos;inscrire au programme
                </h3>
                <p className="mt-2 text-sm text-nuit/70">
                  Notre équipe peut vous accompagner pour démarrer au bon
                  niveau, dans la formule la plus adaptée.
                </p>
                <Link
                  href="/inscription"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-nuit px-5 py-2.5 text-sm font-medium text-creme transition-colors hover:bg-nuit-400"
                >
                  S&apos;inscrire à ce niveau →
                </Link>
                <Link
                  href="/programme"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-nuit/15 px-5 py-2.5 text-sm font-medium text-nuit/70 transition-colors hover:bg-nuit/5"
                >
                  Voir les 15 niveaux
                </Link>
              </div>

              <div className="rounded-2xl border border-nuit/10 bg-creme/40 p-5 text-xs text-nuit/55">
                Ce résultat est une estimation basée sur 15 questions
                maximum. Un échange avec un professeur permet d&apos;affiner
                votre placement définitif.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function CaptureForm({
  attemptId,
  niveau,
}: {
  attemptId: string;
  niveau: number;
}) {
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/test/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attempt_id: attemptId,
          prenom,
          email,
          telephone,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setBusy(false);
      if (!res.ok) {
        setError(data?.error ?? "Erreur lors de l'envoi.");
        return;
      }
      setDone(true);
    } catch {
      setBusy(false);
      setError("Connexion impossible. Réessayez dans un instant.");
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-white p-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5 text-emerald-700"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="mt-3 font-display text-sm text-nuit">
          Votre résultat a été transmis
        </p>
        <p className="mt-1.5 text-xs text-nuit/65">
          Notre équipe vous recontactera in shā&apos;a Llāh pour vous proposer
          le programme adapté à votre niveau {niveau}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-nuit/10 bg-white p-6"
    >
      <p className="font-display text-xs uppercase tracking-[0.2em] text-dore-700">
        Recevoir un suivi
      </p>
      <h3 className="mt-2 font-display text-lg text-nuit">
        Vous voulez être recontacté ?
      </h3>
      <p className="mt-2 text-xs text-nuit/65">
        Laissez vos coordonnées, notre équipe vous proposera la formule
        adaptée à votre niveau.
      </p>

      <div className="mt-4 space-y-3">
        <input
          required
          type="text"
          placeholder="Prénom *"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className={inputCls}
        />
        <input
          required
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <input
          type="tel"
          placeholder="Téléphone (WhatsApp de préférence)"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-dore px-5 py-2.5 text-sm font-medium text-nuit transition-colors hover:bg-dore-300 disabled:opacity-60"
      >
        {busy ? "Envoi…" : "Envoyer mes coordonnées"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-nuit/15 bg-white px-3 py-2.5 text-sm text-nuit outline-none transition-colors focus:border-dore focus:ring-2 focus:ring-dore/20";

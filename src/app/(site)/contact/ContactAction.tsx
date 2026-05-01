"use client";

import { useState } from "react";

type Props =
  | {
      kind: "external";
      href: string;
      label: string;
    }
  | {
      kind: "modal";
      label: string;
    };

export function ContactAction(props: Props) {
  const [open, setOpen] = useState(false);

  if (props.kind === "external") {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-nuit px-4 py-2 text-xs font-medium text-creme transition-colors hover:bg-nuit-400"
      >
        {props.label} →
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-nuit px-4 py-2 text-xs font-medium text-creme transition-colors hover:bg-nuit-400"
      >
        {props.label} →
      </button>
      {open && <ContactModal onClose={() => setOpen(false)} />}
    </>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, email, sujet, message, website }),
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-nuit/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right rounded-full p-1.5 text-nuit/55 hover:bg-nuit/5"
          aria-label="Fermer"
        >
          ✕
        </button>

        <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dore-700">
          Contact
        </p>
        <h2 className="mt-1.5 font-display text-xl text-nuit">
          Envoyer un message
        </h2>

        {done ? (
          <div className="mt-6">
            <div className="flex items-start gap-3 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-4 w-4 flex-none"
                aria-hidden
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>
                Votre message a bien été envoyé. Notre équipe vous recontactera
                rapidement.
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-full bg-nuit px-5 py-2.5 text-sm font-medium text-creme hover:bg-nuit-400"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <p className="text-sm text-nuit/70">
              Remplissez ce formulaire, nous vous répondrons sous 48 h ouvrées.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
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
            </div>

            <input
              type="text"
              placeholder="Sujet (optionnel)"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              className={inputCls}
            />

            <textarea
              required
              rows={5}
              placeholder="Votre message *"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputCls} resize-y`}
            />

            {/* Honeypot anti-spam */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-nuit px-5 py-2.5 text-sm font-medium text-creme hover:bg-nuit-400 disabled:opacity-60"
            >
              {busy ? "Envoi…" : "Envoyer le message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-nuit/15 bg-white px-3 py-2.5 text-sm text-nuit outline-none transition-colors focus:border-dore focus:ring-2 focus:ring-dore/20";

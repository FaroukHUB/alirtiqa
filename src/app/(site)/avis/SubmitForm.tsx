"use client";

import { useState, FormEvent } from "react";

function StarsInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Note">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dore"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill={filled ? "#F0B429" : "transparent"}
              stroke={filled ? "#F0B429" : "#C2B795"}
              strokeWidth="1.4"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 2.5l2.9 6.5 7.1.7-5.4 4.7 1.7 7-6.3-3.7L5.7 21.4l1.7-7L2 9.7l7.1-.7Z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export function SubmitForm() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState(5);
  const [texte, setTexte] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = texte.trim().length;
  const minChars = 30;
  const tooShort = charCount > 0 && charCount < minChars;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (charCount < minChars) {
      setError(`Votre avis doit faire au moins ${minChars} caractères.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, note, texte, website }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Erreur lors de l'envoi.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setNom("");
      setEmail("");
      setNote(5);
      setTexte("");
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-dore/40 bg-white p-8 text-center shadow-[0_8px_32px_rgba(10,26,63,0.06)] sm:p-10">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12l5 5 9-11" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-2xl text-nuit">Merci !</h3>
        <p className="mt-3 text-nuit/70">
          Votre avis sera publié après validation par notre équipe.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 inline-flex items-center text-sm text-dore-700 hover:text-dore-600"
        >
          Laisser un autre avis
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-nuit/10 bg-white p-7 shadow-[0_8px_32px_rgba(10,26,63,0.06)] sm:p-10"
    >
      <h3 className="font-display text-2xl text-nuit">Laissez votre avis</h3>
      <p className="mt-2 text-sm text-nuit/60">
        Votre email reste privé, il ne sera jamais publié.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-nuit/55">
            Prénom
          </span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={50}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="rounded-lg border border-nuit/15 bg-creme/30 px-4 py-2.5 text-sm text-nuit outline-none transition-colors focus:border-dore focus:bg-white"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-nuit/55">
            Email <span className="normal-case tracking-normal text-nuit/40">(privé)</span>
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-nuit/15 bg-creme/30 px-4 py-2.5 text-sm text-nuit outline-none transition-colors focus:border-dore focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-nuit/55">
          Note
        </span>
        <StarsInput value={note} onChange={setNote} />
      </div>

      <label className="mt-5 flex flex-col gap-1.5">
        <span className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-nuit/55">
            Votre avis
          </span>
          <span
            className={`text-xs ${
              tooShort ? "text-amber-600" : "text-nuit/45"
            }`}
          >
            {charCount}/{minChars} min
          </span>
        </span>
        <textarea
          required
          rows={5}
          minLength={minChars}
          maxLength={1000}
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          className="resize-y rounded-lg border border-nuit/15 bg-creme/30 px-4 py-3 text-sm leading-relaxed text-nuit outline-none transition-colors focus:border-dore focus:bg-white"
          placeholder="Partagez votre expérience avec l'institut..."
        />
      </label>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      {error && (
        <p className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-nuit px-6 py-3.5 font-medium text-creme transition-colors hover:bg-nuit-700 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Envoi..." : "Publier mon avis"}
      </button>
    </form>
  );
}

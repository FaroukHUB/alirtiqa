"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { formules } from "@/lib/formules";
import { cn } from "@/lib/cn";

type FormState = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  age: string;
  formule: "particulier" | "duo" | "groupe";
  niveau: string;
  disponibilite: string;
  message: string;
  website: string;
};

const initialState = (preselected?: string | null): FormState => ({
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  age: "",
  formule: (preselected as FormState["formule"]) ?? "particulier",
  niveau: "Débutant",
  disponibilite: "",
  message: "",
  website: "",
});

const niveauOptions = [
  "Débutant complet",
  "Débutant",
  "Intermédiaire",
  "Avancé",
  "Je préfère passer le test",
];

type SubmitState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function InscriptionForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("formule");
  const [form, setForm] = useState<FormState>(() => initialState(preselected));
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "loading") return;
    setState({ kind: "loading" });

    try {
      const res = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setState({
          kind: "error",
          message:
            data?.error ??
            "Une erreur est survenue. Merci de réessayer dans un instant.",
        });
        return;
      }
      setState({ kind: "success" });
    } catch {
      setState({
        kind: "error",
        message:
          "Connexion impossible. Vérifiez votre réseau et réessayez.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-3xl rounded-2xl border border-dore/40 bg-white p-10 text-center sm:p-14"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dore/15">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-dore-700"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-2xl text-nuit sm:text-3xl">
          Votre demande a bien été reçue
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-nuit/75 sm:text-base">
          Bārak Allāhu fīkum. Un email de confirmation vient de vous être
          envoyé. Notre équipe vous recontactera in shā&apos;a Llāh sous 48 heures
          ouvrées, par WhatsApp ou par email.
        </p>
        <p className="mt-6 text-xs text-nuit/55">
          Si vous ne recevez pas notre email, pensez à vérifier vos courriers
          indésirables.
        </p>
      </motion.div>
    );
  }

  const isLoading = state.kind === "loading";

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto grid max-w-3xl gap-6 rounded-2xl border border-nuit/10 bg-white p-8 sm:p-10"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom *" required>
          <input
            required
            type="text"
            value={form.prenom}
            onChange={(e) => update("prenom", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Nom *" required>
          <input
            required
            type="text"
            value={form.nom}
            onChange={(e) => update("nom", e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email *" required>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Téléphone (WhatsApp de préférence)">
          <input
            type="tel"
            value={form.telephone}
            onChange={(e) => update("telephone", e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Âge de l'apprenant">
          <input
            type="text"
            placeholder="ex. 14 ans, adulte…"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Niveau estimé">
          <select
            value={form.niveau}
            onChange={(e) => update("niveau", e.target.value)}
            className={inputCls}
          >
            {niveauOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Formule souhaitée">
        <div className="grid gap-3 sm:grid-cols-3">
          {formules.map((f) => (
            <label
              key={f.slug}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors",
                form.formule === f.slug
                  ? "border-dore bg-dore/5"
                  : "border-nuit/15 hover:border-dore/40",
              )}
            >
              <input
                type="radio"
                name="formule"
                value={f.slug}
                checked={form.formule === f.slug}
                onChange={() => update("formule", f.slug)}
                className="sr-only"
              />
              <span className="font-display text-sm text-nuit">{f.titre}</span>
              <span className="text-xs text-nuit/60">{f.prix} €/mois (8h)</span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Disponibilités préférées">
        <input
          type="text"
          placeholder="ex. soirées en semaine, samedi matin…"
          value={form.disponibilite}
          onChange={(e) => update("disponibilite", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Message libre">
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={cn(inputCls, "resize-y")}
        />
      </Field>

      {/* Honeypot anti-spam — caché aux humains, visible aux bots */}
      <div className="hidden" aria-hidden="true">
        <label>
          Site web (laisser vide)
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
      </div>

      {state.kind === "error" && (
        <div
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {state.message}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-full bg-nuit px-6 py-3 font-medium tracking-wide text-creme transition-colors duration-300 sm:w-auto",
            isLoading
              ? "cursor-wait opacity-70"
              : "hover:bg-nuit-400",
          )}
        >
          {isLoading ? (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" opacity="0.25" />
                <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
              </svg>
              Envoi en cours…
            </>
          ) : (
            "Envoyer ma demande"
          )}
        </button>
      </div>

      <p className="text-xs text-nuit/55">
        Vos informations sont utilisées uniquement pour traiter votre demande
        d&apos;inscription. Aucune diffusion à des tiers.
      </p>
    </motion.form>
  );
}

const inputCls =
  "w-full rounded-lg border border-nuit/15 bg-white px-4 py-3 text-sm text-nuit outline-none transition-colors focus:border-dore focus:ring-2 focus:ring-dore/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-[0.2em] text-nuit/60">
        {label}
        {required && <span className="sr-only"> requis</span>}
      </span>
      {children}
    </label>
  );
}

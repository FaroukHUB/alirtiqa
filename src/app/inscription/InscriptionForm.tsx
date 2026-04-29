"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { formules } from "@/lib/formules";
import { site } from "@/lib/site";
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
});

const niveauOptions = [
  "Débutant complet",
  "Débutant",
  "Intermédiaire",
  "Avancé",
  "Je préfère passer le test",
];

function buildBody(s: FormState) {
  const lignes = [
    "Bonjour,",
    "",
    "Je souhaiterais m'inscrire aux cours de l'Institut Al-Irtiqā'.",
    "",
    `• Nom : ${s.prenom} ${s.nom}`.trim(),
    s.email && `• Email : ${s.email}`,
    s.telephone && `• Téléphone : ${s.telephone}`,
    s.age && `• Âge : ${s.age}`,
    `• Formule souhaitée : ${s.formule}`,
    `• Niveau estimé : ${s.niveau}`,
    s.disponibilite && `• Disponibilités : ${s.disponibilite}`,
    s.message && `• Message : ${s.message}`,
    "",
    "Merci.",
  ].filter(Boolean);
  return lignes.join("\n");
}

export function InscriptionForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("formule");
  const [form, setForm] = useState<FormState>(() => initialState(preselected));

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const subject = "Inscription Institut Al-Irtiqā'";
  const body = useMemo(() => buildBody(form), [form]);

  const mailtoUrl = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(body)}`;

  const requiredFilled = form.prenom && form.nom && form.email;

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto grid max-w-3xl gap-6 rounded-2xl border border-nuit/10 bg-white p-8 sm:p-10"
      onSubmit={(e) => e.preventDefault()}
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

      <div className="grid gap-3 pt-2 sm:grid-cols-2">
        <a
          href={requiredFilled ? mailtoUrl : "#"}
          aria-disabled={!requiredFilled}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full bg-nuit px-6 py-3 font-medium tracking-wide text-creme transition-colors duration-300",
            requiredFilled ? "hover:bg-nuit-400" : "pointer-events-none opacity-50",
          )}
        >
          Envoyer par email
        </a>
        <a
          href={requiredFilled ? whatsappUrl : "#"}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!requiredFilled}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full bg-dore px-6 py-3 font-medium tracking-wide text-nuit transition-colors duration-300",
            requiredFilled ? "hover:bg-dore-300" : "pointer-events-none opacity-50",
          )}
        >
          Envoyer par WhatsApp
        </a>
      </div>

      <p className="text-xs text-nuit/55">
        En envoyant, vous nous transmettez les informations renseignées
        ci-dessus. Aucune donnée n&apos;est encore stockée sur ce site.
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

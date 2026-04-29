"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const inclusions = [
  {
    titre: "Cours en visio",
    detail: "8 heures de cours par mois sur Zoom, en direct avec votre professeur.",
  },
  {
    titre: "Supports pédagogiques",
    detail: "PDF de leçons, fiches de grammaire, exercices corrigés à chaque niveau.",
  },
  {
    titre: "Suivi personnalisé",
    detail: "Évaluation continue, retours réguliers, ajustements en fonction du rythme.",
  },
  {
    titre: "Replays",
    detail: "Accès aux enregistrements pour réviser à votre rythme entre les séances.",
  },
];

const modalites = [
  { label: "Paiement", value: "Mensuel, par virement ou PayPal" },
  { label: "Engagement", value: "Aucun — résiliable à tout moment" },
  { label: "Durée d'un niveau", value: "≈ 8 semaines (variable selon le rythme)" },
  { label: "Public", value: "Enfants à partir de 10 ans et adultes" },
  { label: "Frais d'inscription", value: "10 € unique (fournitures incluses)" },
  { label: "Format", value: "100 % en ligne via Zoom" },
];

export function Tarifs() {
  return (
    <section id="tarifs" className="bg-creme py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -mt-24 h-px bg-gradient-to-r from-transparent via-dore/40 to-transparent"
      />
      <div className="container-prose">
        <SectionHeading
          kicker="Ce qui est inclus"
          title={<>Une offre claire, sans surprise</>}
          description="Tous les supports, un suivi régulier et la flexibilité d'apprendre depuis chez vous, où que vous soyez."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-5"
          >
            {inclusions.map((i) => (
              <li key={i.titre} className="flex gap-4 rounded-xl border border-nuit/10 bg-white p-5">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-dore/40 bg-dore/10 font-display text-sm text-dore-600"
                >
                  ✓
                </span>
                <div>
                  <h3 className="font-display text-base text-nuit">{i.titre}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-nuit/65">{i.detail}</p>
                </div>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
            className="rounded-2xl bg-nuit p-8 text-creme"
          >
            <h3 className="font-display text-xs uppercase tracking-[0.4em] text-dore">
              Modalités
            </h3>
            <dl className="mt-6 divide-y divide-creme/10">
              {modalites.map((m) => (
                <div key={m.label} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                  <dt className="text-xs uppercase tracking-[0.2em] text-creme/55">{m.label}</dt>
                  <dd className="text-sm text-creme/90">{m.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

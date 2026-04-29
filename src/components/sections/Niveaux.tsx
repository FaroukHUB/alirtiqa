"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { cycles, niveaux } from "@/lib/niveaux";

const cycleAccent: Record<(typeof cycles)[number], string> = {
  Initiation: "from-dore-300/40 to-dore-400/10",
  Fondations: "from-dore-400/45 to-dore-500/15",
  Consolidation: "from-dore-500/50 to-dore-600/20",
  Maîtrise: "from-dore-600/55 to-dore-700/25",
};

export function Niveaux() {
  return (
    <section id="niveaux" className="relative bg-nuit text-creme py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-arabesque bg-[length:520px] opacity-[0.04]"
      />
      <div className="container-prose relative">
        <SectionHeading
          tone="light"
          kicker="Programme"
          title={<>Quinze niveaux pour aller du premier mot à l&apos;autonomie</>}
          description="Une progression rigoureuse, structurée en quatre cycles. Chaque niveau dure environ 8 semaines selon le rythme choisi."
        />

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {niveaux.map((n, i) => (
            <motion.div
              key={n.numero}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.04, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-xl border border-dore/15 bg-nuit-400/30 p-5 transition-colors hover:border-dore/50"
            >
              <div
                aria-hidden
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${cycleAccent[n.cycle]}`}
              />
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-2xl text-dore">
                  {String(n.numero).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-creme/45">
                  {n.cycle}
                </span>
              </div>
              <h3 className="mt-3 font-display text-base text-creme">{n.titre}</h3>
              <p className="mt-2 text-xs leading-relaxed text-creme/65">{n.resume}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/programme" variant="primary">
            Voir le programme détaillé
          </ButtonLink>
          <ButtonLink href="/test-de-niveau" variant="ghost">
            Passer le test de niveau
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

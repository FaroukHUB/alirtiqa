"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { cycles, niveaux } from "@/lib/niveaux";

const cycleAccent: Record<(typeof cycles)[number], string> = {
  Initiation: "bg-dore-300/55",
  Préparation: "bg-dore-500/60",
  Approfondissement: "bg-dore-700/65",
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
          description="Une progression rigoureuse, structurée en trois cycles. Chaque niveau dure environ 8 semaines selon le rythme choisi."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {niveaux.map((n, i) => (
            <motion.article
              key={n.numero}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.04, ease: "easeOut" }}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-creme text-nuit transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(0,0,0,0.22)]"
            >
              <div aria-hidden className={`h-1 w-full ${cycleAccent[n.cycle]}`} />

              <div className="relative h-24 w-full overflow-hidden bg-creme">
                <Image
                  src="/images/fourqan.webp"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain object-center p-3"
                />
              </div>

              <div
                aria-hidden
                className="mx-5 h-px bg-gradient-to-r from-transparent via-nuit/12 to-transparent"
              />

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-2xl text-dore-600">
                    {String(n.numero).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-nuit/55">
                    {n.cycle}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base text-nuit">{n.titre}</h3>
                <p className="mt-2 text-xs leading-relaxed text-nuit/65">{n.resume}</p>
              </div>
            </motion.article>
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

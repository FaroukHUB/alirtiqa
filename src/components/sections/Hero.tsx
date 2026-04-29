"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-nuit text-creme">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-arabesque bg-[length:480px] opacity-[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
      />

      <div className="container-prose relative flex min-h-[88vh] flex-col items-center justify-center py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6 font-display text-sm uppercase tracking-[0.4em] text-dore"
        >
          Institut Al-Irtiqā&apos;
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="text-balance font-display text-4xl font-medium leading-tight sm:text-5xl md:text-6xl"
        >
          {site.tagline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-balance text-lg text-creme/80"
        >
          15 niveaux progressifs, cours en ligne via Zoom, fondés sur l&apos;Ajurrumiyya
          et Al-Furqan. Pour francophones, à partir de 10 ans.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ButtonLink href="/test-de-niveau" variant="primary">
            Faire le test de niveau
          </ButtonLink>
          <ButtonLink href="/programme" variant="ghost">
            Découvrir le programme
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const piliers = [
  {
    titre: "Al-Furqan",
    description:
      "La base de notre programme : méthode égyptienne progressive d'apprentissage de la langue arabe et de la lecture du Coran. Pose les fondations du vocabulaire et de la lecture authentique.",
  },
  {
    titre: "Al-Ajurrumiyya",
    description:
      "Le traité fondamental de grammaire arabe (نحو), étudié dans le monde musulman depuis le XIIIᵉ siècle. Vient consolider la compréhension structurelle acquise avec Al-Furqan.",
  },
  {
    titre: "Pédagogie égyptienne",
    description:
      "Tradition d'enseignement reconnue mondialement : oralité, mémorisation active, pratique constante, application immédiate de la règle.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export function Methode() {
  return (
    <section id="methode" className="relative bg-creme py-24 sm:py-32">
      <div className="container-prose">
        <SectionHeading
          kicker="Notre méthode"
          title={<>Une pédagogie éprouvée, transmise depuis des siècles</>}
          description="Inspirée des grands instituts égyptiens, notre méthode allie rigueur grammaticale, immersion progressive et application directe à la lecture du Coran."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {piliers.map((p, i) => (
            <motion.article
              key={p.titre}
              {...fadeUp}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="group relative flex flex-col gap-4 rounded-2xl border border-nuit/10 bg-white/70 p-8 backdrop-blur transition-colors hover:border-dore/40"
            >
              <span
                aria-hidden
                className="absolute right-6 top-6 font-display text-3xl text-dore/40 transition-colors group-hover:text-dore"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl text-nuit">{p.titre}</h3>
              <p className="text-sm leading-relaxed text-nuit/70">{p.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

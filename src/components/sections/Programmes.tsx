"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { formules } from "@/lib/formules";

const ease = [0.16, 1, 0.3, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease,
      delayChildren: 0.15,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const iconBoxVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease, staggerChildren: 0.07 },
  },
};

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.85, ease: "easeOut" },
      opacity: { duration: 0.25 },
    },
  },
};

const formuleCount: Record<string, 1 | 2 | 3> = {
  particulier: 1,
  duo: 2,
  groupe: 3,
};

function PersonsIcon({ count }: { count: 1 | 2 | 3 }) {
  const baseProps = {
    viewBox: "0 0 64 40",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const cls = "h-10 w-16 text-dore-600";

  if (count === 1) {
    return (
      <motion.svg variants={iconBoxVariants} className={cls} {...baseProps}>
        <motion.circle variants={pathVariants} cx="32" cy="12" r="6" />
        <motion.path variants={pathVariants} d="M20 36c0-6 5-12 12-12s12 6 12 12" />
      </motion.svg>
    );
  }

  if (count === 2) {
    return (
      <motion.svg variants={iconBoxVariants} className={cls} {...baseProps}>
        <motion.circle variants={pathVariants} cx="22" cy="14" r="5" />
        <motion.path variants={pathVariants} d="M12 36c0-5 4-10 10-10s10 5 10 10" />
        <motion.circle variants={pathVariants} cx="42" cy="14" r="5" />
        <motion.path variants={pathVariants} d="M32 36c0-5 4-10 10-10s10 5 10 10" />
      </motion.svg>
    );
  }

  return (
    <motion.svg variants={iconBoxVariants} className={cls} {...baseProps}>
      <motion.circle variants={pathVariants} cx="14" cy="14" r="4" />
      <motion.path variants={pathVariants} d="M6 36c0-4 4-8 8-8s8 4 8 8" />
      <motion.circle variants={pathVariants} cx="32" cy="12" r="4.5" />
      <motion.path variants={pathVariants} d="M24 34c0-4 4-8 8-8s8 4 8 8" />
      <motion.circle variants={pathVariants} cx="50" cy="14" r="4" />
      <motion.path variants={pathVariants} d="M42 36c0-4 4-8 8-8s8 4 8 8" />
    </motion.svg>
  );
}

export function Programmes() {
  return (
    <section id="programmes" className="bg-creme py-14 sm:py-20">
      <div className="container-prose">
        <SectionHeading
          kicker="Formules"
          title={<>Choisissez le format qui vous ressemble</>}
          description="Particulier, duo ou groupe : trois formats, une même exigence pédagogique. Tous les cours ont lieu en ligne via Zoom."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {formules.map((f) => {
            const uniteSansEuro = f.unite.replace(/^€\s*/, "");
            return (
              <motion.article
                key={f.slug}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-nuit/10 bg-white p-8 pt-14 shadow-[0_1px_0_rgba(10,26,63,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-dore/40 hover:shadow-[0_18px_48px_rgba(10,26,63,0.10)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/50 to-transparent"
                />

                {f.badge && (
                  <span className="absolute top-4 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-dore px-3 py-1 font-display text-[10px] uppercase tracking-[0.25em] text-nuit shadow-[0_4px_14px_rgba(201,169,97,0.35)]">
                    {f.badge}
                  </span>
                )}

                <div className="flex flex-col items-center text-center">
                  <motion.div variants={itemVariants}>
                    <PersonsIcon count={formuleCount[f.slug]} />
                  </motion.div>

                  <motion.h3 variants={itemVariants} className="mt-4 font-display text-2xl text-nuit">
                    {f.titre}
                  </motion.h3>

                  <motion.p
                    variants={itemVariants}
                    className="mt-4 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-nuit"
                  >
                    {f.promesse}
                  </motion.p>

                  <motion.span
                    aria-hidden
                    variants={itemVariants}
                    className="mt-4 block h-px w-12 bg-dore/50"
                  />
                </div>

                <motion.ul variants={itemVariants} className="mt-7 space-y-3 text-sm text-nuit/80">
                  {f.pour.map((item) => (
                    <li key={item} className="flex gap-3">
                      <svg
                        aria-hidden
                        viewBox="0 0 20 20"
                        className="mt-0.5 h-4 w-4 flex-none text-dore-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 10.5l3.5 3.5L16 6" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </motion.ul>

                <motion.div
                  variants={itemVariants}
                  className="relative mt-8 overflow-hidden rounded-xl border border-dore/30 bg-gradient-to-br from-dore/10 via-dore/5 to-transparent p-5 text-center"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
                  />
                  <p className="font-display text-[10px] uppercase tracking-[0.3em] text-nuit/55">
                    Tarif
                  </p>
                  <p className="mt-2 font-display leading-none text-nuit">
                    <span className="text-5xl">{f.prix}</span>
                    <span className="ml-1 align-top text-2xl text-dore-700">€</span>
                  </p>
                  <p className="mt-2 text-xs text-nuit/60">{uniteSansEuro}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-6">
                  <ButtonLink
                    href={`/inscription?formule=${f.slug}#formulaire`}
                    className="w-full"
                  >
                    Choisir cette formule
                  </ButtonLink>
                </motion.div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2.5 text-center text-sm text-nuit/75">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="h-4 w-4 flex-none text-dore-700"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 3v4M16 3v4" />
          </svg>
          <span>
            Toutes les sessions débutent le <strong>1er du mois</strong> —
            inscription possible à tout moment.
          </span>
        </div>

        <p className="mt-3 text-center text-sm text-nuit/55">
          Frais d&apos;inscription uniques de 10 € (fournitures incluses) — sans engagement de durée.
        </p>
      </div>
    </section>
  );
}

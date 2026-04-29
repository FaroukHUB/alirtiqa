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
          {formules.map((f) => (
            <motion.article
              key={f.slug}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="relative flex flex-col rounded-2xl border border-nuit/10 bg-white p-8 shadow-[0_1px_0_rgba(10,26,63,0.04)] transition-shadow hover:shadow-[0_8px_30px_rgba(10,26,63,0.08)]"
            >
              {f.badge && (
                <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-dore px-3 py-1 font-display text-[10px] uppercase tracking-[0.25em] text-nuit">
                  {f.badge}
                </span>
              )}

              <motion.h3 variants={itemVariants} className="font-display text-xl text-nuit">
                {f.titre}
              </motion.h3>

              <motion.div variants={itemVariants} className="mt-4">
                <PersonsIcon count={formuleCount[f.slug]} />
              </motion.div>

              <motion.p variants={itemVariants} className="mt-3 text-sm text-nuit/65">
                {f.promesse}
              </motion.p>

              <motion.div variants={itemVariants} className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl text-nuit">{f.prix}</span>
                <span className="text-sm text-nuit/60">{f.unite}</span>
              </motion.div>

              <motion.ul variants={itemVariants} className="mt-6 space-y-3 text-sm text-nuit/75">
                {f.pour.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-dore" />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={itemVariants} className="mt-8">
                <ButtonLink
                  href={`/inscription?formule=${f.slug}`}
                  className="w-full"
                >
                  Choisir cette formule
                </ButtonLink>
              </motion.div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-nuit/55">
          Frais d&apos;inscription uniques de 10 € (fournitures incluses) — sans engagement de durée.
        </p>
      </div>
    </section>
  );
}

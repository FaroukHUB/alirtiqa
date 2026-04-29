"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ease = [0.16, 1, 0.3, 1] as const;

type IconKey = "furqan" | "ajurrumiyya" | "pedagogie";

const piliers: Array<{ titre: string; description: string; icon: IconKey }> = [
  {
    titre: "Al-Furqan",
    description:
      "La base de notre programme : méthode égyptienne progressive d'apprentissage de la langue arabe et de la lecture du Coran et de la Sounnah. Pose les fondations du vocabulaire et de la lecture authentique.",
    icon: "furqan",
  },
  {
    titre: "Al-Ajurrumiyya",
    description:
      "Le traité fondamental de grammaire arabe (نحو), étudié dans le monde musulman depuis le XIIIᵉ siècle. Vient consolider la compréhension structurelle acquise avec Al-Furqan.",
    icon: "ajurrumiyya",
  },
  {
    titre: "Pédagogie égyptienne",
    description:
      "Tradition d'enseignement reconnue mondialement : oralité, mémorisation active, pratique constante, application immédiate de la règle.",
    icon: "pedagogie",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease,
      delayChildren: 0.18,
      staggerChildren: 0.09,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const iconBoxVariants = {
  hidden: { opacity: 0, scale: 0.7, rotate: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.55,
      ease,
      staggerChildren: 0.06,
    },
  },
};

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, ease: "easeOut" },
      opacity: { duration: 0.25 },
    },
  },
};

function Icon({ kind }: { kind: IconKey }) {
  const baseProps = {
    viewBox: "0 0 64 64",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const wrapperCls = "h-14 w-14 text-dore-600 sm:h-16 sm:w-16";

  if (kind === "furqan") {
    return (
      <motion.svg variants={iconBoxVariants} className={wrapperCls} {...baseProps}>
        <motion.path variants={pathVariants} d="M32 18 V52" />
        <motion.path variants={pathVariants} d="M32 18 C24 14 16 14 8 17 V47 C16 44 24 44 32 48" />
        <motion.path variants={pathVariants} d="M32 18 C40 14 48 14 56 17 V47 C48 44 40 44 32 48" />
        <motion.path variants={pathVariants} d="M14 26 H26" />
        <motion.path variants={pathVariants} d="M14 32 H22" />
        <motion.path variants={pathVariants} d="M14 38 H26" />
        <motion.path variants={pathVariants} d="M38 26 H50" />
        <motion.path variants={pathVariants} d="M42 32 H50" />
        <motion.path variants={pathVariants} d="M38 38 H50" />
      </motion.svg>
    );
  }

  if (kind === "ajurrumiyya") {
    return (
      <motion.svg variants={iconBoxVariants} className={wrapperCls} {...baseProps}>
        <motion.path
          variants={pathVariants}
          d="M14 14 H50 V50 H14 Z"
        />
        <motion.path
          variants={pathVariants}
          d="M32 6 L46 18 L58 32 L46 46 L32 58 L18 46 L6 32 L18 18 Z"
        />
        <motion.circle variants={pathVariants} cx="32" cy="32" r="6" />
      </motion.svg>
    );
  }

  // pedagogie — lanterne
  return (
    <motion.svg variants={iconBoxVariants} className={wrapperCls} {...baseProps}>
      <motion.path variants={pathVariants} d="M32 6 V12" />
      <motion.path variants={pathVariants} d="M22 12 H42" />
      <motion.path variants={pathVariants} d="M22 18 L26 12 H38 L42 18" />
      <motion.path variants={pathVariants} d="M22 18 H42 V24 H22 Z" />
      <motion.path variants={pathVariants} d="M24 24 V46 H40 V24" />
      <motion.path variants={pathVariants} d="M24 40 H40" />
      <motion.path variants={pathVariants} d="M24 46 L28 50 H36 L40 46" />
      <motion.path variants={pathVariants} d="M28 50 V56 H36 V50" />
      <motion.circle variants={pathVariants} cx="32" cy="32" r="3.5" />
    </motion.svg>
  );
}

export function Methode() {
  return (
    <section id="methode" className="relative bg-creme py-24 sm:py-32">
      <div className="container-prose">
        <SectionHeading
          kicker="Notre méthode"
          title={<>Une pédagogie éprouvée, qui a fait ses preuves</>}
          description="Inspirée des grands instituts égyptiens, notre méthode allie rigueur grammaticale, immersion progressive et application directe à la lecture et la compréhension du Coran et de la Sounnah."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {piliers.map((p, i) => (
            <motion.article
              key={p.titre}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative flex flex-col gap-5 rounded-2xl border border-nuit/10 bg-white/70 p-7 backdrop-blur transition-shadow duration-300 hover:border-dore/40 hover:shadow-[0_18px_48px_rgba(10,26,63,0.10)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/40 to-transparent"
              />

              <motion.span
                aria-hidden
                variants={itemVariants}
                className="absolute right-6 top-6 font-display text-3xl text-dore/40 transition-colors duration-300 group-hover:text-dore"
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>

              <Decoration />

              <motion.div
                variants={itemVariants}
                className="relative inline-flex h-16 w-16 items-center justify-center rounded-xl bg-dore/10 ring-1 ring-dore/20 transition-colors duration-300 group-hover:bg-dore/15 group-hover:ring-dore/40 sm:h-[72px] sm:w-[72px]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-xl bg-dore/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
                />
                <Icon kind={p.icon} />
              </motion.div>

              <motion.h3 variants={itemVariants} className="font-display text-xl text-nuit">
                {p.titre}
              </motion.h3>

              <motion.p variants={itemVariants} className="text-sm leading-relaxed text-nuit/70">
                {p.description}
              </motion.p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Decoration(): ReactNode {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-dore/5 blur-xl transition-opacity duration-500 group-hover:bg-dore/15"
    />
  );
}

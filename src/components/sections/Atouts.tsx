"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

type IconName = "book" | "chart" | "person" | "clipboard";

const items: { icon: IconName; line1: string; line2: string }[] = [
  { icon: "book", line1: "Méthode claire", line2: "et progressive" },
  { icon: "chart", line1: "Progression", line2: "assurée" },
  { icon: "person", line1: "Suivi personnalisé", line2: "et bienveillant" },
  { icon: "clipboard", line1: "Programme adapté", line2: "à chaque élève" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function Icon({ name }: { name: IconName }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-12 w-12 text-dore-600",
    "aria-hidden": true,
  };

  switch (name) {
    case "book":
      return (
        <svg {...common}>
          <path d="M24 12c-4-2-9-3-15-3v28c6 0 11 1 15 3" />
          <path d="M24 12c4-2 9-3 15-3v28c-6 0-11 1-15 3" />
          <path d="M24 12v28" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M8 40h32" />
          <rect x="11" y="28" width="5" height="10" rx="1" />
          <rect x="21" y="22" width="5" height="16" rx="1" />
          <rect x="31" y="14" width="5" height="24" rx="1" />
          <path d="M10 22l8-6 7 4 11-10" />
          <path d="M30 10h6v6" />
        </svg>
      );
    case "person":
      return (
        <svg {...common}>
          <circle cx="24" cy="17" r="6" />
          <path d="M11 40c1-7 7-12 13-12s12 5 13 12" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <path d="M18 8h12a2 2 0 012 2v2H16v-2a2 2 0 012-2z" />
          <path d="M14 12h20a2 2 0 012 2v26a2 2 0 01-2 2H14a2 2 0 01-2-2V14a2 2 0 012-2z" />
          <path d="M18 22l3 3 6-6" />
          <path d="M18 32l3 3 6-6" />
        </svg>
      );
  }
}

export function Atouts() {
  return (
    <section className="bg-creme">
      <div className="container-prose">
        <div
          aria-hidden
          className="h-px bg-gradient-to-r from-transparent via-nuit/12 to-transparent"
        />

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 gap-y-10 py-10 md:grid-cols-4 md:gap-y-0 md:py-14"
        >
          {items.map((item, i) => (
            <motion.li
              key={item.icon}
              variants={itemVariants}
              className={`flex flex-col items-center px-4 text-center ${
                i > 0 ? "md:border-l md:border-nuit/12" : ""
              }`}
            >
              <Icon name={item.icon} />
              <p className="mt-4 font-display text-[15px] leading-snug text-nuit sm:text-base">
                <span className="block">{item.line1}</span>
                <span className="block">{item.line2}</span>
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <div
          aria-hidden
          className="h-px bg-gradient-to-r from-transparent via-nuit/12 to-transparent"
        />
      </div>
    </section>
  );
}

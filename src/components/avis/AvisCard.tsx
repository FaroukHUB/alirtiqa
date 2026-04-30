"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export type PublicAvis = {
  id: string;
  nom: string;
  note: number;
  texte: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease,
      delayChildren: 0.18,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const starVariants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.45, ease },
  },
};

export function Stars({ count }: { count: number }) {
  return (
    <motion.ul
      role="img"
      aria-label={`${count} étoiles sur 5`}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
      className="flex gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.li key={n} variants={starVariants}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={n <= count ? "#F0B429" : "transparent"}
            stroke={n <= count ? "#F0B429" : "#D1C8B0"}
            strokeWidth="1.4"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 2.5l2.9 6.5 7.1.7-5.4 4.7 1.7 7-6.3-3.7L5.7 21.4l1.7-7L2 9.7l7.1-.7Z" />
          </svg>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function AvisCard({ avis }: { avis: PublicAvis }) {
  const initial = avis.nom.charAt(0).toUpperCase();
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="group relative flex h-full flex-col gap-5 rounded-3xl bg-white p-7 shadow-[0_2px_30px_rgba(10,26,63,0.05)] ring-1 ring-nuit/5 transition-shadow duration-300 hover:shadow-[0_18px_48px_rgba(10,26,63,0.10)] sm:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 font-display text-7xl leading-none text-dore/15 transition-colors duration-300 group-hover:text-dore/25 sm:text-8xl"
      >
        “
      </span>

      <motion.header variants={itemVariants} className="flex items-center gap-4">
        <div
          aria-hidden
          className="relative inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-dore/30 to-dore/10 font-display text-lg text-dore-700 ring-1 ring-dore/30"
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base text-nuit">{avis.nom}</h3>
        </div>
      </motion.header>

      <motion.div variants={itemVariants}>
        <Stars count={avis.note} />
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="relative text-[15px] leading-relaxed text-nuit/85 sm:text-base"
      >
        {avis.texte}
      </motion.p>
    </motion.article>
  );
}

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ease = [0.16, 1, 0.3, 1] as const;

type Avis = {
  nom: string;
  flag?: string;
  stars?: number;
  texte: string;
};

const avis: Avis[] = [
  {
    nom: "Mokrane",
    stars: 5,
    texte:
      "frère très pédagogue avec des explications claires Allahibarek, qui rend agréable l'apprentissage",
  },
  {
    nom: "Stefano",
    flag: "🇮🇹",
    stars: 5,
    texte:
      "Je suis ravi d'avoir rencontré Tarek et d'apprendre l'arabe avec lui. Tarek est un professeur très compétent qui a parfaitement compris mes besoins d'amélioration. Ses supports pédagogiques sont excellents et ses cours sont parfaitement organisés. J'ai particulièrement apprécié la richesse des informations qu'il partage et son incroyable patience. Un grand merci, Tarek !",
  },
  {
    nom: "Jibril",
    stars: 5,
    texte:
      "Prof avec un excellent niveau d’arabe qui prend le temps pour expliquer et faire comprendre quand on lui pose des questions et désireux de faire progresser ses élèves. Il peut être dur quand le travail n’est pas fait ou qu’il n’y a pas d’effort fourni donc je recommande pour les élèves qui sont réellement prêt à faire des efforts dans l’apprentissage de la langue arabe",
  },
  {
    nom: "Faycal",
    stars: 5,
    texte:
      "Salam aleykoum, je tiens à remercier Tarek pour son professionnalisme, c’est un prof très compétent et très rigoureux sur l’apprentissage de votre arabe. Je recommande fortement à tous ceux qui veulent apprendre la langue arabe.",
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
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.45, ease } },
};

function Stars({ count }: { count: number }) {
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

function AvisCard({ a }: { a: Avis }) {
  const initial = a.nom.charAt(0).toUpperCase();
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="group relative flex flex-col gap-5 rounded-3xl bg-white p-7 shadow-[0_2px_30px_rgba(10,26,63,0.05)] ring-1 ring-nuit/5 transition-shadow duration-300 hover:shadow-[0_18px_48px_rgba(10,26,63,0.10)] sm:p-8"
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
          <h3 className="flex items-center gap-2 font-display text-base text-nuit">
            <span>{a.nom}</span>
            {a.flag && (
              <span aria-hidden className="text-base">
                {a.flag}
              </span>
            )}
          </h3>
        </div>
      </motion.header>

      {typeof a.stars === "number" && (
        <motion.div variants={itemVariants}>
          <Stars count={a.stars} />
        </motion.div>
      )}

      <motion.p variants={itemVariants} className="relative text-[15px] leading-relaxed text-nuit/85 sm:text-base">
        {a.texte}
      </motion.p>
    </motion.article>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function Avis() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-avis-card]") as HTMLElement | null;
    const cardWidth = card?.offsetWidth ?? 420;
    const gap = 24;
    el.scrollBy({
      left: (cardWidth + gap) * (dir === "right" ? 1 : -1),
      behavior: "smooth",
    });
  };

  return (
    <section id="avis" className="relative overflow-hidden bg-creme py-14 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/35 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-dore/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-nuit/5 blur-3xl"
      />

      <div className="container-prose relative">
        <SectionHeading
          title="Avis"
          description="Nos élèves prennent la parole"
        />
      </div>

      <div className="container-prose relative mt-12 md:hidden">
        <div className="grid gap-6">
          {avis.map((a) => (
            <AvisCard key={a.nom} a={a} />
          ))}
        </div>
      </div>

      <div className="relative mt-12 hidden md:block">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(2rem,calc((100vw-1280px)/2+2rem))] py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {avis.map((a) => (
            <div
              key={a.nom}
              data-avis-card
              className="flex-none snap-start"
              style={{ width: "min(440px, 80vw)" }}
            >
              <AvisCard a={a} />
            </div>
          ))}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-creme to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-creme to-transparent"
        />

        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Avis précédent"
          className="absolute left-6 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-dore/40 bg-white/90 text-nuit shadow-[0_8px_24px_rgba(10,26,63,0.12)] backdrop-blur transition-all hover:border-dore hover:bg-white hover:text-dore-700"
        >
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Avis suivant"
          className="absolute right-6 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-dore/40 bg-white/90 text-nuit shadow-[0_8px_24px_rgba(10,26,63,0.12)] backdrop-blur transition-all hover:border-dore hover:bg-white hover:text-dore-700"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </section>
  );
}

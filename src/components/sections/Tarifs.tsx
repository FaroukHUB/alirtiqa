"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

type IconName = "video" | "book" | "chart" | "replay";

type Inclusion = {
  titre: string;
  detail: string;
  icon: IconName;
};

const inclusions: Inclusion[] = [
  {
    titre: "Cours en visio",
    detail:
      "8 heures de cours par mois sur Zoom, en direct avec votre professeur.",
    icon: "video",
  },
  {
    titre: "Supports pédagogiques",
    detail:
      "PDF de leçons, fiches de grammaire, exercices corrigés à chaque niveau.",
    icon: "book",
  },
  {
    titre: "Suivi personnalisé",
    detail:
      "Évaluation continue, retours réguliers, ajustements en fonction du rythme.",
    icon: "chart",
  },
  {
    titre: "Replays",
    detail:
      "Accès aux enregistrements pour réviser à votre rythme entre les séances.",
    icon: "replay",
  },
];

type ModaliteIconName =
  | "wallet"
  | "shield"
  | "calendar"
  | "users"
  | "ticket"
  | "globe";

const modalites: { label: string; value: string; icon: ModaliteIconName }[] = [
  {
    label: "Paiement",
    value: "Mensuel, par virement ou PayPal",
    icon: "wallet",
  },
  {
    label: "Engagement",
    value: "Aucun — résiliable à tout moment",
    icon: "shield",
  },
  {
    label: "Durée d'un niveau",
    value: "≈ 8 semaines (variable selon le rythme)",
    icon: "calendar",
  },
  {
    label: "Public",
    value: "Enfants à partir de 10 ans et adultes",
    icon: "users",
  },
  {
    label: "Frais d'inscription",
    value: "10 € unique (fournitures incluses)",
    icon: "ticket",
  },
  {
    label: "Format",
    value: "100 % en ligne via Zoom",
    icon: "globe",
  },
];

function ModaliteIcon({ name }: { name: ModaliteIconName }) {
  const baseProps = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 32 32",
    "aria-hidden": true,
    className: "h-6 w-6",
  };

  switch (name) {
    case "wallet":
      return (
        <svg {...baseProps}>
          <rect x="4" y="9" width="24" height="16" rx="2" />
          <path d="M4 13h24" />
          <circle cx="22" cy="19" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "shield":
      return (
        <svg {...baseProps}>
          <path d="M16 4l10 4v8c0 6-4 10-10 12-6-2-10-6-10-12V8l10-4z" />
          <path d="M11 16l3.5 3.5L21 13" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...baseProps}>
          <rect x="5" y="7" width="22" height="20" rx="2" />
          <path d="M5 13h22" />
          <path d="M11 4v6M21 4v6" />
          <circle cx="11" cy="19" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="19" r="1" fill="currentColor" stroke="none" />
          <circle cx="21" cy="19" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "users":
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M5 25c0-4 3-7 7-7s7 3 7 7" />
          <circle cx="22" cy="14" r="3" />
          <path d="M19 25c0-3 2-5 4-5s4 1 4 4" />
        </svg>
      );
    case "ticket":
      return (
        <svg {...baseProps}>
          <path d="M4 12a2 2 0 002-2V8h20v2a2 2 0 000 4v2a2 2 0 000 4v2H6v-2a2 2 0 00-2-2v-2a2 2 0 000-4z" />
          <path d="M14 10v2M14 15v2M14 20v2" />
        </svg>
      );
    case "globe":
      return (
        <svg {...baseProps}>
          <circle cx="16" cy="16" r="11" />
          <path d="M5 16h22" />
          <path d="M16 5c3 3 4.5 7 4.5 11s-1.5 8-4.5 11c-3-3-4.5-7-4.5-11s1.5-8 4.5-11z" />
        </svg>
      );
  }
}

function StepIcon({ name }: { name: IconName }) {
  const baseClass = "h-10 w-10 text-dore-700";
  const baseProps = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 48 48",
    "aria-hidden": true,
  };

  switch (name) {
    case "video":
      return (
        <svg {...baseProps} className={baseClass}>
          <rect x="7" y="11" width="34" height="22" rx="2" />
          <path d="M5 36h38" />
          <path d="M20 17v10l9-5-9-5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "book":
      return (
        <svg {...baseProps} className={baseClass}>
          <path d="M24 14c-3-2-7-3-13-3v23c6 0 10 1 13 3" />
          <path d="M24 14c3-2 7-3 13-3v23c-6 0-10 1-13 3" />
          <path d="M14 19h6M14 25h6M28 19h6M28 25h6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...baseProps} className={baseClass}>
          <path d="M8 38h34" />
          <path d="M8 38V10" />
          <path d="M12 32l7-6 6 4 13-12" />
          <circle cx="12" cy="32" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="19" cy="26" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="25" cy="30" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="38" cy="18" r="2.6" fill="#C9A961" stroke="#C9A961" />
        </svg>
      );
    case "replay":
      return (
        <svg {...baseProps} className={baseClass}>
          <path d="M38 18a14 14 0 11-3-9" />
          <path d="M37 6v9h-9" />
          <path d="M20 19v10l9-5-9-5z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

function DesktopTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const pathLength = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  const o1 = useTransform(scrollYProgress, [0.05, 0.18], [0, 1]);
  const s1 = useTransform(scrollYProgress, [0.05, 0.18], [0.7, 1]);
  const o2 = useTransform(scrollYProgress, [0.30, 0.43], [0, 1]);
  const s2 = useTransform(scrollYProgress, [0.30, 0.43], [0.7, 1]);
  const o3 = useTransform(scrollYProgress, [0.55, 0.68], [0, 1]);
  const s3 = useTransform(scrollYProgress, [0.55, 0.68], [0.7, 1]);
  const o4 = useTransform(scrollYProgress, [0.80, 0.93], [0, 1]);
  const s4 = useTransform(scrollYProgress, [0.80, 0.93], [0.7, 1]);

  const steps = [
    { o: o1, s: s1 },
    { o: o2, s: s2 },
    { o: o3, s: s3 },
    { o: o4, s: s4 },
  ];

  return (
    <div ref={ref} className="hidden md:block">
      <div className="relative">
        <svg
          aria-hidden
          className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-12 h-2 w-3/4"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke="#C9A961"
            strokeOpacity="0.18"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
          <motion.path
            d="M0 1 L100 1"
            fill="none"
            stroke="#C9A961"
            strokeWidth="0.7"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>

        <div className="relative grid grid-cols-4 gap-6">
          {inclusions.map((item, idx) => (
            <motion.div
              key={item.titre}
              style={{ opacity: steps[idx].o, scale: steps[idx].s }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-dore/40 bg-white shadow-[0_10px_30px_rgba(201,169,97,0.18)]">
                <span
                  aria-hidden
                  className="absolute inset-2 rounded-full bg-dore/[0.08]"
                />
                <span className="relative">
                  <StepIcon name={item.icon} />
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg text-nuit">
                {item.titre}
              </h3>
              <p className="mx-auto mt-2 max-w-[260px] text-sm leading-relaxed text-nuit/65">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTimeline() {
  return (
    <ol className="md:hidden">
      {inclusions.map((item, idx) => (
        <motion.li
          key={item.titre}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
          className={`relative flex gap-5 ${
            idx < inclusions.length - 1 ? "pb-8" : ""
          }`}
        >
          {idx < inclusions.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[23px] top-12 bottom-0 w-px bg-dore/30"
            />
          )}
          <span className="relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full border border-dore/40 bg-white shadow-[0_4px_14px_rgba(201,169,97,0.18)]">
            <StepIcon name={item.icon} />
          </span>
          <div className="pt-1">
            <h3 className="font-display text-base text-nuit">{item.titre}</h3>
            <p className="mt-1 text-sm leading-relaxed text-nuit/65">
              {item.detail}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export function Tarifs() {
  return (
    <section id="tarifs" className="bg-creme py-14 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -mt-24 h-px bg-gradient-to-r from-transparent via-dore/40 to-transparent"
      />
      <div className="container-prose">
        <SectionHeading
          kicker="Ce qui est inclus"
          title={<>Une offre claire, sans surprise</>}
          description="Tous les supports, un suivi régulier et la flexibilité d'apprendre depuis chez vous, où que vous soyez."
        />

        <div className="mt-16">
          <DesktopTimeline />
          <MobileTimeline />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-20 rounded-2xl bg-nuit p-8 text-creme sm:p-10"
        >
          <h3 className="font-display text-xs uppercase tracking-[0.4em] text-dore">
            Modalités
          </h3>

          <div className="mt-6 flex items-start gap-4 rounded-xl border border-dore/40 bg-dore/[0.06] p-4 sm:p-5">
            <span
              aria-hidden
              className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-dore/40 bg-dore/[0.1] text-dore"
            >
              <ModaliteIcon name="calendar" />
            </span>
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dore">
                Démarrage des sessions
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-creme/90">
                Toutes les sessions débutent le <strong className="text-dore">1er du mois</strong>.
                Inscrivez-vous à tout moment : votre session démarrera le 1er
                du mois suivant.
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-x-10 gap-y-2 md:grid-cols-3">
            {modalites.map((m, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              const diag = col + row;
              const delay = diag * 0.12;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative -mx-3 flex items-start gap-4 rounded-lg px-3 py-3 transition-colors duration-300 hover:bg-creme/[0.04]"
                >
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.55,
                      delay: delay + 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative mt-0.5 inline-flex h-11 w-11 flex-none items-center justify-center rounded-full border border-dore/30 bg-dore/[0.08] text-dore transition-all duration-300 group-hover:border-dore/70 group-hover:bg-dore/[0.18] group-hover:text-dore group-hover:shadow-[0_0_24px_rgba(201,169,97,0.35)]"
                  >
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      <ModaliteIcon name={m.icon} />
                    </span>
                  </motion.span>
                  <div className="flex min-w-0 flex-col gap-2">
                    <dt className="text-xs uppercase tracking-[0.2em] text-creme/55 transition-colors duration-300 group-hover:text-dore">
                      {m.label}
                    </dt>
                    <motion.span
                      aria-hidden
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{
                        duration: 0.6,
                        delay: delay + 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="block h-px w-10 origin-left bg-dore/60 transition-[width,background-color] duration-300 group-hover:w-16 group-hover:bg-dore"
                    />
                    <dd className="text-sm leading-relaxed text-creme/90">
                      {m.value}
                    </dd>
                  </div>
                </motion.div>
              );
            })}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

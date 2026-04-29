"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

const titleWords = site.tagline.split(/\s+/);

const particles = Array.from({ length: 28 }, (_, i) => {
  const a = (i * 9301 + 49297) % 233280;
  const b = ((i + 13) * 49297 + 9301) % 233280;
  const c = ((i + 7) * 4096 + 150889) % 714025;
  return {
    id: i,
    x: (a / 233280) * 100,
    y: (b / 233280) * 100,
    delay: (c % 60) / 10,
    duration: 7 + ((i * 3) % 6),
    size: 1.5 + (i % 3) * 0.7,
    drift: 14 + (i % 4) * 8,
  };
});

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-nuit text-creme">
      <Image
        src="/images/heromerkez.webp"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-nuit/75 via-nuit/55 to-nuit/85"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(10,26,63,0.55)_85%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-arabesque bg-[length:480px] opacity-[0.03] mix-blend-overlay"
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90%] w-[95%] max-w-[1100px] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.text
          x="600"
          y="320"
          textAnchor="middle"
          fontFamily="'Amiri', 'Noto Naskh Arabic', 'Scheherazade New', serif"
          fontSize="200"
          fontWeight="500"
          fill="none"
          stroke="#C9A961"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={2400}
          initial={{ strokeDashoffset: 2400, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.2 }}
          transition={{ duration: 3.6, ease: "easeOut", delay: 0.2 }}
        >
          الارتقاء
        </motion.text>
      </svg>

      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-y-20 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-dore/20 to-transparent blur-2xl"
          initial={{ x: "-20%" }}
          animate={{ x: "420%" }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
            delay: 1.4,
          }}
        />
      )}

      {!reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-dore"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                filter: "blur(0.5px)",
                boxShadow: "0 0 6px rgba(201, 169, 97, 0.6)",
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.85, 0],
                y: [0, -p.drift, 0],
                x: [0, p.drift / 3, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
      />

      <div className="container-prose relative z-10 flex min-h-[88vh] flex-col items-center justify-center py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-5 font-display text-sm uppercase tracking-[0.4em] text-dore drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        >
          Institut Al-Irtiqā&apos;
        </motion.p>

        <motion.div
          aria-hidden
          className="mb-10 h-px origin-center bg-gradient-to-r from-transparent via-dore to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 180, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
        />

        <h1 className="text-balance font-display text-4xl font-medium leading-[1.1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl">
          <span className="sr-only">{site.tagline}</span>
          <span aria-hidden className="block">
            {titleWords.map((word, i) => (
              <span key={i}>
                <motion.span
                  initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.95 + i * 0.11,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
                {i < titleWords.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1.05 + titleWords.length * 0.11,
            ease: "easeOut",
          }}
          className="mt-7 max-w-2xl text-balance text-lg text-creme/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        >
          15 niveaux progressifs, cours en ligne via Zoom, fondés sur l&apos;Ajurrumiyya
          et Al-Furqan. Pour francophones, à partir de 10 ans.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 18,
            delay: 1.35 + titleWords.length * 0.11,
          }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ButtonLink href="/test-de-niveau" variant="primary">
            Faire le test de niveau
          </ButtonLink>
          <ButtonLink href="/programme" variant="ghost">
            Découvrir le programme
          </ButtonLink>
        </motion.div>

        {!reduced && (
          <motion.div
            aria-hidden
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4,
              delay: 2.6 + titleWords.length * 0.11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex h-9 w-5 items-start justify-center rounded-full border border-dore/40 p-1">
              <motion.div
                className="h-1.5 w-0.5 rounded-full bg-dore"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

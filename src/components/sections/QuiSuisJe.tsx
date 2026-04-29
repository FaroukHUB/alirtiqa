"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const intro = [
  "Je m'appelle Tarek Abou Zeyneb, et si j'ai fondé Institut Al-Irtiqā', c'est d'abord par attachement profond à la langue arabe, par respect pour sa noblesse, et par conscience de son importance.",
  "J'ai étudié la langue arabe en Égypte pendant trois années, puis j'ai poursuivi son étude, sa pratique et son approfondissement jusqu'à aujourd'hui, depuis plus de quinze ans. Au fil du temps, cette langue n'a pas seulement été pour moi une discipline d'étude, mais une voie, une science et un attachement durable.",
  "La langue arabe n'est pas une langue ordinaire. Elle est la langue du Coran, la langue de la Révélation, et la langue de notre Prophète ﷺ. Elle est la clef de compréhension des textes, la porte d'accès à la science, et le moyen par lequel le musulman accède avec justesse au Livre d'Allah et à la Sunnah de Son Messager ﷺ.",
  "C'est cet amour pour cette langue, et cette conscience de sa valeur, qui m'ont poussé à fonder Institut Al-Irtiqā' : offrir un cadre sérieux, structuré et bénéfique pour apprendre la langue arabe avec méthode, progression et clarté.",
  "J'ai également constaté que beaucoup souhaitent apprendre l'arabe, mais se heurtent souvent à des méthodes désordonnées, à des approches confuses, ou à des enseignements qui utilisent la langue non comme une fin noble, mais comme un moyen d'orienter, de détourner ou d'influencer les étudiants, en particulier les plus jeunes, vers des voies qui ne sont pas celles de la vérité.",
  "C'est pourquoi Institut Al-Irtiqā' repose sur un enseignement clair, méthodique et rigoureux, fondé sur le manhaj des gens de la Sunnah et du consensus, selon la compréhension des pieux prédécesseurs.",
  "Le manhaj de l'institut repose sur l'affirmation de ce qu'Allah s'est affirmé à Lui-même, et de ce que Son Messager ﷺ a affirmé pour Lui, parmi Ses Noms et Ses Attributs, sans altération (taḥrīf), sans négation (taʿṭīl), sans chercher le “comment” (takyīf), et sans assimilation (tamthīl). Et il repose également sur le reniement de ce qu'Allah et Son Messager ﷺ ont renié, conformément à la voie des gens de la Sunnah, loin des voies innovées, des déformations spéculatives et des méthodologies altérées.",
  "L'objectif ici n'est pas seulement d'enseigner une langue, mais de transmettre un outil noble, avec droiture, clarté et responsabilité.",
];

const middle =
  "Or la langue arabe est l'un des plus grands moyens d'accéder à cette obligation. Et ce sans quoi une obligation ne peut être accomplie prend le jugement de ce qui la rend possible. C'est pour cette raison que les savants ont accordé à la langue arabe une place centrale dans la religion.";

const outro = [
  "C'est cette conviction qui m'a poussé à enseigner : aider les musulmans à accéder à une langue noble, leur transmettre un outil juste, et contribuer, à ma mesure, à faciliter l'accès à une science utile, authentique et bénéfique.",
  "Institut Al-Irtiqā' est né de cet amour, de cette responsabilité, et de cette volonté : enseigner la langue arabe avec sérieux, méthode et droiture.",
];

const hadithArabic = "« طلب العلم فريضة على كل مسلم »";
const hadithFr = "« La recherche de la science est une obligation pour tout musulman. »";

const ibnTaymiyyahArabic =
  "« فإنَّ نفسَ اللُّغةِ العربيَّةِ من الدِّينِ، ومعرفتُها فرضٌ واجبٌ، فإنَّ فهمَ الكتابِ والسُّنَّةِ فرضٌ، ولا يُفهمُ إلا بفهمِ اللُّغةِ العربيَّةِ، وما لا يتمُّ الواجبُ إلا به فهو واجبٌ »";
const ibnTaymiyyahFr =
  "« La langue arabe elle-même fait partie intégrante de la religion, et sa connaissance est une obligation. Car comprendre le Livre et la Sunnah est une obligation, et ils ne peuvent être compris qu'à travers la compréhension de la langue arabe ; or ce sans quoi une obligation ne peut être accomplie devient lui-même obligatoire. »";

function Reveal({ children, delay = 0, as = "p" }: { children: ReactNode; delay?: number; as?: "p" | "div" }) {
  const Cmp = as === "p" ? motion.p : motion.div;
  return (
    <Cmp
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.6, delay, ease }}
      className="text-base leading-[1.85] text-nuit/85 sm:text-[17px]"
    >
      {children}
    </Cmp>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="56"
      height="20"
      viewBox="0 0 56 20"
      fill="none"
    >
      <path
        d="M2 10h14M40 10h14M16 10c0-3 6-3 6 0s-6 3-6 6 6 3 6 0M40 10c0-3-6-3-6 0s6 3 6 6-6 3-6 0"
        stroke="#C9A961"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="28" cy="10" r="2.4" stroke="#C9A961" strokeWidth="0.9" fill="none" />
    </svg>
  );
}

function Quote({
  intro,
  ar,
  fr,
  size = "md",
}: {
  intro?: ReactNode;
  ar: string;
  fr: string;
  size?: "md" | "lg";
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease }}
      className="relative my-14 overflow-hidden rounded-2xl border border-dore/25 bg-white px-7 py-10 shadow-[0_2px_30px_rgba(10,26,63,0.05)] sm:px-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
      />
      <Ornament className="mx-auto mb-7" />

      {intro && (
        <p className="mb-6 text-center text-base leading-relaxed text-nuit/85 sm:text-[17px]">
          {intro}
        </p>
      )}

      <motion.p
        dir="rtl"
        lang="ar"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.2, ease }}
        className={`text-balance font-arabic text-nuit ${size === "lg" ? "text-2xl leading-[2.2] sm:text-3xl" : "text-2xl leading-[2.1] sm:text-[28px]"}`}
        style={{ textAlign: "center" }}
      >
        {ar}
      </motion.p>

      <div
        aria-hidden
        className="mx-auto my-7 h-px w-16 bg-gradient-to-r from-transparent via-dore/60 to-transparent"
      />

      <p className="text-balance text-center text-base italic leading-relaxed text-nuit/75 sm:text-lg">
        {fr}
      </p>
    </motion.figure>
  );
}

export function QuiSuisJe() {
  return (
    <section id="qui-suis-je" className="relative bg-creme py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/40 to-transparent"
      />

      <div className="mx-auto w-full max-w-3xl px-6 sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-14 text-center"
        >
          <h1 className="font-display text-4xl text-nuit sm:text-5xl md:text-6xl">
            Qui suis-je
          </h1>
          <motion.div
            aria-hidden
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 140, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
            className="mx-auto mt-7 h-px bg-gradient-to-r from-transparent via-dore to-transparent"
          />
          <Ornament className="mx-auto mt-6" />
        </motion.header>

        <article className="space-y-7">
          {intro.map((p, i) => (
            <Reveal key={`intro-${i}`}>{p}</Reveal>
          ))}

          <Quote intro={<>Le Prophète ﷺ a dit :</>} ar={hadithArabic} fr={hadithFr} />

          <Reveal>{middle}</Reveal>

          <Reveal>
            Shaykh al-Islām Ibn Taymiyyah <span lang="ar">رحمه الله</span> a dit :
          </Reveal>

          <Quote ar={ibnTaymiyyahArabic} fr={ibnTaymiyyahFr} size="lg" />

          {outro.map((p, i) => (
            <Reveal key={`outro-${i}`}>{p}</Reveal>
          ))}
        </article>
      </div>
    </section>
  );
}

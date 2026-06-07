import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cours d'arabe en ligne — Institut francophone Al-Irtiqā'",
  description:
    "Apprenez l'arabe en ligne avec un institut francophone : six parcours (débutant, adulte, enfant, femme, intermédiaire, avancé), méthode égyptienne, cours en visioconférence.",
  alternates: { canonical: "/cours-arabe" },
  openGraph: {
    title: "Cours d'arabe en ligne — Institut Al-Irtiqā'",
    description:
      "Apprenez l'arabe en ligne avec un institut francophone : six parcours adaptés, méthode égyptienne, cours en visioconférence.",
    url: `${site.url}/cours-arabe`,
    type: "website",
  },
};

const profils = [
  {
    titre: "Cours d'arabe pour débutant",
    desc: "Pour celles et ceux qui n'ont jamais étudié l'arabe et veulent partir de l'alphabet.",
    href: "/cours-arabe/debutant",
  },
  {
    titre: "Cours d'arabe pour adulte",
    desc: "Un rythme et un vocabulaire pensés pour les apprenants adultes, du débutant au confirmé.",
    href: "/cours-arabe/adulte",
  },
  {
    titre: "Cours d'arabe pour enfant",
    desc: "À partir de 10 ans, dans un cadre structuré et bienveillant, sans pression.",
    href: "/cours-arabe/enfant",
  },
  {
    titre: "Cours d'arabe pour femmes",
    desc: "Un parcours dédié, dispensé dans un cadre exclusivement féminin.",
    href: "/cours-arabe/femme",
  },
  {
    titre: "Niveau intermédiaire",
    desc: "Pour les élèves qui maîtrisent les bases et veulent approfondir grammaire et expression.",
    href: "/cours-arabe/intermediaire",
  },
  {
    titre: "Niveau avancé",
    desc: "Pour celles et ceux qui visent la lecture autonome de textes et l'analyse grammaticale.",
    href: "/cours-arabe/avance",
  },
] as const;

const formats = [
  {
    nom: "Cours particulier",
    prix: site.pricing.particulier,
    desc: "Un élève, un professeur, pour un suivi entièrement personnalisé.",
  },
  {
    nom: "Cours en duo",
    prix: site.pricing.duo,
    desc: "À deux, pour partager la progression à un tarif allégé.",
  },
  {
    nom: "Cours en groupe",
    prix: site.pricing.groupe,
    desc: "À partir de trois élèves, pour avancer ensemble dans une dynamique collective.",
  },
] as const;

const faq = [
  {
    q: "Faut-il un niveau d'arabe pour commencer ?",
    a: "Non. Le programme démarre au niveau 1 — MUQADIMA ALIF — où l'on découvre l'alphabet, les voyelles et les premiers mots. Aucun prérequis n'est demandé. Si vous avez déjà des bases, le test de niveau vous oriente vers le bon point d'entrée.",
  },
  {
    q: "Les cours sont-ils en direct ou en replay ?",
    a: "Tous les cours se déroulent en direct sur Zoom, avec le professeur. Cela permet de poser ses questions sur le moment et d'avoir une correction immédiate.",
  },
  {
    q: "À partir de quel âge peut-on suivre les cours ?",
    a: "Les cours sont ouverts aux enfants à partir de 10 ans et aux adultes. En dessous de 10 ans, l'attention et la posture d'apprentissage rendent l'expérience moins fructueuse.",
  },
  {
    q: "Peut-on changer de formule en cours d'année ?",
    a: "Oui. Si votre situation évolue, vous pouvez passer du cours particulier au duo ou au groupe (et inversement), en lien avec le professeur, dans la limite des places disponibles.",
  },
  {
    q: "Combien de temps faut-il pour apprendre l'arabe ?",
    a: "Cela dépend du rythme et de l'objectif. À raison de 8 heures par mois et d'un travail personnel régulier, le cycle d'Initiation se boucle en 6 à 12 mois selon les élèves. Pour atteindre la lecture autonome de textes classiques, comptez plusieurs années — comme pour toute langue ancienne sérieusement étudiée.",
  },
  {
    q: "Quelle est la différence avec une application ou un cours autodidacte ?",
    a: "Une application permet de mémoriser du vocabulaire ou de reconnaître l'alphabet, mais elle ne corrige pas votre prononciation, ne construit pas une grammaire raisonnée et ne tient pas dans la durée. Un institut apporte la structure, la correction et le suivi qu'aucun outil seul ne remplace.",
  },
] as const;

export default function CoursArabePage() {
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Cours d'arabe en ligne",
    description:
      "Cours d'arabe en ligne en visioconférence pour francophones, du niveau débutant au niveau avancé, en six parcours adaptés.",
    inLanguage: "fr",
    educationalLevel: "Débutant à avancé",
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
      sameAs: site.url,
    },
    offers: formats.map((f) => ({
      "@type": "Offer",
      name: f.nom,
      price: f.prix,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${site.url}/inscription`,
    })),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT8H",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cours d'arabe",
        item: `${site.url}/cours-arabe`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-zellige bg-[length:160px] opacity-[0.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
        />
        <div className="container-prose relative py-16 sm:py-24">
          <nav
            aria-label="Fil d'Ariane"
            className="text-xs uppercase tracking-[0.3em] text-creme/60"
          >
            <Link href="/" className="hover:text-dore">
              Accueil
            </Link>
            <span className="mx-2 text-dore/60">/</span>
            <span className="text-creme/80">Cours d&apos;arabe</span>
          </nav>

          <p className="mt-6 font-display text-xs uppercase tracking-[0.4em] text-dore">
            Cours d&apos;arabe en ligne
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Apprendre l&apos;arabe en ligne, de l&apos;alphabet à la maîtrise
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-creme/80 sm:text-lg">
            Institut Al-Irtiqā&apos; accompagne les francophones — adultes, enfants, débutants ou
            élèves confirmés — dans l&apos;apprentissage progressif de la langue arabe, selon une
            méthode éprouvée, 100% en visioconférence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/test-de-niveau"
              className="inline-flex items-center justify-center rounded-full bg-dore px-6 py-3 text-sm font-medium text-nuit transition-colors hover:bg-dore-300"
            >
              Faire le test de niveau →
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center rounded-full border border-creme/30 px-6 py-3 text-sm font-medium text-creme transition-colors hover:border-dore/60 hover:bg-creme/5"
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROFILS */}
      <section className="bg-creme py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            À qui s&apos;adressent nos cours d&apos;arabe ?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            Apprendre l&apos;arabe ne suit pas le même chemin selon votre point de départ. Un enfant
            qui découvre l&apos;alphabet, un adulte qui souhaite reprendre depuis le début, ou un
            élève qui a déjà quelques bases : chaque profil a son rythme, son vocabulaire et ses
            objectifs. Nous distinguons six parcours, chacun avec sa pédagogie adaptée.
          </p>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {profils.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group flex h-full flex-col rounded-2xl border border-nuit/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-dore/40 hover:shadow-[0_8px_28px_rgba(10,26,63,0.08)]"
                >
                  <h3 className="font-display text-lg text-nuit transition-colors group-hover:text-dore-700">
                    {p.titre}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-nuit/70">{p.desc}</p>
                  <span className="mt-4 inline-flex items-center text-xs font-medium uppercase tracking-[0.2em] text-dore-700">
                    Découvrir →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 3 — POURQUOI */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            Pourquoi apprendre l&apos;arabe en ligne avec un institut ?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            Apprendre l&apos;arabe seul, à partir d&apos;applications ou de vidéos isolées, donne
            souvent l&apos;illusion d&apos;avancer puis bloque rapidement. Un institut apporte ce
            qu&apos;aucun outil automatisé ne remplace : une progression cohérente, un retour
            humain, et une méthode qui tient sur la durée.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div>
              <h3 className="font-display text-lg text-nuit">Une accessibilité totale</h3>
              <p className="mt-2 text-sm leading-relaxed text-nuit/70">
                Que vous habitiez en France, en Belgique, au Maroc, en Suisse ou ailleurs en Europe,
                nos cours en visioconférence vous donnent accès au même enseignant et au même
                contenu, sans contrainte de déplacement.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-nuit">
                Une progression structurée, pas une suite de leçons isolées
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-nuit/70">
                Les quinze niveaux du programme ne sont pas une accumulation de fiches. Chacun
                prépare le suivant : l&apos;alphabet ouvre sur les premiers mots, puis sur la
                phrase, puis sur la grammaire, puis sur la lecture de textes complets. Vous savez à
                tout moment où vous en êtes et ce qui vient.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-nuit">Un suivi humain régulier</h3>
              <p className="mt-2 text-sm leading-relaxed text-nuit/70">
                Le professeur connaît chaque élève, ses difficultés et son rythme. Les supports de
                cours sont fournis, mais le cœur de la pédagogie reste le contact direct en classe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — METHODE */}
      <section className="bg-creme py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            Une méthode pédagogique structurée
          </h2>
          <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-nuit/80">
            <p>
              L&apos;enseignement repose sur la méthode égyptienne, une pédagogie progressive
              employée depuis plusieurs décennies pour transmettre la langue arabe classique à des
              non-arabophones. Elle s&apos;organise autour d&apos;un programme en quinze niveaux,
              répartis en trois cycles : Initiation, Préparation et Approfondissement.
            </p>
            <p>
              Le cycle d&apos;Initiation pose les fondations (alphabet, vocabulaire courant,
              premières structures). Le cycle de Préparation consolide les acquis et installe la
              grammaire élémentaire. Le cycle d&apos;Approfondissement permet d&apos;aborder la
              lecture de textes, la morphologie verbale et l&apos;analyse grammaticale.
            </p>
            <p>
              À la fin du programme, l&apos;élève peut lire un texte arabe classique sans dépendre
              d&apos;une traduction.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/methode-egyptienne"
              className="inline-flex items-center justify-center rounded-full border border-nuit/15 px-5 py-2.5 text-sm font-medium text-nuit transition-colors hover:border-dore/50 hover:bg-dore/5"
            >
              Découvrir la méthode égyptienne →
            </Link>
            <Link
              href="/programme"
              className="inline-flex items-center justify-center rounded-full border border-nuit/15 px-5 py-2.5 text-sm font-medium text-nuit transition-colors hover:border-dore/50 hover:bg-dore/5"
            >
              Voir le programme des 15 niveaux →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FORMATS */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            Trois formats de cours au choix
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            Selon vos préférences et votre disponibilité, vous pouvez choisir entre trois formats.
            Tous donnent accès au même programme et aux mêmes supports.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {formats.map((f) => (
              <div
                key={f.nom}
                className="rounded-2xl border border-nuit/10 bg-creme p-6"
              >
                <h3 className="font-display text-lg text-nuit">{f.nom}</h3>
                <p className="mt-2 font-display text-3xl text-dore-700">
                  {f.prix}&nbsp;€
                  <span className="text-sm font-normal text-nuit/60"> / mois</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-nuit/70">{f.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-nuit/70">
            Chaque formule couvre <strong className="text-nuit">8 heures de cours par mois</strong>,
            en visioconférence. Les sessions démarrent{" "}
            <strong className="text-nuit">le 1er de chaque mois</strong>. Des frais d&apos;inscription
            uniques de 10&nbsp;€ s&apos;appliquent à l&apos;entrée, pour les fournitures
            pédagogiques.
          </p>

          <div className="mt-6">
            <Link
              href="/tarifs"
              className="inline-flex items-center justify-center rounded-full border border-nuit/15 px-5 py-2.5 text-sm font-medium text-nuit transition-colors hover:border-dore/50 hover:bg-dore/5"
            >
              Tous les détails sur la page tarifs →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — DÉROULEMENT */}
      <section className="bg-creme py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            Comment se déroulent les cours ?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            Tout est pensé pour que vous puissiez vous concentrer sur l&apos;apprentissage, sans
            contrainte technique.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              {
                t: "Format Zoom",
                d: "Les cours se déroulent en visioconférence, en direct, avec votre professeur.",
              },
              {
                t: "Démarrage au 1er du mois",
                d: "Pour que les groupes avancent ensemble, chaque session démarre au début du mois civil.",
              },
              {
                t: "Supports fournis",
                d: "Les documents pédagogiques et exercices sont mis à disposition à chaque niveau.",
              },
              {
                t: "Rythme régulier",
                d: "8 heures de cours par mois, réparties sur des créneaux fixes définis avec le professeur.",
              },
              {
                t: "Reprise à n'importe quel niveau",
                d: "Grâce au test de niveau, vous démarrez exactement là où vous en êtes — pas plus bas, pas plus haut.",
              },
            ].map((item) => (
              <li
                key={item.t}
                className="rounded-2xl border border-nuit/10 bg-white p-5"
              >
                <h3 className="font-display text-base text-nuit">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nuit/70">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 7 — FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">Questions fréquentes</h2>
          <ul className="mt-8 divide-y divide-nuit/10 border-y border-nuit/10">
            {faq.map((item) => (
              <li key={item.q}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base text-nuit transition-colors hover:text-dore-700">
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="shrink-0 text-dore transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-nuit/75">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 8 — CTA FINAL */}
      <section className="relative isolate overflow-hidden bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
        />
        <div className="container-prose py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-dore">
              Et maintenant ?
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">
              Découvrez votre niveau ou rejoignez-nous
            </h2>
            <p className="mt-3 text-base leading-relaxed text-creme/80">
              Découvrez votre niveau d&apos;entrée ou inscrivez-vous directement à la prochaine
              session.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/test-de-niveau"
                className="inline-flex items-center justify-center rounded-full bg-dore px-6 py-3 text-sm font-medium text-nuit transition-colors hover:bg-dore-300"
              >
                Faire le test de niveau →
              </Link>
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center rounded-full border border-creme/30 px-6 py-3 text-sm font-medium text-creme transition-colors hover:border-dore/60 hover:bg-creme/5"
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

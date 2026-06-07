import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cours d'arabe pour débutant — Commencer de zéro en ligne | Al-Irtiqā'",
  description:
    "Cours d'arabe pour vrais débutants : alphabet, prononciation, premiers mots. Démarrage au niveau 1 (MUQADIMA ALIF), en visioconférence, méthode éprouvée.",
  alternates: { canonical: "/cours-arabe/debutant" },
  openGraph: {
    title: "Cours d'arabe pour débutant — Commencer de zéro en ligne",
    description:
      "Cours d'arabe pour vrais débutants : alphabet, prononciation, premiers mots. Démarrage au niveau 1 en visioconférence.",
    url: `${site.url}/cours-arabe/debutant`,
    type: "article",
  },
};

const jalons = [
  { etape: "Reconnaître l'ensemble des lettres isolées", delai: "2 à 3 semaines" },
  { etape: "Lire des mots courts vocalisés correctement", delai: "4 à 6 semaines" },
  { etape: "Lire à l'aise des phrases simples", delai: "3 à 4 mois" },
  {
    etape: "Cycle d'Initiation complet (alphabet + vocabulaire + structures de base)",
    delai: "6 à 12 mois",
  },
] as const;

const leconType = [
  {
    t: "Présentation des lettres du jour",
    d: "3 ou 4 lettres, leur tracé, leur prononciation, leurs formes selon la position dans le mot.",
  },
  {
    t: "Pratique de l'écriture",
    d: "Vous écrivez les lettres à la main, avec une correction immédiate du professeur.",
  },
  {
    t: "Premiers mots",
    d: "Vous lisez et prononcez des mots courts construits à partir des lettres apprises.",
  },
  {
    t: "Mémorisation",
    d: "Un petit vocabulaire à retenir pour le cours suivant.",
  },
] as const;

const formats = [
  {
    nom: "Cours particulier",
    prix: site.pricing.particulier,
    desc: "Le format le plus adapté aux débutants. Tout le temps de classe est consacré à votre prononciation, votre écriture et votre rythme. Idéal si vous voulez avancer vite et sans gêne.",
  },
  {
    nom: "Cours en duo",
    prix: site.pricing.duo,
    desc: "Pour celles et ceux qui préfèrent partager l'apprentissage avec un proche (conjoint, frère, sœur, ami). Le rythme reste très individualisé, à un tarif plus accessible.",
  },
  {
    nom: "Cours en groupe",
    prix: site.pricing.groupe,
    desc: "Possible pour un débutant, à condition d'accepter un rythme commun. Plus dynamique, plus collectif, mais moins de temps de correction personnel. À privilégier si vous vous sentez à l'aise pour parler devant les autres.",
  },
] as const;

const faq = [
  {
    q: "Faut-il déjà connaître l'alphabet arabe ?",
    a: "Non. Le cours débutant démarre justement par l'alphabet. C'est tout le sens de la page sur laquelle vous êtes : prendre l'élève à zéro et le guider jusqu'à la lecture.",
  },
  {
    q: "Quel matériel faut-il prévoir pour commencer ?",
    a: "Un ordinateur ou une tablette pour Zoom, un cahier et un stylo pour s'entraîner à écrire les lettres, et le manuel du niveau 1 — fourni au moment de l'inscription. Rien d'autre.",
  },
  {
    q: "Combien de temps pour réussir à lire l'arabe ?",
    a: "En moyenne 4 à 6 semaines pour lire des mots simples vocalisés, et quelques mois pour lire des phrases courtes à l'aise. La régularité — 8 heures de cours par mois et un peu de révision — compte plus que l'intensité.",
  },
  {
    q: "Et si je n'arrive pas à prononcer certaines lettres ?",
    a: "C'est attendu. L'arabe comporte plusieurs sons absents du français (le ʿayn, le ḥā', le qāf). Le professeur les travaille avec vous, sans précipitation. Une lettre difficile devient confortable au bout de quelques séances.",
  },
  {
    q: "Y a-t-il un âge maximum pour commencer ?",
    a: "Aucun. Le programme est suivi par des élèves de 10 à 70 ans. Apprendre à lire l'arabe ne dépend pas de l'âge, mais de la motivation et de la régularité.",
  },
] as const;

export default function CoursArabeDebutantPage() {
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Cours d'arabe pour débutant",
    description:
      "Cours d'arabe en ligne pour vrais débutants : alphabet, voyelles, prononciation, premiers mots. Démarrage au niveau 1 (MUQADIMA ALIF).",
    inLanguage: "fr",
    educationalLevel: "Débutant",
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
      acceptedAnswer: { "@type": "Answer", text: item.a },
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Débutant",
        item: `${site.url}/cours-arabe/debutant`,
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
            <Link href="/cours-arabe" className="hover:text-dore">
              Cours d&apos;arabe
            </Link>
            <span className="mx-2 text-dore/60">/</span>
            <span className="text-creme/80">Débutant</span>
          </nav>

          <p className="mt-6 font-display text-xs uppercase tracking-[0.4em] text-dore">
            Parcours débutant
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Cours d&apos;arabe pour débutant — Commencer de zéro, en ligne
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-creme/80 sm:text-lg">
            Vous n&apos;avez jamais étudié l&apos;arabe et vous ne savez pas par où commencer ?
            Cette page est faite pour vous : un cours pensé pour les vrais débutants, qui démarre à
            l&apos;alphabet et avance pas à pas, depuis chez vous.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center rounded-full bg-dore px-6 py-3 text-sm font-medium text-nuit transition-colors hover:bg-dore-300"
            >
              S&apos;inscrire →
            </Link>
            <Link
              href="/programme/muqadima-alif"
              className="inline-flex items-center justify-center rounded-full border border-creme/30 px-6 py-3 text-sm font-medium text-creme transition-colors hover:border-dore/60 hover:bg-creme/5"
            >
              Voir le niveau 1
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — AU BON ENDROIT */}
      <section className="bg-creme py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            Êtes-vous au bon endroit&nbsp;?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            L&apos;expérience montre qu&apos;un démarrage réussi tient à un seul facteur : commencer
            au bon niveau. Trop haut, on se décourage. Trop bas, on s&apos;ennuie.
          </p>

          <p className="mt-6 font-display text-sm uppercase tracking-[0.2em] text-nuit/60">
            Cette page s&apos;adresse à vous si&nbsp;:
          </p>
          <ul className="mt-3 max-w-3xl space-y-2 text-base leading-relaxed text-nuit/80">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dore" />
              <span>vous ne reconnaissez pas (ou peu) les lettres de l&apos;alphabet arabe&nbsp;;</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dore" />
              <span>vous n&apos;avez jamais suivi de cours d&apos;arabe structuré&nbsp;;</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dore" />
              <span>
                vous avez déjà essayé seul, avec des applications ou des vidéos, et vous avez
                bloqué&nbsp;;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dore" />
              <span>vous voulez avancer dans un cadre humain et progressif, sans pression.</span>
            </li>
          </ul>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-nuit/80">
            À l&apos;inverse, si vous lisez déjà l&apos;arabe à l&apos;aise et que vous cherchez à
            approfondir la grammaire ou le vocabulaire, vous serez plus à votre place dans le{" "}
            <Link
              href="/cours-arabe/intermediaire"
              className="text-dore-700 underline decoration-dore/40 underline-offset-4 hover:decoration-dore"
            >
              parcours intermédiaire
            </Link>
            .
          </p>
        </div>
      </section>

      {/* SECTION 3 — PAR OU ON COMMENCE */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            Par où on commence concrètement&nbsp;?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            Tous les vrais débutants entrent par le même niveau du programme :{" "}
            <strong className="text-nuit">MUQADIMA ALIF</strong>, le premier des quinze niveaux. Pas
            de saut, pas de prérequis.
          </p>

          <p className="mt-6 font-display text-sm uppercase tracking-[0.2em] text-nuit/60">
            Ce niveau couvre&nbsp;:
          </p>
          <ul className="mt-3 max-w-3xl space-y-2 text-base leading-relaxed text-nuit/80">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dore" />
              <span>les 28 lettres de l&apos;alphabet arabe et leurs formes&nbsp;;</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dore" />
              <span>les voyelles brèves et longues&nbsp;;</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dore" />
              <span>les chiffres, les jours et les mois&nbsp;;</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dore" />
              <span>un premier vocabulaire utile pour la vie quotidienne.</span>
            </li>
          </ul>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-nuit/80">
            Quand ce niveau est validé, vous lisez et écrivez en arabe — pas couramment encore, mais
            avec aisance sur des mots et des phrases courtes.
          </p>

          <div className="mt-8">
            <Link
              href="/programme/muqadima-alif"
              className="inline-flex items-center justify-center rounded-full border border-nuit/15 px-5 py-2.5 text-sm font-medium text-nuit transition-colors hover:border-dore/50 hover:bg-dore/5"
            >
              Découvrir le niveau MUQADIMA ALIF en détail →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — PREMIERE LECON */}
      <section className="bg-creme py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            À quoi ressemble une première leçon&nbsp;?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            Une heure de cours type, lors des premières semaines, se déroule à peu près ainsi :
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {leconType.map((item) => (
              <li
                key={item.t}
                className="rounded-2xl border border-nuit/10 bg-white p-5"
              >
                <h3 className="font-display text-base text-nuit">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nuit/70">{item.d}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-nuit/80">
            Le rythme reste mesuré : on revient sur ce qui n&apos;est pas acquis, on ne passe à la
            lettre suivante qu&apos;une fois la précédente maîtrisée. C&apos;est ce qui fait la
            différence avec un apprentissage en autonomie, où l&apos;on saute des étapes sans
            s&apos;en rendre compte.
          </p>
        </div>
      </section>

      {/* SECTION 5 — COMBIEN DE TEMPS */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            Combien de temps pour savoir lire l&apos;alphabet&nbsp;?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            C&apos;est la question qui revient le plus souvent. La réponse honnête : cela dépend de
            votre rythme et du temps que vous consacrez à la révision entre les cours. Voici un
            repère réaliste, observé sur la majorité des élèves.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-nuit/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-nuit text-creme">
                <tr>
                  <th className="px-5 py-3 font-display text-[11px] uppercase tracking-[0.25em]">
                    Étape
                  </th>
                  <th className="px-5 py-3 font-display text-[11px] uppercase tracking-[0.25em]">
                    Délai moyen
                  </th>
                </tr>
              </thead>
              <tbody>
                {jalons.map((j, i) => (
                  <tr
                    key={j.etape}
                    className={i % 2 === 0 ? "bg-creme" : "bg-white"}
                  >
                    <td className="px-5 py-4 text-nuit/80">{j.etape}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-nuit">
                      {j.delai}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-nuit/80">
            À ce stade, vous êtes prêt pour le cycle de Préparation, qui ouvre sur la grammaire et
            la lecture de textes.
          </p>
        </div>
      </section>

      {/* SECTION 6 — QUEL FORMAT */}
      <section className="bg-creme py-16 sm:py-20">
        <div className="container-prose">
          <h2 className="font-display text-2xl text-nuit sm:text-3xl">
            Quel format choisir quand on débute&nbsp;?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-nuit/80">
            Quand on démarre à zéro, la qualité du retour humain compte plus que tout. Une lettre
            mal prononcée dès le départ se transmet aux suivantes, et il devient ensuite difficile
            de corriger.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {formats.map((f) => (
              <div key={f.nom} className="rounded-2xl border border-nuit/10 bg-white p-6">
                <h3 className="font-display text-lg text-nuit">{f.nom}</h3>
                <p className="mt-2 font-display text-3xl text-dore-700">
                  {f.prix}&nbsp;€
                  <span className="text-sm font-normal text-nuit/60"> / mois</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-nuit/70">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/tarifs"
              className="inline-flex items-center justify-center rounded-full border border-nuit/15 px-5 py-2.5 text-sm font-medium text-nuit transition-colors hover:border-dore/50 hover:bg-dore/5"
            >
              Voir les détails et s&apos;inscrire →
            </Link>
          </div>
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
              Démarrer
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">Prêt à commencer&nbsp;?</h2>
            <p className="mt-3 text-base leading-relaxed text-creme/80">
              Vous pouvez vous inscrire dès maintenant au niveau 1 — la prochaine session démarre le
              1er du mois.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center rounded-full bg-dore px-6 py-3 text-sm font-medium text-nuit transition-colors hover:bg-dore-300"
              >
                S&apos;inscrire →
              </Link>
              <Link
                href="/programme"
                className="inline-flex items-center justify-center rounded-full border border-creme/30 px-6 py-3 text-sm font-medium text-creme transition-colors hover:border-dore/60 hover:bg-creme/5"
              >
                Voir le programme complet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

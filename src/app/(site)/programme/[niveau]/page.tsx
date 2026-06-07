import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { niveaux, type Niveau } from "@/lib/niveaux";
import { site } from "@/lib/site";

type Params = { niveau: string };

const CYCLE_TONE: Record<Niveau["cycle"], string> = {
  Initiation: "bg-emerald-50 text-emerald-800 ring-emerald-300/50",
  Préparation: "bg-sky-50 text-sky-800 ring-sky-300/50",
  Approfondissement: "bg-dore/10 text-dore-700 ring-dore/30",
};

export function generateStaticParams(): Params[] {
  return niveaux.map((n) => ({ niveau: n.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const n = niveaux.find((x) => x.slug === params.niveau);
  if (!n) return {};
  const title = `Niveau ${n.numero} — ${n.titre} | Programme d'arabe`;
  return {
    title,
    description: n.resume,
    alternates: { canonical: `/programme/${n.slug}` },
    openGraph: {
      title,
      description: n.resume,
      url: `${site.url}/programme/${n.slug}`,
      type: "article",
    },
  };
}

export default function NiveauPage({ params }: { params: Params }) {
  const n = niveaux.find((x) => x.slug === params.niveau);
  if (!n) return notFound();

  const index = niveaux.findIndex((x) => x.slug === n.slug);
  const prev = index > 0 ? niveaux[index - 1] : null;
  const next = index < niveaux.length - 1 ? niveaux[index + 1] : null;

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `Niveau ${n.numero} — ${n.titre}`,
    description: n.contenu,
    inLanguage: "fr",
    courseCode: n.slug,
    educationalLevel: n.cycle,
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
      sameAs: site.url,
    },
    offers: {
      "@type": "Offer",
      category: "Cours d'arabe en ligne",
      priceCurrency: "EUR",
      price: site.pricing.particulier,
      availability: "https://schema.org/InStock",
      url: `${site.url}/inscription`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT8H",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Programme",
        item: `${site.url}/programme`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Niveau ${n.numero} — ${n.titre}`,
        item: `${site.url}/programme/${n.slug}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="relative isolate overflow-hidden bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-zellige bg-[length:160px] opacity-[0.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
        />
        <div className="container-prose relative py-16 sm:py-20">
          <nav
            aria-label="Fil d'Ariane"
            className="text-xs uppercase tracking-[0.3em] text-creme/60"
          >
            <Link href="/" className="hover:text-dore">
              Accueil
            </Link>
            <span className="mx-2 text-dore/60">/</span>
            <Link href="/programme" className="hover:text-dore">
              Programme
            </Link>
            <span className="mx-2 text-dore/60">/</span>
            <span className="text-creme/80">N{n.numero}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-dore px-3 py-1 text-xs font-bold uppercase tracking-wider text-nuit">
              Niveau {n.numero}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ring-1 ${CYCLE_TONE[n.cycle]}`}
            >
              Cycle {n.cycle}
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            {n.titre}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-creme/80 sm:text-lg">
            {n.resume}
          </p>
        </div>
      </section>

      <section className="bg-creme py-14 sm:py-20">
        <div className="container-prose">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <article>
              <h2 className="font-display text-2xl text-nuit sm:text-3xl">
                Au programme de ce niveau
              </h2>
              <p className="mt-5 text-base leading-relaxed text-nuit/80 sm:text-lg">
                {n.contenu}
              </p>

              <div className="mt-10 overflow-hidden rounded-2xl border border-nuit/10 bg-white">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-creme">
                  <Image
                    src="/images/programme.webp"
                    alt={`Niveau ${n.numero} — ${n.titre}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 720px"
                    className="object-cover"
                  />
                </div>
              </div>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-nuit/10 bg-white p-6">
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dore">
                  Démarrer
                </p>
                <h3 className="mt-2 font-display text-lg text-nuit">
                  Pas sûr de votre niveau ?
                </h3>
                <p className="mt-2 text-sm text-nuit/70">
                  Le test de niveau d&apos;arabe vous oriente vers le bon point d&apos;entrée du programme.
                </p>
                <Link
                  href="/test-de-niveau"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-nuit px-5 py-2.5 text-sm font-medium text-creme transition-colors hover:bg-nuit/90"
                >
                  Faire le test →
                </Link>
                <Link
                  href="/inscription"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-nuit/15 px-5 py-2.5 text-sm font-medium text-nuit transition-colors hover:border-dore/50 hover:bg-dore/5"
                >
                  S&apos;inscrire
                </Link>
                <Link
                  href="/tarifs"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-nuit/70 transition-colors hover:text-nuit"
                >
                  Voir les tarifs
                </Link>
              </div>

              <div className="rounded-2xl border border-nuit/10 bg-white p-6">
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dore">
                  Repères
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-nuit/60">Cycle</dt>
                    <dd className="text-nuit">{n.cycle}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-nuit/60">Position</dt>
                    <dd className="text-nuit">
                      {n.numero} / {niveaux.length}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-nuit/60">Format</dt>
                    <dd className="text-nuit">En ligne (Zoom)</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-nuit/60">Volume</dt>
                    <dd className="text-nuit">8 h / mois</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-nuit/10 bg-creme pb-16">
        <div className="container-prose">
          <nav
            aria-label="Navigation entre niveaux"
            className="grid gap-4 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/programme/${prev.slug}`}
                className="group flex flex-col rounded-2xl border border-nuit/10 bg-white p-5 transition-colors hover:border-dore/40"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-nuit/50">
                  ← Niveau précédent
                </span>
                <span className="mt-2 font-display text-base text-nuit group-hover:text-dore-700">
                  N{prev.numero} — {prev.titre}
                </span>
                <span className="mt-1 text-xs text-nuit/60">{prev.resume}</span>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-nuit/15 p-5">
                <span className="text-[10px] uppercase tracking-[0.3em] text-nuit/40">
                  Premier niveau du programme
                </span>
              </div>
            )}

            {next ? (
              <Link
                href={`/programme/${next.slug}`}
                className="group flex flex-col rounded-2xl border border-nuit/10 bg-white p-5 text-right transition-colors hover:border-dore/40"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-nuit/50">
                  Niveau suivant →
                </span>
                <span className="mt-2 font-display text-base text-nuit group-hover:text-dore-700">
                  N{next.numero} — {next.titre}
                </span>
                <span className="mt-1 text-xs text-nuit/60">{next.resume}</span>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-nuit/15 p-5 text-right">
                <span className="text-[10px] uppercase tracking-[0.3em] text-nuit/40">
                  Dernier niveau du programme
                </span>
              </div>
            )}
          </nav>

          <div className="mt-8 text-center">
            <Link
              href="/programme"
              className="inline-flex items-center justify-center rounded-full border border-nuit/15 px-5 py-2.5 text-sm font-medium text-nuit transition-colors hover:border-dore/50 hover:bg-dore/5"
            >
              ← Revenir au programme complet
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

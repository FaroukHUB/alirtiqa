import type { Metadata } from "next";
import Link from "next/link";
import { formules } from "@/lib/formules";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Tarifs des cours d'arabe : particulier 72 €, duo 63 €, groupe 50 € par mois pour 8 heures de cours.",
};

export default function TarifsPage() {
  return (
    <main>
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
          <p className="font-display text-xs uppercase tracking-[0.4em] text-dore">
            Tarifs
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Trois formules pour avancer à votre rythme
          </h1>
        </div>
      </section>

      <section className="bg-creme py-14 sm:py-20">
        <div className="container-prose">
          <ul className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {formules.map((f, i) => {
              const featured = i === 0;
              return (
                <li
                  key={f.slug}
                  className={`relative flex flex-col rounded-2xl border bg-white p-7 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(10,26,63,0.08)] sm:p-8 ${
                    featured
                      ? "border-dore/50 shadow-[0_4px_24px_rgba(201,169,97,0.15)]"
                      : "border-nuit/10"
                  }`}
                >
                  {f.badge && (
                    <span className="absolute -top-3 left-7 inline-flex items-center rounded-full bg-dore px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-nuit">
                      {f.badge}
                    </span>
                  )}

                  <h2 className="font-display text-2xl text-nuit">{f.titre}</h2>
                  <p className="mt-2 text-sm text-nuit/65">{f.promesse}</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-5xl text-nuit">
                      {f.prix}
                    </span>
                    <span className="text-2xl font-display text-nuit/60">€</span>
                  </div>
                  <p className="mt-1 text-xs text-nuit/55">{f.unite}</p>

                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-nuit/10 pt-5">
                    {f.pour.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 text-sm text-nuit/80"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-0.5 h-4 w-4 flex-none text-dore-700"
                          aria-hidden
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/inscription?formule=${f.slug}`}
                    className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                      featured
                        ? "bg-nuit text-creme hover:bg-nuit-400"
                        : "border border-nuit/15 bg-white text-nuit hover:border-dore/40 hover:bg-creme/50"
                    }`}
                  >
                    Choisir cette formule
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 rounded-2xl border border-nuit/10 bg-white p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.25em] text-dore-700">
                  Frais d&apos;inscription
                </p>
                <p className="mt-1.5 font-display text-xl text-nuit">
                  {site.pricing.inscription} € — payés une seule fois
                </p>
                <p className="mt-1 text-sm text-nuit/65">
                  Couvre les fournitures pédagogiques (livret, supports
                  numériques, accès aux ressources).
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-nuit/55">
            Tous les cours se déroulent en ligne via Zoom. Aucun engagement de
            durée. Le règlement se fait au mois.
          </p>
        </div>
      </section>

      <section className="relative bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
        />
        <div className="container-prose py-14 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-dore">
              Pas sûr du niveau ?
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">
              Faites le test pour démarrer au bon endroit
            </h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/test-de-niveau"
                className="inline-flex items-center justify-center rounded-full bg-dore px-6 py-3 text-sm font-medium text-nuit transition-colors hover:bg-dore-300"
              >
                Faire le test de niveau →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-creme/30 px-6 py-3 text-sm font-medium text-creme transition-colors hover:border-dore/60 hover:bg-creme/5"
              >
                Poser une question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

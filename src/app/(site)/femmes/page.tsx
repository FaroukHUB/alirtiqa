import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Femmes",
  description:
    "Cours pour femmes et filles à l'Institut Al-Irtiqā'.",
};

export default function FemmesPage() {
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
            Femmes
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Cours pour femmes et filles
          </h1>
        </div>
      </section>

      <section className="bg-creme py-14 sm:py-20">
        <div className="container-prose">
          <div className="mx-auto max-w-2xl">
            <p className="text-base leading-relaxed text-nuit/80">
              Les cours pour femmes ne sont pas encore d&apos;actualité.
            </p>
            <p className="mt-4 text-base leading-relaxed text-nuit/80">
              Après recrutement, nous ouvrirons des cours réservés aux
              femmes et aux filles.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

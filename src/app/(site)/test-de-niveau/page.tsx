import type { Metadata } from "next";
import { TestRunner } from "./TestRunner";

export const metadata: Metadata = {
  title: "Test de niveau",
  description:
    "Cinq questions pour situer votre niveau d'entrée dans le programme Al-Furqan. Réservé aux apprenants qui savent déjà lire l'arabe.",
};

export default function TestDeNiveauPage() {
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
            Test de niveau
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Trouvez votre point d&apos;entrée dans le programme
          </h1>
          <p className="mt-5 max-w-xl text-creme/75">
            Cinq questions pour situer votre niveau d&apos;entrée parmi les
            premiers paliers d&apos;Al-Furqan. Test réservé aux apprenants
            qui savent déjà lire l&apos;arabe.
          </p>
        </div>
      </section>

      <section className="bg-creme py-12 sm:py-16">
        <div className="container-prose">
          <TestRunner />
        </div>
      </section>
    </main>
  );
}

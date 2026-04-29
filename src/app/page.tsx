import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="bg-creme py-20">
        <div className="container-prose text-center">
          <p className="font-display text-sm uppercase tracking-[0.4em] text-dore-600">
            Phase 1 — Fondations
          </p>
          <h2 className="mt-4 font-display text-3xl text-nuit sm:text-4xl">
            Le site complet arrive bientôt
          </h2>
          <p className="mt-4 text-nuit/70">
            Méthode, programme, tarifs et test de niveau adaptatif —
            en cours de construction.
          </p>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { niveaux, cycles, type Niveau } from "@/lib/niveaux";

export const metadata: Metadata = {
  title: "Programme — 15 niveaux",
  description:
    "Programme complet en 15 niveaux progressifs : alphabet, grammaire, conjugaison, lecture coranique.",
};

const CYCLE_TONE: Record<Niveau["cycle"], string> = {
  Initiation: "bg-emerald-50 text-emerald-800 ring-emerald-300/50",
  Préparation: "bg-sky-50 text-sky-800 ring-sky-300/50",
  Approfondissement: "bg-dore/10 text-dore-700 ring-dore/30",
};

export default function ProgrammePage() {
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
            Programme
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Le programme en 15 niveaux
          </h1>
        </div>
      </section>

      <section className="bg-creme py-14 sm:py-20">
        <div className="container-prose space-y-16">
          {cycles.map((cycle) => {
            const niveauxDuCycle = niveaux.filter((n) => n.cycle === cycle);
            return (
              <div key={cycle}>
                <header className="mb-8 flex items-baseline justify-between gap-4 border-b border-nuit/10 pb-4">
                  <h2 className="font-display text-2xl text-nuit sm:text-3xl">
                    Cycle {cycle}
                  </h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-nuit/55">
                    {niveauxDuCycle.length} niveau
                    {niveauxDuCycle.length > 1 ? "x" : ""}
                  </p>
                </header>

                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {niveauxDuCycle.map((n, i) => (
                    <NiveauCard
                      key={n.numero}
                      niveau={n}
                      priority={cycle === "Initiation" && i === 0}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
        />
        <div className="container-prose py-14 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-dore">
              Et ensuite ?
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">
              Découvrez votre niveau ou rejoignez-nous
            </h2>
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

function NiveauCard({
  niveau,
  priority,
}: {
  niveau: Niveau;
  priority: boolean;
}) {
  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl border border-nuit/10 bg-white transition-all hover:-translate-y-0.5 hover:border-dore/40 hover:shadow-[0_8px_28px_rgba(10,26,63,0.08)]">
      <Link
        href={`/programme/${niveau.slug}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-dore/60"
        aria-label={`Voir le détail du niveau ${niveau.numero} — ${niveau.titre}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-creme">
          <Image
            src="/images/programme.webp"
            alt={`Niveau ${niveau.numero} — ${niveau.titre}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-nuit px-2.5 py-0.5 text-[11px] font-bold text-creme">
              N{niveau.numero}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${CYCLE_TONE[niveau.cycle]}`}
            >
              {niveau.cycle}
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg text-nuit transition-colors group-hover:text-dore-700">
            {niveau.titre}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-nuit/70">
            {niveau.contenu}
          </p>

          <span className="mt-4 inline-flex items-center text-xs font-medium uppercase tracking-[0.2em] text-dore-700">
            Voir le niveau →
          </span>
        </div>
      </Link>
    </li>
  );
}

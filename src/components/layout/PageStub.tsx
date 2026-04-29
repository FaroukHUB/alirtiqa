import Link from "next/link";

export function PageStub({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <section className="bg-creme">
      <div className="container-prose flex min-h-[60vh] flex-col items-start justify-center py-24">
        {kicker && (
          <p className="font-display text-xs uppercase tracking-[0.4em] text-dore-600">
            {kicker}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl text-nuit sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-nuit/70">
          Cette page est en construction. Le contenu détaillé sera publié dans
          les prochaines phases du site.
        </p>
        <Link
          href="/"
          className="mt-8 text-sm tracking-wide text-dore-600 underline-offset-4 hover:underline"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}

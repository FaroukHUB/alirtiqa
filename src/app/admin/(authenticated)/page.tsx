import Link from "next/link";
import { sql } from "@/lib/db";

type CountRow = { count: string };

async function getStats() {
  const [
    avisPending,
    avisApproved,
    inscNouveau,
    inscEnCours,
    inscInscrit,
  ] = (await Promise.all([
    sql`SELECT COUNT(*)::text AS count FROM avis WHERE statut = 'pending'`,
    sql`SELECT COUNT(*)::text AS count FROM avis WHERE statut = 'approved'`,
    sql`SELECT COUNT(*)::text AS count FROM inscriptions WHERE statut = 'nouveau'`,
    sql`SELECT COUNT(*)::text AS count FROM inscriptions WHERE statut IN ('contacte', 'essai')`,
    sql`SELECT COUNT(*)::text AS count FROM inscriptions WHERE statut = 'inscrit'`,
  ])) as [CountRow[], CountRow[], CountRow[], CountRow[], CountRow[]];

  return {
    avisPending: parseInt(avisPending[0].count, 10),
    avisApproved: parseInt(avisApproved[0].count, 10),
    inscNouveau: parseInt(inscNouveau[0].count, 10),
    inscEnCours: parseInt(inscEnCours[0].count, 10),
    inscInscrit: parseInt(inscInscrit[0].count, 10),
  };
}

export default async function AdminHome() {
  const stats = await getStats();

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Tableau de bord
          </p>
          <h1 className="mt-2 font-display text-3xl text-nuit">Bienvenue</h1>
          <p className="mt-3 max-w-xl text-sm text-nuit/65">
            Vue d&apos;ensemble du site et accès aux modules de gestion.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-sm uppercase tracking-[0.25em] text-nuit/55">
            Inscriptions
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              label="Nouvelles demandes"
              value={stats.inscNouveau}
              href="/admin/inscriptions"
              highlight={stats.inscNouveau > 0}
            />
            <KpiCard
              label="En cours de traitement"
              value={stats.inscEnCours}
              href="/admin/inscriptions?statut=contacte"
            />
            <KpiCard
              label="Élèves inscrits"
              value={stats.inscInscrit}
              href="/admin/inscriptions?statut=inscrit"
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-sm uppercase tracking-[0.25em] text-nuit/55">
            Avis
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              label="Avis en attente"
              value={stats.avisPending}
              href="/admin/avis?statut=pending"
              highlight={stats.avisPending > 0}
            />
            <KpiCard
              label="Avis publiés"
              value={stats.avisApproved}
              href="/admin/avis?statut=approved"
            />
          </div>
        </section>

        <div className="mt-10">
          <h2 className="font-display text-sm uppercase tracking-[0.25em] text-nuit/55">
            Modules disponibles
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            <li className="rounded-xl border border-nuit/10 bg-white p-5">
              <Link
                href="/admin/inscriptions"
                className="font-display text-base text-nuit hover:text-dore-700"
              >
                Gérer les inscriptions →
              </Link>
              <p className="mt-1.5 text-sm text-nuit/60">
                Suivre le pipeline des demandes : nouveau, contacté, essai,
                inscrit. Export CSV disponible.
              </p>
            </li>
            <li className="rounded-xl border border-nuit/10 bg-white p-5">
              <Link
                href="/admin/avis"
                className="font-display text-base text-nuit hover:text-dore-700"
              >
                Gérer les avis →
              </Link>
              <p className="mt-1.5 text-sm text-nuit/60">
                Modérer, publier ou refuser les avis soumis depuis la page
                publique.
              </p>
            </li>
          </ul>

          <p className="mt-6 text-xs text-nuit/45">
            Bibliothèque, questions du test, statistiques : arrivent
            prochainement.
          </p>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,26,63,0.06)] ${
        highlight
          ? "border-dore/50 shadow-[0_4px_18px_rgba(201,169,97,0.15)]"
          : "border-nuit/10"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-nuit/55">
        {label}
      </p>
      <p className="mt-3 font-display text-4xl text-nuit">{value}</p>
      <p className="mt-3 text-xs text-dore-700 opacity-0 transition-opacity group-hover:opacity-100">
        Voir →
      </p>
    </Link>
  );
}

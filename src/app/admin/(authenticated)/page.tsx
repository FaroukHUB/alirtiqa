import Link from "next/link";
import { sql } from "@/lib/db";

type CountRow = { count: string };

async function getStats() {
  const [pendingRows, approvedRows] = (await Promise.all([
    sql`SELECT COUNT(*)::text AS count FROM avis WHERE statut = 'pending'`,
    sql`SELECT COUNT(*)::text AS count FROM avis WHERE statut = 'approved'`,
  ])) as [CountRow[], CountRow[]];

  return {
    pending: parseInt(pendingRows[0].count, 10),
    approved: parseInt(approvedRows[0].count, 10),
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
          <h1 className="mt-2 font-display text-3xl text-nuit">
            Bienvenue
          </h1>
          <p className="mt-3 max-w-xl text-sm text-nuit/65">
            Vue d&apos;ensemble du site et accès aux modules de gestion.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            label="Avis en attente"
            value={stats.pending}
            href="/admin/avis?statut=pending"
            highlight={stats.pending > 0}
          />
          <KpiCard
            label="Avis publiés"
            value={stats.approved}
            href="/admin/avis?statut=approved"
          />
        </div>

        <div className="mt-10">
          <h2 className="font-display text-sm uppercase tracking-[0.25em] text-nuit/55">
            Modules disponibles
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
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
            Bibliothèque, questions du test, inscriptions, statistiques :
            arrivent prochainement.
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

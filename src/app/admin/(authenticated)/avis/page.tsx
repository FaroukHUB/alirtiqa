import Link from "next/link";
import { sql } from "@/lib/db";
import type { Avis } from "@/lib/db";
import { AvisRow } from "./AvisRow";

const ALLOWED_STATUTS = ["pending", "approved", "rejected"] as const;
type Statut = (typeof ALLOWED_STATUTS)[number];

const FILTER_LABELS: Record<Statut | "all", string> = {
  all: "Tous",
  pending: "En attente",
  approved: "Publiés",
  rejected: "Refusés",
};

async function getAvis(filter: Statut | "all") {
  const rows = (filter === "all"
    ? await sql`
        SELECT id, nom, email, note, texte, statut, created_at, moderated_at
        FROM avis
        ORDER BY
          CASE statut WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
          created_at DESC
      `
    : await sql`
        SELECT id, nom, email, note, texte, statut, created_at, moderated_at
        FROM avis
        WHERE statut = ${filter}
        ORDER BY created_at DESC
      `) as Avis[];

  return rows;
}

async function getCounts() {
  const rows = (await sql`
    SELECT statut, COUNT(*)::text AS count
    FROM avis
    GROUP BY statut
  `) as { statut: string; count: string }[];

  const counts: Record<string, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  for (const r of rows) counts[r.statut] = parseInt(r.count, 10);
  return counts;
}

export default async function AvisAdminPage({
  searchParams,
}: {
  searchParams: { statut?: string };
}) {
  const filterRaw = searchParams.statut ?? "pending";
  const filter: Statut | "all" =
    filterRaw === "all" ||
    ALLOWED_STATUTS.includes(filterRaw as Statut)
      ? (filterRaw as Statut | "all")
      : "pending";

  const [avis, counts] = await Promise.all([getAvis(filter), getCounts()]);
  const total = counts.pending + counts.approved + counts.rejected;

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Modération
          </p>
          <h1 className="mt-2 font-display text-3xl text-nuit">Avis</h1>
          <p className="mt-3 max-w-xl text-sm text-nuit/65">
            Validez ou refusez les avis soumis depuis la page publique. Les
            avis publiés apparaissent immédiatement sur la page Avis et sur la
            home.
          </p>
        </header>

        <nav className="mt-8 flex flex-wrap gap-2 border-b border-nuit/10 pb-4">
          {(["pending", "approved", "rejected", "all"] as const).map((key) => {
            const active = filter === key;
            const count = key === "all" ? total : counts[key] ?? 0;
            return (
              <Link
                key={key}
                href={
                  key === "pending" ? "/admin/avis" : `/admin/avis?statut=${key}`
                }
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-nuit text-creme"
                    : "bg-nuit/5 text-nuit/70 hover:bg-nuit/10"
                }`}
              >
                <span>{FILTER_LABELS[key]}</span>
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] ${
                    active
                      ? "bg-dore text-nuit"
                      : "bg-white text-nuit/65"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </nav>

        {avis.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-nuit/15 bg-creme/40 p-12 text-center">
            <p className="font-display text-lg text-nuit/70">
              Aucun avis dans cette catégorie.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {avis.map((a) => (
              <AvisRow key={a.id} avis={a} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

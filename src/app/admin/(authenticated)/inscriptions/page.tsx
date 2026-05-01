import Link from "next/link";
import { sql } from "@/lib/db";
import type { Inscription, InscriptionStatut } from "@/lib/db";

const ALLOWED_STATUTS = [
  "nouveau",
  "contacte",
  "essai",
  "inscrit",
  "refus",
  "sans_suite",
] as const;

const FILTER_LABELS: Record<InscriptionStatut | "all", string> = {
  all: "Tous",
  nouveau: "Nouveau",
  contacte: "Contacté",
  essai: "Essai planifié",
  inscrit: "Inscrit",
  refus: "Refusé",
  sans_suite: "Sans suite",
};

const FORMULE_LABEL: Record<Inscription["formule"], string> = {
  particulier: "Particulier",
  duo: "Duo",
  groupe: "Groupe",
};

const STATUT_BADGE: Record<InscriptionStatut, string> = {
  nouveau: "bg-amber-100 text-amber-800 ring-amber-300/50",
  contacte: "bg-sky-100 text-sky-800 ring-sky-300/50",
  essai: "bg-violet-100 text-violet-800 ring-violet-300/50",
  inscrit: "bg-emerald-100 text-emerald-800 ring-emerald-300/50",
  refus: "bg-rose-100 text-rose-800 ring-rose-300/50",
  sans_suite: "bg-nuit/10 text-nuit/65 ring-nuit/20",
};

async function getInscriptions(filter: InscriptionStatut | "all") {
  const rows = (filter === "all"
    ? await sql`
        SELECT id, prenom, nom, email, telephone, age, formule, niveau,
               disponibilite, message, statut, note_admin, ip, user_agent,
               created_at, updated_at
        FROM inscriptions
        ORDER BY
          CASE statut
            WHEN 'nouveau' THEN 0
            WHEN 'contacte' THEN 1
            WHEN 'essai' THEN 2
            WHEN 'inscrit' THEN 3
            WHEN 'refus' THEN 4
            ELSE 5
          END,
          created_at DESC
      `
    : await sql`
        SELECT id, prenom, nom, email, telephone, age, formule, niveau,
               disponibilite, message, statut, note_admin, ip, user_agent,
               created_at, updated_at
        FROM inscriptions
        WHERE statut = ${filter}
        ORDER BY created_at DESC
      `) as Inscription[];

  return rows;
}

async function getCounts() {
  const rows = (await sql`
    SELECT statut, COUNT(*)::text AS count
    FROM inscriptions
    GROUP BY statut
  `) as { statut: string; count: string }[];

  const counts: Record<string, number> = {
    nouveau: 0,
    contacte: 0,
    essai: 0,
    inscrit: 0,
    refus: 0,
    sans_suite: 0,
  };
  for (const r of rows) counts[r.statut] = parseInt(r.count, 10);
  return counts;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function InscriptionsAdminPage({
  searchParams,
}: {
  searchParams: { statut?: string };
}) {
  const filterRaw = searchParams.statut ?? "nouveau";
  const filter: InscriptionStatut | "all" =
    filterRaw === "all" ||
    ALLOWED_STATUTS.includes(filterRaw as InscriptionStatut)
      ? (filterRaw as InscriptionStatut | "all")
      : "nouveau";

  const [inscriptions, counts] = await Promise.all([
    getInscriptions(filter),
    getCounts(),
  ]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
              Pipeline
            </p>
            <h1 className="mt-2 font-display text-3xl text-nuit">
              Inscriptions
            </h1>
            <p className="mt-3 max-w-xl text-sm text-nuit/65">
              Demandes reçues depuis le formulaire public. Suivez chaque
              candidat de la prise de contact à l&apos;inscription.
            </p>
          </div>
          <a
            href="/api/admin/inscriptions/export"
            className="inline-flex items-center gap-2 rounded-full border border-nuit/15 bg-white px-4 py-2 text-xs font-medium text-nuit/70 transition-colors hover:border-dore/40 hover:text-dore-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exporter CSV
          </a>
        </header>

        <nav className="mt-8 flex flex-wrap gap-2 border-b border-nuit/10 pb-4">
          {(
            [
              "nouveau",
              "contacte",
              "essai",
              "inscrit",
              "refus",
              "sans_suite",
              "all",
            ] as const
          ).map((key) => {
            const active = filter === key;
            const count = key === "all" ? total : counts[key] ?? 0;
            return (
              <Link
                key={key}
                href={
                  key === "nouveau"
                    ? "/admin/inscriptions"
                    : `/admin/inscriptions?statut=${key}`
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
                    active ? "bg-dore text-nuit" : "bg-white text-nuit/65"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </nav>

        {inscriptions.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-nuit/15 bg-creme/40 p-12 text-center">
            <p className="font-display text-lg text-nuit/70">
              Aucune demande dans cette catégorie.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-xl border border-nuit/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-creme/60 text-left text-xs uppercase tracking-[0.15em] text-nuit/55">
                <tr>
                  <th className="px-4 py-3 font-medium">Candidat</th>
                  <th className="px-4 py-3 font-medium">Formule</th>
                  <th className="px-4 py-3 font-medium">Niveau</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Reçu le</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-nuit/5">
                {inscriptions.map((i) => (
                  <tr
                    key={i.id}
                    className="transition-colors hover:bg-creme/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-display text-sm text-nuit">
                        {i.prenom} {i.nom}
                      </div>
                      <div className="text-xs text-nuit/55">{i.email}</div>
                    </td>
                    <td className="px-4 py-3 text-nuit/75">
                      {FORMULE_LABEL[i.formule]}
                    </td>
                    <td className="px-4 py-3 text-nuit/75">
                      {i.niveau ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${STATUT_BADGE[i.statut]}`}
                      >
                        {FILTER_LABELS[i.statut]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-nuit/60">
                      {fmtDate(i.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/inscriptions/${i.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-dore-700 hover:underline"
                      >
                        Ouvrir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

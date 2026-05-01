import Link from "next/link";
import { sql } from "@/lib/db";
import { niveaux } from "@/lib/niveaux";

type TestRow = {
  id: string;
  prenom: string | null;
  email: string | null;
  telephone: string | null;
  niveau_final: number | null;
  finished_at: string | null;
  created_at: string;
  nb_answered: number;
  nb_correct: number;
};

async function getTests(filter: "all" | "finished" | "abandoned") {
  const rows = (await sql`
    SELECT
      a.id, a.prenom, a.email, a.telephone, a.niveau_final, a.finished_at, a.created_at,
      COALESCE(stats.nb_answered, 0)::int AS nb_answered,
      COALESCE(stats.nb_correct, 0)::int AS nb_correct
    FROM test_attempts a
    LEFT JOIN (
      SELECT
        attempt_id,
        COUNT(*)::int AS nb_answered,
        SUM(CASE WHEN est_correcte THEN 1 ELSE 0 END)::int AS nb_correct
      FROM test_answers
      GROUP BY attempt_id
    ) AS stats ON stats.attempt_id = a.id
    WHERE
      (${filter}::text = 'all')
      OR (${filter}::text = 'finished' AND a.finished_at IS NOT NULL)
      OR (${filter}::text = 'abandoned' AND a.finished_at IS NULL)
    ORDER BY a.created_at DESC
    LIMIT 200
  `) as TestRow[];
  return rows;
}

async function getCounts() {
  const rows = (await sql`
    SELECT
      COUNT(*)::int AS total,
      SUM(CASE WHEN finished_at IS NOT NULL THEN 1 ELSE 0 END)::int AS finished,
      SUM(CASE WHEN finished_at IS NULL THEN 1 ELSE 0 END)::int AS abandoned
    FROM test_attempts
  `) as { total: number; finished: number; abandoned: number }[];
  return rows[0];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function TestsAdminPage({
  searchParams,
}: {
  searchParams: { filtre?: string };
}) {
  const filterRaw = searchParams.filtre ?? "finished";
  const filter: "all" | "finished" | "abandoned" =
    filterRaw === "all" || filterRaw === "abandoned" || filterRaw === "finished"
      ? filterRaw
      : "finished";

  const [tests, counts] = await Promise.all([getTests(filter), getCounts()]);

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Évaluations
          </p>
          <h1 className="mt-2 font-display text-3xl text-nuit">
            Résultats des tests de niveau
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-nuit/65">
            Tous les élèves qui ont passé le test de niveau apparaissent ici.
            Tu peux ouvrir chaque tentative pour voir les questions
            posées et les réponses, et juger si le niveau préconisé par le
            système est cohérent.
          </p>
        </header>

        <nav className="mt-8 flex flex-wrap gap-2 border-b border-nuit/10 pb-4">
          {(
            [
              { key: "finished", label: "Terminés", count: counts.finished },
              { key: "abandoned", label: "Abandonnés", count: counts.abandoned },
              { key: "all", label: "Tous", count: counts.total },
            ] as const
          ).map((f) => {
            const active = filter === f.key;
            return (
              <Link
                key={f.key}
                href={
                  f.key === "finished"
                    ? "/admin/tests"
                    : `/admin/tests?filtre=${f.key}`
                }
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-nuit text-creme"
                    : "bg-nuit/5 text-nuit/70 hover:bg-nuit/10"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] ${
                    active ? "bg-dore text-nuit" : "bg-white text-nuit/65"
                  }`}
                >
                  {f.count}
                </span>
              </Link>
            );
          })}
        </nav>

        {tests.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-nuit/15 bg-creme/40 p-12 text-center">
            <p className="font-display text-lg text-nuit/70">
              Aucun test dans cette catégorie.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-xl border border-nuit/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-creme/60 text-left text-xs uppercase tracking-[0.15em] text-nuit/55">
                <tr>
                  <th className="px-4 py-3 font-medium">Candidat</th>
                  <th className="px-4 py-3 font-medium">Niveau préconisé</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-nuit/5">
                {tests.map((t) => {
                  const niveauInfo =
                    t.niveau_final !== null
                      ? niveaux.find((n) => n.numero === t.niveau_final)
                      : null;
                  const pct =
                    t.nb_answered > 0
                      ? Math.round((t.nb_correct / t.nb_answered) * 100)
                      : 0;
                  return (
                    <tr
                      key={t.id}
                      className="transition-colors hover:bg-creme/30"
                    >
                      <td className="px-4 py-3">
                        {t.prenom || t.email ? (
                          <>
                            <div className="font-display text-sm text-nuit">
                              {t.prenom ?? "—"}
                            </div>
                            <div className="text-xs text-nuit/55">
                              {t.email ?? ""}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs italic text-nuit/45">
                            Anonyme
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {t.niveau_final !== null ? (
                          <div>
                            <span className="font-display text-base text-nuit">
                              N{t.niveau_final}
                            </span>
                            {niveauInfo && (
                              <span className="ml-2 text-xs text-nuit/60">
                                {niveauInfo.titre}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-nuit/45">
                            Non terminé
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {t.nb_answered > 0 ? (
                          <span className="text-xs text-nuit/70">
                            {t.nb_correct}/{t.nb_answered}{" "}
                            <span className="text-nuit/45">({pct}%)</span>
                          </span>
                        ) : (
                          <span className="text-xs text-nuit/45">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-nuit/60">
                        {fmtDate(t.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/tests/${t.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-dore-700 hover:underline"
                        >
                          Ouvrir →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

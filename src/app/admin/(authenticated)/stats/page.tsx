import { sql } from "@/lib/db";
import { niveaux } from "@/lib/niveaux";

const PDF_CATEGORIE_LABEL: Record<string, string> = {
  exercices: "Cahiers d'exercices",
  cours: "Supports de cours",
  reference: "Références",
  coran: "Coran",
  lecture: "Lectures",
  autre: "Autre",
};

const INSCRIPTION_STATUT_LABEL: Record<string, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  essai: "Essai planifié",
  inscrit: "Inscrit",
  refus: "Refusé",
  sans_suite: "Sans suite",
};

async function getOverview() {
  const [insc, tests, downloads, conversions] = (await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::int AS this_month,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW() - interval '1 month')
                         AND created_at < date_trunc('month', NOW()))::int AS last_month
      FROM inscriptions
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::int AS this_month,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW() - interval '1 month')
                         AND created_at < date_trunc('month', NOW()))::int AS last_month
      FROM test_attempts
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::int AS this_month,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW() - interval '1 month')
                         AND created_at < date_trunc('month', NOW()))::int AS last_month
      FROM pdf_downloads
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE statut = 'inscrit')::int AS total_inscrits,
        COUNT(*)::int AS total_demandes
      FROM inscriptions
    `,
  ])) as [
    { this_month: number; last_month: number }[],
    { this_month: number; last_month: number }[],
    { this_month: number; last_month: number }[],
    { total_inscrits: number; total_demandes: number }[],
  ];

  return {
    inscriptions: insc[0],
    tests: tests[0],
    downloads: downloads[0],
    conversions: conversions[0],
  };
}

async function getInscriptionFunnel() {
  const rows = (await sql`
    SELECT statut, COUNT(*)::int AS count
    FROM inscriptions
    GROUP BY statut
  `) as { statut: string; count: number }[];
  const counts: Record<string, number> = {
    nouveau: 0,
    contacte: 0,
    essai: 0,
    inscrit: 0,
    refus: 0,
    sans_suite: 0,
  };
  for (const r of rows) counts[r.statut] = r.count;
  return counts;
}

async function getInscriptions30d() {
  const rows = (await sql`
    SELECT date_trunc('day', created_at)::date::text AS day, COUNT(*)::int AS count
    FROM inscriptions
    WHERE created_at >= NOW() - interval '30 days'
    GROUP BY day
    ORDER BY day ASC
  `) as { day: string; count: number }[];
  return rows;
}

async function getTestsStats() {
  const [overall, distribution, abandonAvg] = (await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE finished_at IS NOT NULL)::int AS finished
      FROM test_attempts
    `,
    sql`
      SELECT niveau_final, COUNT(*)::int AS count
      FROM test_attempts
      WHERE niveau_final IS NOT NULL
      GROUP BY niveau_final
      ORDER BY niveau_final
    `,
    sql`
      SELECT COALESCE(AVG(nb), 0)::float AS avg_q
      FROM (
        SELECT a.id, COUNT(ans.id)::int AS nb
        FROM test_attempts a
        LEFT JOIN test_answers ans ON ans.attempt_id = a.id
        WHERE a.finished_at IS NULL
        GROUP BY a.id
      ) sub
    `,
  ])) as [
    { total: number; finished: number }[],
    { niveau_final: number; count: number }[],
    { avg_q: number }[],
  ];

  const dist: Record<number, number> = {};
  for (let i = 1; i <= 15; i++) dist[i] = 0;
  for (const r of distribution) dist[r.niveau_final] = r.count;

  return {
    total: overall[0].total,
    finished: overall[0].finished,
    distribution: dist,
    abandonAvg: abandonAvg[0].avg_q,
  };
}

async function getBibliothequeStats() {
  const [top5, byCat, uniqueEmails] = (await Promise.all([
    sql`
      SELECT p.id, p.titre, COUNT(d.id)::int AS nb
      FROM pdfs p
      JOIN pdf_downloads d ON d.pdf_id = p.id
      GROUP BY p.id, p.titre
      ORDER BY nb DESC
      LIMIT 5
    `,
    sql`
      SELECT p.categorie, COUNT(d.id)::int AS nb
      FROM pdfs p
      JOIN pdf_downloads d ON d.pdf_id = p.id
      GROUP BY p.categorie
      ORDER BY nb DESC
    `,
    sql`SELECT COUNT(DISTINCT email)::int AS uniq FROM pdf_downloads`,
  ])) as [
    { id: string; titre: string; nb: number }[],
    { categorie: string; nb: number }[],
    { uniq: number }[],
  ];

  return {
    top5,
    byCat,
    uniqueEmails: uniqueEmails[0].uniq,
  };
}

async function getAvisStats() {
  const [agg, distribution] = (await Promise.all([
    sql`
      SELECT
        AVG(note) FILTER (WHERE statut = 'approved')::float AS avg_note,
        COUNT(*) FILTER (WHERE statut = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE statut = 'approved')::int AS approved
      FROM avis
    `,
    sql`
      SELECT note, COUNT(*)::int AS count
      FROM avis
      WHERE statut = 'approved'
      GROUP BY note
      ORDER BY note DESC
    `,
  ])) as [
    { avg_note: number | null; pending: number; approved: number }[],
    { note: number; count: number }[],
  ];

  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of distribution) dist[r.note] = r.count;

  return {
    avg: agg[0].avg_note,
    pending: agg[0].pending,
    approved: agg[0].approved,
    distribution: dist,
  };
}

async function getChatbotStats() {
  const [activity, uniqueIps] = (await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= NOW() - interval '24 hours')::int AS day,
        COUNT(*) FILTER (WHERE created_at >= NOW() - interval '7 days')::int AS week,
        COUNT(*) FILTER (WHERE created_at >= NOW() - interval '30 days')::int AS month
      FROM chatbot_log
    `,
    sql`
      SELECT COUNT(DISTINCT ip)::int AS uniq
      FROM chatbot_log
      WHERE created_at >= NOW() - interval '30 days'
    `,
  ])) as [
    { day: number; week: number; month: number }[],
    { uniq: number }[],
  ];

  return {
    day: activity[0].day,
    week: activity[0].week,
    month: activity[0].month,
    uniqueIps: uniqueIps[0].uniq,
  };
}

export default async function StatsPage() {
  const [
    overview,
    funnel,
    inscriptions30d,
    tests,
    biblio,
    avis,
    chatbot,
  ] = await Promise.all([
    getOverview(),
    getInscriptionFunnel(),
    getInscriptions30d(),
    getTestsStats(),
    getBibliothequeStats(),
    getAvisStats(),
    getChatbotStats(),
  ]);

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-12">
        <header>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Tableau de bord
          </p>
          <h1 className="mt-2 font-display text-3xl text-nuit">Statistiques</h1>
          <p className="mt-3 max-w-2xl text-sm text-nuit/65">
            Vue d&apos;ensemble de l&apos;activité du site. Données mises à
            jour en temps réel à chaque visite de cette page.
          </p>
        </header>

        <Section title="Vue d'ensemble" subtitle="Activité du mois en cours">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Inscriptions ce mois"
              value={overview.inscriptions.this_month}
              previous={overview.inscriptions.last_month}
            />
            <KpiCard
              label="Tests passés ce mois"
              value={overview.tests.this_month}
              previous={overview.tests.last_month}
            />
            <KpiCard
              label="Téléchargements PDF ce mois"
              value={overview.downloads.this_month}
              previous={overview.downloads.last_month}
            />
            <KpiCard
              label="Élèves inscrits (total)"
              value={overview.conversions.total_inscrits}
              hint={
                overview.conversions.total_demandes > 0
                  ? `${Math.round((overview.conversions.total_inscrits / overview.conversions.total_demandes) * 100)}% des demandes`
                  : undefined
              }
            />
          </div>
        </Section>

        <Section
          title="Acquisition"
          subtitle="Comment les leads progressent dans le pipeline"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-nuit/10 bg-white p-6">
              <h3 className="font-display text-sm uppercase tracking-[0.2em] text-nuit/55">
                Funnel des inscriptions
              </h3>
              <div className="mt-5 space-y-3">
                {(
                  [
                    "nouveau",
                    "contacte",
                    "essai",
                    "inscrit",
                  ] as const
                ).map((statut) => {
                  const count = funnel[statut];
                  const max = Math.max(funnel.nouveau, 1);
                  const pct = (count / max) * 100;
                  return (
                    <div key={statut}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-nuit/80">
                          {INSCRIPTION_STATUT_LABEL[statut]}
                        </span>
                        <span className="font-mono text-xs text-nuit/65">
                          {count}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-nuit/10">
                        <div
                          className="h-full rounded-full bg-dore"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {(funnel.refus > 0 || funnel.sans_suite > 0) && (
                <p className="mt-5 text-xs text-nuit/55">
                  Refusés : {funnel.refus} · Sans suite : {funnel.sans_suite}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-nuit/10 bg-white p-6">
              <h3 className="font-display text-sm uppercase tracking-[0.2em] text-nuit/55">
                30 derniers jours
              </h3>
              <Sparkline data={inscriptions30d} />
              <p className="mt-3 text-xs text-nuit/55">
                {inscriptions30d.reduce((acc, d) => acc + d.count, 0)}{" "}
                inscriptions sur 30 jours
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Test de niveau"
          subtitle="Engagement et résultats"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Tests démarrés"
              value={tests.total}
            />
            <Stat
              label="Tests terminés"
              value={tests.finished}
              hint={
                tests.total > 0
                  ? `${Math.round((tests.finished / tests.total) * 100)}% de complétion`
                  : undefined
              }
            />
            <Stat
              label="Question moyenne d'abandon"
              value={tests.abandonAvg.toFixed(1)}
              hint="parmi les tests non terminés"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-nuit/10 bg-white p-6">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-nuit/55">
              Distribution des niveaux préconisés
            </h3>
            <div className="mt-5">
              {Object.values(tests.distribution).every((v) => v === 0) ? (
                <p className="text-sm text-nuit/55">
                  Aucun test terminé pour l&apos;instant.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => {
                    const count = tests.distribution[n];
                    const max = Math.max(
                      ...Object.values(tests.distribution),
                      1,
                    );
                    const pct = (count / max) * 100;
                    const niveauInfo = niveaux.find((nv) => nv.numero === n);
                    return (
                      <div key={n} className="flex items-center gap-3">
                        <span className="w-7 flex-none text-right font-mono text-[11px] text-nuit/55">
                          N{n}
                        </span>
                        <span className="w-32 flex-none truncate text-xs text-nuit/65">
                          {niveauInfo?.titre}
                        </span>
                        <div className="flex-1">
                          <div className="h-2 overflow-hidden rounded-full bg-nuit/10">
                            <div
                              className="h-full rounded-full bg-dore"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-8 flex-none text-right text-xs text-nuit/65">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section
          title="Bibliothèque"
          subtitle="Documents les plus consultés"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-nuit/10 bg-white p-6">
              <h3 className="font-display text-sm uppercase tracking-[0.2em] text-nuit/55">
                Top 5 des PDFs téléchargés
              </h3>
              {biblio.top5.length === 0 ? (
                <p className="mt-4 text-sm text-nuit/55">
                  Aucun téléchargement pour l&apos;instant.
                </p>
              ) : (
                <ol className="mt-5 space-y-3">
                  {biblio.top5.map((p, i) => {
                    const max = biblio.top5[0].nb;
                    const pct = (p.nb / max) * 100;
                    return (
                      <li key={p.id}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex-1 truncate text-sm text-nuit/85">
                            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-nuit/5 text-[10px] font-bold text-nuit/65">
                              {i + 1}
                            </span>
                            {p.titre}
                          </span>
                          <span className="font-mono text-xs text-nuit/65">
                            ↓ {p.nb}
                          </span>
                        </div>
                        <div className="mt-1.5 ml-7 h-1.5 overflow-hidden rounded-full bg-nuit/10">
                          <div
                            className="h-full rounded-full bg-dore"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-dore/40 bg-dore/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-dore-700">
                  Emails captés
                </p>
                <p className="mt-2 font-display text-3xl text-nuit">
                  {biblio.uniqueEmails}
                </p>
                <p className="mt-1 text-xs text-nuit/55">
                  uniques via la bibliothèque
                </p>
              </div>

              {biblio.byCat.length > 0 && (
                <div className="rounded-2xl border border-nuit/10 bg-white p-5">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-nuit/55">
                    Par catégorie
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {biblio.byCat.map((c) => (
                      <li
                        key={c.categorie}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-nuit/70">
                          {PDF_CATEGORIE_LABEL[c.categorie] ?? c.categorie}
                        </span>
                        <span className="font-mono text-nuit/65">{c.nb}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section title="Avis" subtitle="Satisfaction des élèves">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Note moyenne"
              value={avis.avg !== null ? avis.avg.toFixed(2) : "—"}
              hint="sur 5"
            />
            <Stat label="Avis publiés" value={avis.approved} />
            <Stat label="En attente de modération" value={avis.pending} />
          </div>

          {avis.approved > 0 && (
            <div className="mt-6 rounded-2xl border border-nuit/10 bg-white p-6">
              <h3 className="font-display text-sm uppercase tracking-[0.2em] text-nuit/55">
                Distribution des notes (publiées)
              </h3>
              <div className="mt-5 space-y-2">
                {[5, 4, 3, 2, 1].map((n) => {
                  const count = avis.distribution[n];
                  const max = Math.max(...Object.values(avis.distribution), 1);
                  const pct = (count / max) * 100;
                  return (
                    <div key={n} className="flex items-center gap-3">
                      <span className="w-12 flex-none text-xs text-nuit/65">
                        {"★".repeat(n)}
                      </span>
                      <div className="flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-nuit/10">
                          <div
                            className="h-full rounded-full bg-dore"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-8 flex-none text-right text-xs text-nuit/65">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Section>

        <Section title="Chatbot" subtitle="Activité de l'assistant IA">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Messages 24h" value={chatbot.day} />
            <Stat label="Messages 7 jours" value={chatbot.week} />
            <Stat label="Messages 30 jours" value={chatbot.month} />
            <Stat
              label="Visiteurs uniques 30j"
              value={chatbot.uniqueIps}
              hint="par adresse IP"
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="font-display text-xl text-nuit">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-nuit/55">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function KpiCard({
  label,
  value,
  previous,
  hint,
}: {
  label: string;
  value: number;
  previous?: number;
  hint?: string;
}) {
  let delta: { pct: number; up: boolean } | null = null;
  if (previous !== undefined && previous > 0) {
    const change = ((value - previous) / previous) * 100;
    delta = { pct: Math.abs(Math.round(change)), up: change >= 0 };
  } else if (previous === 0 && value > 0) {
    delta = { pct: 100, up: true };
  }

  return (
    <div className="rounded-xl border border-nuit/10 bg-white p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-nuit/55">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-nuit">{value}</p>
      {delta && (
        <p
          className={`mt-1 text-[11px] font-medium ${
            delta.up ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {delta.up ? "↑" : "↓"} {delta.pct}% vs mois dernier
        </p>
      )}
      {hint && !delta && (
        <p className="mt-1 text-[11px] text-nuit/45">{hint}</p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-nuit/10 bg-white p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-nuit/55">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-nuit">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-nuit/45">{hint}</p>}
    </div>
  );
}

function Sparkline({ data }: { data: { day: string; count: number }[] }) {
  if (data.length === 0) {
    return (
      <p className="mt-3 text-sm text-nuit/55">
        Pas encore de données.
      </p>
    );
  }

  const w = 280;
  const h = 80;
  const padding = 4;
  const max = Math.max(...data.map((d) => d.count), 1);
  const stepX =
    data.length > 1 ? (w - padding * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = h - padding - ((h - padding * 2) * d.count) / max;
    return { x, y, count: d.count };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${path} L ${points[points.length - 1].x.toFixed(1)} ${h - padding} L ${points[0].x.toFixed(1)} ${h - padding} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-4 w-full"
      role="img"
      aria-label="Inscriptions sur 30 jours"
    >
      <path d={areaPath} fill="rgba(201,169,97,0.18)" />
      <path
        d={path}
        fill="none"
        stroke="#C9A961"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#C9A961" />
      ))}
    </svg>
  );
}

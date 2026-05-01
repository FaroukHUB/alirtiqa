import Link from "next/link";
import { sql } from "@/lib/db";
import type { Question, QuestionStatut, QuestionCategorie } from "@/lib/db";
import { QuestionsClient } from "./QuestionsClient";
import { AideContent } from "./AideContent";

const CATEGORIES: QuestionCategorie[] = [
  "vocabulaire",
  "grammaire",
  "sarf",
  "lecture",
  "comprehension",
  "coran",
];

const STATUTS: QuestionStatut[] = ["draft", "published", "archived"];

async function getQuestions(filters: {
  niveau: number | null;
  categorie: QuestionCategorie | null;
  statut: QuestionStatut | null;
}) {
  const { niveau, categorie, statut } = filters;
  return (await sql`
    SELECT id, type, enonce, arabe, choix, bonne_reponse, explication,
           niveau, categorie, statut, source, created_at, updated_at
    FROM questions
    WHERE
      (${niveau}::int IS NULL OR niveau = ${niveau}::int)
      AND (${categorie}::text IS NULL OR categorie = ${categorie}::text)
      AND (${statut}::text IS NULL OR statut = ${statut}::text)
    ORDER BY niveau ASC, categorie ASC,
      CASE statut WHEN 'draft' THEN 0 WHEN 'published' THEN 1 ELSE 2 END,
      created_at DESC
  `) as Question[];
}

async function getCounts() {
  const rows = (await sql`
    SELECT statut, COUNT(*)::text AS count FROM questions GROUP BY statut
  `) as { statut: string; count: string }[];
  const counts: Record<string, number> = {
    draft: 0,
    published: 0,
    archived: 0,
  };
  for (const r of rows) counts[r.statut] = parseInt(r.count, 10);
  return counts;
}

export default async function QuestionsAdminPage({
  searchParams,
}: {
  searchParams: {
    niveau?: string;
    categorie?: string;
    statut?: string;
    vue?: string;
  };
}) {
  const vue: "liste" | "aide" = searchParams.vue === "aide" ? "aide" : "liste";

  const niveau =
    searchParams.niveau && /^\d+$/.test(searchParams.niveau)
      ? Math.min(15, Math.max(1, parseInt(searchParams.niveau, 10)))
      : null;
  const categorie =
    searchParams.categorie &&
    CATEGORIES.includes(searchParams.categorie as QuestionCategorie)
      ? (searchParams.categorie as QuestionCategorie)
      : null;
  const statut =
    searchParams.statut &&
    STATUTS.includes(searchParams.statut as QuestionStatut)
      ? (searchParams.statut as QuestionStatut)
      : null;

  const [questions, counts] = await Promise.all([
    vue === "liste"
      ? getQuestions({ niveau, categorie, statut })
      : Promise.resolve([] as Question[]),
    getCounts(),
  ]);

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Test de niveau
          </p>
          <h1 className="mt-2 font-display text-3xl text-nuit">
            Questions du test
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-nuit/65">
            Pool de questions du test de niveau adaptatif. Seules les questions
            publiées sont servies au public. Les brouillons doivent être
            validés avant de servir au test.
          </p>
        </header>

        <nav className="mt-7 flex gap-1 border-b border-nuit/10">
          <TabLink href="/admin/questions" active={vue === "liste"}>
            📋 Liste des questions
          </TabLink>
          <TabLink href="/admin/questions?vue=aide" active={vue === "aide"}>
            📖 Comment ça marche
          </TabLink>
        </nav>

        {vue === "aide" ? (
          <AideContent />
        ) : (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatusCard
                label="Brouillons à valider"
                value={counts.draft}
                href="/admin/questions?statut=draft"
                highlight={counts.draft > 0}
              />
              <StatusCard
                label="Publiées"
                value={counts.published}
                href="/admin/questions?statut=published"
              />
              <StatusCard
                label="Archivées"
                value={counts.archived}
                href="/admin/questions?statut=archived"
              />
            </div>

            <Filters
              niveau={niveau}
              categorie={categorie}
              statut={statut}
            />

            <QuestionsClient questions={questions} />
          </>
        )}
      </div>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "text-nuit"
          : "text-nuit/55 hover:text-nuit"
      }`}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-3 -bottom-px h-0.5 bg-dore"
        />
      )}
    </Link>
  );
}

function StatusCard({
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
      className={`group rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,26,63,0.06)] ${
        highlight
          ? "border-dore/50 shadow-[0_4px_18px_rgba(201,169,97,0.15)]"
          : "border-nuit/10"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-nuit/55">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-nuit">{value}</p>
    </Link>
  );
}

const CATEGORIE_LABEL: Record<QuestionCategorie, string> = {
  vocabulaire: "Vocabulaire",
  grammaire: "Grammaire",
  sarf: "Sarf",
  lecture: "Lecture",
  comprehension: "Compréhension",
  coran: "Coran",
};

function Filters({
  niveau,
  categorie,
  statut,
}: {
  niveau: number | null;
  categorie: QuestionCategorie | null;
  statut: QuestionStatut | null;
}) {
  const buildHref = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams();
    const merged = {
      niveau: niveau ? String(niveau) : null,
      categorie: categorie ?? null,
      statut: statut ?? null,
      ...overrides,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== null) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/admin/questions?${qs}` : "/admin/questions";
  };

  return (
    <div className="mt-8 space-y-4 rounded-xl border border-nuit/10 bg-creme/40 p-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-nuit/55">
          Niveau
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterChip href={buildHref({ niveau: null })} active={niveau === null}>
            Tous
          </FilterChip>
          {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
            <FilterChip
              key={n}
              href={buildHref({ niveau: String(n) })}
              active={niveau === n}
            >
              N{n}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-nuit/55">
          Catégorie
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterChip
            href={buildHref({ categorie: null })}
            active={categorie === null}
          >
            Toutes
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              href={buildHref({ categorie: c })}
              active={categorie === c}
            >
              {CATEGORIE_LABEL[c]}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-nuit/55">
          Statut
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterChip
            href={buildHref({ statut: null })}
            active={statut === null}
          >
            Tous
          </FilterChip>
          <FilterChip
            href={buildHref({ statut: "draft" })}
            active={statut === "draft"}
          >
            Brouillons
          </FilterChip>
          <FilterChip
            href={buildHref({ statut: "published" })}
            active={statut === "published"}
          >
            Publiées
          </FilterChip>
          <FilterChip
            href={buildHref({ statut: "archived" })}
            active={statut === "archived"}
          >
            Archivées
          </FilterChip>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-nuit text-creme"
          : "bg-white text-nuit/65 ring-1 ring-nuit/10 hover:ring-nuit/25"
      }`}
    >
      {children}
    </Link>
  );
}

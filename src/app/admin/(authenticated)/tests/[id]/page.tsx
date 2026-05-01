import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import type { TestAttempt, TestAnswer, Question } from "@/lib/db";
import { niveaux } from "@/lib/niveaux";
import { scoresParCategorie } from "@/lib/test-engine";

const CATEGORIE_LABEL: Record<string, string> = {
  vocabulaire: "Vocabulaire",
  grammaire: "Grammaire",
  sarf: "Sarf / Conjugaison",
  lecture: "Lecture / Voyellation",
  comprehension: "Compréhension",
  coran: "Coran / Hadith",
};

type AnswerWithQuestion = TestAnswer & {
  enonce: string;
  arabe: string | null;
  choix: string[];
  bonne_reponse: number;
  explication: string | null;
};

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

async function getAttempt(id: string): Promise<TestAttempt | null> {
  const rows = (await sql`
    SELECT id, current_level, niveau_final, finished_at, prenom, email,
           telephone, age, ip, user_agent, created_at
    FROM test_attempts WHERE id = ${id} LIMIT 1
  `) as TestAttempt[];
  return rows[0] ?? null;
}

async function getAnswers(attemptId: string): Promise<AnswerWithQuestion[]> {
  return (await sql`
    SELECT a.id, a.attempt_id, a.question_id, a.level_at_time, a.categorie,
           a.choix_donne, a.est_correcte, a.ordre, a.created_at,
           q.enonce, q.arabe, q.choix, q.bonne_reponse, q.explication
    FROM test_answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.attempt_id = ${attemptId}
    ORDER BY a.ordre ASC
  `) as AnswerWithQuestion[];
}

export default async function TestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const attempt = await getAttempt(params.id);
  if (!attempt) notFound();

  const answers = await getAnswers(attempt.id);
  const niveauInfo =
    attempt.niveau_final !== null
      ? niveaux.find((n) => n.numero === attempt.niveau_final)
      : null;
  const scores = scoresParCategorie(
    answers.map((a) => ({
      level_at_time: a.level_at_time,
      categorie: a.categorie,
      est_correcte: a.est_correcte,
    })),
  );
  const correctTotal = answers.filter((a) => a.est_correcte).length;

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/tests"
          className="inline-flex items-center gap-1.5 text-xs text-nuit/55 transition-colors hover:text-dore-700"
        >
          ← Retour aux tests
        </Link>

        <header className="mt-4">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Tentative de test
          </p>
          <h1 className="mt-2 font-display text-3xl text-nuit">
            {attempt.prenom ?? "Candidat anonyme"}
          </h1>
          <p className="mt-2 text-xs text-nuit/55">
            Démarré le {fmtDateTime(attempt.created_at)}
            {attempt.finished_at && (
              <> · Terminé le {fmtDateTime(attempt.finished_at)}</>
            )}
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <KpiCard label="Niveau préconisé">
            {attempt.niveau_final !== null ? (
              <>
                <p className="font-display text-3xl text-nuit">
                  N{attempt.niveau_final}
                </p>
                {niveauInfo && (
                  <p className="mt-1 text-xs text-dore-700">
                    {niveauInfo.titre}
                  </p>
                )}
                {niveauInfo && (
                  <p className="mt-0.5 text-[11px] text-nuit/55">
                    {niveauInfo.cycle}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-nuit/55">
                Test non terminé par l&apos;élève
              </p>
            )}
          </KpiCard>

          <KpiCard label="Score global">
            <p className="font-display text-3xl text-nuit">
              {correctTotal}/{answers.length}
            </p>
            {answers.length > 0 && (
              <p className="mt-1 text-xs text-nuit/55">
                {Math.round((correctTotal / answers.length) * 100)}% de
                bonnes réponses
              </p>
            )}
          </KpiCard>

          <KpiCard label="Coordonnées">
            {attempt.email ? (
              <>
                <a
                  href={`mailto:${attempt.email}`}
                  className="block truncate font-display text-sm text-nuit hover:text-dore-700"
                >
                  {attempt.email}
                </a>
                {attempt.telephone && (
                  <p className="mt-1 text-xs text-nuit/65">
                    {attempt.telephone}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs italic text-nuit/55">
                Aucune coordonnée laissée
              </p>
            )}
          </KpiCard>
        </section>

        <section className="mt-8 rounded-xl border border-nuit/10 bg-white p-6">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-nuit/55">
            Détail par catégorie
          </h2>
          <ul className="mt-4 space-y-3">
            {(Object.keys(scores) as (keyof typeof scores)[]).map((cat) => {
              const s = scores[cat];
              if (!s) return null;
              return (
                <li key={cat}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-nuit/80">
                      {CATEGORIE_LABEL[cat]}
                    </span>
                    <span className="font-mono text-xs text-nuit/65">
                      {s.correct}/{s.total} · {s.pct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-nuit/10">
                    <div
                      className={`h-full rounded-full ${
                        s.pct >= 70
                          ? "bg-emerald-500"
                          : s.pct >= 40
                            ? "bg-dore"
                            : "bg-rose-400"
                      }`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-nuit/55">
            Toutes les questions et réponses (dans l&apos;ordre)
          </h2>
          <p className="mt-2 text-xs text-nuit/55">
            Tu peux juger ici si le niveau préconisé par le système est
            cohérent avec les réponses de l&apos;élève. La bonne réponse est
            en vert, le choix de l&apos;élève est entouré.
          </p>

          <ol className="mt-5 space-y-4">
            {answers.map((a, idx) => (
              <AnswerCard key={a.id} index={idx + 1} answer={a} />
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-nuit/10 bg-white p-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-nuit/55">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function AnswerCard({
  index,
  answer,
}: {
  index: number;
  answer: AnswerWithQuestion;
}) {
  return (
    <li className="rounded-xl border border-nuit/10 bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-nuit/5 text-[11px] font-bold text-nuit/65">
          {index}
        </span>
        <span className="rounded-full bg-nuit/5 px-2.5 py-0.5 text-[11px] font-medium text-nuit/70">
          Niveau {answer.level_at_time}
        </span>
        <span className="rounded-full bg-nuit/5 px-2.5 py-0.5 text-[11px] font-medium text-nuit/70">
          {CATEGORIE_LABEL[answer.categorie]}
        </span>
        <span
          className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${
            answer.est_correcte
              ? "bg-emerald-100 text-emerald-800 ring-emerald-300/50"
              : "bg-rose-100 text-rose-800 ring-rose-300/50"
          }`}
        >
          {answer.est_correcte ? "✓ Bonne réponse" : "✗ Mauvaise réponse"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-nuit">{answer.enonce}</p>

      {answer.arabe && (
        <p
          dir="rtl"
          lang="ar"
          className="mt-3 rounded-lg bg-creme/60 px-4 py-2.5 text-right text-lg leading-loose text-nuit"
          style={{ fontFamily: "Amiri, serif" }}
        >
          {answer.arabe}
        </p>
      )}

      <ul className="mt-4 space-y-1.5">
        {answer.choix.map((c, i) => {
          const isCorrect = i === answer.bonne_reponse;
          const isStudentChoice = i === answer.choix_donne;
          const isArabic = /[؀-ۿ]/.test(c);
          return (
            <li
              key={i}
              className={`flex items-start gap-3 rounded-md border px-3 py-2 text-sm ${
                isCorrect
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-900"
                  : isStudentChoice
                    ? "border-rose-300 bg-rose-50/60 text-rose-900"
                    : "border-nuit/10 text-nuit/60"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold ${
                  isCorrect
                    ? "bg-emerald-600 text-white"
                    : isStudentChoice
                      ? "bg-rose-600 text-white"
                      : "bg-nuit/10 text-nuit/55"
                }`}
              >
                {isCorrect ? "✓" : isStudentChoice ? "✗" : String.fromCharCode(65 + i)}
              </span>
              <span
                className={`flex-1 ${isArabic ? "text-base" : ""}`}
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : undefined}
                style={isArabic ? { fontFamily: "Amiri, serif" } : undefined}
              >
                {c}
              </span>
              {isStudentChoice && !isCorrect && (
                <span className="text-[10px] uppercase tracking-wider text-rose-700">
                  Choix de l&apos;élève
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {answer.explication && (
        <p className="mt-3 border-l-2 border-dore/40 bg-creme/40 px-4 py-2 text-xs italic text-nuit/70">
          {answer.explication}
        </p>
      )}
    </li>
  );
}

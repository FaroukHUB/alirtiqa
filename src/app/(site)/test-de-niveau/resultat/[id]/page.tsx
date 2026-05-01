import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import type { TestAttempt, TestAnswer } from "@/lib/db";
import { niveaux } from "@/lib/niveaux";
import { scoresParCategorie } from "@/lib/test-engine";
import { ResultatClient } from "./ResultatClient";

export const metadata: Metadata = {
  title: "Résultat du test de niveau",
  description: "Votre niveau d'arabe estimé selon la méthode Al-Furqan.",
  robots: { index: false },
};

async function getAttempt(id: string) {
  const rows = (await sql`
    SELECT id, current_level, niveau_final, finished_at, prenom, email,
           telephone, age, ip, user_agent, created_at
    FROM test_attempts WHERE id = ${id} LIMIT 1
  `) as TestAttempt[];
  return rows[0] ?? null;
}

async function getAnswers(attemptId: string) {
  return (await sql`
    SELECT id, attempt_id, question_id, level_at_time, categorie,
           choix_donne, est_correcte, ordre, created_at
    FROM test_answers WHERE attempt_id = ${attemptId}
    ORDER BY ordre ASC
  `) as TestAnswer[];
}

export default async function ResultatPage({
  params,
}: {
  params: { id: string };
}) {
  const attempt = await getAttempt(params.id);
  if (!attempt || !attempt.finished_at || attempt.niveau_final === null) {
    notFound();
  }

  const answers = await getAnswers(attempt.id);
  const niveauInfo = niveaux.find((n) => n.numero === attempt.niveau_final);
  const scores = scoresParCategorie(
    answers.map((a) => ({
      level_at_time: a.level_at_time,
      categorie: a.categorie,
      est_correcte: a.est_correcte,
    })),
  );
  const correctTotal = answers.filter((a) => a.est_correcte).length;

  return (
    <ResultatClient
      attemptId={attempt.id}
      niveau={attempt.niveau_final}
      niveauInfo={niveauInfo ?? null}
      scores={scores}
      correctTotal={correctTotal}
      totalAnswers={answers.length}
      identityCaptured={Boolean(attempt.email)}
    />
  );
}

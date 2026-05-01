import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import {
  TEST_MAX_QUESTIONS,
  nextLevel,
  shouldStop,
  niveauFinal,
  type AnswerLog,
} from "@/lib/test-engine";
import {
  answeredQuestionIds,
  loadQuestion,
  pickQuestion,
  toPublic,
  type PublicQuestion,
} from "@/lib/test-server";

const bodySchema = z.object({
  attempt_id: z.string().uuid(),
  question_id: z.string().uuid(),
  choix: z.number().int().min(0).max(3),
});

export type AnswerResponse =
  | {
      finished: false;
      question: PublicQuestion;
      question_number: number;
      max_questions: number;
    }
  | {
      finished: true;
      attempt_id: string;
      niveau_final: number;
    };

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { attempt_id, question_id, choix } = parsed.data;

  const attemptRows = (await sql`
    SELECT id, finished_at FROM test_attempts WHERE id = ${attempt_id} LIMIT 1
  `) as { id: string; finished_at: string | null }[];
  if (attemptRows.length === 0) {
    return NextResponse.json(
      { error: "Tentative introuvable" },
      { status: 404 },
    );
  }
  if (attemptRows[0].finished_at) {
    return NextResponse.json(
      { error: "Tentative déjà terminée" },
      { status: 409 },
    );
  }

  const question = await loadQuestion(question_id);
  if (!question) {
    return NextResponse.json(
      { error: "Question introuvable" },
      { status: 404 },
    );
  }
  if (choix >= question.choix.length) {
    return NextResponse.json(
      { error: "Choix hors bornes" },
      { status: 400 },
    );
  }

  const est_correcte = choix === question.bonne_reponse;
  const level_at_time = question.niveau;

  const ordreRows = (await sql`
    SELECT COALESCE(MAX(ordre), 0) + 1 AS next_ordre
    FROM test_answers WHERE attempt_id = ${attempt_id}
  `) as { next_ordre: number }[];
  const ordre = ordreRows[0].next_ordre;

  await sql`
    INSERT INTO test_answers
      (attempt_id, question_id, level_at_time, categorie, choix_donne, est_correcte, ordre)
    VALUES
      (${attempt_id}, ${question_id}, ${level_at_time}, ${question.categorie},
       ${choix}, ${est_correcte}, ${ordre})
  `;

  const histRows = (await sql`
    SELECT level_at_time, categorie, est_correcte
    FROM test_answers
    WHERE attempt_id = ${attempt_id}
    ORDER BY ordre ASC
  `) as AnswerLog[];

  if (shouldStop(histRows)) {
    const niveau = niveauFinal(histRows);
    await sql`
      UPDATE test_attempts
      SET niveau_final = ${niveau}, finished_at = NOW()
      WHERE id = ${attempt_id}
    `;
    return NextResponse.json<AnswerResponse>({
      finished: true,
      attempt_id,
      niveau_final: niveau,
    });
  }

  const targetLevel = nextLevel(level_at_time, est_correcte);
  const excludeIds = await answeredQuestionIds(attempt_id);
  const next = await pickQuestion(targetLevel, excludeIds);

  if (!next) {
    const niveau = niveauFinal(histRows);
    await sql`
      UPDATE test_attempts
      SET niveau_final = ${niveau}, finished_at = NOW()
      WHERE id = ${attempt_id}
    `;
    return NextResponse.json<AnswerResponse>({
      finished: true,
      attempt_id,
      niveau_final: niveau,
    });
  }

  await sql`
    UPDATE test_attempts
    SET current_level = ${next.niveau}
    WHERE id = ${attempt_id}
  `;

  return NextResponse.json<AnswerResponse>({
    finished: false,
    question: toPublic(next),
    question_number: histRows.length + 1,
    max_questions: TEST_MAX_QUESTIONS,
  });
}

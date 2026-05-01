import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { TEST_PLAN, TEST_QUESTIONS_COUNT } from "@/lib/test-engine";
import {
  pickPhase1Question,
  toPublic,
  type PublicQuestion,
} from "@/lib/test-server";

export type StartResponse = {
  attempt_id: string;
  question: PublicQuestion;
  question_number: number;
  max_questions: number;
};

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const slot = TEST_PLAN[0];
  const first = await pickPhase1Question(slot.niveau, slot.categorie, new Set());
  if (!first) {
    return NextResponse.json(
      {
        error:
          "Aucune question publiée pour le moment. Le test sera bientôt accessible.",
      },
      { status: 503 },
    );
  }

  const rows = (await sql`
    INSERT INTO test_attempts (current_level, ip, user_agent)
    VALUES (${first.niveau}, ${ip}, ${userAgent})
    RETURNING id
  `) as { id: string }[];

  return NextResponse.json<StartResponse>({
    attempt_id: rows[0].id,
    question: toPublic(first),
    question_number: 1,
    max_questions: TEST_QUESTIONS_COUNT,
  });
}

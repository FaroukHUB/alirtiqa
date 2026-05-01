import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import type { TestAttempt, TestAnswer } from "@/lib/db";
import { sendTestResultNotif } from "@/lib/mailer";

const bodySchema = z.object({
  attempt_id: z.string().uuid(),
  prenom: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(255),
  telephone: z.string().trim().max(40).optional().or(z.literal("")),
  age: z.string().trim().max(40).optional().or(z.literal("")),
});

function nullify(v: string | undefined): string | null {
  return v && v.trim().length > 0 ? v : null;
}

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

  const { attempt_id, prenom, email, telephone, age } = parsed.data;

  const attemptRows = (await sql`
    SELECT id, current_level, niveau_final, finished_at, prenom, email,
           telephone, age, ip, user_agent, created_at
    FROM test_attempts WHERE id = ${attempt_id} LIMIT 1
  `) as TestAttempt[];
  if (attemptRows.length === 0) {
    return NextResponse.json(
      { error: "Tentative introuvable" },
      { status: 404 },
    );
  }
  const attempt = attemptRows[0];
  if (!attempt.finished_at || attempt.niveau_final === null) {
    return NextResponse.json(
      { error: "Le test n'est pas encore terminé" },
      { status: 409 },
    );
  }

  await sql`
    UPDATE test_attempts
    SET prenom = ${prenom}, email = ${email},
        telephone = ${nullify(telephone)}, age = ${nullify(age)}
    WHERE id = ${attempt_id}
  `;

  const answers = (await sql`
    SELECT id, attempt_id, question_id, level_at_time, categorie,
           choix_donne, est_correcte, ordre, created_at
    FROM test_answers WHERE attempt_id = ${attempt_id}
    ORDER BY ordre ASC
  `) as TestAnswer[];

  void sendTestResultNotif(
    {
      ...attempt,
      prenom,
      email,
      telephone: nullify(telephone),
      age: nullify(age),
    },
    answers,
  );

  return NextResponse.json({ ok: true });
}

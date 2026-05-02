import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import type { ContactMessage } from "@/lib/db";
import { sendContactMessage } from "@/lib/mailer";

const submitSchema = z.object({
  prenom: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(255),
  sujet: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(4000),
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides ou manquants" },
      { status: 400 },
    );
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { prenom, email, sujet, message } = parsed.data;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const rows = (await sql`
    INSERT INTO contact_messages (prenom, email, sujet, message, ip, user_agent)
    VALUES (${prenom}, ${email}, ${sujet && sujet.length > 0 ? sujet : null}, ${message}, ${ip}, ${userAgent})
    RETURNING id, prenom, email, sujet, message, lu, ip, user_agent, created_at
  `) as ContactMessage[];

  await sendContactMessage(rows[0]);

  return NextResponse.json({ ok: true });
}

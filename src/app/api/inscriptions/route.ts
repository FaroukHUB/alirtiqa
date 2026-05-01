import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import type { Inscription } from "@/lib/db";
import { sendAdminNotif, sendCandidateConfirm } from "@/lib/mailer";

const submitSchema = z.object({
  prenom: z.string().trim().min(1).max(80),
  nom: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(255),
  telephone: z.string().trim().max(40).optional().or(z.literal("")),
  age: z.string().trim().max(40).optional().or(z.literal("")),
  formule: z.enum(["particulier", "duo", "groupe"]),
  niveau: z.string().trim().max(80).optional().or(z.literal("")),
  disponibilite: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  website: z.string().max(0).optional(),
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

  const d = parsed.data;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const rows = (await sql`
    INSERT INTO inscriptions
      (prenom, nom, email, telephone, age, formule, niveau, disponibilite, message, ip, user_agent)
    VALUES
      (${d.prenom}, ${d.nom}, ${d.email}, ${nullify(d.telephone)}, ${nullify(d.age)},
       ${d.formule}, ${nullify(d.niveau)}, ${nullify(d.disponibilite)}, ${nullify(d.message)},
       ${ip}, ${userAgent})
    RETURNING id, prenom, nom, email, telephone, age, formule, niveau, disponibilite,
              message, statut, note_admin, ip, user_agent, created_at, updated_at
  `) as Inscription[];

  const inscription = rows[0];

  void Promise.allSettled([
    sendAdminNotif(inscription),
    sendCandidateConfirm(inscription),
  ]);

  return NextResponse.json({ ok: true, id: inscription.id });
}

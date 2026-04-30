import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";

const submitSchema = z.object({
  nom: z.string().trim().min(2).max(50),
  email: z.string().trim().toLowerCase().email().max(255),
  note: z.coerce.number().int().min(1).max(5),
  texte: z.string().trim().min(30).max(1000),
  website: z.string().max(0).optional(),
});

export async function GET() {
  const rows = (await sql`
    SELECT id, nom, note, texte
    FROM avis
    WHERE statut = 'approved'
    ORDER BY moderated_at DESC NULLS LAST, created_at DESC
  `) as { id: string; nom: string; note: number; texte: string }[];

  return NextResponse.json({ avis: rows });
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

  const { nom, email, note, texte } = parsed.data;

  await sql`
    INSERT INTO avis (nom, email, note, texte)
    VALUES (${nom}, ${email}, ${note}, ${texte})
  `;

  return NextResponse.json({ ok: true });
}

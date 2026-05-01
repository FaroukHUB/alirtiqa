import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";

const downloadSchema = z.object({
  pdf_id: z.string().uuid(),
  email: z.string().trim().toLowerCase().email().max(255),
  prenom: z.string().trim().max(80).optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});

/**
 * GET /api/pdfs : liste publique des PDFs publiés (sans blob_url, qu'on ne révèle qu'après capture email).
 */
export async function GET() {
  const rows = (await sql`
    SELECT id, titre, description, niveau, categorie, file_size, auteur, created_at
    FROM pdfs
    WHERE statut = 'published'
    ORDER BY created_at DESC
  `) as {
    id: string;
    titre: string;
    description: string | null;
    niveau: number | null;
    categorie: string;
    file_size: number | null;
    auteur: string | null;
    created_at: string;
  }[];

  return NextResponse.json({ pdfs: rows });
}

/**
 * POST /api/pdfs : capture l'email du visiteur et renvoie l'URL Blob du PDF demandé.
 * Le PDF doit être en statut 'published'.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides" },
      { status: 400 },
    );
  }

  // Honeypot anti-spam
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ error: "Spam détecté" }, { status: 400 });
  }

  const { pdf_id, email, prenom } = parsed.data;

  const rows = (await sql`
    SELECT id, titre, blob_url FROM pdfs
    WHERE id = ${pdf_id} AND statut = 'published'
    LIMIT 1
  `) as { id: string; titre: string; blob_url: string }[];

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Document indisponible" },
      { status: 404 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  await sql`
    INSERT INTO pdf_downloads (pdf_id, email, prenom, ip, user_agent)
    VALUES (${pdf_id}, ${email}, ${prenom && prenom.length > 0 ? prenom : null}, ${ip}, ${userAgent})
  `;

  return NextResponse.json({
    ok: true,
    url: rows[0].blob_url,
    titre: rows[0].titre,
  });
}

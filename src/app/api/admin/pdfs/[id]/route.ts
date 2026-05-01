import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { del } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

const CATEGORIES = [
  "exercices",
  "cours",
  "reference",
  "coran",
  "lecture",
  "autre",
] as const;

const patchSchema = z
  .object({
    titre: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    niveau: z.number().int().min(1).max(15).nullable().optional(),
    categorie: z.enum(CATEGORIES).optional(),
    auteur: z.string().trim().max(200).nullable().optional(),
    statut: z.enum(["draft", "published", "archived"]).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Au moins un champ requis",
  });

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const sets: string[] = [];
  const values: unknown[] = [];
  const push = (col: string, val: unknown) => {
    values.push(val);
    sets.push(`${col} = $${values.length}`);
  };

  const d = parsed.data;
  if (d.titre !== undefined) push("titre", d.titre);
  if (d.description !== undefined) {
    push(
      "description",
      d.description === null || d.description.trim() === ""
        ? null
        : d.description.trim(),
    );
  }
  if (d.niveau !== undefined) push("niveau", d.niveau);
  if (d.categorie !== undefined) push("categorie", d.categorie);
  if (d.auteur !== undefined) {
    push(
      "auteur",
      d.auteur === null || d.auteur.trim() === "" ? null : d.auteur.trim(),
    );
  }
  if (d.statut !== undefined) push("statut", d.statut);
  sets.push("updated_at = NOW()");

  values.push(params.id);
  const idIdx = values.length;

  const { Pool } = await import("@neondatabase/serverless");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  try {
    const r = await pool.query<{ id: string }>(
      `UPDATE pdfs SET ${sets.join(", ")} WHERE id = $${idIdx} RETURNING id`,
      values,
    );
    if (r.rows.length === 0) {
      return NextResponse.json(
        { error: "PDF non trouvé" },
        { status: 404 },
      );
    }
  } finally {
    await pool.end();
  }

  revalidatePath("/admin/bibliotheque");
  revalidatePath("/bibliotheque");

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = (await sql`
    SELECT blob_url FROM pdfs WHERE id = ${params.id} LIMIT 1
  `) as { blob_url: string }[];
  if (rows.length === 0) {
    return NextResponse.json({ error: "PDF non trouvé" }, { status: 404 });
  }

  const blobUrl = rows[0].blob_url;

  await sql`DELETE FROM pdfs WHERE id = ${params.id}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(blobUrl);
    } catch (err) {
      console.error("[pdfs] échec suppression Blob:", err);
    }
  }

  revalidatePath("/admin/bibliotheque");
  revalidatePath("/bibliotheque");

  return NextResponse.json({ ok: true });
}

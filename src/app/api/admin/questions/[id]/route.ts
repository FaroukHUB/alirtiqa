import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

const CATEGORIES = [
  "vocabulaire",
  "grammaire",
  "sarf",
  "lecture",
  "comprehension",
  "coran",
] as const;

const patchSchema = z
  .object({
    type: z.enum(["qcm", "vf"]).optional(),
    enonce: z.string().trim().min(5).max(2000).optional(),
    arabe: z.string().trim().max(2000).nullable().optional(),
    choix: z.array(z.string().trim().min(1).max(500)).optional(),
    bonne_reponse: z.number().int().min(0).optional(),
    explication: z.string().trim().max(2000).nullable().optional(),
    niveau: z.number().int().min(1).max(15).optional(),
    categorie: z.enum(CATEGORIES).optional(),
    statut: z.enum(["draft", "published", "archived"]).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Au moins un champ doit être fourni",
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

  const current = (await sql`
    SELECT type, choix, bonne_reponse FROM questions WHERE id = ${params.id} LIMIT 1
  `) as { type: "qcm" | "vf"; choix: string[]; bonne_reponse: number }[];
  if (current.length === 0) {
    return NextResponse.json(
      { error: "Question non trouvée" },
      { status: 404 },
    );
  }

  const c = current[0];
  const finalType = parsed.data.type ?? c.type;
  const finalChoix = parsed.data.choix ?? c.choix;
  const finalBonneReponse = parsed.data.bonne_reponse ?? c.bonne_reponse;

  if (finalType === "qcm" && finalChoix.length !== 4) {
    return NextResponse.json(
      { error: "QCM doit avoir 4 choix" },
      { status: 400 },
    );
  }
  if (finalType === "vf" && finalChoix.length !== 2) {
    return NextResponse.json(
      { error: "Vrai/Faux doit avoir 2 choix" },
      { status: 400 },
    );
  }
  if (finalBonneReponse < 0 || finalBonneReponse >= finalChoix.length) {
    return NextResponse.json(
      { error: "bonne_reponse hors bornes" },
      { status: 400 },
    );
  }

  const sets: string[] = [];
  const values: unknown[] = [];
  const push = (col: string, val: unknown) => {
    values.push(val);
    sets.push(`${col} = $${values.length}`);
  };

  const d = parsed.data;
  if (d.type !== undefined) push("type", d.type);
  if (d.enonce !== undefined) push("enonce", d.enonce);
  if (d.arabe !== undefined) {
    const v = d.arabe === null || d.arabe.trim() === "" ? null : d.arabe.trim();
    push("arabe", v);
  }
  if (d.choix !== undefined) {
    values.push(JSON.stringify(d.choix));
    sets.push(`choix = $${values.length}::jsonb`);
  }
  if (d.bonne_reponse !== undefined) push("bonne_reponse", d.bonne_reponse);
  if (d.explication !== undefined) {
    const v =
      d.explication === null || d.explication.trim() === ""
        ? null
        : d.explication.trim();
    push("explication", v);
  }
  if (d.niveau !== undefined) push("niveau", d.niveau);
  if (d.categorie !== undefined) push("categorie", d.categorie);
  if (d.statut !== undefined) push("statut", d.statut);
  sets.push("updated_at = NOW()");

  values.push(params.id);
  const idIdx = values.length;

  const { Pool } = await import("@neondatabase/serverless");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  try {
    const r = await pool.query<{ id: string }>(
      `UPDATE questions SET ${sets.join(", ")} WHERE id = $${idIdx} RETURNING id`,
      values,
    );
    if (r.rows.length === 0) {
      return NextResponse.json(
        { error: "Question non trouvée" },
        { status: 404 },
      );
    }
  } finally {
    await pool.end();
  }

  revalidatePath("/admin/questions");
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
    DELETE FROM questions WHERE id = ${params.id} RETURNING id
  `) as { id: string }[];

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Question non trouvée" },
      { status: 404 },
    );
  }

  revalidatePath("/admin/questions");
  return NextResponse.json({ ok: true });
}

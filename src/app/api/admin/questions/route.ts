import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import type { Question } from "@/lib/db";

const CATEGORIES = [
  "vocabulaire",
  "grammaire",
  "sarf",
  "lecture",
  "comprehension",
  "coran",
] as const;

const createSchema = z
  .object({
    type: z.enum(["qcm", "vf"]),
    enonce: z.string().trim().min(5).max(2000),
    arabe: z.string().trim().max(2000).nullable().optional(),
    choix: z.array(z.string().trim().min(1).max(500)),
    bonne_reponse: z.number().int().min(0),
    explication: z.string().trim().max(2000).nullable().optional(),
    niveau: z.number().int().min(1).max(15),
    categorie: z.enum(CATEGORIES),
    statut: z.enum(["draft", "published", "archived"]).optional(),
  })
  .superRefine((d, ctx) => {
    if (d.type === "qcm" && d.choix.length !== 4) {
      ctx.addIssue({
        code: "custom",
        message: "QCM doit avoir 4 choix",
        path: ["choix"],
      });
    }
    if (d.type === "vf" && d.choix.length !== 2) {
      ctx.addIssue({
        code: "custom",
        message: "Vrai/Faux doit avoir 2 choix",
        path: ["choix"],
      });
    }
    if (d.bonne_reponse >= d.choix.length) {
      ctx.addIssue({
        code: "custom",
        message: "bonne_reponse hors bornes",
        path: ["bonne_reponse"],
      });
    }
  });

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const niveauStr = sp.get("niveau");
  const categorie = sp.get("categorie");
  const statut = sp.get("statut");

  const niveau =
    niveauStr && /^\d+$/.test(niveauStr) ? parseInt(niveauStr, 10) : null;
  const validCategorie =
    categorie && CATEGORIES.includes(categorie as (typeof CATEGORIES)[number])
      ? categorie
      : null;
  const validStatut =
    statut && ["draft", "published", "archived"].includes(statut)
      ? statut
      : null;

  const rows = (await sql`
    SELECT id, type, enonce, arabe, choix, bonne_reponse, explication,
           niveau, categorie, statut, source, created_at, updated_at
    FROM questions
    WHERE
      (${niveau}::int IS NULL OR niveau = ${niveau}::int)
      AND (${validCategorie}::text IS NULL OR categorie = ${validCategorie}::text)
      AND (${validStatut}::text IS NULL OR statut = ${validStatut}::text)
    ORDER BY niveau ASC, categorie ASC,
      CASE statut WHEN 'draft' THEN 0 WHEN 'published' THEN 1 ELSE 2 END,
      created_at DESC
  `) as Question[];

  return NextResponse.json({ questions: rows });
}

export async function POST(req: NextRequest) {
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const arabeValue =
    d.arabe && d.arabe.trim().length > 0 ? d.arabe.trim() : null;
  const explicationValue =
    d.explication && d.explication.trim().length > 0
      ? d.explication.trim()
      : null;

  const rows = (await sql`
    INSERT INTO questions
      (type, enonce, arabe, choix, bonne_reponse, explication, niveau, categorie, statut, source)
    VALUES
      (${d.type}, ${d.enonce}, ${arabeValue}, ${JSON.stringify(d.choix)}::jsonb,
       ${d.bonne_reponse}, ${explicationValue}, ${d.niveau}, ${d.categorie},
       ${d.statut ?? "draft"}, 'manuel')
    RETURNING id
  `) as { id: string }[];

  return NextResponse.json({ ok: true, id: rows[0].id });
}

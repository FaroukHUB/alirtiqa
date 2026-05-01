import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
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

const NIVEAU_DESC: Record<number, string> = {
  1: "Alphabet arabe — reconnaissance des 28 lettres et leurs formes.",
  2: "Voyelles brèves (harakāt) — fatḥa, kasra, ḍamma, sukūn.",
  3: "Mots simples du quotidien.",
  4: "Phrases simples (jumla basique).",
  5: "Pronoms personnels et démonstratifs.",
  6: "Verbe au passé (al-fiʿl al-māḍī).",
  7: "Verbe au présent (al-fiʿl al-muḍāriʿ).",
  8: "Phrase verbale vs phrase nominale.",
  9: "Cas du nom — rafʿ, naṣb, jarr.",
  10: "Verbes augmentés (al-fiʿl al-mazīd).",
  11: "Particules (al-ḥurūf) — inna et ses sœurs, kāna et ses sœurs.",
  12: "Phrases coraniques courtes.",
  13: "Sarf avancé — al-wazn, ism al-fāʿil/mafʿūl.",
  14: "Nahw avancé — al-iʿrāb complet.",
  15: "Compréhension de Coran et de Sunna.",
};

const CATEGORIE_DESC: Record<(typeof CATEGORIES)[number], string> = {
  vocabulaire: "Sens d'un mot arabe ou traduction. Vocabulaire courant.",
  grammaire: "Règles de nahw : structure de phrase, accord, cas.",
  sarf: "Morphologie et conjugaison.",
  lecture: "Voyellation correcte (tashkīl).",
  comprehension: "Compréhension d'une phrase ou d'un court passage.",
  coran: "Extraits courts du Coran ou de hadiths authentiques.",
};

const TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    questions: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          type: { type: "string" as const, enum: ["qcm", "vf"] },
          enonce: { type: "string" as const },
          arabe: { type: "string" as const },
          choix: { type: "array" as const, items: { type: "string" as const } },
          bonne_reponse: { type: "integer" as const },
          explication: { type: "string" as const },
        },
        required: [
          "type",
          "enonce",
          "arabe",
          "choix",
          "bonne_reponse",
          "explication",
        ],
      },
    },
  },
  required: ["questions"],
};

const inputSchema = z.object({
  niveau: z.number().int().min(1).max(15),
  categorie: z.enum(CATEGORIES),
  count: z.number().int().min(1).max(10),
});

type GeneratedQuestion = {
  type: "qcm" | "vf";
  enonce: string;
  arabe: string;
  choix: string[];
  bonne_reponse: number;
  explication: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY non configuré côté serveur" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { niveau, categorie, count } = parsed.data;
  const client = new Anthropic();

  const prompt = `Tu es un professeur d'arabe expert formé à la méthode égyptienne classique (Ajurrumiyya, Al-Furqan). Tu prépares des questions pour un test de niveau adaptatif destiné à des francophones musulmans qui apprennent l'arabe en ligne.

NIVEAU CIBLE : ${niveau} sur 15
${NIVEAU_DESC[niveau]}

CATÉGORIE : ${categorie}
${CATEGORIE_DESC[categorie]}

NOMBRE À GÉNÉRER : ${count} question${count > 1 ? "s" : ""}

CONSIGNES :
1. Difficulté STRICTEMENT adaptée au niveau ${niveau}.
2. Mélange les types : majoritairement QCM (4 choix), quelques Vrai/Faux si plus d'1 question.
3. QCM : 4 choix, 1 bonne réponse, 3 distracteurs plausibles.
4. Voyellation (harakāt) OBLIGATOIRE sur tout le texte arabe.
5. Énoncés en français. Texte arabe dans le champ "arabe" et/ou dans les "choix".
6. Public musulman pratiquant : exemples religieux respectueux acceptés.
7. Explication concise (1-2 phrases) et utile.

Appelle l'outil submit_questions avec exactement ${count} question${count > 1 ? "s" : ""}.`;

  let questions: GeneratedQuestion[];
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4096,
      tools: [
        {
          name: "submit_questions",
          description: `Soumet ${count} question(s) pour le niveau ${niveau}, catégorie ${categorie}.`,
          input_schema: TOOL_SCHEMA,
        },
      ],
      tool_choice: { type: "tool", name: "submit_questions" },
      messages: [{ role: "user", content: prompt }],
    });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("Pas de tool_use dans la réponse");
    }
    const input = toolUse.input as { questions: GeneratedQuestion[] };
    questions = input.questions;
  } catch (err) {
    console.error("[questions/generate] échec Claude:", err);
    return NextResponse.json(
      { error: "Échec de la génération via Claude" },
      { status: 502 },
    );
  }

  let inserted = 0;
  const rejected: string[] = [];

  for (const q of questions) {
    if (
      !q.enonce ||
      !Array.isArray(q.choix) ||
      typeof q.bonne_reponse !== "number"
    ) {
      rejected.push("structure invalide");
      continue;
    }
    if (q.type === "qcm" && q.choix.length !== 4) {
      rejected.push(`qcm a ${q.choix.length} choix au lieu de 4`);
      continue;
    }
    if (q.type === "vf" && q.choix.length !== 2) {
      rejected.push(`vf a ${q.choix.length} choix au lieu de 2`);
      continue;
    }
    if (q.bonne_reponse < 0 || q.bonne_reponse >= q.choix.length) {
      rejected.push("bonne_reponse hors bornes");
      continue;
    }

    await sql`
      INSERT INTO questions
        (type, enonce, arabe, choix, bonne_reponse, explication, niveau, categorie, statut, source)
      VALUES
        (${q.type}, ${q.enonce.trim()}, ${q.arabe?.trim() || null},
         ${JSON.stringify(q.choix)}::jsonb, ${q.bonne_reponse},
         ${q.explication?.trim() || null}, ${niveau}, ${categorie},
         'draft', 'ia_admin')
    `;
    inserted++;
  }

  revalidatePath("/admin/questions");

  return NextResponse.json({
    ok: true,
    inserted,
    rejected: rejected.length > 0 ? rejected : undefined,
  });
}

import { Pool } from "@neondatabase/serverless";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

dotenv.config({ path: ".env.local" });

const PDFS_DIR = join(process.cwd(), "scripts", "cours-pdfs");

type Categorie =
  | "vocabulaire"
  | "grammaire"
  | "sarf"
  | "lecture"
  | "comprehension"
  | "coran";

type Cell = { categorie: Categorie; count: number };
type GridByLevel = Record<number, Cell[]>;

// Même grille pédagogique que le seed précédent — total 75 questions
const GRID: GridByLevel = {
  1: [{ categorie: "vocabulaire", count: 2 }, { categorie: "lecture", count: 3 }],
  2: [{ categorie: "vocabulaire", count: 2 }, { categorie: "lecture", count: 3 }],
  3: [{ categorie: "vocabulaire", count: 2 }, { categorie: "grammaire", count: 1 }, { categorie: "lecture", count: 2 }],
  4: [{ categorie: "vocabulaire", count: 2 }, { categorie: "grammaire", count: 1 }, { categorie: "sarf", count: 1 }, { categorie: "lecture", count: 1 }],
  5: [{ categorie: "vocabulaire", count: 1 }, { categorie: "grammaire", count: 2 }, { categorie: "sarf", count: 1 }, { categorie: "lecture", count: 1 }],
  6: [{ categorie: "vocabulaire", count: 1 }, { categorie: "grammaire", count: 1 }, { categorie: "sarf", count: 2 }, { categorie: "comprehension", count: 1 }],
  7: [{ categorie: "vocabulaire", count: 1 }, { categorie: "grammaire", count: 1 }, { categorie: "sarf", count: 2 }, { categorie: "comprehension", count: 1 }],
  8: [{ categorie: "vocabulaire", count: 1 }, { categorie: "grammaire", count: 2 }, { categorie: "sarf", count: 1 }, { categorie: "comprehension", count: 1 }],
  9: [{ categorie: "grammaire", count: 2 }, { categorie: "sarf", count: 1 }, { categorie: "comprehension", count: 1 }, { categorie: "coran", count: 1 }],
  10: [{ categorie: "grammaire", count: 1 }, { categorie: "sarf", count: 2 }, { categorie: "comprehension", count: 1 }, { categorie: "coran", count: 1 }],
  11: [{ categorie: "grammaire", count: 2 }, { categorie: "sarf", count: 1 }, { categorie: "comprehension", count: 1 }, { categorie: "coran", count: 1 }],
  12: [{ categorie: "grammaire", count: 1 }, { categorie: "sarf", count: 1 }, { categorie: "comprehension", count: 1 }, { categorie: "coran", count: 2 }],
  13: [{ categorie: "grammaire", count: 1 }, { categorie: "sarf", count: 2 }, { categorie: "comprehension", count: 1 }, { categorie: "coran", count: 1 }],
  14: [{ categorie: "grammaire", count: 2 }, { categorie: "sarf", count: 1 }, { categorie: "comprehension", count: 1 }, { categorie: "coran", count: 1 }],
  15: [{ categorie: "grammaire", count: 1 }, { categorie: "comprehension", count: 1 }, { categorie: "coran", count: 3 }],
};

const CATEGORIE_DESC: Record<Categorie, string> = {
  vocabulaire:
    "Sens d'un mot arabe (donner la traduction française) OU traduction d'un mot français vers l'arabe. Vocabulaire utilisé dans le cours.",
  grammaire:
    "Règles de nahw : structure de la phrase, accord, cas du nom, particules, syntaxe — telles qu'enseignées dans le cours.",
  sarf:
    "Morphologie et conjugaison : conjugaison de verbes, schèmes, dérivation — telles qu'enseignées dans le cours.",
  lecture:
    "Voyellation correcte (tashkīl), lecture juste d'un mot ou d'une syllabe, identification d'une voyelle. Selon les règles enseignées.",
  comprehension:
    "Compréhension d'une phrase ou d'un court passage en arabe — sens global, intention, idée principale. Idéalement extrait du cours.",
  coran:
    "Extraits courts du Coran ou de hadiths cités dans le cours. Sens d'un mot dans le verset, ou compréhension d'un verset court.",
};

const TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    questions: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          type: {
            type: "string" as const,
            enum: ["qcm", "vf"],
          },
          enonce: { type: "string" as const },
          arabe: { type: "string" as const },
          choix: {
            type: "array" as const,
            items: { type: "string" as const },
          },
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

type GeneratedQuestion = {
  type: "qcm" | "vf";
  enonce: string;
  arabe: string;
  choix: string[];
  bonne_reponse: number;
  explication: string;
};

function loadPdf(niveau: number): { pdfBase64: string; sizeKb: number } | null {
  const path = join(PDFS_DIR, `niveau-${niveau}.pdf`);
  if (!existsSync(path)) return null;
  const buf = readFileSync(path);
  return {
    pdfBase64: buf.toString("base64"),
    sizeKb: Math.round(buf.length / 1024),
  };
}

function buildPrompt(
  niveau: number,
  cell: Cell,
): string {
  return `Tu es un professeur d'arabe expert formé à la méthode égyptienne classique. Tu prépares des questions pour un test de niveau adaptatif destiné à des francophones musulmans.

LE PDF JOINT EST LE COURS OFFICIEL DU NIVEAU ${niveau} sur 15 (programme Al-Furqan).

CATÉGORIE À GÉNÉRER : ${cell.categorie}
${CATEGORIE_DESC[cell.categorie]}

NOMBRE À GÉNÉRER : ${cell.count} question${cell.count > 1 ? "s" : ""}

CONSIGNES STRICTES :
1. Base-toi STRICTEMENT sur le contenu du PDF fourni. Vocabulaire, tournures, exemples, règles → tout doit venir du cours, pas de ta culture générale arabe.
2. Adapte STRICTEMENT la difficulté au niveau ${niveau}. Ne propose JAMAIS de notion d'un niveau supérieur.
3. Mélange les types : si tu génères 2 questions ou plus, fais 1 Vrai/Faux parmi elles, le reste en QCM.
4. Pour les QCM : 4 choix exactement, 1 seule bonne réponse. Distracteurs plausibles (pas absurdes).
5. Pour les Vrai/Faux : choix = ["Vrai", "Faux"], énoncé clair et non ambigu.
6. Voyellation (harakāt) OBLIGATOIRE sur tout le texte arabe. Pas de texte arabe sans voyelles.
7. Énoncés en français. Texte arabe dans le champ "arabe" et/ou dans les "choix" si la réponse est en arabe.
8. Public musulman pratiquant : exemples religieux respectueux acceptés.
9. Explication concise (1-2 phrases) qui aide à comprendre, ancrée dans le cours.

Appelle l'outil submit_questions avec exactement ${cell.count} question${cell.count > 1 ? "s" : ""}.`;
}

function validate(q: GeneratedQuestion): string | null {
  if (!q.enonce || q.enonce.trim().length < 5) return "énoncé trop court";
  if (!Array.isArray(q.choix)) return "choix invalides";
  if (q.type === "qcm" && q.choix.length !== 4)
    return `qcm doit avoir 4 choix, a ${q.choix.length}`;
  if (q.type === "vf" && q.choix.length !== 2)
    return `vf doit avoir 2 choix, a ${q.choix.length}`;
  if (
    typeof q.bonne_reponse !== "number" ||
    q.bonne_reponse < 0 ||
    q.bonne_reponse >= q.choix.length
  )
    return "bonne_reponse hors bornes";
  return null;
}

async function clearOldIaQuestions(pool: Pool): Promise<{
  archived: number;
  deleted: number;
}> {
  // Tente la suppression. Si une question est référencée par un test_answer,
  // on la passe en 'archived' à la place pour préserver l'historique des tests.

  // 1) Sépare les questions IA selon qu'elles ont des réponses ou pas
  const withAnswers = (
    await pool.query<{ id: string }>(
      `SELECT DISTINCT q.id
       FROM questions q
       JOIN test_answers ta ON ta.question_id = q.id
       WHERE q.source IN ('ia_seed', 'ia_admin')`,
    )
  ).rows.map((r) => r.id);

  // 2) Archive celles qui ont des réponses (préserve l'historique)
  let archived = 0;
  if (withAnswers.length > 0) {
    const r = await pool.query<{ id: string }>(
      `UPDATE questions SET statut = 'archived', updated_at = NOW()
       WHERE id = ANY($1::uuid[]) RETURNING id`,
      [withAnswers],
    );
    archived = r.rowCount ?? 0;
  }

  // 3) Supprime les autres
  const deletedRes = await pool.query(
    `DELETE FROM questions
     WHERE source IN ('ia_seed', 'ia_admin')
       AND id NOT IN (
         SELECT DISTINCT question_id FROM test_answers
       )`,
  );

  return { archived, deleted: deletedRes.rowCount ?? 0 };
}

async function generateForCell(
  client: Anthropic,
  niveau: number,
  pdfBase64: string,
  cell: Cell,
): Promise<GeneratedQuestion[]> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    tools: [
      {
        name: "submit_questions",
        description: `Soumet ${cell.count} question(s) pour le niveau ${niveau}, catégorie ${cell.categorie}, basées sur le PDF du cours.`,
        input_schema: TOOL_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "submit_questions" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: pdfBase64,
            },
            // Cache le PDF : sera réutilisé pour les autres catégories du même niveau
            cache_control: { type: "ephemeral" },
          },
          {
            type: "text",
            text: buildPrompt(niveau, cell),
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Pas de tool_use dans la réponse Claude");
  }

  const input = toolUse.input as { questions: GeneratedQuestion[] };
  if (!Array.isArray(input.questions) || input.questions.length === 0) {
    throw new Error("Tableau questions vide ou invalide");
  }

  return input.questions;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL manquant");
  if (!process.env.ANTHROPIC_API_KEY)
    throw new Error("ANTHROPIC_API_KEY manquant dans .env.local");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = new Anthropic();

  try {
    // Inventaire des PDFs disponibles
    const availableLevels = Object.keys(GRID)
      .map(Number)
      .filter((n) => loadPdf(n) !== null)
      .sort((a, b) => a - b);

    const missingLevels = Object.keys(GRID)
      .map(Number)
      .filter((n) => !availableLevels.includes(n));

    console.log(
      `\n→ ${availableLevels.length} PDF(s) trouvé(s) dans scripts/cours-pdfs/`,
    );
    if (missingLevels.length > 0) {
      console.log(
        `⚠ Manquants : ${missingLevels.map((n) => `niveau-${n}.pdf`).join(", ")}`,
      );
    }
    if (availableLevels.length === 0) {
      console.log(
        "\n❌ Aucun PDF trouvé. Place tes PDFs dans scripts/cours-pdfs/ avec le nommage niveau-1.pdf à niveau-15.pdf.",
      );
      return;
    }

    // Suppression / archivage des anciennes questions IA
    console.log("\n→ Nettoyage du pool actuel (questions IA)…");
    const { archived, deleted } = await clearOldIaQuestions(pool);
    console.log(
      `  ✓ ${deleted} supprimée(s), ${archived} archivée(s) (référencées par des tests passés).`,
    );

    let totalInserted = 0;
    const failures: { niveau: number; cell: Cell; error: string }[] = [];

    for (const niveau of availableLevels) {
      const pdf = loadPdf(niveau)!;
      const cells = GRID[niveau];
      console.log(
        `\n━ Niveau ${niveau} — PDF ${pdf.sizeKb} KB — ${cells.length} catégorie(s) à générer`,
      );

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const tag = `  [${i + 1}/${cells.length}] ${cell.categorie} × ${cell.count}`;
        process.stdout.write(`${tag.padEnd(50)} `);

        try {
          const questions = await generateForCell(
            client,
            niveau,
            pdf.pdfBase64,
            cell,
          );
          let inserted = 0;
          for (const q of questions) {
            const err = validate(q);
            if (err) {
              console.log(`\n    ✗ rejet : ${err}`);
              continue;
            }
            await pool.query(
              `INSERT INTO questions
                (type, enonce, arabe, choix, bonne_reponse, explication, niveau, categorie, statut, source)
               VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, 'draft', 'ia_seed')`,
              [
                q.type,
                q.enonce.trim(),
                q.arabe?.trim() || null,
                JSON.stringify(q.choix),
                q.bonne_reponse,
                q.explication?.trim() || null,
                niveau,
                cell.categorie,
              ],
            );
            inserted++;
            totalInserted++;
          }
          console.log(`✓ ${inserted}/${cell.count}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.log(`✗ ${msg}`);
          failures.push({ niveau, cell, error: msg });
        }
      }
    }

    console.log(`\n━━━ Résumé ━━━`);
    console.log(
      `✓ ${totalInserted} questions insérées en draft (source="ia_seed", basées sur les PDFs des cours)`,
    );
    if (failures.length > 0) {
      console.log(`✗ ${failures.length} échec(s) :`);
      for (const f of failures) {
        console.log(
          `   - Niveau ${f.niveau} · ${f.cell.categorie} : ${f.error}`,
        );
      }
    }
    if (missingLevels.length > 0) {
      console.log(
        `\nℹ Aucune question générée pour les niveaux ${missingLevels.join(", ")} (PDFs manquants).`,
      );
    }
    console.log(
      `\n→ Va dans /admin/questions pour valider chaque question avant publication.`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("\n❌ Échec :", err);
  process.exit(1);
});

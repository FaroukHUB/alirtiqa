import { Pool } from "@neondatabase/serverless";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

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

// Grille pédagogique focalisée sur les 3 premiers niveaux du programme
// (le test ne sert qu'à placer en MUQADIMA ALIF / TA3BIR / MUQADIMA BA).
// 6 questions par cellule pour avoir suffisamment de variété entre élèves.
const GRID: GridByLevel = {
  1: [
    { categorie: "lecture", count: 6 },
    { categorie: "vocabulaire", count: 6 },
  ],
  2: [
    { categorie: "vocabulaire", count: 6 },
    { categorie: "grammaire", count: 4 },
  ],
  3: [
    { categorie: "grammaire", count: 6 },
    { categorie: "comprehension", count: 6 },
  ],
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

async function loadPdfText(
  niveau: number,
): Promise<{ text: string; chars: number; pages: number } | null> {
  const pdfPath = join(PDFS_DIR, `niveau-${niveau}.pdf`);
  if (!existsSync(pdfPath)) return null;

  const cachePath = join(PDFS_DIR, `niveau-${niveau}.txt`);
  if (existsSync(cachePath)) {
    const cached = readFileSync(cachePath, "utf-8");
    const pageCount = (cached.match(/\f/g)?.length ?? 0) + 1;
    return { text: cached, chars: cached.length, pages: pageCount };
  }

  const buf = readFileSync(pdfPath);
  const data = new Uint8Array(buf);
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  const pageTexts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((it) => ("str" in it ? it.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 0) pageTexts.push(text);
  }
  const fullText = pageTexts.join("\n\f\n");
  writeFileSync(cachePath, fullText, "utf-8");
  return { text: fullText, chars: fullText.length, pages: doc.numPages };
}

function buildPrompt(
  niveau: number,
  cell: Cell,
  courseText: string,
): string {
  return `Tu es un professeur d'arabe expert formé à la méthode égyptienne classique. Tu prépares des questions pour un test de niveau adaptatif destiné à des francophones musulmans.

CI-DESSOUS LE TEXTE EXTRAIT DU COURS OFFICIEL DU NIVEAU ${niveau} sur 15 (programme Al-Furqan). Le texte arabe peut comporter de petites imperfections d'extraction (diacritiques mal placées, ligatures cassées) — appuie-toi sur le sens et restaure une voyellation correcte dans tes questions.

<cours-niveau-${niveau}>
${courseText}
</cours-niveau-${niveau}>

CATÉGORIE À GÉNÉRER : ${cell.categorie}
${CATEGORIE_DESC[cell.categorie]}

NOMBRE À GÉNÉRER : ${cell.count} question${cell.count > 1 ? "s" : ""}

CONSIGNES STRICTES :
1. Base-toi STRICTEMENT sur le contenu du cours ci-dessus. Vocabulaire, tournures, exemples, règles → tout doit venir du cours, pas de ta culture générale arabe.
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
  courseText: string,
  cell: Cell,
): Promise<GeneratedQuestion[]> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    tools: [
      {
        name: "submit_questions",
        description: `Soumet ${cell.count} question(s) pour le niveau ${niveau}, catégorie ${cell.categorie}.`,
        input_schema: TOOL_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "submit_questions" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: buildPrompt(niveau, cell, courseText),
            cache_control: { type: "ephemeral" },
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
    // Inventaire des PDFs disponibles + extraction du texte (avec cache .txt)
    console.log("\n→ Extraction du texte des PDFs (cache si .txt existe déjà)…");
    const allLevels = Object.keys(GRID).map(Number);
    const courseTexts: Record<number, { text: string; chars: number; pages: number }> = {};
    for (const n of allLevels) {
      const r = await loadPdfText(n);
      if (r) {
        courseTexts[n] = r;
        console.log(`  niveau-${n}.pdf : ${r.pages} pages → ${r.chars.toLocaleString()} chars`);
      }
    }
    const availableLevels = allLevels
      .filter((n) => courseTexts[n])
      .sort((a, b) => a - b);
    const missingLevels = allLevels.filter((n) => !courseTexts[n]);

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

    // Mode "complétion" si --no-clear : on garde les questions déjà en base
    // et on ne génère que ce qui manque pour atteindre le count visé par cellule.
    const noClear = process.argv.includes("--no-clear");

    if (!noClear) {
      console.log("\n→ Nettoyage du pool actuel (questions IA)…");
      const { archived, deleted } = await clearOldIaQuestions(pool);
      console.log(
        `  ✓ ${deleted} supprimée(s), ${archived} archivée(s) (référencées par des tests passés).`,
      );
    } else {
      console.log("\n→ Mode --no-clear : on conserve les questions existantes et on complète uniquement ce qui manque.");
    }

    let totalInserted = 0;
    const failures: { niveau: number; cell: Cell; error: string }[] = [];

    for (const niveau of availableLevels) {
      const course = courseTexts[niveau];
      const cells = GRID[niveau];
      console.log(
        `\n━ Niveau ${niveau} — ${course.pages} pages, ${course.chars.toLocaleString()} chars — ${cells.length} catégorie(s) à générer`,
      );

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        // En mode complétion : combien de questions déjà présentes dans cette cellule ?
        let need = cell.count;
        if (noClear) {
          const existingRes = await pool.query<{ c: string }>(
            `SELECT COUNT(*)::text AS c FROM questions
             WHERE niveau = $1 AND categorie = $2 AND source IN ('ia_seed', 'ia_admin')`,
            [niveau, cell.categorie],
          );
          const existing = parseInt(existingRes.rows[0].c, 10);
          need = Math.max(0, cell.count - existing);
          if (need === 0) {
            console.log(
              `  [${i + 1}/${cells.length}] ${cell.categorie} × ${cell.count}`.padEnd(50) +
                ` → déjà ${existing}, skip`,
            );
            continue;
          }
        }

        const tag = `  [${i + 1}/${cells.length}] ${cell.categorie} × ${need}`;
        process.stdout.write(`${tag.padEnd(50)} `);

        try {
          const questions = await generateForCell(
            client,
            niveau,
            course.text,
            { ...cell, count: need },
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
          console.log(`✓ ${inserted}/${need}`);
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

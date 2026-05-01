import { Pool } from "@neondatabase/serverless";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

type Categorie =
  | "vocabulaire"
  | "grammaire"
  | "sarf"
  | "lecture"
  | "comprehension"
  | "coran";

type Cell = { niveau: number; categorie: Categorie; count: number };

const GRID: Cell[] = [
  // Niveau 1 — Alphabet
  { niveau: 1, categorie: "vocabulaire", count: 2 },
  { niveau: 1, categorie: "lecture", count: 3 },
  // Niveau 2 — Voyelles brèves
  { niveau: 2, categorie: "vocabulaire", count: 2 },
  { niveau: 2, categorie: "lecture", count: 3 },
  // Niveau 3 — Mots simples
  { niveau: 3, categorie: "vocabulaire", count: 2 },
  { niveau: 3, categorie: "grammaire", count: 1 },
  { niveau: 3, categorie: "lecture", count: 2 },
  // Niveau 4 — Phrases simples
  { niveau: 4, categorie: "vocabulaire", count: 2 },
  { niveau: 4, categorie: "grammaire", count: 1 },
  { niveau: 4, categorie: "sarf", count: 1 },
  { niveau: 4, categorie: "lecture", count: 1 },
  // Niveau 5 — Pronoms + démonstratifs
  { niveau: 5, categorie: "vocabulaire", count: 1 },
  { niveau: 5, categorie: "grammaire", count: 2 },
  { niveau: 5, categorie: "sarf", count: 1 },
  { niveau: 5, categorie: "lecture", count: 1 },
  // Niveau 6 — Verbe passé (mâdî)
  { niveau: 6, categorie: "vocabulaire", count: 1 },
  { niveau: 6, categorie: "grammaire", count: 1 },
  { niveau: 6, categorie: "sarf", count: 2 },
  { niveau: 6, categorie: "comprehension", count: 1 },
  // Niveau 7 — Verbe présent (mudâri')
  { niveau: 7, categorie: "vocabulaire", count: 1 },
  { niveau: 7, categorie: "grammaire", count: 1 },
  { niveau: 7, categorie: "sarf", count: 2 },
  { niveau: 7, categorie: "comprehension", count: 1 },
  // Niveau 8 — Phrase verbale + nominale
  { niveau: 8, categorie: "vocabulaire", count: 1 },
  { niveau: 8, categorie: "grammaire", count: 2 },
  { niveau: 8, categorie: "sarf", count: 1 },
  { niveau: 8, categorie: "comprehension", count: 1 },
  // Niveau 9 — Cas du nom (raf'/nasb/jarr)
  { niveau: 9, categorie: "grammaire", count: 2 },
  { niveau: 9, categorie: "sarf", count: 1 },
  { niveau: 9, categorie: "comprehension", count: 1 },
  { niveau: 9, categorie: "coran", count: 1 },
  // Niveau 10 — Verbes augmentés (mazîd)
  { niveau: 10, categorie: "grammaire", count: 1 },
  { niveau: 10, categorie: "sarf", count: 2 },
  { niveau: 10, categorie: "comprehension", count: 1 },
  { niveau: 10, categorie: "coran", count: 1 },
  // Niveau 11 — Particules (hurûf)
  { niveau: 11, categorie: "grammaire", count: 2 },
  { niveau: 11, categorie: "sarf", count: 1 },
  { niveau: 11, categorie: "comprehension", count: 1 },
  { niveau: 11, categorie: "coran", count: 1 },
  // Niveau 12 — Phrases coraniques courtes
  { niveau: 12, categorie: "grammaire", count: 1 },
  { niveau: 12, categorie: "sarf", count: 1 },
  { niveau: 12, categorie: "comprehension", count: 1 },
  { niveau: 12, categorie: "coran", count: 2 },
  // Niveau 13 — Sarf avancé
  { niveau: 13, categorie: "grammaire", count: 1 },
  { niveau: 13, categorie: "sarf", count: 2 },
  { niveau: 13, categorie: "comprehension", count: 1 },
  { niveau: 13, categorie: "coran", count: 1 },
  // Niveau 14 — Nahw avancé (i'rab)
  { niveau: 14, categorie: "grammaire", count: 2 },
  { niveau: 14, categorie: "sarf", count: 1 },
  { niveau: 14, categorie: "comprehension", count: 1 },
  { niveau: 14, categorie: "coran", count: 1 },
  // Niveau 15 — Compréhension Coran/Sunna
  { niveau: 15, categorie: "grammaire", count: 1 },
  { niveau: 15, categorie: "comprehension", count: 1 },
  { niveau: 15, categorie: "coran", count: 3 },
];

const NIVEAU_DESC: Record<number, string> = {
  1: "Alphabet arabe — reconnaissance des 28 lettres et leurs formes (isolée, initiale, médiane, finale).",
  2: "Voyelles brèves (harakāt) — fatḥa, kasra, ḍamma, sukūn ; lire des syllabes vocalisées.",
  3: "Mots simples du quotidien — bayt, kitāb, qalam, bāb, walad, etc. Reconnaissance et sens de base.",
  4: "Phrases simples (jumla basique) — sujet + verbe court ou nom + adjectif. Construction très basique.",
  5: "Pronoms personnels et démonstratifs — anā, anta, anti, huwa, hiya / hādhā, hādhihi, dhālika, tilka.",
  6: "Verbe au passé (al-fiʿl al-māḍī) — conjugaison du modèle kataba, faʿala, à toutes les personnes.",
  7: "Verbe au présent (al-fiʿl al-muḍāriʿ) — conjugaison de yaktubu, yafʿalu, à toutes les personnes.",
  8: "Phrase verbale (jumla fiʿliyya) vs phrase nominale (jumla ismiyya) — distinction et structure.",
  9: "Cas du nom — al-rafʿ (nominatif), al-naṣb (accusatif), al-jarr (génitif). Marques flexionnelles.",
  10: "Verbes augmentés (al-fiʿl al-mazīd) — schèmes afʿala, faʿʿala, fāʿala, tafāʿala, etc.",
  11: "Particules (al-ḥurūf) — inna et ses sœurs, kāna et ses sœurs, ḥurūf al-jarr, ḥurūf al-nasb.",
  12: "Phrases coraniques courtes — versets très courts à comprendre mot à mot avec aide.",
  13: "Sarf avancé — al-wazn (les schèmes), ism al-fāʿil, ism al-mafʿūl, al-maṣdar.",
  14: "Nahw avancé — al-iʿrāb complet d'une phrase, particules complexes, exceptions.",
  15: "Compréhension de Coran et de Sunna — versets et hadiths, analyse grammaticale et sens global.",
};

const CATEGORIE_DESC: Record<Categorie, string> = {
  vocabulaire:
    "Sens d'un mot arabe (donner la traduction française) OU traduction d'un mot français vers l'arabe. Vocabulaire courant et religieux adapté au niveau.",
  grammaire:
    "Règles de nahw : structure de la phrase, accord, cas du nom, particules, syntaxe.",
  sarf:
    "Morphologie et conjugaison : conjugaison de verbes, schèmes, dérivation, ism al-fāʿil/al-mafʿūl.",
  lecture:
    "Voyellation correcte (tashkīl), lecture juste d'un mot ou d'une syllabe, identification d'une voyelle.",
  comprehension:
    "Compréhension d'une phrase ou d'un court passage en arabe — sens global, intention, idée principale.",
  coran:
    "Extraits courts du Coran ou de hadiths authentiques. Sens d'un mot dans le verset, ou compréhension d'un verset court.",
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
            description: "qcm = 4 choix, vf = Vrai/Faux",
          },
          enonce: {
            type: "string" as const,
            description: "Énoncé de la question, en français.",
          },
          arabe: {
            type: "string" as const,
            description:
              "Texte arabe avec voyellation complète (harakāt) si la question en contient. Optionnel, sinon chaîne vide.",
          },
          choix: {
            type: "array" as const,
            items: { type: "string" as const },
            description:
              "4 choix pour qcm (mots arabes voyellés ou textes français selon la question), 2 choix ['Vrai', 'Faux'] pour vf.",
          },
          bonne_reponse: {
            type: "integer" as const,
            description:
              "Index 0-based de la bonne réponse dans choix (0 à 3 pour qcm, 0 ou 1 pour vf).",
          },
          explication: {
            type: "string" as const,
            description:
              "Explication courte (1-2 phrases) de pourquoi la réponse est correcte. En français.",
          },
        },
        required: ["type", "enonce", "arabe", "choix", "bonne_reponse", "explication"],
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

async function generateCell(
  client: Anthropic,
  cell: Cell,
): Promise<GeneratedQuestion[]> {
  const prompt = `Tu es un professeur d'arabe expert formé à la méthode égyptienne classique (Ajurrumiyya, Al-Furqan). Tu prépares des questions pour un test de niveau adaptatif destiné à des francophones musulmans qui apprennent l'arabe en ligne.

NIVEAU CIBLE : ${cell.niveau} sur 15
${NIVEAU_DESC[cell.niveau]}

CATÉGORIE : ${cell.categorie}
${CATEGORIE_DESC[cell.categorie]}

NOMBRE À GÉNÉRER : ${cell.count} question${cell.count > 1 ? "s" : ""}

CONSIGNES STRICTES :
1. Adapte STRICTEMENT la difficulté au niveau ${cell.niveau}. Ne propose JAMAIS de vocabulaire ou de structure d'un niveau supérieur.
2. Mélange les types : si tu génères 2 questions, fais 1 QCM + 1 Vrai/Faux. Si 3 ou plus, majoritairement QCM.
3. Pour les QCM : 4 choix exactement, 1 seule bonne réponse. Les 3 distracteurs doivent être plausibles (pas absurdes).
4. Pour les Vrai/Faux : choix = ["Vrai", "Faux"], énoncé clair et non ambigu.
5. Voyellation (harakāt) OBLIGATOIRE sur tout le texte arabe. Pas de texte arabe sans voyelles.
6. Les énoncés sont en français. Le texte arabe est dans le champ "arabe" et/ou dans les "choix" si la réponse est en arabe.
7. Translittération : si tu cites un mot arabe dans l'énoncé français, mets-le en arabe voyellé entre parenthèses, pas en translittération latine.
8. Public musulman pratiquant : tu peux utiliser des exemples religieux respectueux (vocabulaire du Coran, formules courantes). Pas de contenu haram ou inapproprié.
9. Pas de pièges trop subtils : on évalue le niveau, pas la ruse.
10. Explication concise (1-2 phrases) qui aide réellement à comprendre, pas juste à répéter la réponse.

Appelle l'outil submit_questions avec exactement ${cell.count} question${cell.count > 1 ? "s" : ""}.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    tools: [
      {
        name: "submit_questions",
        description: `Soumet exactement ${cell.count} question(s) générée(s) pour le niveau ${cell.niveau}, catégorie ${cell.categorie}.`,
        input_schema: TOOL_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "submit_questions" },
    messages: [{ role: "user", content: prompt }],
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

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL manquant");
  if (!process.env.ANTHROPIC_API_KEY)
    throw new Error("ANTHROPIC_API_KEY manquant dans .env.local");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = new Anthropic();

  const force = process.argv.includes("--force");

  try {
    if (!force) {
      const { rows } = await pool.query<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM questions WHERE source = 'ia_seed'",
      );
      const existing = parseInt(rows[0].count, 10);
      if (existing > 0) {
        console.log(
          `\n⚠ ${existing} questions seed déjà en DB. Utilise --force pour regénérer (ajoute des doublons).`,
        );
        return;
      }
    }

    const totalExpected = GRID.reduce((acc, c) => acc + c.count, 0);
    console.log(
      `\n→ Génération de ${totalExpected} questions sur ${GRID.length} cellules (niveau × catégorie).\n`,
    );

    let totalInserted = 0;
    const failures: { cell: Cell; error: string }[] = [];

    for (let i = 0; i < GRID.length; i++) {
      const cell = GRID[i];
      const tag = `[${i + 1}/${GRID.length}] N${cell.niveau} · ${cell.categorie} × ${cell.count}`;
      process.stdout.write(`${tag.padEnd(60)} `);

      try {
        const questions = await generateCell(client, cell);
        let inserted = 0;
        for (const q of questions) {
          const err = validate(q);
          if (err) {
            console.log(`\n  ✗ rejet : ${err}`);
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
              cell.niveau,
              cell.categorie,
            ],
          );
          inserted++;
          totalInserted++;
        }
        console.log(`✓ ${inserted}/${cell.count} insérées`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`✗ ${msg}`);
        failures.push({ cell, error: msg });
      }
    }

    console.log(`\n━━━ Résumé ━━━`);
    console.log(`✓ ${totalInserted} questions insérées en draft (statut="draft", source="ia_seed")`);
    if (failures.length > 0) {
      console.log(`✗ ${failures.length} cellule(s) en échec :`);
      for (const f of failures) {
        console.log(`   - N${f.cell.niveau} ${f.cell.categorie} : ${f.error}`);
      }
      console.log(`\nRelance le script pour réessayer (les cellules réussies ne seront pas re-générées si tu enlèves --force).`);
    } else {
      console.log(`\n→ Va dans /admin/questions pour valider chaque question avant publication.`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("\n❌ Échec :", err);
  process.exit(1);
});

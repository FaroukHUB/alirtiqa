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

// Descriptions internes alignées sur le programme officiel Al-Furqan (méthode égyptienne).
// Sert à guider Claude pour générer des questions strictement adaptées au niveau.
const NIVEAU_DESC: Record<number, string> = {
  1: "MUQADIMA ALIF (Initiation) — Alphabet arabe (sorties de lettres, voyelles courtes et longues), chiffres, jours de la semaine, mois, vocabulaire de base. Aucun pré-requis.",
  2: "TA3BIR (Initiation) — Adjectifs et métiers, verbes, pronoms personnels et démonstratifs, particules grammaticales, dialogues pratiques. Pré-requis : sait lire et écrire.",
  3: "MUQADIMA BA (Préparation) — Types de mots approfondis, verbes conjugués illustrés, textes thématiques (maison, mosquée, classe), apprentissage de l'heure.",
  4: "TIMHIDI ALIF (Préparation) — Textes plus longs (milieux scolaire, médical, restauration), présentation personnelle, pronoms sous différentes formes, possession, défini et indéfini.",
  5: "TIMHIDI BA (Préparation) — Textes géographiques, médicaux, quotidiens (famille). Règles de grammaire approfondies, conjugaison verbale, enrichissement vocabulaire oral et écrit.",
  6: "MOUSTAWA 1 (Approfondissement) — Textes (sport, zoo, démarches administratives), règles d'écriture de la Hamza, formation et déclinaison du pluriel masculin, Inna wa akhawatuha et Kāna wa akhawatuha.",
  7: "MOUSTAWA 2 (Approfondissement) — Pluriel féminin et duel, analyse grammaticale (al-iʿrāb), construction des noms et verbes, textes (appartement, achats, mariage), poésie.",
  8: "MOUSTAWA 3 (Approfondissement) — Textes technologie/communication, Ramadan. Noms invariables (mamnūʿ min al-ṣarf), bases de la conjugaison (mīzān al-ṣarfī), poésie.",
  9: "MOUSTAWA 4 (Approfondissement) — Textes histoire des prophètes (Soulaymān), poèmes, bases conjugaison (al-maṣādir al-thulāthiyya), expressions arabes idiomatiques.",
  10: "MOUSTAWA 5 (Approfondissement) — Textes prophètes (Mūsā et Khaḍir, Dāwūd, sourate Ṣād), texte sur la fitnah de l'argent (sourate Al-Qalam), poèmes, grammaire (adjectifs, adverbes, compléments de temps/lieu), figures de style.",
  11: "MOUSTAWA 6 (Approfondissement) — Sourate Al-Kahf (Gens de la Caverne), thèmes de science religieuse, poèmes science et vérité, rhétorique arabe approfondie, interpellation (al-nidāʾ), liaison des mots.",
  12: "MOUSTAWA 7 (Approfondissement) — Textes Pharaon et Mūsā (sourate Al-Qaṣaṣ), différents types de maṣdar, sujet (al-fāʿil) et complément direct (al-mafʿūl bihi), exception (al-istithnāʾ), Kāda wa akhawatuha.",
  13: "MOUSTAWA 8 (Approfondissement) — Textes prophète Yūsuf, rôles sujet/complément direct/nom verbal, précédence Khabar sur Mubtadaʾ, Dhanna wa akhawatuha, expressions (critique, éloge, étonnement, exclamation).",
  14: "MOUSTAWA 9 (Spécialisation) — Vie du Prophète Muḥammad ﷺ (avant Révélation jusqu'à Badr), ḥurūf al-jarr, écriture de la hamza avec Inna, négation.",
  15: "MOUSTAWA 10 (Spécialisation) — Vie du Prophète Muḥammad ﷺ (d'Uḥud à sa mort), catégories du tanwīn, diminutif (al-taṣghīr), nasab (descendance), al-tanāzuʿ.",
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

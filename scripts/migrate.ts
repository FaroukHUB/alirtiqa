import { Pool } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SEED_AVIS = [
  {
    nom: "Mokrane",
    email: "seed@institut-alirtiqa.com",
    note: 5,
    texte:
      "frère très pédagogue avec des explications claires Allahibarek, qui rend agréable l'apprentissage",
  },
  {
    nom: "Stefano",
    email: "seed@institut-alirtiqa.com",
    note: 5,
    texte:
      "Je suis ravi d'avoir rencontré Tarek et d'apprendre l'arabe avec lui. Tarek est un professeur très compétent qui a parfaitement compris mes besoins d'amélioration. Ses supports pédagogiques sont excellents et ses cours sont parfaitement organisés. J'ai particulièrement apprécié la richesse des informations qu'il partage et son incroyable patience. Un grand merci, Tarek !",
  },
  {
    nom: "Jibril",
    email: "seed@institut-alirtiqa.com",
    note: 5,
    texte:
      "Prof avec un excellent niveau d’arabe qui prend le temps pour expliquer et faire comprendre quand on lui pose des questions et désireux de faire progresser ses élèves. Il peut être dur quand le travail n’est pas fait ou qu’il n’y a pas d’effort fourni donc je recommande pour les élèves qui sont réellement prêt à faire des efforts dans l’apprentissage de la langue arabe",
  },
  {
    nom: "Faycal",
    email: "seed@institut-alirtiqa.com",
    note: 5,
    texte:
      "Salam aleykoum, je tiens à remercier Tarek pour son professionnalisme, c’est un prof très compétent et très rigoureux sur l’apprentissage de votre arabe. Je recommande fortement à tous ceux qui veulent apprendre la langue arabe.",
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const schema = readFileSync(
      join(process.cwd(), "scripts/schema.sql"),
      "utf-8",
    );
    await pool.query(schema);
    console.log("✓ Schema applied");

    const { rows } = await pool.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM avis",
    );
    const existing = parseInt(rows[0].count, 10);

    if (existing === 0) {
      for (const a of SEED_AVIS) {
        await pool.query(
          `INSERT INTO avis (nom, email, note, texte, statut, moderated_at)
           VALUES ($1, $2, $3, $4, 'approved', NOW())`,
          [a.nom, a.email, a.note, a.texte],
        );
      }
      console.log(`✓ Seeded ${SEED_AVIS.length} initial avis`);
    } else {
      console.log(`• Skipped seed (${existing} avis already in DB)`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

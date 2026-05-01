import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const r = await pool.query(`
    SELECT niveau, categorie, type, enonce, arabe, choix, bonne_reponse, explication
    FROM questions
    WHERE source = 'ia_seed' AND statut = 'draft'
    ORDER BY niveau, categorie, created_at
  `);
  let lastNiveau = -1;
  let lastCat = "";
  let countInGroup = 0;
  for (const q of r.rows) {
    if (q.niveau !== lastNiveau || q.categorie !== lastCat) {
      lastNiveau = q.niveau;
      lastCat = q.categorie;
      countInGroup = 0;
      console.log(`\n━━━ Niveau ${q.niveau} · ${q.categorie} ━━━`);
    }
    countInGroup++;
    if (countInGroup > 2) continue;
    const choixArr = q.choix as string[];
    console.log(`\n[${q.type}] ${q.enonce}`);
    if (q.arabe) console.log(`  arabe: ${q.arabe}`);
    choixArr.forEach((c, i) => {
      const mark = i === q.bonne_reponse ? "✓" : " ";
      console.log(`  ${mark} ${i + 1}. ${c}`);
    });
    if (q.explication) console.log(`  → ${q.explication}`);
  }
  await pool.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

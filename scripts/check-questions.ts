import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const r = await pool.query(
    `SELECT statut, source, COUNT(*)::int AS count
     FROM questions GROUP BY statut, source ORDER BY statut, source`,
  );
  console.log(r.rows);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

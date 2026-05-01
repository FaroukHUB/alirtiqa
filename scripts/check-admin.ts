import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const r = await pool.query(
    "SELECT id, email, length(password_hash) as hash_len, created_at FROM admins",
  );
  console.log("Admins in DB:", JSON.stringify(r.rows, null, 2));
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

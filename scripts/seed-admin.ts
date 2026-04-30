import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import prompts from "prompts";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  console.log("\n— Création / mise à jour d'un compte admin —\n");

  const answers = await prompts(
    [
      {
        type: "text",
        name: "email",
        message: "Email admin :",
        validate: (v: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
            ? true
            : "Email invalide",
      },
      {
        type: "password",
        name: "password",
        message: "Mot de passe (min 10 caractères) :",
        validate: (v: string) =>
          v.length >= 10 ? true : "10 caractères minimum",
      },
      {
        type: "password",
        name: "confirm",
        message: "Confirmer le mot de passe :",
      },
    ],
    {
      onCancel: () => {
        console.log("\nAnnulé.");
        process.exit(0);
      },
    },
  );

  if (answers.password !== answers.confirm) {
    console.error("\n✗ Les mots de passe ne correspondent pas.");
    process.exit(1);
  }

  const email = answers.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(answers.password, 12);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const result = await pool.query<{ id: string; created: boolean }>(
      `INSERT INTO admins (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email)
       DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id, (xmax = 0) AS created`,
      [email, passwordHash],
    );

    const { created } = result.rows[0];
    console.log(
      `\n✓ Admin ${created ? "créé" : "mis à jour"} : ${email}\n`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Erreur :", err);
  process.exit(1);
});

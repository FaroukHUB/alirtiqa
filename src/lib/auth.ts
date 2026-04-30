import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

type AdminRow = {
  id: string;
  email: string;
  password_hash: string;
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const rows = (await sql`
          SELECT id, email, password_hash
          FROM admins
          WHERE email = ${email}
          LIMIT 1
        `) as AdminRow[];

        if (rows.length === 0) return null;

        const admin = rows[0];
        const ok = await bcrypt.compare(
          credentials.password,
          admin.password_hash,
        );
        if (!ok) return null;

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

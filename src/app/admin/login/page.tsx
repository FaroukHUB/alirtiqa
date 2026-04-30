"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-dore/30 bg-creme/[0.04] p-8 backdrop-blur"
    >
      <div>
        <p className="font-display text-xs uppercase tracking-[0.4em] text-dore">
          Administration
        </p>
        <h1 className="mt-2 font-display text-2xl text-creme">Connexion</h1>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.2em] text-creme/60">
          Email
        </span>
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-creme/15 bg-nuit/60 px-4 py-2.5 text-sm text-creme outline-none transition-colors focus:border-dore"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.2em] text-creme/60">
          Mot de passe
        </span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-creme/15 bg-nuit/60 px-4 py-2.5 text-sm text-creme outline-none transition-colors focus:border-dore"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-dore px-6 py-3 font-medium text-nuit transition-colors hover:bg-dore-300 disabled:opacity-60"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-nuit text-creme">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-zellige bg-[length:160px] opacity-[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
      />
      <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

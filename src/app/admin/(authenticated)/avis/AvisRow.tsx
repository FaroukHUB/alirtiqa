"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Avis } from "@/lib/db";

const STATUT_BADGE: Record<Avis["statut"], { label: string; cls: string }> = {
  pending: {
    label: "En attente",
    cls: "bg-amber-100 text-amber-800 ring-amber-300/50",
  },
  approved: {
    label: "Publié",
    cls: "bg-emerald-100 text-emerald-800 ring-emerald-300/50",
  },
  rejected: {
    label: "Refusé",
    cls: "bg-rose-100 text-rose-800 ring-rose-300/50",
  },
};

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${count} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={n <= count ? "#C9A961" : "transparent"}
          stroke={n <= count ? "#C9A961" : "#D1C8B0"}
          strokeWidth="1.4"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 2.5l2.9 6.5 7.1.7-5.4 4.7 1.7 7-6.3-3.7L5.7 21.4l1.7-7L2 9.7l7.1-.7Z" />
        </svg>
      ))}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AvisRow({ avis }: { avis: Avis }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function changeStatut(statut: Avis["statut"]) {
    setError(null);
    const res = await fetch(`/api/admin/avis/${avis.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    if (!res.ok) {
      setError("Erreur, réessaye.");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function deleteAvis() {
    setError(null);
    const res = await fetch(`/api/admin/avis/${avis.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("Erreur, réessaye.");
      return;
    }
    startTransition(() => router.refresh());
  }

  const badge = STATUT_BADGE[avis.statut];

  return (
    <li className="rounded-xl border border-nuit/10 bg-white p-5 shadow-[0_1px_0_rgba(10,26,63,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-lg text-nuit">{avis.nom}</h3>
            <Stars count={avis.note} />
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${badge.cls}`}
            >
              {badge.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-nuit/55">
            {avis.email} · soumis le {formatDate(avis.created_at)}
            {avis.moderated_at && (
              <> · modéré le {formatDate(avis.moderated_at)}</>
            )}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-nuit/85">{avis.texte}</p>

      {error && (
        <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-nuit/5 pt-4">
        {avis.statut !== "approved" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => changeStatut("approved")}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            ✓ Publier
          </button>
        )}
        {avis.statut !== "rejected" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => changeStatut("rejected")}
            className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
          >
            ✗ Refuser
          </button>
        )}
        {avis.statut !== "pending" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => changeStatut("pending")}
            className="inline-flex items-center gap-1.5 rounded-md border border-nuit/15 bg-white px-3 py-1.5 text-xs font-medium text-nuit/75 transition-colors hover:border-nuit/30 hover:bg-nuit/5 disabled:opacity-60"
          >
            ↺ Remettre en attente
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          {confirmingDelete ? (
            <>
              <span className="text-xs text-nuit/65">Confirmer ?</span>
              <button
                type="button"
                disabled={pending}
                onClick={deleteAvis}
                className="inline-flex items-center rounded-md bg-rose-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-800 disabled:opacity-60"
              >
                Oui, supprimer
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="inline-flex items-center rounded-md border border-nuit/15 bg-white px-3 py-1.5 text-xs text-nuit/65 hover:bg-nuit/5"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex items-center rounded-md border border-nuit/10 bg-white px-3 py-1.5 text-xs text-nuit/55 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

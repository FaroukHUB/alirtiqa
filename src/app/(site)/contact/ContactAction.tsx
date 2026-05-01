"use client";

import { useState } from "react";

type Props =
  | {
      kind: "external";
      href: string;
      label: string;
    }
  | {
      kind: "copy";
      value: string;
      label: string;
      labelDone?: string;
    };

export function ContactAction(props: Props) {
  const [copied, setCopied] = useState(false);

  if (props.kind === "external") {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-nuit px-4 py-2 text-xs font-medium text-creme transition-colors hover:bg-nuit-400"
      >
        {props.label} →
      </a>
    );
  }

  const valueToCopy = props.value;
  async function copy() {
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback : sélectionne via une textarea temporaire
      const ta = document.createElement("textarea");
      ta.value = valueToCopy;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
        copied
          ? "bg-emerald-600 text-white"
          : "bg-nuit text-creme hover:bg-nuit-400"
      }`}
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          {props.labelDone ?? "Copié !"}
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {props.label}
        </>
      )}
    </button>
  );
}

"use client";

import { useRef } from "react";
import { AvisCard, type PublicAvis } from "@/components/avis/AvisCard";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function AvisInner({ avis }: { avis: PublicAvis[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-avis-card]") as HTMLElement | null;
    const cardWidth = card?.offsetWidth ?? 420;
    const gap = 24;
    el.scrollBy({
      left: (cardWidth + gap) * (dir === "right" ? 1 : -1),
      behavior: "smooth",
    });
  };

  if (avis.length === 0) return null;

  return (
    <>
      <div className="container-prose relative mt-12 md:hidden">
        <div className="grid gap-6">
          {avis.map((a) => (
            <AvisCard key={a.id} avis={a} />
          ))}
        </div>
      </div>

      <div className="relative mt-12 hidden md:block">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-8 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {avis.map((a) => (
            <div
              key={a.id}
              data-avis-card
              className="flex-none snap-start"
              style={{ width: "calc((100vw - 4rem - 3rem) / 3)" }}
            >
              <AvisCard avis={a} />
            </div>
          ))}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-creme to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-creme to-transparent"
        />

        {avis.length > 3 && (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Avis précédent"
              className="absolute left-6 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-dore/40 bg-white/90 text-nuit shadow-[0_8px_24px_rgba(10,26,63,0.12)] backdrop-blur transition-all hover:border-dore hover:bg-white hover:text-dore-700"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Avis suivant"
              className="absolute right-6 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-dore/40 bg-white/90 text-nuit shadow-[0_8px_24px_rgba(10,26,63,0.12)] backdrop-blur transition-all hover:border-dore hover:bg-white hover:text-dore-700"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>
    </>
  );
}

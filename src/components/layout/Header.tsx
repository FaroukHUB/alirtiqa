"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { SocialIcons } from "./SocialIcons";
import { mainNav } from "@/lib/nav";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-dore/15 bg-nuit/85 backdrop-blur supports-[backdrop-filter]:bg-nuit/70">
        <div className="container-prose flex h-24 items-center justify-between">
          <Logo size="md" tone="light" />

          <nav className="hidden items-center gap-8 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wide text-creme/80 transition-colors hover:text-dore"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <ButtonLink href="/inscription" className="px-5 py-2 text-sm">
              Inscription
            </ButtonLink>
          </div>

          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="text-creme md:hidden"
            onClick={() => setOpen(true)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-nuit/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              className="fixed right-0 top-0 z-50 flex h-full w-[88%] max-w-[380px] flex-col bg-creme text-nuit shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between px-6 pb-2 pt-5">
                <SocialIcons />
                <button
                  type="button"
                  aria-label="Fermer le menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-nuit/15 text-nuit transition-colors hover:border-dore hover:bg-dore/10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div
                aria-hidden
                className="mx-6 mt-4 h-px bg-gradient-to-r from-transparent via-nuit/15 to-transparent"
              />

              <nav className="flex flex-col px-6 py-8">
                {mainNav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.35, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 font-display text-2xl tracking-wide text-nuit transition-colors hover:text-dore-600"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex-1" />

              <div className="flex flex-col gap-3 px-6">
                <ButtonLink
                  href="/test-de-niveau"
                  variant="primary"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Faire le test de niveau
                </ButtonLink>
                <ButtonLink
                  href="/programme"
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Découvrir le programme
                </ButtonLink>
              </div>

              <div className="flex items-center justify-center px-6 pb-10 pt-12">
                <Logo size="lg" tone="dark" href={null} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav } from "@/lib/nav";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-dore/15 bg-nuit/85 backdrop-blur supports-[backdrop-filter]:bg-nuit/70">
      <div className="container-prose flex h-16 items-center justify-between">
        <Logo tone="light" />

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
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="md:hidden text-creme"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="container-prose flex flex-col gap-4 pb-6 pt-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-base text-creme/85 hover:text-dore"
                >
                  {item.label}
                </Link>
              ))}
              <ButtonLink href="/inscription" className="mt-2 self-start px-5 py-2 text-sm">
                Inscription
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

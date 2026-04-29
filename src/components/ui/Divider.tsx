"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export function Divider() {
  return (
    <div
      aria-hidden
      className="relative bg-creme py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-3xl px-6 sm:px-8">
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, ease }}
            className="h-px w-full origin-center bg-gradient-to-r from-transparent via-dore/45 to-transparent"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.55, ease }}
            className="absolute flex items-center justify-center"
          >
            <span className="absolute h-9 w-9 rounded-full bg-dore/15 blur-xl" />
            <span className="relative h-2.5 w-2.5 rotate-45 border border-dore/70 bg-creme" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { formules } from "@/lib/formules";

export function Programmes() {
  return (
    <section id="programmes" className="bg-creme py-24 sm:py-32">
      <div className="container-prose">
        <SectionHeading
          kicker="Formules"
          title={<>Choisissez le format qui vous ressemble</>}
          description="Particulier, duo ou groupe : trois formats, une même exigence pédagogique. Tous les cours ont lieu en ligne via Zoom."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {formules.map((f, i) => (
            <motion.article
              key={f.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="relative flex flex-col rounded-2xl border border-nuit/10 bg-white p-8 shadow-[0_1px_0_rgba(10,26,63,0.04)] transition-shadow hover:shadow-[0_8px_30px_rgba(10,26,63,0.08)]"
            >
              {f.badge && (
                <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-dore px-3 py-1 font-display text-[10px] uppercase tracking-[0.25em] text-nuit">
                  {f.badge}
                </span>
              )}

              <h3 className="font-display text-xl text-nuit">{f.titre}</h3>
              <p className="mt-2 text-sm text-nuit/65">{f.promesse}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl text-nuit">{f.prix}</span>
                <span className="text-sm text-nuit/60">{f.unite}</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-nuit/75">
                {f.pour.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-dore" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <ButtonLink
                  href={`/inscription?formule=${f.slug}`}
                  className="w-full"
                >
                  Choisir cette formule
                </ButtonLink>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-nuit/55">
          Frais d&apos;inscription uniques de 10 € (fournitures incluses) — sans engagement de durée.
        </p>
      </div>
    </section>
  );
}

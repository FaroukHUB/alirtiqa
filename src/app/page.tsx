import { Hero } from "@/components/sections/Hero";
import { QuiSuisJe } from "@/components/sections/QuiSuisJe";
import { Methode } from "@/components/sections/Methode";
import { Niveaux } from "@/components/sections/Niveaux";
import { Programmes } from "@/components/sections/Programmes";
import { Tarifs } from "@/components/sections/Tarifs";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { Divider } from "@/components/ui/Divider";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <QuiSuisJe />
      <Divider />
      <Methode />
      <Niveaux />
      <Programmes />
      <Tarifs />
      <CtaFinale />
    </main>
  );
}

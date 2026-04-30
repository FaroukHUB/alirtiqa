import { Hero } from "@/components/sections/Hero";
import { QuiSuisJe } from "@/components/sections/QuiSuisJe";
import { Methode } from "@/components/sections/Methode";
import { Niveaux } from "@/components/sections/Niveaux";
import { Avis } from "@/components/sections/Avis";
import { Programmes } from "@/components/sections/Programmes";
import { Atouts } from "@/components/sections/Atouts";
import { Tarifs } from "@/components/sections/Tarifs";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { Divider } from "@/components/ui/Divider";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <QuiSuisJe truncated asH1={false} />
      <Divider />
      <Methode />
      <Niveaux />
      <Avis />
      <Programmes />
      <Atouts />
      <Tarifs />
      <CtaFinale />
    </main>
  );
}

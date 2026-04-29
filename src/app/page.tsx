import { Hero } from "@/components/sections/Hero";
import { Methode } from "@/components/sections/Methode";
import { Niveaux } from "@/components/sections/Niveaux";
import { Programmes } from "@/components/sections/Programmes";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Methode />
      <Niveaux />
      <Programmes />
    </main>
  );
}

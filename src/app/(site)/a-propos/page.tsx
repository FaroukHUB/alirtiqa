import type { Metadata } from "next";
import { QuiSuisJe } from "@/components/sections/QuiSuisJe";

export const metadata: Metadata = {
  title: "Qui suis-je",
  description:
    "Je m'appelle Tarek Abou Zeyneb, et si j'ai fondé Institut Al-Irtiqā', c'est d'abord par attachement profond à la langue arabe, par respect pour sa noblesse, et par conscience de son importance.",
};

export default function Page() {
  return (
    <main>
      <QuiSuisJe />
    </main>
  );
}

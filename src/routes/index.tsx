import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SmoothScroll } from "@/components/akali/SmoothScroll";
import { Hero } from "@/components/akali/Hero";
import { Lore } from "@/components/akali/Lore";
import { Abilities } from "@/components/akali/Abilities";
import { Skins } from "@/components/akali/Skins";
import { Footer } from "@/components/akali/Footer";
import { Preloader } from "@/components/akali/Preloader";
import { Navbar } from "@/components/akali/Navbar";
import { InkDivider } from "@/components/akali/InkDivider";
import { LanguageProvider } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akali — The Rogue Assassin" },
      {
        name: "description",
        content:
          "A cinematic fan tribute to Akali, the Rogue Assassin of Ionia. Motion study built with React, GSAP, and Lenis.",
      },
      { property: "og:title", content: "Akali — The Rogue Assassin" },
      {
        property: "og:description",
        content: "Cinematic fan tribute. Motion-driven landing for the Ionian shadow.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [loaded, setLoaded] = useState(false);

  return (
    <LanguageProvider>
      <Preloader onComplete={() => setLoaded(true)} />
      <Navbar />
      <main className="relative">
        <SmoothScroll />
        <Hero isParentLoaded={loaded} />
        <InkDivider />
        <Lore />
        <InkDivider flip />
        <Abilities />
        <Skins />
        <Footer />
      </main>
    </LanguageProvider>
  );
}

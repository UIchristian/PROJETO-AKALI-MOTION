import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/akali/SmoothScroll";
import { Hero } from "@/components/akali/Hero";
import { Lore } from "@/components/akali/Lore";
import { Abilities } from "@/components/akali/Abilities";
import { Skins } from "@/components/akali/Skins";
import { Footer } from "@/components/akali/Footer";
import { InkDivider } from "@/components/akali/InkDivider";

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
  return (
    <main className="relative">
      <SmoothScroll />
      <Hero />
      <InkDivider />
      <Lore />
      <InkDivider flip />
      <Abilities />
      <Skins />
      <Footer />
    </main>
  );
}

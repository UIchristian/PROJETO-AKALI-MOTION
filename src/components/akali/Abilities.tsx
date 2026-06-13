import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Smoke } from "./Smoke";

const abilities = [
  {
    key: "P",
    name: "Assassin's Mark",
    desc: "Spell damage to a champion rings them. Leaving the ring empowers her next attack with bonus range and damage.",
    icon: "◎",
  },
  {
    key: "Q",
    name: "Five Point Strike",
    desc: "Hurls five kunai in a cone — damaging and slowing everything in their path.",
    icon: "✦",
  },
  {
    key: "W",
    name: "Twilight Shroud",
    desc: "Drops a smoke cloud. She gains speed, turns invisible and untargetable inside. Striking briefly reveals her.",
    icon: "❂",
    smoke: true,
  },
  {
    key: "E",
    name: "Shuriken Flip",
    desc: "Flips backward and snaps a shuriken forward — marking the first enemy struck.",
    icon: "✺",
  },
  {
    key: "R",
    name: "Perfect Execution",
    desc: "Leaps in a direction, damaging foes. The recast dashes through and executes low-health enemies.",
    icon: "✶",
  },
];

export function Abilities() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-ability-card]", {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-ability-grid]", start: "top 75%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="abilities" className="relative grain py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 flex items-baseline gap-6">
          <span className="section-label accent-text">03</span>
          <span className="section-label">Kit · Mechanics</span>
        </div>
        <h2 className="display text-5xl md:text-7xl mb-16 max-w-3xl">
          Five strikes. <span className="accent-text">No mercy.</span>
        </h2>

        <div data-ability-grid className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {abilities.map((a) => (
            <article
              key={a.key}
              data-ability-card
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-500 hover:border-[color:var(--accent)] hover:-translate-y-1"
              style={{ boxShadow: "0 0 0 0 transparent" }}
            >
              {a.smoke && (
                <div className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100">
                  <Smoke />
                </div>
              )}
              <div className="relative flex items-start justify-between mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border bg-background text-2xl accent-text transition-colors group-hover:accent-border">
                  {a.icon}
                </div>
                <span className="section-label accent-text">{a.key}</span>
              </div>
              <h3 className="display relative text-2xl md:text-3xl mb-3">{a.name}</h3>
              <p className="relative text-sm md:text-base text-muted-foreground leading-relaxed">
                {a.desc}
              </p>
              <div
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-0 accent-bg transition-all duration-700 group-hover:w-full"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

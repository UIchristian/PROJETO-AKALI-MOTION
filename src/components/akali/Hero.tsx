import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Smoke } from "./Smoke";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-word] span", {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.2,
      });
      gsap.from("[data-hero-tag]", { opacity: 0, y: 24, duration: 1, delay: 0.9, ease: "power2.out" });
      gsap.from("[data-hero-meta]", { opacity: 0, y: 12, duration: 0.8, delay: 1.1, stagger: 0.08 });
      gsap.from("[data-hero-kunai]", { scaleY: 0, transformOrigin: "top center", duration: 1.4, delay: 0.4, ease: "expo.inOut" });
      gsap.to("[data-hero-cue]", { y: 8, repeat: -1, yoyo: true, duration: 1.4, ease: "sine.inOut" });
    }, root);
    return () => ctx.revert();
  }, []);

  const letters = "AKALI".split("");

  return (
    <section ref={root} className="relative grain min-h-[100svh] w-full overflow-hidden">
      <Smoke />
      {/* Kanji backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="display text-[42vw] leading-none accent-text opacity-[0.06] kanji-glow">
          忍
        </span>
      </div>

      {/* Kunai accent line */}
      <div
        data-hero-kunai
        aria-hidden
        className="absolute left-8 top-0 hidden h-[60vh] w-px md:block accent-bg"
        style={{ boxShadow: "0 0 24px var(--accent-glow)" }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-6 pt-10 pb-12 md:px-12">
        <header className="flex items-center justify-between">
          <span className="section-label">忍 — Kinkou / Renegade</span>
          <span className="section-label">Lv. 18 · Ionia</span>
        </header>

        <div className="flex flex-col items-start gap-6">
          <h1 data-hero-word className="display text-[clamp(5rem,18vw,18rem)] leading-[0.85]">
            {letters.map((l, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="inline-block">{l}</span>
              </span>
            ))}
          </h1>
          <p data-hero-tag className="text-xl md:text-3xl text-foreground/80 max-w-2xl">
            The <span className="accent-text">Rogue Assassin</span>. Shadow without an order.
          </p>
        </div>

        <footer className="flex items-end justify-between">
          <div data-hero-meta className="section-label max-w-xs">
            A fan-made tribute · Motion study · 2026
          </div>
          <div data-hero-cue className="section-label flex flex-col items-center gap-2">
            <span>Scroll</span>
            <span className="block h-8 w-px accent-bg" />
          </div>
        </footer>
      </div>
    </section>
  );
}

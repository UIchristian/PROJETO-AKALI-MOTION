import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Skin = {
  name: string;
  tag: string;
  accent: string;
  accentGlow: string;
  gradient: string;
};

const skins: Skin[] = [
  {
    name: "Akali",
    tag: "The Rogue Assassin. Neon green, neo-Ionian shadow.",
    accent: "oklch(0.82 0.22 155)",
    accentGlow: "oklch(0.88 0.24 152 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.18 0.05 165), oklch(0.28 0.18 155))",
  },
  {
    name: "Blood Moon Akali",
    tag: "Demon mask. Crimson tide. Bone-white grin.",
    accent: "oklch(0.65 0.25 22)",
    accentGlow: "oklch(0.7 0.27 22 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.15 0.04 25), oklch(0.45 0.22 22))",
  },
  {
    name: "Star Guardian Akali",
    tag: "Pastel constellations. A lonely magical girl.",
    accent: "oklch(0.82 0.16 340)",
    accentGlow: "oklch(0.88 0.18 320 / 45%)",
    gradient:
      "linear-gradient(135deg, oklch(0.45 0.12 320), oklch(0.75 0.14 230) 50%, oklch(0.85 0.13 350))",
  },
  {
    name: "K/DA Akali",
    tag: "Stage lights. Hot magenta. Pop the world.",
    accent: "oklch(0.7 0.28 330)",
    accentGlow: "oklch(0.75 0.3 320 / 50%)",
    gradient: "linear-gradient(135deg, oklch(0.25 0.15 300), oklch(0.6 0.28 330))",
  },
];

export function Skins() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !track.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Horizontal scroll on desktop
      if (!reduced && !isMobile) {
        const panels = gsap.utils.toArray<HTMLElement>("[data-skin-panel]");
        const totalX = () => track.current!.scrollWidth - window.innerWidth;
        gsap.to(track.current, {
          x: () => -totalX(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => "+=" + totalX(),
            invalidateOnRefresh: true,
          },
        });

        // Per-panel accent transition
        panels.forEach((panel) => {
          const accent = panel.dataset.accent!;
          const glow = panel.dataset.glow!;
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: ScrollTrigger.getAll().find((s) => s.pin === root.current)
              ? undefined
              : undefined,
            start: "left center",
            end: "right center",
            horizontal: true,
            onToggle: (self) => {
              if (self.isActive) {
                gsap.to(document.documentElement, {
                  duration: 0.8,
                  ease: "power2.out",
                  "--accent": accent,
                  "--accent-glow": glow,
                } as gsap.TweenVars);
              }
            },
          });
        });
      } else {
        // Mobile: stacked, accent on enter
        gsap.utils.toArray<HTMLElement>("[data-skin-panel]").forEach((panel) => {
          ScrollTrigger.create({
            trigger: panel,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => {
              if (self.isActive) {
                gsap.to(document.documentElement, {
                  duration: 0.6,
                  "--accent": panel.dataset.accent!,
                  "--accent-glow": panel.dataset.glow!,
                } as gsap.TweenVars);
              }
            },
          });
        });
      }

      // Reset to default green on leaving section
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        onLeaveBack: () => {
          gsap.to(document.documentElement, {
            duration: 0.6,
            "--accent": skins[0].accent,
            "--accent-glow": skins[0].accentGlow,
          } as gsap.TweenVars);
        },
        onLeave: () => {
          gsap.to(document.documentElement, {
            duration: 0.6,
            "--accent": skins[0].accent,
            "--accent-glow": skins[0].accentGlow,
          } as gsap.TweenVars);
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="skins" className="relative grain overflow-hidden md:h-screen">
      <div className="absolute top-0 left-0 right-0 z-20 mx-auto max-w-7xl px-6 md:px-12 pt-12 pointer-events-none">
        <div className="flex items-baseline gap-6">
          <span className="section-label accent-text">04</span>
          <span className="section-label">Skins · Identities</span>
        </div>
      </div>

      <div
        ref={track}
        className="flex flex-col md:flex-row md:h-screen md:w-max md:flex-nowrap"
      >
        {skins.map((s, i) => (
          <article
            key={s.name}
            data-skin-panel
            data-accent={s.accent}
            data-glow={s.accentGlow}
            className="relative flex min-h-[80vh] w-full shrink-0 flex-col justify-end p-8 md:h-screen md:w-screen md:p-16"
          >
            <div
              aria-hidden
              className="absolute inset-6 md:inset-12 rounded-xl"
              style={{ background: s.gradient, boxShadow: `0 30px 120px -30px ${s.accentGlow}` }}
            />
            <div className="relative z-10 max-w-2xl">
              <span className="section-label opacity-80">0{i + 1} / 0{skins.length}</span>
              <h3 className="display mt-4 text-5xl md:text-8xl text-bone">{s.name}</h3>
              <p className="mt-4 text-base md:text-xl text-bone/80 max-w-md">{s.tag}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

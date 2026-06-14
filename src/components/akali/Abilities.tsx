import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Smoke } from "./Smoke";
import { fx } from "@/assets/fx";
import { useTranslation } from "@/lib/i18n";

const abilityIcons: Record<string, string> = {
  P: "◎",
  Q: "✦",
  W: "❂",
  E: "✺",
  R: "✶",
};

const cardColors = {
  P: { accent: "oklch(0.82 0.22 155)", glow: "oklch(0.88 0.24 152 / 45%)" },
  Q: { accent: "oklch(0.76 0.18 142)", glow: "oklch(0.82 0.20 142 / 45%)" },
  W: { accent: "oklch(0.55 0.08 170)", glow: "oklch(0.60 0.10 170 / 40%)" },
  E: { accent: "oklch(0.84 0.18 150)", glow: "oklch(0.88 0.20 150 / 45%)" },
  R: { accent: "oklch(0.92 0.28 155)", glow: "oklch(0.95 0.30 155 / 55%)" },
};

export function Abilities() {
  const root = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set("[data-ability-card]", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-ability-card]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: "[data-ability-grid]",
            start: "top 80%",
            once: true,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (e: React.SyntheticEvent<HTMLElement>, key: string) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const colors = cardColors[key as keyof typeof cardColors] || cardColors.P;

    gsap.to(e.currentTarget, {
      y: -6,
      z: 15,
      "--accent": colors.accent,
      "--accent-glow": colors.glow,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;

    const tiltX = (dy / yc) * 8;
    const tiltY = -(dx / xc) * 8;

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.25,
      overwrite: "auto",
    });
  };

  const handleMouseLeave = (e: React.SyntheticEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      z: 0,
      rotateX: 0,
      rotateY: 0,
      "--accent": "oklch(0.82 0.22 155)",
      "--accent-glow": "oklch(0.88 0.24 152 / 45%)",
      ease: "power3.out",
      duration: 0.5,
      overwrite: "auto",
    });
  };

  return (
    <section ref={root} id="abilities" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 flex items-baseline gap-6">
          <span className="section-label accent-text">03</span>
          <span className="section-label">{t.abilities.label}</span>
        </div>
        <h2 className="display text-5xl md:text-7xl mb-16 max-w-3xl text-bone select-none">
          {t.abilities.title}<span className="accent-text">{t.abilities.titleBold}</span>
        </h2>

        <div
          data-ability-grid
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:pb-24 md:pb-16"
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          {t.abilities.cards.map((a) => {
            const icon = abilityIcons[a.key] || "◎";
            // Layout stagger offset map to prevent GSAP transform conflicts
            const staggerClasses = {
              P: "md:translate-y-0 lg:translate-y-0",
              Q: "md:translate-y-8 lg:translate-y-12",
              W: "md:translate-y-0 lg:translate-y-6",
              E: "md:translate-y-8 lg:translate-y-18",
              R: "md:translate-y-0 lg:translate-y-10",
            }[a.key] || "";

            return (
              <div key={a.key} className={`transition-transform duration-500 ${staggerClasses}`}>
                <article
                  data-ability-card
                  onMouseEnter={(e) => handleMouseEnter(e, a.key)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onFocus={(e) => handleMouseEnter(e, a.key)}
                  onBlur={handleMouseLeave}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 cursor-pointer select-none transition-[border-color,box-shadow] duration-300 hover:border-[color:var(--accent)] focus-visible:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  tabIndex={0}
                  role="region"
                  aria-label={`Ability ${a.key}: ${a.name}`}
                >
                  {/* Smoke hover elements on all ability cards */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-85 group-focus-within:opacity-85 pointer-events-none">
                    <Smoke />
                  </div>
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 ${
                      a.key === "W"
                        ? "group-hover:opacity-45 group-focus-within:opacity-45"
                        : "group-hover:opacity-30 group-focus-within:opacity-30"
                    }`}
                    style={{
                      backgroundImage: `url(${fx.smoke})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "invert(1)",
                    }}
                  />

                  <div className="relative flex items-start justify-between mb-8 pointer-events-none">
                    <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border bg-background text-2xl accent-text transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-focus-within:scale-110 group-focus-within:rotate-12">
                      {icon}
                    </div>
                    <span className="section-label accent-text">{a.key}</span>
                  </div>
                  <h3 className="display relative text-2xl md:text-3xl mb-3 text-bone pointer-events-none">
                    {a.name}
                  </h3>
                  <p className="relative text-sm md:text-base text-muted-foreground leading-relaxed pointer-events-none">
                    {a.desc}
                  </p>
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px w-0 accent-bg transition-all duration-500 group-hover:w-full group-focus-within:w-full"
                  />
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

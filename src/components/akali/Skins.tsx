import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { akaliImages } from "@/assets/akali";
import { useTranslation } from "@/lib/i18n";

type SkinConfig = {
  accent: string;
  accentGlow: string;
  gradient: string;
  image?: { src: string; alt: string };
  objectPosition?: string;
};

const skinsConfig: SkinConfig[] = [
  {
    accent: "oklch(0.88 0.20 95)",
    accentGlow: "oklch(0.88 0.20 95 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.12 0.04 290), oklch(0.35 0.15 310))",
    image: akaliImages.truedamage,
  },
  {
    accent: "oklch(0.72 0.18 200)",
    accentGlow: "oklch(0.72 0.18 200 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.12 0.03 200), oklch(0.38 0.12 200))",
    image: akaliImages.nurse,
    objectPosition: "center 4%",
  },
  {
    accent: "oklch(0.78 0.06 250)",
    accentGlow: "oklch(0.78 0.06 250 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.12 0.02 250), oklch(0.35 0.05 250))",
    image: akaliImages.silverfang,
  },
  {
    accent: "oklch(0.55 0.22 25)",
    accentGlow: "oklch(0.55 0.22 25 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.12 0.03 15), oklch(0.38 0.18 25))",
    image: akaliImages.bloodmoon,
  },
  {
    accent: "oklch(0.75 0.25 320)",
    accentGlow: "oklch(0.75 0.25 320 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.15 0.08 300), oklch(0.52 0.24 320))",
    image: akaliImages.kdaallout,
  },
  {
    accent: "oklch(0.78 0.22 290)",
    accentGlow: "oklch(0.78 0.22 290 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.14 0.06 280), oklch(0.48 0.18 290))",
    image: akaliImages.starguardian,
  },
  {
    accent: "oklch(0.82 0.16 220)",
    accentGlow: "oklch(0.82 0.16 220 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.13 0.04 220), oklch(0.42 0.15 220))",
    image: akaliImages.drx,
  },
  {
    accent: "oklch(0.80 0.12 75)",
    accentGlow: "oklch(0.80 0.12 75 / 45%)",
    gradient: "linear-gradient(135deg, oklch(0.15 0.03 40), oklch(0.45 0.10 75))",
    image: akaliImages.coven,
    objectPosition: "center 5%",
  },
];

export function Skins() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const localizedSkins = t.skins.list.map((item, idx) => ({
    ...item,
    ...skinsConfig[idx],
  }));

  useEffect(() => {
    if (!root.current || !track.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (reduced) {
        const progressContainer = root.current?.querySelector("[data-skins-progress-container]") as HTMLElement;
        if (progressContainer) {
          progressContainer.style.display = "none";
        }
        return;
      }

      if (!isMobile) {
        const panels = gsap.utils.toArray<HTMLElement>("[data-skin-panel]");
        const totalX = () => track.current!.scrollWidth - window.innerWidth;

        // Sync the horizontal translate tween with vertical scroll scrub
        const scrollTween = gsap.to(track.current, {
          x: () => -totalX(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 0.5,
            start: "top top",
            end: () => "+=" + totalX(),
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progressBar = root.current?.querySelector("[data-skins-progress-bar]");
              if (progressBar) {
                gsap.set(progressBar, { scaleX: self.progress });
              }
              const progressText = root.current?.querySelector("[data-skins-progress-text]");
              if (progressText) {
                const totalSkins = localizedSkins.length;
                const activeIdx = Math.min(
                  Math.round(self.progress * (totalSkins - 1)),
                  totalSkins - 1
                );
                progressText.textContent = `0${activeIdx + 1} / 0${totalSkins}`;
              }
            },
          },
        });

        // Horizontal image parallax inside each skin panel's portrait frame
        panels.forEach((panel) => {
          const img = panel.querySelector("[data-skin-img]");
          if (img) {
            gsap.fromTo(
              img,
              { x: -30 },
              {
                x: 30,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }
        });

        // Trigger color shifts as each panel enters horizontal focus
        panels.forEach((panel) => {
          const accent = panel.dataset.accent!;
          const glow = panel.dataset.glow!;

          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: scrollTween,
            start: "left center",
            end: "right center",
            onToggle: (self) => {
              if (self.isActive) {
                document.documentElement.style.setProperty("--accent", accent);
                document.documentElement.style.setProperty("--accent-glow", glow);
              }
            },
          });
        });
      } else {
        // Mobile layout: vertical cards trigger color shifts when crossing the center
        gsap.utils.toArray<HTMLElement>("[data-skin-panel]").forEach((panel) => {
          ScrollTrigger.create({
            trigger: panel,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => {
              if (self.isActive) {
                document.documentElement.style.setProperty("--accent", panel.dataset.accent!);
                document.documentElement.style.setProperty("--accent-glow", panel.dataset.glow!);
              }
            },
          });
        });
      }

      // Restore baseline colors when leaving the section bounds
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => {
          document.documentElement.style.setProperty("--accent", "oklch(0.82 0.22 155)");
          document.documentElement.style.setProperty("--accent-glow", "oklch(0.88 0.24 152 / 45%)");
        },
        onLeaveBack: () => {
          document.documentElement.style.setProperty("--accent", "oklch(0.82 0.22 155)");
          document.documentElement.style.setProperty("--accent-glow", "oklch(0.88 0.24 152 / 45%)");
        },
      });
    }, root);

    return () => ctx.revert();
  }, [localizedSkins]);

  return (
    <section ref={root} id="skins" className="relative overflow-hidden md:h-screen w-full">
      <div className="absolute top-0 left-0 right-0 z-20 mx-auto max-w-7xl px-6 md:px-12 pt-16 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-6">
            <span className="section-label accent-text">04</span>
            <span className="section-label">{t.skins.label}</span>
          </div>
          {/* Progress Indicator */}
          <div className="hidden md:flex flex-col items-end gap-2 font-mono" data-skins-progress-container>
            <span className="text-xs tracking-widest text-bone/60" data-skins-progress-text>
              01 / 0{localizedSkins.length}
            </span>
            <div className="h-[2px] w-32 bg-white/10 overflow-hidden relative">
              <div 
                className="absolute inset-0 bg-[color:var(--accent)] origin-left scale-x-0 transition-colors duration-500" 
                data-skins-progress-bar
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="flex flex-col md:flex-row md:h-screen md:w-max md:flex-nowrap"
      >
        {localizedSkins.map((s, i) => (
          <article
            key={s.name}
            data-skin-panel
            data-accent={s.accent}
            data-glow={s.accentGlow}
            className="relative flex min-h-screen w-full shrink-0 flex-col justify-center p-8 md:h-screen md:w-screen md:p-16"
            role="region"
            aria-label={`Skin ${i + 1}: ${s.name}`}
          >
            {/* Split Screen layout to prevent character cropping */}
            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              
              {/* Left text column */}
              <div className="md:col-span-5 flex flex-col justify-center text-left pt-16 md:pt-0">
                <span className="section-label opacity-90 text-bone drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  0{i + 1} / 0{localizedSkins.length}
                </span>
                <h3 className="display mt-4 text-5xl md:text-7xl lg:text-8xl text-bone drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] select-none">
                  {s.name}
                </h3>
                <p className="mt-4 text-base md:text-lg lg:text-xl text-bone/90 max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] select-none">
                  {s.tag}
                </p>
              </div>

              {/* Right framed image column (2:3 aspect ratio) */}
              <div className="md:col-span-7 flex justify-center items-center w-full">
                <div
                  className="relative aspect-[2/3] h-[50vh] md:h-[65vh] lg:h-[70vh] max-h-[720px] w-full max-w-[450px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
                  style={{
                    background: s.gradient,
                    boxShadow: `0 30px 100px -20px ${s.accentGlow}, 0 0 40px -10px ${s.accentGlow}`,
                  }}
                >
                  {s.image ? (
                    <>
                      <img
                        data-skin-img
                        src={s.image.src}
                        alt={s.image.alt}
                        width={1472}
                        height={2208}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-y-0 h-full w-[118%] -left-[9%] max-w-none object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-[1.12]"
                        style={{ objectPosition: s.objectPosition || "center center" }}
                      />
                      {/* Scrim Overlay */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent pointer-events-none"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </>
                  ) : (
                    /* Abstract Neon Grid Stage for K/DA */
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 overflow-hidden bg-radial-gradient"
                      style={{
                        background: "radial-gradient(circle at center, oklch(0.20 0.12 300) 0%, oklch(0.08 0.05 310) 100%)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                          backgroundSize: "40px 40px",
                        }}
                      />
                      {/* Glowing core representing a spotlight */}
                      <div
                        className="absolute h-[60vw] w-[60vw] max-w-[350px] max-h-[350px] rounded-full opacity-40 blur-[80px] transition-colors duration-1000"
                        style={{ background: "var(--accent)" }}
                      />
                      <span
                        className="display text-6xl md:text-8xl leading-none text-bone/5 select-none tracking-widest uppercase"
                      >
                        {t.skins.stage}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

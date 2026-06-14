import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Smoke } from "./Smoke";
import { akaliImages } from "@/assets/akali";
import { useTranslation } from "@/lib/i18n";

export function Hero({ isParentLoaded }: { isParentLoaded: boolean }) {
  const root = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isParentLoaded || !root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero-word] span span", { yPercent: 0 });
        gsap.set("[data-hero-tag]", { opacity: 1, y: 0 });
        gsap.set("[data-hero-meta]", { opacity: 1, y: 0 });
        gsap.set(lineRef.current, { scaleX: 1 });
        return;
      }

      const tl = gsap.timeline();

      // Neon line draw slash
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: "power4.inOut", transformOrigin: "left center" }
      );

      // Flash neon glow expansion at slash contact/completion
      tl.fromTo(
        lineRef.current,
        { boxShadow: "0 0 8px var(--accent-glow)" },
        {
          boxShadow: "0 0 28px var(--accent-glow), 0 0 45px var(--accent)",
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        },
        "-=0.15"
      );

      // Title characters mask slide-up
      tl.fromTo(
        "[data-hero-word] span span",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.08 },
        "-=0.4"
      );

      // Tagline reveal
      tl.fromTo(
        "[data-hero-tag]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "-=0.7"
      );

      // Meta text items stagger
      tl.fromTo(
        "[data-hero-meta]",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.08 },
        "-=0.6"
      );

      // Continuous drift of scroll cue
      gsap.to("[data-hero-cue]", {
        y: 6,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });



      // Background Parallax
      gsap.fromTo(
        bgRef.current,
        { yPercent: -5 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [isParentLoaded]);

  const letters = "AKALI".split("");

  return (
    <section
      ref={root}
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col justify-between z-0"
    >
      {/* Background Image with Parallax & Scrim (split desktop layout to prevent portrait image stretching) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Solid dark backdrop */}
        <div className="absolute inset-0 bg-background" />

        {/* Floating portrait image on the right */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[55%] lg:w-[48%] h-full overflow-hidden">
          <img
            ref={bgRef}
            src={akaliImages.base.src}
            alt={akaliImages.base.alt}
            width={1215}
            height={1800}
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 h-[120%] w-full object-cover opacity-90 select-none pointer-events-none"
            style={{ objectPosition: "center 12%" }}
          />
          {/* Contrast scrim on the image layer */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Horizontal smooth fade from left to right (desktop only) */}
        <div
          className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-background via-background/70 to-transparent hidden md:block"
          aria-hidden="true"
        />

        {/* Vertical fade and vignette overlays for mobile */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent md:hidden"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.10_0.012_160_/_92%)_100%)]"
          aria-hidden="true"
        />
      </div>

      <Smoke className="opacity-40" />

      {/* Kanji backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="display text-[42vw] leading-none accent-text opacity-[0.04] kanji-glow">
          忍
        </span>
      </div>

      {/* Main Content wrapper (z-10 layer) */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-6 pt-24 pb-12 md:px-12">
        <header className="flex items-center justify-between">
          <span className="section-label">{t.hero.sub}</span>
          <span className="section-label">{t.hero.level}</span>
        </header>

        <div className="flex flex-col items-start gap-6 w-full max-w-3xl">
          <h1 data-hero-word className="display text-[clamp(5rem,18vw,18rem)] leading-[0.85] text-bone select-none">
            {letters.map((l, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="inline-block translate-y-[110%]">{l}</span>
              </span>
            ))}
          </h1>

          {/* Thin neon blade-slash line */}
          <div
            ref={lineRef}
            className="h-[2px] w-full max-w-lg accent-bg rounded-full shadow-[0_0_12px_var(--accent-glow)] origin-left"
            style={{ transform: "scaleX(0)" }}
            aria-hidden="true"
          />

          <p data-hero-tag className="text-xl md:text-3xl text-foreground/90 max-w-2xl opacity-0">
            {t.hero.tagline}<span className="accent-text">{t.hero.taglineBold}</span>{t.hero.taglineEnd}
          </p>
        </div>

        <footer className="flex items-end justify-between">
          <div data-hero-meta className="section-label max-w-xs opacity-0">
            {t.hero.meta}
          </div>
          <div data-hero-cue className="section-label flex flex-col items-center gap-2">
            <span>{t.hero.scroll}</span>
            <span className="block h-8 w-px accent-bg" />
          </div>
        </footer>
      </div>
    </section>
  );
}

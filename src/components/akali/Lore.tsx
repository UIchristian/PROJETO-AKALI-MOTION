import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { akaliImages } from "@/assets/akali";

const beats = [
  "Once the Fist of Shadow within the Kinkou Order, sworn to balance the realms seen and unseen.",
  "She turned away from that doctrine to defend Ionia by her own deadly path — answering threats with steel, not philosophy.",
  "Twin kama at her hips. A fan of kunai at her back. Energy in place of mana. A storm that arrives before the thunder.",
];

export function Lore() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-lore-beat]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
      });
      gsap.to("[data-lore-bg]", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="lore" className="relative grain py-32 md:py-48 overflow-hidden">
      <div data-lore-bg aria-hidden className="absolute inset-0 -z-0">
        <img
          src={akaliImages.shadow.src}
          alt=""
          width={1472}
          height={2080}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-[120%] w-full object-cover object-center opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 30% 40%, transparent 0%, oklch(0.10 0.012 160 / 85%) 70%), linear-gradient(180deg, oklch(0.10 0.012 160 / 80%), oklch(0.10 0.012 160 / 95%))",
          }}
        />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 md:px-12">
        <div className="mb-16 flex items-baseline gap-6">
          <span className="section-label accent-text">02</span>
          <span className="section-label">Lore</span>
        </div>
        <h2 className="display text-5xl md:text-7xl mb-20 max-w-3xl">
          A shadow that <span className="accent-text">refused</span> its order.
        </h2>
        <div className="space-y-16 max-w-3xl">
          {beats.map((t, i) => (
            <p
              key={i}
              data-lore-beat
              className="text-xl md:text-2xl leading-relaxed text-foreground/85"
            >
              <span className="accent-text mr-3 font-mono text-sm align-middle">0{i + 1}</span>
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

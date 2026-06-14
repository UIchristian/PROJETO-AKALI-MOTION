import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ThreeDBackground } from "./ThreeDBackground";
import { akaliImages } from "@/assets/akali";
import { useTranslation } from "@/lib/i18n";

export function Lore() {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!root.current || !content.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Gentle parallax floating effect on the story image frame
      if (!reduced) {
        gsap.fromTo(
          bgRef.current,
          { y: 30 },
          {
            y: -30,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // If mobile or reduced motion, do not pin. Instead, fade elements in normally.
      if (reduced || isMobile) {
        gsap.utils.toArray<HTMLElement>("[data-lore-beat]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0.1, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 60%",
                scrub: true,
              },
            }
          );
        });
        return;
      }

      // Desktop Pinned Scroll-telling sequence
      const beatsElements = gsap.utils.toArray<HTMLElement>("[data-lore-beat]");
      
      // Set initial styles for absolute overlap animations
      gsap.set(beatsElements.slice(1), { opacity: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          pin: content.current,
          start: "top top",
          end: "+=1800",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // Reveal Sequence:
      // Beat 0 active -> fades out, slides up. Beat 1 slides up and fades in.
      tl.to(beatsElements[0], { opacity: 0, y: -30, duration: 1 }, "+=0.3");
      tl.to(beatsElements[1], { opacity: 1, y: 0, duration: 1 }, "<");

      // Beat 1 active -> fades out, slides up. Beat 2 slides up and fades in.
      tl.to(beatsElements[1], { opacity: 0, y: -30, duration: 1 }, "+=0.5");
      tl.to(beatsElements[2], { opacity: 1, y: 0, duration: 1 }, "<");

      // Hold last beat for a small scroll before releasing pin
      tl.to({}, { duration: 0.4 });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="lore"
      className="relative w-full overflow-hidden min-h-screen md:h-[250vh] z-0"
    >
      <div ref={content} className="relative md:h-screen w-full flex items-center z-10">
        {/* Dynamic 3D Motion Particle Field Background */}
        <ThreeDBackground />
        
        {/* Ambient fade overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/95 via-transparent to-background/95 pointer-events-none z-0"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-12 py-24 md:py-0 z-10">
          <div className="md:col-span-6 flex flex-col justify-center gap-8">
            <div>
              <div className="mb-6 flex items-baseline gap-6">
                <span className="section-label accent-text">02</span>
                <span className="section-label">{t.lore.label}</span>
              </div>
              <h2 className="display text-5xl md:text-7xl mb-6 leading-[0.9] text-bone select-none">
                {t.lore.title}<span className="accent-text">{t.lore.titleBold}</span>{t.lore.titleEnd}
              </h2>
            </div>

            {/* Complementary Artwork Frame with Scroll Parallax */}
            <div
              ref={bgRef}
              className="relative aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-xl border border-white/10 shadow-[0_10px_45px_rgba(0,0,0,0.8)] group select-none pointer-events-none hidden md:block"
            >
              <img
                src={akaliImages.story.src}
                alt={akaliImages.story.alt}
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>

          <div className="relative md:col-span-6 flex items-center min-h-[350px] md:min-h-[450px]">
            {/* Story beats container */}
            <div className="relative w-full md:absolute md:inset-0 md:flex md:flex-col md:justify-center">
              {t.lore.beats.map((textBeat, i) => (
                <div
                  key={i}
                  data-lore-beat
                  className="mb-10 md:mb-0 md:absolute md:left-0 md:right-0 text-xl md:text-2xl leading-relaxed text-bone/90"
                  style={{
                    // Fallback opacity for server-side rendering or non-JS
                    opacity: i === 0 ? 1 : 0.2,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span className="accent-text font-mono text-sm tracking-wider mt-1 select-none">
                      0{i + 1}
                    </span>
                    <p className="flex-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                      {textBeat}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

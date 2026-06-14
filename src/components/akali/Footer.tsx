import { useTranslation } from "@/lib/i18n";
import { gsap } from "gsap";

export function Footer() {
  const { t } = useTranslation();

  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.innerWidth < 768) return;

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const strength = 8;
    const targetX = (dx / rect.width) * strength;
    const targetY = (dy / rect.height) * strength;

    gsap.to(el, {
      x: targetX,
      y: targetY,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <footer className="relative border-t border-border py-20 z-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 flex items-baseline gap-6">
          <span className="section-label accent-text">05</span>
          <span className="section-label">{t.footer.label}</span>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="display text-4xl md:text-6xl max-w-xl text-bone">
              {t.footer.title}<span className="accent-text">{t.footer.titleBold}</span>
            </h3>
            <p className="mt-6 max-w-md text-sm text-muted-foreground leading-relaxed">
              {t.footer.disclaimer}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {t.footer.craftedBy}<span className="accent-text">Christian</span> · 2026 · <span className="text-muted-foreground/60">Built with React, GSAP and Lenis</span>
            </p>
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            <span className="section-label mb-2">{t.footer.linksLabel}</span>
            <a
              href="https://github.com/UIchristian/akali-blade-showcase"
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="group flex items-center justify-between border-b border-border py-2 transition-colors hover:accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              <span>GitHub</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </nav>
        </div>

        <div className="mt-20 flex items-center justify-between">
          <span className="display text-2xl accent-text">忍</span>
          <span className="section-label">© 2026</span>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { gsap } from "gsap";

export function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const { language, setLanguage, t } = useTranslation();

  useEffect(() => {
    const sections = ["hero", "lore", "abilities", "skins"];
    const handleScroll = () => {
      const midpoint = window.innerHeight * 0.4; // 40% threshold from the top
      let currentSection = "hero";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // The active section is the last one that has scrolled past the threshold
          if (rect.top <= midpoint) {
            currentSection = sectionId;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      target.scrollIntoView({ behavior: "auto" });
    } else {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
    setActiveSection(id);
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.innerWidth < 768) return;

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const strength = 5;
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

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const navLinks = [
    { id: "hero", label: t.navbar.overview },
    { id: "lore", label: t.navbar.lore },
    { id: "abilities", label: t.navbar.abilities },
    { id: "skins", label: t.navbar.skins },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-background/90 via-background/50 to-transparent backdrop-blur-[2px] py-4 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "hero")}
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
          className="display inline-block text-2xl tracking-wider text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
        >
          AKALI <span className="accent-text text-lg">忍</span>
        </a>
        <div className="flex items-center gap-6">
          <nav aria-label="Main Navigation">
            <ul className="flex items-center gap-6 md:gap-8 text-xs font-mono tracking-widest uppercase">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={handleMagneticLeave}
                    className={`relative inline-block py-2 text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded ${
                      activeSection === link.id ? "text-foreground" : ""
                    }`}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <span
                        className="absolute bottom-0 left-0 h-px w-full accent-bg"
                        style={{ boxShadow: "0 0 8px var(--accent-glow)" }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Language Switcher Toggle */}
          <div className="flex items-center gap-1 border-l border-border pl-6 h-4" role="group" aria-label="Language Selector">
            <button
              onClick={() => setLanguage("pt")}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className={`font-mono text-[10px] tracking-wider hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] rounded px-1 py-0.5 transition-colors ${
                language === "pt" ? "text-foreground font-semibold accent-text" : "text-foreground/40"
              }`}
              aria-label="Alterar idioma para Português"
            >
              PT
            </button>
            <span className="text-foreground/25 text-[9px] font-mono select-none">/</span>
            <button
              onClick={() => setLanguage("en")}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className={`font-mono text-[10px] tracking-wider hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] rounded px-1 py-0.5 transition-colors ${
                language === "en" ? "text-foreground font-semibold accent-text" : "text-foreground/40"
              }`}
              aria-label="Change language to English"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

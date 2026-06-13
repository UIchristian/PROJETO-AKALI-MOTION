export function Footer() {
  return (
    <footer className="relative grain border-t border-border py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 flex items-baseline gap-6">
          <span className="section-label accent-text">05</span>
          <span className="section-label">End · Credits</span>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="display text-4xl md:text-6xl max-w-xl">
              Balance is a <span className="accent-text">choice</span>.
            </h3>
            <p className="mt-6 max-w-md text-sm text-muted-foreground leading-relaxed">
              Fan-made project. Akali and League of Legends are property of Riot Games. This project
              is not affiliated with or endorsed by Riot Games.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Crafted by <span className="accent-text">Your Name</span> · 2026
            </p>
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            <span className="section-label mb-2">Elsewhere</span>
            {["GitHub", "Twitter / X", "Dribbble", "Email"].map((l) => (
              <a
                key={l}
                href="#"
                className="group flex items-center justify-between border-b border-border py-2 transition-colors hover:accent-text"
              >
                <span>{l}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            ))}
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

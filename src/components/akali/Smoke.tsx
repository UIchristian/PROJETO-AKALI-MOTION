export function Smoke({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute -inset-[20%] opacity-60 animate-[drift_28s_linear_infinite]"
        style={{
          background:
            "radial-gradient(60% 40% at 30% 50%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 60%), radial-gradient(50% 35% at 70% 60%, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -inset-[30%] opacity-40 animate-[drift2_42s_linear_infinite]"
        style={{
          background:
            "radial-gradient(40% 30% at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(45% 30% at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <style>{`
        @keyframes drift { 0%{transform:translate3d(0,0,0)} 50%{transform:translate3d(4%,-3%,0)} 100%{transform:translate3d(0,0,0)} }
        @keyframes drift2 { 0%{transform:translate3d(0,0,0)} 50%{transform:translate3d(-5%,4%,0)} 100%{transform:translate3d(0,0,0)} }
      `}</style>
    </div>
  );
}

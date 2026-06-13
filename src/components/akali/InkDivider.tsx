import { fx } from "@/assets/fx";

export function InkDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto h-12 w-full max-w-5xl opacity-60"
      style={{
        backgroundImage: `url(${fx.ink})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        transform: flip ? "scaleX(-1)" : undefined,
        filter: "invert(1) brightness(1.2)",
        mixBlendMode: "screen",
      }}
    />
  );
}

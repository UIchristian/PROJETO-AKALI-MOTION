import { useEffect, useRef } from "react";

export function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const xc = window.innerWidth / 2;
      const yc = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - xc) / xc;
      mouseRef.current.targetY = (e.clientY - yc) / yc;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 3D Particles Config
    const particleCount = 80;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      r: number;
      speed: number;
      color: string;
    }> = [];

    const focalLength = 320;
    const maxZ = 1000;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2500,
        y: (Math.random() - 0.5) * 2500,
        z: Math.random() * maxZ,
        r: Math.random() * 2 + 1.2,
        speed: Math.random() * 1.2 + 0.6,
        color: i % 4 === 0 
          ? "rgba(45, 212, 191, 0.45)" // teal/cyan
          : i % 3 === 0 
            ? "rgba(52, 211, 153, 0.35)" // emerald
            : "rgba(16, 185, 129, 0.25)", // green
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse coordinates for smooth lag-follow
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;

      const centerX = width / 2 + m.x * -70;
      const centerY = height / 2 + m.y * -70;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.z -= p.speed;

        if (p.z <= 0) {
          p.z = maxZ;
          p.x = (Math.random() - 0.5) * 2500;
          p.y = (Math.random() - 0.5) * 2500;
        }

        // 3D projection formulas
        const scale = focalLength / p.z;
        const px = centerX + p.x * scale;
        const py = centerY + p.y * scale;
        const size = p.r * scale;

        // Render only if within canvas bounds
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          // Opacity is higher when closer (smaller z)
          const depthOpacity = (1 - p.z / maxZ) * 0.85;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${depthOpacity})`);
          ctx.shadowBlur = size * 3;
          ctx.shadowColor = "rgba(45, 212, 191, 0.35)";
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0; // reset
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" 
      style={{ mixBlendMode: "screen" }}
    />
  );
}

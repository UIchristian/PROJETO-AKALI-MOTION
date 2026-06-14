import { useEffect, useRef } from "react";

export function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // 1. Return early if prefers-reduced-motion is active
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let logicWidth = canvas.offsetWidth;
    let logicHeight = canvas.offsetHeight;

    canvas.width = logicWidth * dpr;
    canvas.height = logicHeight * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      logicWidth = canvas.offsetWidth;
      logicHeight = canvas.offsetHeight;
      canvas.width = logicWidth * dpr;
      canvas.height = logicHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const xc = window.innerWidth / 2;
      const yc = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - xc) / xc;
      mouseRef.current.targetY = (e.clientY - yc) / yc;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Track visibility to pause drawing loop when offscreen or backgrounded
    let isCanvasVisible = true;
    let isTabVisible = true;
    let loopActive = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible) {
          startLoop();
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 2. Offscreen sprite rendering function
    const createParticleSprite = (colorStr: string) => {
      const spriteSize = 64; // sprite diameter
      const offscreen = document.createElement("canvas");
      offscreen.width = spriteSize;
      offscreen.height = spriteSize;
      const oCtx = offscreen.getContext("2d");
      if (oCtx) {
        const grad = oCtx.createRadialGradient(
          spriteSize / 2,
          spriteSize / 2,
          2,
          spriteSize / 2,
          spriteSize / 2,
          spriteSize / 2
        );
        const solidColor = colorStr.replace(/[\d.]+\)$/, "1.0)");
        const glowColor = colorStr.replace(/[\d.]+\)$/, "0.4)");
        const fadeColor = colorStr.replace(/[\d.]+\)$/, "0.0)");

        grad.addColorStop(0, solidColor);
        grad.addColorStop(0.15, solidColor);
        grad.addColorStop(0.4, glowColor);
        grad.addColorStop(1, fadeColor);

        oCtx.fillStyle = grad;
        oCtx.beginPath();
        oCtx.arc(spriteSize / 2, spriteSize / 2, spriteSize / 2, 0, Math.PI * 2);
        oCtx.fill();
      }
      return offscreen;
    };

    const baseColors = [
      "rgba(45, 212, 191, 1)", // teal/cyan
      "rgba(52, 211, 153, 1)", // emerald
      "rgba(16, 185, 129, 1)"  // green
    ];
    const sprites = baseColors.map(color => createParticleSprite(color));

    // 3D Particles Config
    const particleCount = 80;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      r: number;
      speed: number;
      sprite: HTMLCanvasElement;
    }> = [];

    const focalLength = 320;
    const maxZ = 1000;

    for (let i = 0; i < particleCount; i++) {
      const colorIdx = i % 4 === 0 ? 0 : i % 3 === 0 ? 1 : 2;
      particles.push({
        x: (Math.random() - 0.5) * 2500,
        y: (Math.random() - 0.5) * 2500,
        z: Math.random() * maxZ,
        r: Math.random() * 2 + 1.2,
        speed: Math.random() * 1.2 + 0.6,
        sprite: sprites[colorIdx],
      });
    }

    function startLoop() {
      if (!loopActive && isCanvasVisible && isTabVisible) {
        loopActive = true;
        animationId = requestAnimationFrame(loop);
      }
    }

    function loop() {
      if (!ctx) return;
      if (!isCanvasVisible || !isTabVisible) {
        loopActive = false;
        return;
      }

      // Clear scaled logic canvas area
      ctx.clearRect(0, 0, logicWidth, logicHeight);

      // Interpolate mouse coordinates for smooth lag-follow
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;

      const centerX = logicWidth / 2 + m.x * -70;
      const centerY = logicHeight / 2 + m.y * -70;

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
        if (px >= 0 && px <= logicWidth && py >= 0 && py <= logicHeight) {
          // Opacity is higher when closer (smaller z)
          const depthOpacity = (1 - p.z / maxZ) * 0.85;
          
          // Draw particle using the cached offscreen sprite
          const drawSize = size * 4;
          const dx = px - drawSize / 2;
          const dy = py - drawSize / 2;

          ctx.globalAlpha = depthOpacity;
          ctx.drawImage(p.sprite, dx, dy, drawSize, drawSize);
        }
      }
      ctx.globalAlpha = 1.0; // reset

      animationId = requestAnimationFrame(loop);
    }

    // Initial start
    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
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

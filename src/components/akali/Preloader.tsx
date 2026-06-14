import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { akaliImages } from "@/assets/akali";
import { fx } from "@/assets/fx";
import { useTranslation } from "@/lib/i18n";

const assetsToPreload = [
  akaliImages.base.src,
  akaliImages.shadow.src,
  akaliImages.bloodmoon.src,
  akaliImages.nurse.src,
  akaliImages.silverfang.src,
  akaliImages.infernal.src,
  akaliImages.kdaallout.src,
  akaliImages.starguardian.src,
  akaliImages.drx.src,
  akaliImages.coven.src,
  akaliImages.story.src,
  fx.smoke,
  fx.ink,
  fx.glow,
  fx.grain,
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(100);
      setIsDone(true);
      onComplete();
      return;
    }

    let loadedCount = 0;
    const totalAssets = assetsToPreload.length;

    if (totalAssets === 0) {
      setProgress(100);
      setIsDone(true);
      onComplete();
      return;
    }

    const onAssetLoaded = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / totalAssets) * 100);
      setProgress(percent);

      if (loadedCount === totalAssets) {
        setTimeout(() => {
          setIsDone(true);
        }, 300);
      }
    };

    assetsToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = onAssetLoaded;
      img.onerror = onAssetLoaded;
    });
  }, [onComplete]);

  useEffect(() => {
    if (isDone) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        onComplete();
        return;
      }

      const tl = gsap.timeline({
        onComplete: onComplete,
      });

      tl.to("#preloader-glow", {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: "power2.in",
      }).to("#preloader-root", {
        yPercent: -100,
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [isDone, onComplete]);

  return (
    <div
      id="preloader-root"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-bone"
      role="status"
      aria-live="polite"
      aria-label="Loading page contents"
    >
      <div id="preloader-glow" className="flex flex-col items-center gap-6">
        <span
          className="display text-8xl md:text-9xl accent-text kanji-glow select-none"
          style={{ animation: "pulse 2s infinite ease-in-out" }}
        >
          忍
        </span>
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-border">
            <div
              className="h-full accent-bg transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {t.preloader.loading} {progress}%
          </span>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

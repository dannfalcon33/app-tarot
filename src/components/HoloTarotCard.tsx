"use client";

import { useEffect, useRef } from "react";
import { createHoloCard, requestOrientationPermission } from "@kongyo2/cards-css";
import "@kongyo2/cards-css/styles.css";
import { REVERSO_PATH } from "@/data/tarotSpread";

interface HoloTarotCardProps {
  src: string;
  alt: string;
  backSrc?: string;
  width?: string;
  className?: string;
  activateOnClick?: boolean;
  showcase?: boolean;
}

/**
 * Componente de carta de tarot con el efecto parallax holográfico
 * "Reverse Leviathan" de @kongyo2/cards-css (effect: "reverse")
 * e imagen de reverso oficial (/tarot/reverse-universe.webp).
 */
export default function HoloTarotCard({
  src,
  alt,
  backSrc = REVERSO_PATH,
  width = "min(70vw, 320px)",
  className = "",
  activateOnClick = false,
  showcase = true,
}: HoloTarotCardProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = stageRef.current;
    if (!container) return;

    container.innerHTML = "";

    // Configuración exacta del preset "Reverse Leviathan" de kongyo2/cards-css con su reverso
    const card = createHoloCard({
      image: src,
      imageAlt: alt,
      back: backSrc,
      backAlt: "Reverso Universe Tarot",
      effect: "reverse",
      aspectRatio: 2 / 3,
      interactive: true,
      activateOnClick,
      showcase: showcase
        ? { delay: 350, duration: 2800, intensity: 18 }
        : false,
      physics: {
        parallax: 1.3,
        glareRange: 1.1,
        maxTilt: 18,
      },
      glare: {
        shape: "ellipse",
        size: "75% 60%",
        stops: [
          "hsla(190, 100%, 92%, 0.85) 0%",
          "hsla(210, 90%, 60%, 0.35) 45%",
          "hsla(0, 0%, 0%, 0.7) 100%",
        ],
      },
      depth: {
        strength: 14,
        perspective: 650,
        shadow: 0.45,
      },
      glow: "hsl(275, 95%, 76%)",
    });

    card.element.style.width = "100%";
    card.element.style.height = "100%";
    container.appendChild(card.element);

    const handlePointerDown = () => {
      void requestOrientationPermission();
    };
    container.addEventListener("pointerdown", handlePointerDown, {
      once: true,
    });

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      card.destroy();
      container.innerHTML = "";
    };
  }, [src, alt, backSrc, activateOnClick, showcase]);

  return (
    <div
      ref={stageRef}
      className={`relative select-none ${className}`}
      style={{
        width,
        aspectRatio: "2/3",
      }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import {
  createHoloCard,
  requestOrientationPermission,
  type HoloEffect,
} from "@kongyo2/cards-css";
import "@kongyo2/cards-css/styles.css";
import { REVERSO_PATH } from "@/data/tarotSpread";
import type { CardOrientation } from "@/types/tarot";

export interface HoloTarotCardProps {
  src: string;
  alt: string;
  backSrc?: string;
  width?: string;
  className?: string;
  activateOnClick?: boolean;
  showcase?: boolean;
  orientation?: CardOrientation;
  effect?: HoloEffect;
  interactive?: boolean;
  maxTilt?: number;
  parallax?: number;
  depthStrength?: number;
  glowColor?: string;
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
  orientation = "upright",
  effect = "reverse",
  interactive = true,
  maxTilt = 18,
  parallax = 1.3,
  depthStrength = 14,
  glowColor = "hsl(275, 95%, 76%)",
}: HoloTarotCardProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = stageRef.current;
    if (!container) return;

    container.innerHTML = "";

    const card = createHoloCard({
      image: src,
      imageAlt:
        orientation === "reversed" ? `${alt} (Invertida)` : alt,
      back: backSrc,
      backAlt: "Reverso Universe Tarot",
      effect,
      aspectRatio: 2 / 3,
      interactive,
      activateOnClick,
      showcase: showcase
        ? {
            delay: 350,
            duration: 2800,
            intensity: 18,
            respectReducedMotion: true,
          }
        : false,
      physics: {
        parallax,
        glareRange: 1.1,
        maxTilt,
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
        strength: depthStrength,
        perspective: 650,
        shadow: 0.45,
      },
      glow: glowColor,
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
  }, [
    src,
    alt,
    backSrc,
    activateOnClick,
    showcase,
    orientation,
    effect,
    interactive,
    maxTilt,
    parallax,
    depthStrength,
    glowColor,
  ]);

  return (
    <div
      ref={stageRef}
      className={`relative select-none ${
        orientation === "reversed" ? "holo-card--reversed" : ""
      } ${className}`}
      style={{
        width,
        aspectRatio: "2/3",
      }}
    />
  );
}

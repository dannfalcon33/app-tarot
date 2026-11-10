"use client";

import type { ReactNode } from "react";
import type { CardVisualState } from "@/types/tarot";

export interface TarotFlipProps {
  visualState: CardVisualState;
  showRevealFlash?: boolean;
  backContent: ReactNode;
  frontContent: ReactNode;
  className?: string;
}

/**
 * Contenedor 3D de rotación (180 grados en eje Y) para revelar una carta
 * desde su reverso oficial hasta su frente holográfico con destello cósmico,
 * sin interferir con el contexto perspective interno de @kongyo2/cards-css.
 */
export default function TarotFlip({
  visualState,
  showRevealFlash = false,
  backContent,
  frontContent,
  className = "",
}: TarotFlipProps) {
  const isFaceDown = visualState === "face_down";
  const isFlipping = visualState === "flipping";

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isFaceDown ? (
        <div className="relative w-full h-full">{backContent}</div>
      ) : (
        <div
          className={`relative w-full h-full ${
            isFlipping ? "animate-tarot-flip-3d" : ""
          }`}
        >
          {frontContent}
        </div>
      )}

      {/* Destello luminoso al completar el giro de revelación */}
      {showRevealFlash && (
        <div
          aria-hidden="true"
          className="absolute -inset-1.5 rounded-2xl pointer-events-none z-40 animate-card-reveal-flash"
          style={{
            background:
              "radial-gradient(circle, rgba(250,232,255,0.85) 0%, rgba(217,70,239,0.55) 42%, rgba(56,189,248,0.25) 70%, transparent 100%)",
            boxShadow: "0 0 36px rgba(217, 70, 239, 0.75)",
          }}
        />
      )}
    </div>
  );
}

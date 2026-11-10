"use client";

import Image from "next/image";
import { REVERSO_PATH } from "@/data/tarotSpread";
import type { CardTiltState } from "@/hooks/useCardAnimation";

export interface TarotCardBackProps {
  backSrc?: string;
  alt?: string;
  isSelected?: boolean;
  showRevealHint?: boolean;
  revealHintText?: string;
  tilt?: CardTiltState;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export default function TarotCardBack({
  backSrc = REVERSO_PATH,
  alt = "Reverso Universe Tarot",
  isSelected = false,
  showRevealHint = false,
  revealHintText = "Revelar",
  tilt,
  sizes = "(max-width: 640px) 128px, 176px",
  priority = false,
  className = "",
}: TarotCardBackProps) {
  const hasActiveTilt =
    tilt && (tilt.rotateX !== 0 || tilt.rotateY !== 0 || tilt.isPointerOver);

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden shadow-xl border-2 transition-all duration-200 select-none ${
        isSelected
          ? "border-fuchsia-400 shadow-fuchsia-500/35 ring-2 ring-fuchsia-400/50"
          : "border-purple-400/45 group-hover:border-purple-300/80 shadow-purple-950/60"
      } ${className}`}
      style={
        hasActiveTilt
          ? {
              transform: `perspective(700px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            }
          : undefined
      }
    >
      <Image
        src={backSrc}
        alt={alt}
        fill
        className="object-cover pointer-events-none"
        sizes={sizes}
        priority={priority}
      />

      {/* Reflejo dinámico del reverso al inclinar con mouse o táctil */}
      {tilt && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: tilt.isPointerOver ? 0.55 : 0,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(232, 121, 249, 0.45) 0%, rgba(56, 189, 248, 0.2) 38%, transparent 72%)`,
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Borde interior sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-1 rounded-lg border border-purple-200/20 pointer-events-none"
      />

      {showRevealHint && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-center p-2.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-100 bg-black/80 px-2.5 py-0.5 rounded-full border border-fuchsia-400/50 shadow">
            {revealHintText}
          </span>
        </div>
      )}
    </div>
  );
}


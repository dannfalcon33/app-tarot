"use client";

import Image from "next/image";
import type { HoloEffect } from "@kongyo2/cards-css";
import { REVERSO_PATH } from "@/data/tarotSpread";
import type { CardOrientation, CardVisualState } from "@/types/tarot";
import { useCardAnimation } from "@/hooks/useCardAnimation";
import HoloTarotCard from "@/components/HoloTarotCard";
import TarotCardBack from "./TarotCardBack";
import TarotFlip from "./TarotFlip";

export type TarotCardSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "compact"
  | "staff"
  | "normal"
  | "custom";

export type TarotCardVariant =
  | "table"
  | "inspector"
  | "showcase"
  | "thumbnail"
  | "preview";

export interface TarotCardProps {
  frontSrc: string;
  alt: string;
  backSrc?: string;
  isRevealed?: boolean;
  visualState?: CardVisualState;
  orientation?: CardOrientation;
  isSelected?: boolean;
  holoEffect?: HoloEffect;
  enableHolo?: boolean;
  showcase?: boolean;
  activateOnClick?: boolean;
  size?: TarotCardSize;
  width?: string;
  variant?: TarotCardVariant;
  positionNumber?: number;
  positionLabel?: string;
  cardName?: string;
  subtitle?: string;
  showNameplate?: boolean;
  showRevealHint?: boolean;
  isCrossed?: boolean;
  priority?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  onRevealComplete?: () => void;
}

const SIZE_CLASSES: Record<Exclude<TarotCardSize, "custom">, string> = {
  xs: "w-16 sm:w-20",
  sm: "w-24 sm:w-28",
  compact: "w-24 sm:w-28",
  staff: "w-28 sm:w-32 lg:w-28",
  normal: "w-28 sm:w-32 md:w-36",
  md: "w-32 sm:w-40",
  lg: "w-44 sm:w-56",
  xl: "w-56 sm:w-72",
};

/**
 * Componente reutilizable oficial de carta de Universe Tarot (Fase 2).
 * Admite frente, reverso, estado (face_down / flipping / face_up),
 * orientación (upright / reversed), selección, efectos holográficos 3D,
 * destello al revelar y accesibilidad por mouse, teclado y pantalla táctil.
 */
export default function TarotCard({
  frontSrc,
  alt,
  backSrc = REVERSO_PATH,
  isRevealed = true,
  visualState: visualStateProp,
  orientation = "upright",
  isSelected = false,
  holoEffect = "reverse",
  enableHolo = true,
  showcase = false,
  activateOnClick = false,
  size = "normal",
  width,
  variant = "table",
  positionNumber,
  positionLabel,
  cardName,
  subtitle,
  showNameplate = false,
  showRevealHint = true,
  isCrossed = false,
  priority = false,
  disabled = false,
  className = "",
  onClick,
  onRevealComplete,
}: TarotCardProps) {
  const {
    visualState,
    showRevealFlash,
    tilt,
    handlePointerMove,
    handlePointerLeave,
  } = useCardAnimation({
    isRevealed,
    visualStateOverride: visualStateProp,
    enableTilt: !disabled,
    onRevealComplete,
  });

  const isFaceUp = visualState === "face_up" || visualState === "flipping";
  const isInteractive = Boolean(onClick) && !disabled;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  const sizeClass = width
    ? ""
    : SIZE_CLASSES[size === "custom" ? "normal" : size];

  const ariaDescription = isFaceUp
    ? `${positionNumber ? `Posición #${positionNumber}${positionLabel ? ` (${positionLabel})` : ""}: ` : ""}${cardName || alt}${orientation === "reversed" ? " (Invertida)" : ""}`
    : `${positionNumber ? `Posición #${positionNumber}${positionLabel ? ` (${positionLabel})` : ""} — ` : ""}Carta cubierta. Pulsa para revelar.`;

  const renderFrontFace = () => {
    const useHoloEngine =
      enableHolo && variant !== "thumbnail" && holoEffect !== "none";

    return (
      <div
        className={`relative w-full h-full rounded-xl preserve-3d ${
          isSelected
            ? "ring-2 ring-fuchsia-400/80 shadow-lg shadow-fuchsia-500/30"
            : "shadow-xl"
        }`}
      >
        {useHoloEngine ? (
          <HoloTarotCard
            src={frontSrc}
            alt={alt}
            backSrc={backSrc}
            width="100%"
            activateOnClick={activateOnClick}
            showcase={showcase}
            orientation={orientation}
            effect={holoEffect}
            interactive={!disabled}
          />
        ) : (
          <div
            className="relative w-full h-full rounded-xl overflow-hidden border border-purple-300/40 bg-black/80"
            style={
              tilt.rotateX !== 0 || tilt.rotateY !== 0
                ? {
                    transform: `perspective(700px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  }
                : undefined
            }
          >
            <Image
              src={frontSrc}
              alt={
                orientation === "reversed" ? `${alt} (Invertida)` : alt
              }
              fill
              className={`object-cover transition-transform duration-300 ${
                orientation === "reversed" ? "rotate-180" : ""
              }`}
              sizes="(max-width: 640px) 128px, 220px"
              priority={priority}
            />
            {tilt.isPointerOver && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.35) 0%, rgba(217,70,239,0.18) 45%, transparent 75%)`,
                  mixBlendMode: "screen",
                }}
              />
            )}
          </div>
        )}

        {/* Insignia de orientación cuando la carta está invertida */}
        {orientation === "reversed" && variant !== "thumbnail" && (
          <div className="absolute top-1.5 right-1.5 z-30 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-400/60 text-[9px] font-bold uppercase tracking-wider text-amber-200 shadow">
              Invertida ↺
            </span>
          </div>
        )}

        {/* Placa inferior con el nombre del arcano */}
        {showNameplate && (cardName || alt) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-1.5 sm:p-2 text-center rounded-b-xl pointer-events-none z-30">
            {subtitle && (
              <p className="text-[9px] uppercase tracking-wider text-purple-300 font-semibold leading-tight truncate">
                {subtitle}
              </p>
            )}
            <p className="text-[10px] sm:text-xs font-bold text-white leading-tight truncate">
              {cardName || alt}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderBackFace = () => (
    <TarotCardBack
      backSrc={backSrc}
      alt={
        positionNumber
          ? `Carta #${positionNumber} oculta`
          : "Carta Universe Tarot cubierta"
      }
      isSelected={isSelected}
      showRevealHint={showRevealHint && isInteractive}
      tilt={tilt}
      priority={priority}
    />
  );

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaDescription}
      aria-pressed={isInteractive ? isSelected : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className={`flex flex-col items-center group select-none focus:outline-none ${
        isInteractive ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Etiqueta superior de posición (para mesa de Cruz Celta) */}
      {positionNumber !== undefined && (
        <div
          className={`mb-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide border transition-all flex items-center gap-1 ${
            isSelected
              ? "bg-fuchsia-600 border-white text-white shadow-md"
              : isFaceUp
                ? "bg-purple-900/75 border-purple-400/50 text-purple-100"
                : "bg-black/65 border-purple-500/30 text-purple-300 group-hover:text-white"
          }`}
        >
          <span>#{positionNumber}</span>
          {positionLabel && (
            <span className="truncate max-w-[92px]">{positionLabel}</span>
          )}
        </div>
      )}

      {/* Marco 3D de la carta con relación 2:3 */}
      <div
        className={`relative ${sizeClass} aspect-[2/3] transition-transform duration-300 ${
          isCrossed ? "sm:rotate-6 hover:rotate-0" : ""
        } ${
          isSelected
            ? "scale-105 z-20"
            : isInteractive
              ? "group-hover:scale-105 group-focus-visible:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-fuchsia-400 rounded-xl"
              : ""
        }`}
        style={width ? { width, aspectRatio: "2/3" } : undefined}
      >
        <TarotFlip
          visualState={visualState}
          showRevealFlash={showRevealFlash}
          backContent={renderBackFace()}
          frontContent={renderFrontFace()}
        />
      </div>
    </div>
  );
}


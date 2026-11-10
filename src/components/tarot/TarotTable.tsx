"use client";

import { useEffect } from "react";
import { CELTIC_CROSS_POSITIONS } from "@/data/tarotSpread";
import type { ReadingPhase, SessionSpreadCard } from "@/types/tarot";
import TarotCard from "./TarotCard";

export interface TarotTableProps {
  cards: SessionSpreadCard[];
  phase: ReadingPhase;
  selectedPosition: number;
  layoutMode: "celtic" | "grid";
  onSelectOrRevealCard: (positionNumber: number) => void;
  onDealComplete?: () => void;
}

/**
 * Mesa virtual interactiva de la Cruz Celta (Sprints 3.3 y 3.4).
 * Gestiona la animación escalonada de reparto (dealing) y la revelación 3D
 * de cada una de las 10 posiciones oficiales en desktop y móvil.
 */
export default function TarotTable({
  cards,
  phase,
  selectedPosition,
  layoutMode,
  onSelectOrRevealCard,
  onDealComplete,
}: TarotTableProps) {
  const isDealing = phase === "dealing";

  useEffect(() => {
    if (!isDealing || !onDealComplete) return;
    const totalDealDurationMs = 10 * 110 + 650;
    const timer = setTimeout(() => {
      onDealComplete();
    }, totalDealDurationMs);
    return () => clearTimeout(timer);
  }, [isDealing, onDealComplete]);

  const getSlotByPos = (pos: number) =>
    cards.find((s) => s.position === pos);

  const renderPositionSlot = (
    posNum: number,
    size: "normal" | "compact" | "staff" = "normal",
    isCrossed = false,
  ) => {
    const slot = getSlotByPos(posNum);
    if (!slot) return null;

    const posInfo = CELTIC_CROSS_POSITIONS.find(
      (p) => p.position === posNum,
    )!;

    const dealDelayMs = (posNum - 1) * 110;

    return (
      <div
        key={posNum}
        className={isDealing ? "animate-card-deal" : ""}
        style={
          isDealing
            ? {
                animationDelay: `${dealDelayMs}ms`,
              }
            : undefined
        }
      >
        <TarotCard
          frontSrc={slot.card.path}
          alt={slot.card.name}
          cardName={slot.card.name}
          isRevealed={slot.isRevealed}
          orientation={slot.orientation}
          isSelected={selectedPosition === posNum}
          positionNumber={posInfo.position}
          positionLabel={posInfo.shortLabel}
          showNameplate={true}
          showRevealHint={!isDealing}
          size={size}
          isCrossed={isCrossed}
          activateOnClick={false}
          showcase={false}
          variant="table"
          onClick={() => onSelectOrRevealCard(posNum)}
        />
      </div>
    );
  };

  return (
    <div className="bg-black/50 border border-purple-500/35 rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
      {isDealing && (
        <div className="rounded-2xl bg-purple-950/60 border border-fuchsia-400/40 px-4 py-2.5 flex items-center justify-between text-xs text-fuchsia-200 animate-pulse">
          <span>
            ✦ Distribuyendo las 10 cartas sobre las posiciones sagradas de la
            Cruz Celta...
          </span>
          <span className="font-bold">1 → 10</span>
        </div>
      )}

      {layoutMode === "celtic" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* SECCIÓN I: LA CRUZ CENTRAL (POSICIONES 1 A 6) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                I. La Cruz Central (Posiciones 1 a 6)
              </span>
              <span className="text-[11px] text-purple-300/70">
                Eje del Presente, Pasado y Futuro
              </span>
            </div>

            {/* Disposición Espacial en Cruz */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center justify-items-center py-2">
              {/* Fila Superior: Posición 5 (La Corona) */}
              <div className="hidden sm:block" />
              <div className="col-span-3 sm:col-span-1 flex justify-center">
                {renderPositionSlot(5, "normal")}
              </div>
              <div className="hidden sm:block" />

              {/* Fila Central: Posición 4 (Izquierda), Altar Central 1 y 2 (Centro), Posición 6 (Derecha) */}
              <div className="col-span-1 flex justify-center">
                {renderPositionSlot(4, "normal")}
              </div>

              {/* Núcleo Central: Cartas 1 (Presente) y 2 (El Desafío) */}
              <div className="col-span-1 bg-purple-950/35 border border-fuchsia-400/35 rounded-2xl p-2 sm:p-3 flex flex-col items-center gap-2 shadow-inner">
                <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-300 text-center">
                  Núcleo Central (1 y 2)
                </span>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  {renderPositionSlot(1, "compact", false)}
                  {renderPositionSlot(2, "compact", true)}
                </div>
              </div>

              <div className="col-span-1 flex justify-center">
                {renderPositionSlot(6, "normal")}
              </div>

              {/* Fila Inferior: Posición 3 (La Base) */}
              <div className="hidden sm:block" />
              <div className="col-span-3 sm:col-span-1 flex justify-center">
                {renderPositionSlot(3, "normal")}
              </div>
              <div className="hidden sm:block" />
            </div>
          </div>

          {/* SECCIÓN II: EL BASTÓN DEL DESTINO (POSICIONES 7 A 10) */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-purple-500/25 pt-5 lg:pt-0 lg:pl-5 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
                II. El Bastón (7 a 10)
              </span>
              <span className="text-[11px] text-purple-300/70">
                Ascenso al Desenlace
              </span>
            </div>

            {/* En móvil 2x2, en desktop columna vertical de 10 (arriba) a 7 (abajo) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3 justify-items-center">
              {[10, 9, 8, 7].map((posNum) =>
                renderPositionSlot(posNum, "staff"),
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VISTA EN CUADRÍCULA ORDENADA (1 AL 10) */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Las 10 Cartas de la Cruz Celta en Orden Secuencial (1 al 10)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center py-2">
            {cards.map((slot) => renderPositionSlot(slot.position, "normal"))}
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { CELTIC_CROSS_POSITIONS, REVERSO_PATH } from "@/data/tarotSpread";
import type { SessionSpreadCard } from "@/types/tarot";
import TarotCard from "@/components/tarot/TarotCard";

export interface CardInspectorProps {
  cards: SessionSpreadCard[];
  selectedPosition: number;
  revealedCount: number;
  canInterpret: boolean;
  isInterpreting: boolean;
  onSelectPosition: (positionNumber: number) => void;
  onRevealPosition: (positionNumber: number) => void;
  onRevealNext: () => void;
  onRequestInterpretation: () => void;
}

/**
 * Panel lateral sincronizado de inspección de carta y posición (Sprint 3.4).
 */
export default function CardInspector({
  cards,
  selectedPosition,
  revealedCount,
  canInterpret,
  isInterpreting,
  onSelectPosition,
  onRevealPosition,
  onRevealNext,
  onRequestInterpretation,
}: CardInspectorProps) {
  const getSlotByPos = (pos: number) =>
    cards.find((s) => s.position === pos);

  const activeSlot = getSlotByPos(selectedPosition);
  const activePosInfo =
    CELTIC_CROSS_POSITIONS.find((p) => p.position === selectedPosition) ||
    CELTIC_CROSS_POSITIONS[0];

  const isReversed = activeSlot?.orientation === "reversed";

  return (
    <aside className="bg-gradient-to-b from-purple-950/65 via-black/80 to-indigo-950/55 border border-purple-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl sticky top-22 space-y-5">
      {/* Navegador rápido de posiciones 1..10 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300/85">
            Posiciones de la Cruz Celta
          </span>
          <span className="text-[11px] text-fuchsia-300 font-semibold">
            {revealedCount}/10 reveladas
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {CELTIC_CROSS_POSITIONS.map((pos) => {
            const slotObj = getSlotByPos(pos.position);
            const isSelected = selectedPosition === pos.position;
            const isRevealed = slotObj?.isRevealed;
            return (
              <button
                key={pos.position}
                type="button"
                onClick={() => onSelectPosition(pos.position)}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 border-white text-white shadow-md scale-105"
                    : isRevealed
                      ? "bg-purple-900/50 border-purple-400/50 text-purple-100 hover:border-purple-300"
                      : "bg-black/40 border-purple-500/20 text-purple-300/60 hover:text-purple-200"
                }`}
              >
                <span>#{pos.position}</span>
                {isRevealed && (
                  <span className="text-[9px] text-fuchsia-300">✦</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Encabezado de la Posición */}
      <div className="border-t border-purple-500/25 pt-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-xl bg-purple-600/40 border border-purple-300/50 flex items-center justify-center text-base font-extrabold text-white shrink-0">
            #{activePosInfo.position}
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300 block">
              {activePosInfo.group === "cruz"
                ? "I · Cruz Central"
                : "II · El Bastón"}
            </span>
            <h2 className="text-xl font-bold text-white leading-tight">
              {activePosInfo.title}
            </h2>
            <p className="text-xs font-medium text-fuchsia-300">
              {activePosInfo.subtitle}
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-purple-200/85 leading-relaxed bg-purple-950/35 border border-purple-500/20 rounded-2xl p-3">
          {activePosInfo.description}
        </p>
      </div>

      {/* Estado de la Carta en esta Posición */}
      {activeSlot && activeSlot.isRevealed ? (
        <div className="border-t border-purple-500/25 pt-4 space-y-4 animate-fade-in">
          <div className="flex gap-4 items-center">
            <div className="shrink-0">
              <TarotCard
                frontSrc={activeSlot.card.path}
                alt={activeSlot.card.name}
                width="106px"
                isRevealed={true}
                orientation={activeSlot.orientation}
                activateOnClick={true}
                showcase={true}
                variant="inspector"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-200">
                  {activeSlot.card.categoryLabel}
                </span>
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isReversed
                      ? "bg-amber-950/80 border-amber-400/50 text-amber-200"
                      : "bg-emerald-950/70 border-emerald-400/40 text-emerald-200"
                  }`}
                >
                  {isReversed ? "Invertida ↺" : "Al Derecho ↑"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {activeSlot.card.name}
              </h3>
              <p className="text-xs text-purple-200/85 leading-relaxed">
                {activeSlot.card.description}
              </p>
            </div>
          </div>

          <div className="bg-black/50 border border-purple-400/30 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
              ✦ Significado en {activePosInfo.title}
            </h4>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed">
              {activeSlot.card.meaning}
            </p>
            {isReversed && (
              <p className="text-xs text-amber-200/90 border-t border-amber-500/20 pt-2 leading-relaxed">
                <strong>Matiz en orientación invertida:</strong> La energía de{" "}
                {activeSlot.card.name} actúa aquí de forma introspectiva, con
                resistencia interna o pidiendo desbloquear su flujo consciente
                antes de manifestarse plenamente.
              </p>
            )}
          </div>

          {revealedCount < 10 ? (
            <button
              type="button"
              onClick={onRevealNext}
              className="w-full bg-purple-900/70 hover:bg-purple-800/80 border border-purple-300/40 text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continuar Revelación ({revealedCount}/10)</span>
              <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onRequestInterpretation}
              disabled={!canInterpret || isInterpreting}
              className="w-full bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 hover:from-amber-400 hover:via-fuchsia-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-lg border border-amber-300/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>✦</span>
              <span>
                {isInterpreting
                  ? "Interpretando Tirada con IA..."
                  : "Interpretar las 10 Cartas con IA"}
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="border-t border-purple-500/25 pt-5 text-center space-y-4">
          <div className="flex justify-center">
            <TarotCard
              frontSrc={activeSlot?.card.path || REVERSO_PATH}
              alt={`Carta #${activePosInfo.position} oculta`}
              width="112px"
              isRevealed={false}
              onClick={() => onRevealPosition(activePosInfo.position)}
              variant="inspector"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Esta posición aún está cubierta
            </p>
            <p className="text-xs text-purple-300/80 mt-0.5">
              Haz clic para girar en 3D la carta #{activePosInfo.position} y
              descubrir su arcano.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRevealPosition(activePosInfo.position)}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-3 px-5 rounded-2xl text-sm shadow-lg transition-all cursor-pointer"
          >
            Revelar Carta #{activePosInfo.position} ({activePosInfo.shortLabel})
          </button>
        </div>
      )}
    </aside>
  );
}


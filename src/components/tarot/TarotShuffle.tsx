"use client";

import { useState, useEffect } from "react";
import TarotCardBack from "./TarotCardBack";

export interface TarotShuffleProps {
  question: string;
  categoryLabel: string;
  onCompleteShuffle: () => void;
}

const DECK_LAYERS = [0, 1, 2, 3, 4, 5, 6];

/**
 * Escenario interactivo de barajado del mazo de 78 cartas (Sprint 3.2).
 * Ejecuta la animación de mezcla con profundidad, rotaciones y desplazamientos
 * sin alterar el resultado lógico ya congelado en la sesión.
 */
export default function TarotShuffle({
  question,
  categoryLabel,
  onCompleteShuffle,
}: TarotShuffleProps) {
  const [shuffleStage, setShuffleStage] = useState<
    "ready" | "mixing" | "completed"
  >("mixing");
  const [mixProgress, setMixProgress] = useState<number>(0);

  useEffect(() => {
    if (shuffleStage !== "mixing") return;

    const interval = setInterval(() => {
      setMixProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 85);

    const doneTimer = setTimeout(() => {
      setShuffleStage("completed");
      setMixProgress(100);
    }, 1850);

    return () => {
      clearInterval(interval);
      clearTimeout(doneTimer);
    };
  }, [shuffleStage]);

  const handleRestartVisualMix = () => {
    setMixProgress(0);
    setShuffleStage("mixing");
  };

  return (
    <section className="bg-black/55 border border-purple-500/35 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center space-y-8 animate-fade-in">
      {/* Encabezado del Ritual */}
      <div className="max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/60 border border-fuchsia-400/40 text-xs font-semibold text-fuchsia-200">
          <span>✦</span>
          <span>Etapa del Ritual · Barajado del Mazo de 78 Arcanos</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {shuffleStage === "mixing"
            ? "Entrelazando tu intención con los 78 Arcanos..."
            : "Mazo Consagrado · Tus 10 Cartas están Listas"}
        </h2>

        <p className="text-xs sm:text-sm text-purple-200/85 max-w-xl mx-auto leading-relaxed">
          Enfoque: <strong className="text-white">{categoryLabel}</strong> ·
          Pregunta guía: <span className="italic text-purple-100">“{question}”</span>
        </p>
      </div>

      {/* Escenario 3D del Mazo */}
      <div className="relative h-64 sm:h-72 flex items-center justify-center perspective-1000">
        {/* Halo cósmico de fondo */}
        <div
          aria-hidden="true"
          className={`absolute w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            shuffleStage === "completed"
              ? "bg-gradient-to-tr from-amber-500/35 via-fuchsia-500/35 to-cyan-400/30 scale-110"
              : "bg-gradient-to-tr from-purple-600/35 via-fuchsia-600/25 to-indigo-600/30"
          }`}
        />

        {/* Pila de cartas en 3D */}
        <div className="relative w-36 sm:w-40 aspect-[2/3] preserve-3d">
          {DECK_LAYERS.map((layerIdx) => {
            const isLeftWave = layerIdx % 2 === 0;
            const offsetZ = -layerIdx * 4;
            const offsetY = -layerIdx * 2;
            const offsetX = (layerIdx - 3) * 2;

            const animClass =
              shuffleStage === "mixing"
                ? isLeftWave
                  ? "animate-shuffle-left"
                  : "animate-shuffle-right"
                : "";

            return (
              <div
                key={layerIdx}
                className={`absolute inset-0 transition-transform duration-500 ${animClass}`}
                style={{
                  transform:
                    shuffleStage === "completed"
                      ? `translate3d(${offsetX}px, ${offsetY}px, ${offsetZ}px)`
                      : undefined,
                  animationDelay: `${layerIdx * 90}ms`,
                  zIndex: DECK_LAYERS.length - layerIdx,
                }}
              >
                <TarotCardBack
                  isSelected={shuffleStage === "completed" && layerIdx === 0}
                  sizes="160px"
                  priority={layerIdx === 0}
                />
              </div>
            );
          })}

          {/* Sello luminoso de finalización */}
          {shuffleStage === "completed" && (
            <div className="absolute -top-3 -right-3 z-30 w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-fuchsia-600 border-2 border-white flex items-center justify-center text-white font-extrabold text-sm shadow-lg animate-bounce">
              ✦
            </div>
          )}
        </div>
      </div>

      {/* Barra de estado del barajado y controles */}
      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span>
              {shuffleStage === "mixing"
                ? "Mezclando mediante algoritmo Fisher-Yates..."
                : "✦ 10 posiciones de Cruz Celta fijadas"}
            </span>
            <span className="font-bold text-fuchsia-300">{mixProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-purple-950/80 border border-purple-500/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 transition-all duration-150"
              style={{ width: `${mixProgress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCompleteShuffle}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white font-bold py-3.5 px-7 rounded-2xl text-sm sm:text-base shadow-xl shadow-fuchsia-600/30 border border-purple-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>✦</span>
            <span>
              {shuffleStage === "completed"
                ? "Distribuir las 10 Cartas en la Mesa →"
                : "Cortar Mazo y Distribuir Ahora →"}
            </span>
          </button>

          {shuffleStage === "completed" && (
            <button
              type="button"
              onClick={handleRestartVisualMix}
              className="w-full sm:w-auto bg-purple-950/50 hover:bg-purple-900/60 border border-purple-400/35 text-purple-200 hover:text-white font-semibold py-3.5 px-5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
            >
              Repetir Animación
            </button>
          )}
        </div>
      </div>
    </section>
  );
}


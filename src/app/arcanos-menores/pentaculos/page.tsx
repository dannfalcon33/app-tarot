"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MINOR_ARCANA_PENTACULOS } from "@/data/minorArcana";

export default function PentaculosMinorArcanaPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = MINOR_ARCANA_PENTACULOS[currentIndex];

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MINOR_ARCANA_PENTACULOS.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? MINOR_ARCANA_PENTACULOS.length - 1 : prev - 1
    );
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-sm text-purple-200 hover:text-white underline"
        >
          ← Volver al inicio
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-3 drop-shadow-lg">
          Arcanos Menores de Pentáculos
        </h1>
        <p className="text-center text-purple-200 mb-8 max-w-2xl mx-auto">
          Explora los Arcanos Menores de Pentáculos, relacionados con lo
          material, el cuerpo y los recursos. Usa las flechas o selecciona una
          carta para ver su imagen, descripción y significado.
        </p>

        <div className="flex flex-col items-center gap-8">
          {/* Carrusel principal */}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={goPrev}
                className="rounded-full bg-black/40 border border-purple-500/60 text-white w-10 h-10 flex items-center justify-center hover:bg-purple-700/70 transition-colors"
                aria-label="Carta anterior"
              >
                ‹
              </button>

              <div
                className="relative rounded-xl overflow-hidden shadow-2xl border border-purple-500/50 bg-black/40"
                style={{
                  width: "min(70vw, 320px)",
                  aspectRatio: "2/3",
                }}
              >
                <Image
                  src={currentCard.path}
                  alt={currentCard.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 70vw, 320px"
                />
              </div>

              <button
                onClick={goNext}
                className="rounded-full bg-black/40 border border-purple-500/60 text-white w-10 h-10 flex items-center justify-center hover:bg-purple-700/70 transition-colors"
                aria-label="Carta siguiente"
              >
                ›
              </button>
            </div>

            {/* Info de la carta */}
            <div className="max-w-2xl text-center text-purple-100 bg-black/40 border border-purple-500/40 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                {currentCard.name}
              </h2>
              <p className="text-sm uppercase tracking-widest text-purple-300 mb-4">
                Arcano Menor de Pentáculos {currentCard.id}
              </p>
              <p className="mb-4 text-base md:text-lg">
                {currentCard.description}
              </p>
              <div className="border-t border-purple-500/30 mt-2 pt-3">
                <h3 className="text-sm font-semibold text-purple-300 mb-1">
                  Significado:
                </h3>
                <p className="text-sm md:text-base">{currentCard.meaning}</p>
              </div>
            </div>
          </div>

          {/* Miniaturas para saltar entre cartas */}
          <div className="w-full max-w-4xl">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {MINOR_ARCANA_PENTACULOS.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => goToIndex(index)}
                  className={`relative rounded-lg overflow-hidden border transition-all duration-150 ${
                    index === currentIndex
                      ? "border-purple-400 ring-2 ring-purple-400/70 scale-105"
                      : "border-purple-500/40 hover:border-purple-300/80"
                  }`}
                  style={{
                    width: "64px",
                    height: "96px",
                  }}
                  aria-label={card.name}
                >
                  <Image
                    src={card.path}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

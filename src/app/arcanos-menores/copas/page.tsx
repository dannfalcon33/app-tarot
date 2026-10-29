"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MINOR_ARCANA_COPAS } from "@/data/minorArcana";
import HoloTarotCard from "@/components/HoloTarotCard";

export default function CopasMinorArcanaPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = MINOR_ARCANA_COPAS[currentIndex];

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MINOR_ARCANA_COPAS.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? MINOR_ARCANA_COPAS.length - 1 : prev - 1
    );
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-purple-200 hover:text-white bg-purple-950/50 border border-purple-500/35 px-4 py-2 rounded-full transition-colors cursor-pointer"
          >
            ← Volver a Universe Tarot
          </button>
          <button
            onClick={() => router.push("/lectura")}
            className="text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 px-4 py-2 rounded-full shadow-lg transition-all cursor-pointer"
          >
            Ir a Tirada Cruz Celta ✦
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-3 drop-shadow-lg">
          Arcanos Menores de Copas
        </h1>
        <p className="text-center text-purple-200 mb-8 max-w-2xl mx-auto">
          Explora los Arcanos Menores de Copas, vinculados a las emociones, el
          amor y la intuición. Pasa el cursor sobre la carta para ver su efecto
          holográfico 3D.
        </p>

        <div className="flex flex-col items-center gap-8">
          {/* Carrusel principal con efecto Reverse Leviathan */}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
              <button
                onClick={goPrev}
                className="rounded-full bg-black/40 border border-purple-500/60 text-white w-11 h-11 flex items-center justify-center hover:bg-purple-700/70 transition-colors cursor-pointer text-lg"
                aria-label="Carta anterior"
              >
                ‹
              </button>

              <HoloTarotCard
                src={currentCard.path}
                alt={currentCard.name}
                width="min(70vw, 320px)"
                activateOnClick={true}
                showcase={true}
              />

              <button
                onClick={goNext}
                className="rounded-full bg-black/40 border border-purple-500/60 text-white w-11 h-11 flex items-center justify-center hover:bg-purple-700/70 transition-colors cursor-pointer text-lg"
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
                Arcano Menor de Copas {currentCard.id}
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
              {MINOR_ARCANA_COPAS.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => goToIndex(index)}
                  className={`relative rounded-lg overflow-hidden border transition-all duration-150 cursor-pointer ${
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

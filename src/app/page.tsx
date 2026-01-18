"use client";

import { useState } from "react";
import Image from "next/image";
import MajorArcanaButton, {
  ArcanaNavButton,
} from "@/components/MajorArcanaButton";

// Función para barajar array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Lista completa de todas las cartas del tarot con sus rutas
interface TarotCard {
  path: string;
  name: string;
}

const ALL_TAROT_CARDS: TarotCard[] = [
  // Arcanos Mayores
  { path: "/tarot/Arcanos Mayores/1 El Mago.webp", name: "El Mago" },
  {
    path: "/tarot/Arcanos Mayores/2 La Alta Sacerdotiza.webp",
    name: "La Sacerdotisa",
  },
  {
    path: "/tarot/Arcanos Mayores/3 La Emperatriz.webp",
    name: "La Emperatriz",
  },
  { path: "/tarot/Arcanos Mayores/4 El Emperador.webp", name: "El Emperador" },
  { path: "/tarot/Arcanos Mayores/5 El Hierofante.webp", name: "El Papa" },
  {
    path: "/tarot/Arcanos Mayores/6 Los Enamorados.webp",
    name: "Los Enamorados",
  },
  { path: "/tarot/Arcanos Mayores/7 El Carro.webp", name: "El Carro" },
  { path: "/tarot/Arcanos Mayores/8 La Justicia.webp", name: "La Justicia" },
  { path: "/tarot/Arcanos Mayores/9 El Ermitano.webp", name: "El Ermitaño" },
  {
    path: "/tarot/Arcanos Mayores/10 La Rueda de la Fortuna.webp",
    name: "La Rueda de la Fortuna",
  },
  { path: "/tarot/Arcanos Mayores/11 La Fuerza.webp", name: "La Fuerza" },
  { path: "/tarot/Arcanos Mayores/12 El Colgado.webp", name: "El Colgado" },
  { path: "/tarot/Arcanos Mayores/13 La Muerte.webp", name: "La Muerte" },
  { path: "/tarot/Arcanos Mayores/14 La Templanza.webp", name: "La Templanza" },
  { path: "/tarot/Arcanos Mayores/15 El Diablo.webp", name: "El Diablo" },
  { path: "/tarot/Arcanos Mayores/16 La Torre.webp", name: "La Torre" },
  { path: "/tarot/Arcanos Mayores/17 La Estrella.webp", name: "La Estrella" },
  { path: "/tarot/Arcanos Mayores/18 La Luna.webp", name: "La Luna" },
  { path: "/tarot/Arcanos Mayores/19 El Sol.webp", name: "El Sol" },
  { path: "/tarot/Arcanos Mayores/20 El Juicio.webp", name: "El Juicio" },
  { path: "/tarot/Arcanos Mayores/21 El Mundo.webp", name: "El Mundo" },
  { path: "/tarot/Arcanos Mayores/0 El Loco.webp", name: "El Loco" },

  // Bastos
  { path: "/tarot/Bastos/As de Bastos.webp", name: "As de Bastos" },
  { path: "/tarot/Bastos/Dos de Bastos.webp", name: "Dos de Bastos" },
  { path: "/tarot/Bastos/Tres de Bastos.webp", name: "Tres de Bastos" },
  { path: "/tarot/Bastos/Cuatro de Bastos.webp", name: "Cuatro de Bastos" },
  { path: "/tarot/Bastos/Cinco de Bastos.webp", name: "Cinco de Bastos" },
  { path: "/tarot/Bastos/Seis de Bastos.webp", name: "Seis de Bastos" },
  { path: "/tarot/Bastos/Siete de Bastos.webp", name: "Siete de Bastos" },
  { path: "/tarot/Bastos/Ocho de Bastos.webp", name: "Ocho de Bastos" },
  { path: "/tarot/Bastos/Nueve de Bastos.webp", name: "Nueve de Bastos" },
  { path: "/tarot/Bastos/Diez de Bastos.webp", name: "Diez de Bastos" },
  { path: "/tarot/Bastos/Sota de Bastos.webp", name: "Sota de Bastos" },
  {
    path: "/tarot/Bastos/Caballero de Bastos.webp",
    name: "Caballero de Bastos",
  },
  { path: "/tarot/Bastos/Reina de Bastos.webp", name: "Reina de Bastos" },
  { path: "/tarot/Bastos/Rey de Bastos.webp", name: "Rey de Bastos" },

  // Copas
  { path: "/tarot/Copas/As de Copas.webp", name: "As de Copas" },
  { path: "/tarot/Copas/Dos de Copas.webp", name: "Dos de Copas" },
  { path: "/tarot/Copas/Tres de Copas.webp", name: "Tres de Copas" },
  { path: "/tarot/Copas/Cuatro de Copas.webp", name: "Cuatro de Copas" },
  { path: "/tarot/Copas/Cinco de Copas.webp", name: "Cinco de Copas" },
  { path: "/tarot/Copas/Seis de Copas.webp", name: "Seis de Copas" },
  { path: "/tarot/Copas/Siete de Copas.webp", name: "Siete de Copas" },
  { path: "/tarot/Copas/Ocho de Copas.webp", name: "Ocho de Copas" },
  { path: "/tarot/Copas/Nueve de Copas.webp", name: "Nueve de Copas" },
  { path: "/tarot/Copas/Diez de Copas.webp", name: "Diez de Copas" },
  { path: "/tarot/Copas/Sota de Copas.webp", name: "Sota de Copas" },
  { path: "/tarot/Copas/Caballero de Copas.webp", name: "Caballero de Copas" },
  { path: "/tarot/Copas/Reina de Copas.webp", name: "Reina de Copas" },
  { path: "/tarot/Copas/Rey de Copas.webp", name: "Rey de Copas" },

  // Espadas
  { path: "/tarot/Espadas/1 As de Espadas.webp", name: "As de Espadas" },
  { path: "/tarot/Espadas/2 Dos de Espadas.webp", name: "Dos de Espadas" },
  { path: "/tarot/Espadas/3 Tres de Espadas.webp", name: "Tres de Espadas" },
  {
    path: "/tarot/Espadas/4 Cuatro de Espadas.webp",
    name: "Cuatro de Espadas",
  },
  { path: "/tarot/Espadas/5 Cinco de Espadas.webp", name: "Cinco de Espadas" },
  { path: "/tarot/Espadas/6 Seis de Espada.webp", name: "Seis de Espadas" },
  { path: "/tarot/Espadas/7 Siete de Espadas.webp", name: "Siete de Espadas" },
  { path: "/tarot/Espadas/8 Ocho de Espadas.webp", name: "Ocho de Espadas" },
  { path: "/tarot/Espadas/9 Nueve de Espadas.webp", name: "Nueve de Espadas" },
  { path: "/tarot/Espadas/10 Diez de Espadas.webp", name: "Diez de Espadas" },
  { path: "/tarot/Espadas/Sota de Espadas.webp", name: "Sota de Espadas" },
  {
    path: "/tarot/Espadas/Caballero de Espadas.webp",
    name: "Caballero de Espadas",
  },
  { path: "/tarot/Espadas/Reina de Espadas.webp", name: "Reina de Espadas" },
  { path: "/tarot/Espadas/Rey de Espadas.webp", name: "Rey de Espadas" },

  // Pentáculos
  { path: "/tarot/Pentaculos/As de Pentaculos.webp", name: "As de Pentáculos" },
  {
    path: "/tarot/Pentaculos/Dos de Pentaculos.webp",
    name: "Dos de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Tres de Pentaculos.webp",
    name: "Tres de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Cuatro de Pentaculos.webp",
    name: "Cuatro de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Cinco de Pentaculos.webp",
    name: "Cinco de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Seis de Pentaculos.webp",
    name: "Seis de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Siete de Pentaculos.webp",
    name: "Siete de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Ocho de Pentaculos.webp",
    name: "Ocho de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Nueve de Pentaculos.webp",
    name: "Nueve de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Diez de Pentaculos.webp",
    name: "Diez de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Sota de Pentaculos.webp",
    name: "Sota de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Caballero de Pentaculos.webp",
    name: "Caballero de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Reina de Pentaculos.webp",
    name: "Reina de Pentáculos",
  },
  {
    path: "/tarot/Pentaculos/Rey de Pentáculos.webp",
    name: "Rey de Pentáculos",
  },
];

const REVERSO_PATH = "/tarot/reverso.webp";

interface CardState {
  card: TarotCard | null;
  isFlipped: boolean;
}

export default function Home() {
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startReading = () => {
    setHasStarted(true);
    dealNewCards();
  };

  const dealNewCards = () => {
    setIsShuffling(true);

    // Barajar todas las cartas
    const shuffled = shuffleArray(ALL_TAROT_CARDS);

    // Crear 12 posiciones de cartas (2 filas x 6 columnas), todas en reverso inicialmente
    const initialStates: CardState[] = Array.from(
      { length: 12 },
      (_, index) => ({
        card: shuffled[index],
        isFlipped: false,
      }),
    );

    // Animación de barajado con un pequeño delay
    setTimeout(() => {
      setCardStates(initialStates);
      setIsShuffling(false);
    }, 500);
  };

  const flipCard = (index: number) => {
    if (cardStates[index].isFlipped) return; // No permitir voltear cartas ya volteadas

    setCardStates((prev) => {
      const newStates = [...prev];
      newStates[index] = {
        ...newStates[index],
        isFlipped: true,
      };
      return newStates;
    });
  };

  const resetReading = () => {
    setCardStates([]);
    setHasStarted(false);
    setIsShuffling(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-2 drop-shadow-lg">
          Lectura de Tarot
        </h1>
        <p className="text-center text-purple-200 mb-6 text-lg">
          Haz clic en cada carta para revelarla.
        </p>

        {!hasStarted && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <button
                onClick={startReading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-7 rounded-full text-lg shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Iniciar Lectura
              </button>
              <MajorArcanaButton />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <ArcanaNavButton
                label="Ver Arcanos Menores de Pentáculos"
                href="/arcanos-menores/pentaculos"
              />
              <ArcanaNavButton
                label="Ver Arcanos Menores de Espadas"
                href="/arcanos-menores/espadas"
              />
              <ArcanaNavButton
                label="Ver Arcanos Menores de Copas"
                href="/arcanos-menores/copas"
              />
              <ArcanaNavButton
                label="Ver Arcanos Menores de Bastos"
                href="/arcanos-menores/bastos"
              />
            </div>
          </div>
        )}

        {hasStarted && (
          <>
            {isShuffling ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-300 mb-4"></div>
                  <p className="text-white text-xl">Barajando cartas...</p>
                </div>
              </div>
            ) : (
              <>
                {/* 12 cartas en layout responsive: 1 col ultra-móvil, 2 cols móvil, 3-4 cols tablets, 6 cols desktop */}
                <div className="grid max-[360px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 max-[360px]:gap-2 gap-3 sm:gap-4 md:gap-5 mb-8 px-2 md:px-4 justify-center">
                  {cardStates.map((cardState, index) => (
                    <div
                      key={index}
                      onClick={() => flipCard(index)}
                      className="relative cursor-pointer mx-auto"
                      style={{
                        width: "100%",
                        // Máximo ancho: casi pantalla completa en ultra-móvil; tope 160px en desktop
                        maxWidth: "min(90vw, 160px)",
                        aspectRatio: "2/3",
                        perspective: "1000px",
                      }}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-700"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: cardState.isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        }}
                      >
                        {/* Cara delantera (reverso) */}
                        <div
                          className="absolute inset-0 w-full h-full backface-hidden rounded-lg shadow-2xl overflow-hidden"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(0deg)",
                          }}
                        >
                          <Image
                            src={REVERSO_PATH}
                            alt="Reverso de carta"
                            fill
                            className="object-cover"
                            sizes="(max-width: 360px) 90vw, (max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 160px"
                          />
                        </div>

                        {/* Cara trasera (carta) */}
                        <div
                          className="absolute inset-0 w-full h-full backface-hidden rounded-lg shadow-2xl overflow-hidden"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          {cardState.card && (
                            <Image
                              src={cardState.card.path}
                              alt={cardState.card.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 360px) 90vw, (max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 160px"
                            />
                          )}
                          {/* Nombre de la carta al hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-end justify-center opacity-0 hover:opacity-100">
                            <p className="text-white text-xs md:text-sm font-bold mb-2 px-2 text-center">
                              {cardState.card?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetReading}
                    className="bg-black/40 border border-purple-500/60 hover:border-purple-300 text-purple-100 hover:text-white font-semibold py-3 px-6 rounded-full text-sm sm:text-base shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Volver
                  </button>
                  <button
                    onClick={dealNewCards}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Barajar de Nuevo
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

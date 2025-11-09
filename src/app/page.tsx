'use client';

import { useState } from 'react';
import Image from 'next/image';

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
  { path: '/tarot/Arcanos Mayores/arcano 1 el mago.png', name: 'El Mago' },
  { path: '/tarot/Arcanos Mayores/arcano 2 la sacerdotiza.png', name: 'La Sacerdotisa' },
  { path: '/tarot/Arcanos Mayores/arcano 3 la emperatriz.png', name: 'La Emperatriz' },
  { path: '/tarot/Arcanos Mayores/arcano 4 el emperador.png', name: 'El Emperador' },
  { path: '/tarot/Arcanos Mayores/arcano 5 el papa.png', name: 'El Papa' },
  { path: '/tarot/Arcanos Mayores/arcano 6 los enamorados.png', name: 'Los Enamorados' },
  { path: '/tarot/Arcanos Mayores/arcano 7 el carro.png', name: 'El Carro' },
  { path: '/tarot/Arcanos Mayores/arcano 8 la justicia.png', name: 'La Justicia' },
  { path: '/tarot/Arcanos Mayores/arcano 9 el hermitano.png', name: 'El Ermitaño' },
  { path: '/tarot/Arcanos Mayores/arcano 10 la rueda de la fortuna.png', name: 'La Rueda de la Fortuna' },
  { path: '/tarot/Arcanos Mayores/arcano 11 la fuerza.png', name: 'La Fuerza' },
  { path: '/tarot/Arcanos Mayores/arcano 12 el colgado.png', name: 'El Colgado' },
  { path: '/tarot/Arcanos Mayores/arcano 13 la muerte.png', name: 'La Muerte' },
  { path: '/tarot/Arcanos Mayores/arcano 14 la templanza.png', name: 'La Templanza' },
  { path: '/tarot/Arcanos Mayores/arcano 15 el diablo.png', name: 'El Diablo' },
  { path: '/tarot/Arcanos Mayores/arcano 16 la torre.png', name: 'La Torre' },
  { path: '/tarot/Arcanos Mayores/arcano 17 la estrella.png', name: 'La Estrella' },
  { path: '/tarot/Arcanos Mayores/arcano 18 la luna.png', name: 'La Luna' },
  { path: '/tarot/Arcanos Mayores/arcano 19 el sol.png', name: 'El Sol' },
  { path: '/tarot/Arcanos Mayores/arcano 20 el juicio.png', name: 'El Juicio' },
  { path: '/tarot/Arcanos Mayores/arcano 21 el mundo.png', name: 'El Mundo' },
  { path: '/tarot/Arcanos Mayores/arcano 22 el loco.png', name: 'El Loco' },
  
  // Bastos
  { path: '/tarot/Bastos/As de Bastos.png', name: 'As de Bastos' },
  { path: '/tarot/Bastos/Dos de Bastos.png', name: 'Dos de Bastos' },
  { path: '/tarot/Bastos/Tres de Bastos.png', name: 'Tres de Bastos' },
  { path: '/tarot/Bastos/Cuatro de Bastos.png', name: 'Cuatro de Bastos' },
  { path: '/tarot/Bastos/Cinco de Bastos.png', name: 'Cinco de Bastos' },
  { path: '/tarot/Bastos/Seis de Bastos.png', name: 'Seis de Bastos' },
  { path: '/tarot/Bastos/Siete de Bastos.png', name: 'Siete de Bastos' },
  { path: '/tarot/Bastos/Ocho de Bastos.png', name: 'Ocho de Bastos' },
  { path: '/tarot/Bastos/Nueve de Bastos.png', name: 'Nueve de Bastos' },
  { path: '/tarot/Bastos/Diez de Bastos.png', name: 'Diez de Bastos' },
  { path: '/tarot/Bastos/Sota de Bastos.png', name: 'Sota de Bastos' },
  { path: '/tarot/Bastos/Caballero de Bastos.png', name: 'Caballero de Bastos' },
  { path: '/tarot/Bastos/Reina de Bastos.png', name: 'Reina de Bastos' },
  { path: '/tarot/Bastos/Rey de Bastos.png', name: 'Rey de Bastos' },
  
  // Copas
  { path: '/tarot/Copas/As de Copas.png', name: 'As de Copas' },
  { path: '/tarot/Copas/Dos de Copas.png', name: 'Dos de Copas' },
  { path: '/tarot/Copas/Tres de Copas.png', name: 'Tres de Copas' },
  { path: '/tarot/Copas/Cuatro de Copas.png', name: 'Cuatro de Copas' },
  { path: '/tarot/Copas/Cinco de Copas.png', name: 'Cinco de Copas' },
  { path: '/tarot/Copas/Seis de Copas.png', name: 'Seis de Copas' },
  { path: '/tarot/Copas/Siete de Copas.png', name: 'Siete de Copas' },
  { path: '/tarot/Copas/Ocho de Copas.png', name: 'Ocho de Copas' },
  { path: '/tarot/Copas/Nueve de Copas.png', name: 'Nueve de Copas' },
  { path: '/tarot/Copas/Diez de Copas.png', name: 'Diez de Copas' },
  { path: '/tarot/Copas/Sota de Copas.png', name: 'Sota de Copas' },
  { path: '/tarot/Copas/Caballero de Copas.png', name: 'Caballero de Copas' },
  { path: '/tarot/Copas/Reina de Copas.png', name: 'Reina de Copas' },
  { path: '/tarot/Copas/Rey de Copas.png', name: 'Rey de Copas' },
  
  // Espadas
  { path: '/tarot/Espadas/1 As de Espadas.png', name: 'As de Espadas' },
  { path: '/tarot/Espadas/2 Dos de Espadas.png', name: 'Dos de Espadas' },
  { path: '/tarot/Espadas/3 Tres de Espadas.png', name: 'Tres de Espadas' },
  { path: '/tarot/Espadas/4 Cuatro de Espadas.png', name: 'Cuatro de Espadas' },
  { path: '/tarot/Espadas/5 Cinco de Espadas.png', name: 'Cinco de Espadas' },
  { path: '/tarot/Espadas/6 Seis de Espada.png', name: 'Seis de Espadas' },
  { path: '/tarot/Espadas/7 Siete de Espadas.png', name: 'Siete de Espadas' },
  { path: '/tarot/Espadas/8 Ocho de Espadas.png', name: 'Ocho de Espadas' },
  { path: '/tarot/Espadas/9 Nueve de Espadas.png', name: 'Nueve de Espadas' },
  { path: '/tarot/Espadas/10 Diez de Espadas.png', name: 'Diez de Espadas' },
  { path: '/tarot/Espadas/Sota de Espadas.png', name: 'Sota de Espadas' },
  { path: '/tarot/Espadas/Caballero de Espadas.png', name: 'Caballero de Espadas' },
  { path: '/tarot/Espadas/Reina de Espadas.png', name: 'Reina de Espadas' },
  { path: '/tarot/Espadas/Rey de Espadas.png', name: 'Rey de Espadas' },
  
  // Pentáculos
  { path: '/tarot/Pentaculos/As de Pentaculos.png', name: 'As de Pentáculos' },
  { path: '/tarot/Pentaculos/Dos de Pentaculos.png', name: 'Dos de Pentáculos' },
  { path: '/tarot/Pentaculos/Tres de Pentaculos.png', name: 'Tres de Pentáculos' },
  { path: '/tarot/Pentaculos/Cuatro de Pentaculos.png', name: 'Cuatro de Pentáculos' },
  { path: '/tarot/Pentaculos/Cinco de Pentaculos.png', name: 'Cinco de Pentáculos' },
  { path: '/tarot/Pentaculos/Seis de Pentaculos.png', name: 'Seis de Pentáculos' },
  { path: '/tarot/Pentaculos/Siete de Pentaculos.png', name: 'Siete de Pentáculos' },
  { path: '/tarot/Pentaculos/Ocho de Pentaculos.png', name: 'Ocho de Pentáculos' },
  { path: '/tarot/Pentaculos/Nueve de Pentaculos.png', name: 'Nueve de Pentáculos' },
  { path: '/tarot/Pentaculos/Diez de Pentaculos.png', name: 'Diez de Pentáculos' },
  { path: '/tarot/Pentaculos/Sota de Pentaculos.png', name: 'Sota de Pentáculos' },
  { path: '/tarot/Pentaculos/Caballero de Pentaculos.png', name: 'Caballero de Pentáculos' },
  { path: '/tarot/Pentaculos/Reina de Pentaculos.png', name: 'Reina de Pentáculos' },
  { path: '/tarot/Pentaculos/Rey de Pentáculos.png', name: 'Rey de Pentáculos' },
];

const REVERSO_PATH = '/tarot/reverso.png';

interface CardState {
  card: TarotCard | null;
  isFlipped: boolean;
}

export default function Home() {
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startReading = () => {
    setIsShuffling(true);
    setHasStarted(true);

    // Barajar todas las cartas
    const shuffled = shuffleArray(ALL_TAROT_CARDS);

    // Crear 12 posiciones de cartas (2 filas x 6 columnas), todas en reverso inicialmente
    const initialStates: CardState[] = Array.from({ length: 12 }, (_, index) => ({
      card: shuffled[index],
      isFlipped: false,
    }));

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
        <p className="text-center text-purple-200 mb-8 text-lg">
          Haz clic en cada carta para revelarla (2 filas x 6 cartas)
        </p>

        {!hasStarted ? (
          <div className="flex justify-center">
            <button
              onClick={startReading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Iniciar Lectura
            </button>
          </div>
        ) : (
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
                        width: '100%',
                        // Máximo ancho: casi pantalla completa en ultra-móvil; tope 160px en desktop
                        maxWidth: 'min(90vw, 160px)',
                        aspectRatio: '2/3',
                        perspective: '1000px',
                      }}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-700"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: cardState.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                      >
                        {/* Cara delantera (reverso) */}
                        <div
                          className="absolute inset-0 w-full h-full backface-hidden rounded-lg shadow-2xl overflow-hidden"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)',
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
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
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
                <div className="flex justify-center">
                  <button
                    onClick={resetReading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Nueva Lectura
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

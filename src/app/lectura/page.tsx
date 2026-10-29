"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ALL_TAROT_CARDS,
  CELTIC_CROSS_POSITIONS,
  CONSULTATION_TOPICS,
  REVERSO_PATH,
  shuffleDeck,
  UnifiedTarotCard,
} from "@/data/tarotSpread";
import type { InterpretResponseData } from "@/app/api/interpretar/route";

interface DealtCardSlot {
  position: number;
  card: UnifiedTarotCard;
  isFlipped: boolean;
}

// Renderiza negritas (**texto**) devueltas por la IA de forma limpia
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="text-fuchsia-200 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function TarotReadingContent() {
  const searchParams = useSearchParams();
  const initialTopicId = searchParams.get("tema") || "general";
  const initialQuery = (searchParams.get("consulta") || "").trim();

  const [topicId, setTopicId] = useState<string>(initialTopicId);
  const [question, setQuestion] = useState<string>(initialQuery);
  const [draftQuestion, setDraftQuestion] = useState<string>(initialQuery);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [hasConfirmedQuestion, setHasConfirmedQuestion] = useState<boolean>(
    initialQuery.length >= 5,
  );

  const [slots, setSlots] = useState<DealtCardSlot[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<number>(1);
  const [layoutMode, setLayoutMode] = useState<"celtic" | "grid">("celtic");

  // Estados para la interpretación con IA gratuita
  const [aiReading, setAiReading] = useState<InterpretResponseData | null>(
    null,
  );
  const [isInterpreting, setIsInterpreting] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiSectionRef = useRef<HTMLElement | null>(null);

  const activeTopic =
    CONSULTATION_TOPICS.find((t) => t.id === topicId) || CONSULTATION_TOPICS[0];

  // Barajar las 78 cartas una única vez al iniciar la consulta y repartir 10 para la Cruz Celta
  const dealCelticCrossOnce = useCallback(() => {
    setIsShuffling(true);
    setAiReading(null);
    setAiError(null);

    const shuffled = shuffleDeck(ALL_TAROT_CARDS);

    const newSlots: DealtCardSlot[] = CELTIC_CROSS_POSITIONS.map(
      (pos, idx) => ({
        position: pos.position,
        card: shuffled[idx],
        isFlipped: false,
      }),
    );

    setTimeout(() => {
      setSlots(newSlots);
      setIsShuffling(false);
      setSelectedPosition(1);
    }, 450);
  }, []);

  useEffect(() => {
    if (hasConfirmedQuestion && slots.length === 0) {
      dealCelticCrossOnce();
    }
  }, [hasConfirmedQuestion, slots.length, dealCelticCrossOnce]);

  const handleConfirmMandatoryQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftQuestion.trim();
    if (!trimmed || trimmed.length < 5) {
      setQuestionError(
        "Por favor, escribe tu pregunta o intención (mínimo 5 caracteres) para que la IA tenga un prompt guía claro y coherente.",
      );
      return;
    }
    setQuestionError(null);
    setQuestion(trimmed);
    setHasConfirmedQuestion(true);
  };

  // Voltear o seleccionar una carta por su posición (1 a 10)
  const handleCardClick = (positionNumber: number) => {
    if (isShuffling) return;

    setSelectedPosition(positionNumber);
    setSlots((prev) =>
      prev.map((slot) =>
        slot.position === positionNumber && !slot.isFlipped
          ? { ...slot, isFlipped: true }
          : slot,
      ),
    );
  };

  // Revelar la siguiente carta en orden (1 -> 10)
  const revealNextCard = () => {
    if (isShuffling) return;
    const nextUnflipped = slots.find((s) => !s.isFlipped);
    if (nextUnflipped) {
      handleCardClick(nextUnflipped.position);
    }
  };

  // Revelar las 10 cartas de golpe
  const revealAllCards = () => {
    if (isShuffling) return;
    setSlots((prev) => prev.map((s) => ({ ...s, isFlipped: true })));
  };

  // Solicitar interpretación completa de las 10 cartas a la API gratuita usando la pregunta guía obligatoria
  const handleInterpretSpread = async () => {
    if (isShuffling || isInterpreting || slots.length === 0) return;

    // Si aún hay cartas boca abajo, las revelamos todas para interpretar la Cruz Celta completa
    setSlots((prev) => prev.map((s) => ({ ...s, isFlipped: true })));
    setIsInterpreting(true);
    setAiError(null);

    setTimeout(() => {
      aiSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    try {
      const cardsPayload = slots.map((slot) => {
        const posInfo = CELTIC_CROSS_POSITIONS.find(
          (p) => p.position === slot.position,
        )!;
        return {
          position: slot.position,
          positionTitle: posInfo.title,
          positionSubtitle: posInfo.subtitle,
          cardName: slot.card.name,
          categoryLabel: slot.card.categoryLabel,
          description: slot.card.description,
          meaning: slot.card.meaning,
        };
      });

      const response = await fetch("/api/interpretar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          topicLabel: activeTopic.label,
          cards: cardsPayload,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al conectar con el oráculo.");
      }

      const data = (await response.json()) as InterpretResponseData;
      setAiReading(data);
    } catch {
      setAiError(
        "No se pudo obtener la interpretación en este instante. Intenta nuevamente.",
      );
    } finally {
      setIsInterpreting(false);
    }
  };

  const revealedCount = slots.filter((s) => s.isFlipped).length;
  const activeSlot = slots.find((s) => s.position === selectedPosition);
  const activePosInfo =
    CELTIC_CROSS_POSITIONS.find((p) => p.position === selectedPosition) ||
    CELTIC_CROSS_POSITIONS[0];

  const getSlotByPos = (pos: number) => slots.find((s) => s.position === pos);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* Barra superior de la sala de lectura */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-purple-500/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-purple-200 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/35 px-3.5 py-2 rounded-full transition-all"
            >
              <span>←</span>
              <span>Nueva Consulta</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-fuchsia-400">✦</span>
              <span className="font-bold text-white tracking-wide">
                Universe Tarot
              </span>
              <span className="text-xs text-purple-300/75">
                · Tirada de Cruz Celta (10 Cartas)
              </span>
            </div>
          </div>

          {/* Estado y botón de IA */}
          {hasConfirmedQuestion && (
            <div className="flex items-center gap-2.5">
              <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200">
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                <span>
                  Reveladas: <strong>{revealedCount}</strong> / 10
                </span>
              </div>

              <button
                onClick={handleInterpretSpread}
                disabled={isShuffling || isInterpreting}
                className="bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 hover:from-amber-400 hover:via-fuchsia-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg shadow-fuchsia-600/30 border border-amber-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>✦</span>
                <span>
                  {isInterpreting ? "Interpretando..." : "Interpretar con IA"}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {!hasConfirmedQuestion ? (
          /* Paso obligatorio si el usuario entró directo a /lectura sin escribir su pregunta */
          <section className="max-w-2xl mx-auto my-10 bg-black/60 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/40 text-xs font-semibold text-purple-200">
                ✦ Paso Obligatorio antes de Repartir
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Escribe tu Pregunta Guía para el Tarot
              </h1>
              <p className="text-sm text-purple-200/80">
                Para que el Oráculo de IA analice tu tirada de Cruz Celta con
                total coherencia, es indispensable definir primero tu pregunta o
                intención.
              </p>
            </div>

            <form
              onSubmit={handleConfirmMandatoryQuestion}
              noValidate
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2.5">
                  1. Selecciona el ámbito de tu consulta
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CONSULTATION_TOPICS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopicId(t.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        t.id === topicId
                          ? "bg-purple-600/40 border-purple-300 text-white"
                          : "bg-purple-950/35 border-purple-500/25 text-purple-200/80 hover:text-white"
                      }`}
                    >
                      <span>{t.icon}</span>
                      <span className="truncate">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="mandatory-question-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2"
                >
                  2. Escribe tu pregunta o intención{" "}
                  <span className="text-amber-300 font-bold">
                    (Obligatorio *)
                  </span>
                </label>
                <input
                  id="mandatory-question-input"
                  type="text"
                  required
                  value={draftQuestion}
                  onChange={(e) => {
                    setDraftQuestion(e.target.value);
                    if (questionError) setQuestionError(null);
                  }}
                  placeholder={activeTopic.promptPlaceholder}
                  className={`w-full rounded-2xl bg-purple-950/45 border px-4 py-3.5 text-sm sm:text-base text-white placeholder-purple-300/45 focus:outline-none focus:ring-2 transition-all ${
                    questionError
                      ? "border-amber-400 focus:border-amber-400 focus:ring-amber-400/30"
                      : "border-purple-500/40 focus:border-fuchsia-400 focus:ring-fuchsia-500/30"
                  }`}
                />
                {questionError && (
                  <p className="mt-2 text-xs sm:text-sm text-amber-300 font-medium">
                    ⚠ {questionError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-2xl text-base shadow-xl cursor-pointer transition-all"
              >
                Confirmar Pregunta y Generar mi Cruz Celta →
              </button>
            </form>
          </section>
        ) : (
          <>
            {/* Banner de Consulta Actual y Controles de Revelado */}
            <section className="bg-black/55 backdrop-blur-xl border border-purple-500/35 rounded-3xl p-5 sm:p-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Intención / Pregunta Guía Fijada */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/30 border border-purple-400/40 text-xs font-semibold text-purple-200">
                      <span>{activeTopic.icon}</span>
                      <span>{activeTopic.label}</span>
                    </span>
                    <span className="text-xs text-purple-300/75">
                      ✦ Prompt Guía activo para la IA
                    </span>
                  </div>

                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug">
                    “{question}”
                  </h1>
                </div>

                {/* Botones de Acción de la Tirada (Sin opción de barajar de nuevo) */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {revealedCount < 10 && (
                    <button
                      type="button"
                      onClick={revealNextCard}
                      disabled={isShuffling}
                      className="bg-purple-950/70 hover:bg-purple-900/80 border border-purple-400/40 text-purple-100 font-semibold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      Revelar #{revealedCount + 1}
                    </button>
                  )}

                  {revealedCount < 10 && (
                    <button
                      type="button"
                      onClick={revealAllCards}
                      disabled={isShuffling}
                      className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      Revelar Todas
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleInterpretSpread}
                    disabled={isShuffling || isInterpreting}
                    className="bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 hover:from-amber-400 hover:via-fuchsia-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-xl border border-amber-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>✦</span>
                    <span>
                      {isInterpreting
                        ? "Consultando IA..."
                        : aiReading
                          ? "Actualizar Lectura IA"
                          : "Interpretar Cruz Celta con IA"}
                    </span>
                  </button>

                  {/* Selector de Vista: Cruz Celta vs Cuadrícula */}
                  <div className="inline-flex rounded-2xl bg-purple-950/60 border border-purple-500/30 p-1">
                    <button
                      type="button"
                      onClick={() => setLayoutMode("celtic")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        layoutMode === "celtic"
                          ? "bg-purple-600 text-white shadow"
                          : "text-purple-300 hover:text-white"
                      }`}
                    >
                      Cruz Celta
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode("grid")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        layoutMode === "grid"
                          ? "bg-purple-600 text-white shadow"
                          : "text-purple-300 hover:text-white"
                      }`}
                    >
                      Orden 1–10
                    </button>
                  </div>
                </div>
              </div>

              {/* Barra de progreso sutil */}
              <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-purple-200/80">
                <span>
                  Haz clic en cada carta para revelarla o pulsa{" "}
                  <strong className="text-amber-200">
                    “Interpretar Cruz Celta con IA”
                  </strong>{" "}
                  para analizar tus 10 cartas junto con tu pregunta guía.
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 rounded-full bg-purple-950 overflow-hidden border border-purple-500/30">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-all duration-500"
                      style={{ width: `${(revealedCount / 10) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-white">
                    {revealedCount}/10
                  </span>
                </div>
              </div>
            </section>

            {/* TABLERO PRINCIPAL + PANEL DE INTERPRETACIÓN */}
            {isShuffling ? (
              <div className="min-h-[460px] flex flex-col items-center justify-center bg-black/40 border border-purple-500/25 rounded-3xl p-8 backdrop-blur-md">
                <div className="relative w-24 h-36 mb-6">
                  <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-purple-400 shadow-2xl animate-ping opacity-30" />
                  <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-fuchsia-400 shadow-2xl animate-bounce">
                    <Image
                      src={REVERSO_PATH}
                      alt="Preparando tirada"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Conectando tu Pregunta con las 78 Cartas...
                </h2>
                <p className="text-sm text-purple-200/80">
                  Disponiendo las 10 posiciones sagradas de tu Cruz Celta
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* COLUMNA IZQUIERDA (8 cols): TABLERO DE LA CRUZ CELTA O CUADRÍCULA */}
                <div className="xl:col-span-8 bg-black/45 border border-purple-500/30 rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
                  {layoutMode === "celtic" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* SECCIÓN I: LA CRUZ CENTRAL (POSICIONES 1 A 6) */}
                      <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                            I. La Cruz Central (Cartas 1 a 6)
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
                            <TarotSpreadCard
                              slot={getSlotByPos(5)}
                              isSelected={selectedPosition === 5}
                              onClick={() => handleCardClick(5)}
                              size="normal"
                            />
                          </div>
                          <div className="hidden sm:block" />

                          {/* Fila Central: Posición 4 (Izquierda), Altar Central 1 y 2 (Centro), Posición 6 (Derecha) */}
                          <div className="col-span-1 flex justify-center">
                            <TarotSpreadCard
                              slot={getSlotByPos(4)}
                              isSelected={selectedPosition === 4}
                              onClick={() => handleCardClick(4)}
                              size="normal"
                            />
                          </div>

                          {/* Núcleo Central: Cartas 1 (Presente) y 2 (Lo que Cruza / Desafío) */}
                          <div className="col-span-1 bg-purple-950/35 border border-fuchsia-400/35 rounded-2xl p-2 sm:p-3 flex flex-col items-center gap-2 shadow-inner">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-300 text-center">
                              Núcleo Central (1 y 2)
                            </span>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                              <TarotSpreadCard
                                slot={getSlotByPos(1)}
                                isSelected={selectedPosition === 1}
                                onClick={() => handleCardClick(1)}
                                size="compact"
                              />
                              <TarotSpreadCard
                                slot={getSlotByPos(2)}
                                isSelected={selectedPosition === 2}
                                onClick={() => handleCardClick(2)}
                                size="compact"
                                isCrossed
                              />
                            </div>
                          </div>

                          <div className="col-span-1 flex justify-center">
                            <TarotSpreadCard
                              slot={getSlotByPos(6)}
                              isSelected={selectedPosition === 6}
                              onClick={() => handleCardClick(6)}
                              size="normal"
                            />
                          </div>

                          {/* Fila Inferior: Posición 3 (La Base) */}
                          <div className="hidden sm:block" />
                          <div className="col-span-3 sm:col-span-1 flex justify-center">
                            <TarotSpreadCard
                              slot={getSlotByPos(3)}
                              isSelected={selectedPosition === 3}
                              onClick={() => handleCardClick(3)}
                              size="normal"
                            />
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
                          {[10, 9, 8, 7].map((posNum) => (
                            <TarotSpreadCard
                              key={posNum}
                              slot={getSlotByPos(posNum)}
                              isSelected={selectedPosition === posNum}
                              onClick={() => handleCardClick(posNum)}
                              size="staff"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* VISTA EN CUADRÍCULA ORDENADA (1 AL 10) */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                          Las 10 Cartas de la Cruz Celta en Orden Secuencial (1
                          al 10)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center py-2">
                        {slots.map((slot) => (
                          <TarotSpreadCard
                            key={slot.position}
                            slot={slot}
                            isSelected={selectedPosition === slot.position}
                            onClick={() => handleCardClick(slot.position)}
                            size="normal"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* COLUMNA DERECHA (4 cols): PANEL DE INTERPRETACIÓN DE LA POSICIÓN ACTIVA */}
                <aside className="xl:col-span-4 bg-gradient-to-b from-purple-950/65 via-black/75 to-indigo-950/50 border border-purple-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl sticky top-22 space-y-5">
                  {/* Navegador rápido de posiciones 1..10 */}
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-purple-300/80 mb-2">
                      Seleccionar Posición de la Cruz Celta
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {CELTIC_CROSS_POSITIONS.map((pos) => {
                        const slotObj = getSlotByPos(pos.position);
                        const isSelected = selectedPosition === pos.position;
                        const isRevealed = slotObj?.isFlipped;
                        return (
                          <button
                            key={pos.position}
                            type="button"
                            onClick={() => setSelectedPosition(pos.position)}
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
                              <span className="text-[9px] text-fuchsia-300">
                                ✦
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Encabezado de la Posición */}
                  <div className="border-t border-purple-500/25 pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-10 h-10 rounded-xl bg-purple-600/40 border border-purple-300/50 flex items-center justify-center text-base font-extrabold text-white">
                        #{activePosInfo.position}
                      </span>
                      <div>
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
                  {activeSlot && activeSlot.isFlipped ? (
                    <div className="border-t border-purple-500/25 pt-4 space-y-4 animate-fade-in">
                      <div className="flex gap-4 items-center">
                        <div className="relative w-24 aspect-[2/3] rounded-xl overflow-hidden border border-purple-300/50 shadow-xl shrink-0">
                          <Image
                            src={activeSlot.card.path}
                            alt={activeSlot.card.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div>
                          <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-200 mb-1">
                            {activeSlot.card.categoryLabel}
                          </span>
                          <h3 className="text-2xl font-extrabold text-white">
                            {activeSlot.card.name}
                          </h3>
                          <p className="text-xs text-purple-200/85 mt-1 leading-relaxed">
                            {activeSlot.card.description}
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/50 border border-purple-400/30 rounded-2xl p-4 space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
                          ✦ Significado Tradicional de la Carta
                        </h4>
                        <p className="text-sm text-purple-100/95 leading-relaxed">
                          {activeSlot.card.meaning}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleInterpretSpread}
                        disabled={isInterpreting}
                        className="w-full bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 hover:from-amber-400 hover:via-fuchsia-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-lg border border-amber-300/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>✦</span>
                        <span>
                          {isInterpreting
                            ? "Interpretando Tirada con IA..."
                            : "Interpretar las 10 Cartas con IA"}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-purple-500/25 pt-5 text-center space-y-4">
                      <div
                        onClick={() => handleCardClick(activePosInfo.position)}
                        className="relative w-28 aspect-[2/3] mx-auto rounded-2xl overflow-hidden border border-purple-400/50 shadow-xl cursor-pointer hover:scale-105 transition-transform animate-pulse-glow"
                      >
                        <Image
                          src={REVERSO_PATH}
                          alt="Carta oculta"
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Esta posición aún está cubierta
                        </p>
                        <p className="text-xs text-purple-300/80 mt-0.5">
                          Haz clic para voltear la carta #
                          {activePosInfo.position} y descubrir su arcano.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCardClick(activePosInfo.position)}
                        className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-3 px-5 rounded-2xl text-sm shadow-lg transition-all cursor-pointer"
                      >
                        Revelar Carta #{activePosInfo.position} (
                        {activePosInfo.shortLabel})
                      </button>
                    </div>
                  )}
                </aside>
              </div>
            )}

            {/* SECCIÓN DE INTERPRETACIÓN DE LA IA GRATUITA */}
            <section ref={aiSectionRef} className="scroll-mt-24">
              {isInterpreting && (
                <div className="bg-gradient-to-br from-purple-950/70 via-black/80 to-indigo-950/70 border border-fuchsia-400/50 rounded-3xl p-8 text-center space-y-4 shadow-2xl animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-fuchsia-500 to-purple-600 mx-auto flex items-center justify-center text-2xl text-white shadow-lg animate-spin">
                    ✦
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Consultando al Oráculo de Inteligencia Artificial...
                  </h2>
                  <p className="text-sm text-purple-200/85 max-w-xl mx-auto">
                    Analizando tu pregunta guía (“{question}”) junto con las 10
                    cartas de tu Cruz Celta para construir una respuesta
                    coherente.
                  </p>
                </div>
              )}

              {aiError && !isInterpreting && (
                <div className="bg-red-950/50 border border-red-400/40 rounded-3xl p-6 text-center space-y-3">
                  <p className="text-sm text-red-200">{aiError}</p>
                  <button
                    type="button"
                    onClick={handleInterpretSpread}
                    className="bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer"
                  >
                    Reintentar Interpretación
                  </button>
                </div>
              )}

              {aiReading && !isInterpreting && (
                <div className="bg-gradient-to-br from-purple-950/75 via-black/85 to-indigo-950/70 border-2 border-fuchsia-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/30 pb-5">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-300/40 text-amber-200 text-xs font-bold">
                          ✦ Lectura Completa del Oráculo IA
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-200">
                          {aiReading.provider} · {aiReading.model}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
                        Interpretación de tu Cruz Celta
                      </h2>
                      <p className="text-xs sm:text-sm text-purple-200/85">
                        Prompt Guía Analizado: <strong>“{question}”</strong> (
                        {activeTopic.label})
                      </p>
                    </div>

                    <Link
                      href="/"
                      className="self-start sm:self-auto bg-white/10 hover:bg-white/15 border border-purple-300/40 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5"
                    >
                      <span>←</span>
                      <span>Hacer Otra Consulta</span>
                    </Link>
                  </div>

                  {/* Visión General */}
                  <div className="bg-purple-950/40 border border-purple-400/35 rounded-2xl p-5 space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                      <span>✦</span>
                      <span>Diagnóstico Profundo y Sentido de tu Tirada</span>
                    </h3>
                    <p className="text-sm sm:text-base text-purple-100/95 leading-relaxed whitespace-pre-line">
                      {renderFormattedText(aiReading.summary)}
                    </p>
                  </div>

                  {/* Dos columnas para Cruz Central (1-6) y Bastón (7-10) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-black/45 border border-purple-500/30 rounded-2xl p-5 space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                        <span>I.</span>
                        <span>
                          Raíces, Bloqueos y Evolución (Cruz Central)
                        </span>
                      </h3>
                      <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed whitespace-pre-line">
                        {renderFormattedText(aiReading.cruzCentral)}
                      </p>
                    </div>

                    <div className="bg-black/45 border border-purple-500/30 rounded-2xl p-5 space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-fuchsia-300 flex items-center gap-2">
                        <span>II.</span>
                        <span>
                          Tu Actitud, Entorno y Desenlace (El Bastón)
                        </span>
                      </h3>
                      <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed whitespace-pre-line">
                        {renderFormattedText(aiReading.bastonDestino)}
                      </p>
                    </div>
                  </div>

                  {/* Consejo Final */}
                  <div className="bg-gradient-to-r from-fuchsia-950/50 via-purple-950/60 to-indigo-950/50 border border-fuchsia-400/40 rounded-2xl p-5 space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-fuchsia-200 flex items-center gap-2">
                      <span>☽</span>
                      <span>Guía Práctica y Camino de Acción</span>
                    </h3>
                    <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium whitespace-pre-line">
                      {renderFormattedText(aiReading.consejoFinal)}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* RESUMEN COMPLETO DE LAS CARTAS REVELADAS */}
            {revealedCount > 0 && !isShuffling && (
              <section className="bg-black/50 border border-purple-500/30 rounded-3xl p-5 sm:p-7 backdrop-blur-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400">
                      Detalle Carta por Carta
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      Cartas Reveladas en tu Mesa ({revealedCount} de 10)
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {revealedCount < 10 && (
                      <button
                        type="button"
                        onClick={revealAllCards}
                        className="text-xs font-semibold text-purple-200 hover:text-white bg-purple-900/50 border border-purple-400/40 px-4 py-2 rounded-full transition-all cursor-pointer"
                      >
                        Revelar las {10 - revealedCount} restantes
                      </button>
                    )}
                    {!aiReading && (
                      <button
                        type="button"
                        onClick={handleInterpretSpread}
                        disabled={isInterpreting}
                        className="text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-fuchsia-600 px-4 py-2 rounded-full shadow-md transition-all cursor-pointer"
                      >
                        ✦ Interpretar toda la Cruz Celta con IA
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slots
                    .filter((s) => s.isFlipped)
                    .map((slot) => {
                      const posInfo = CELTIC_CROSS_POSITIONS.find(
                        (p) => p.position === slot.position,
                      )!;
                      return (
                        <div
                          key={slot.position}
                          onClick={() => setSelectedPosition(slot.position)}
                          className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                            selectedPosition === slot.position
                              ? "bg-purple-900/35 border-fuchsia-400/60 shadow-lg"
                              : "bg-purple-950/20 border-purple-500/25 hover:border-purple-400/45"
                          }`}
                        >
                          <div className="relative w-16 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden border border-purple-300/40 shrink-0">
                            <Image
                              src={slot.card.path}
                              alt={slot.card.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-purple-600/40 text-purple-100">
                                #{posInfo.position} · {posInfo.title}
                              </span>
                              <span className="text-[11px] text-fuchsia-300">
                                {slot.card.categoryLabel}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-white">
                              {slot.card.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-purple-100/85 leading-relaxed">
                              {slot.card.meaning}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Pie de página compacto */}
      <footer className="border-t border-purple-500/20 bg-black/60 py-5 px-4 text-center text-xs text-purple-300/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            ✦ <strong>Universe Tarot</strong> — Motor de 78 Cartas, Cruz Celta e
            Interpretación con IA
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="hover:text-white underline">
              Volver a la Landing Page
            </Link>
            <Link
              href="/arcanos-mayores"
              className="hover:text-white underline"
            >
              Arcanos Mayores
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface TarotSpreadCardProps {
  slot?: DealtCardSlot;
  isSelected: boolean;
  onClick: () => void;
  size?: "normal" | "compact" | "staff";
  isCrossed?: boolean;
}

function TarotSpreadCard({
  slot,
  isSelected,
  onClick,
  size = "normal",
  isCrossed = false,
}: TarotSpreadCardProps) {
  if (!slot) return null;

  const posInfo = CELTIC_CROSS_POSITIONS.find(
    (p) => p.position === slot.position,
  )!;

  const sizeClasses =
    size === "compact"
      ? "w-24 sm:w-28"
      : size === "staff"
        ? "w-28 sm:w-32 lg:w-28"
        : "w-28 sm:w-32 md:w-36";

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center group cursor-pointer select-none"
    >
      {/* Etiqueta de Posición */}
      <div
        className={`mb-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide border transition-all flex items-center gap-1 ${
          isSelected
            ? "bg-fuchsia-600 border-white text-white shadow-md"
            : slot.isFlipped
              ? "bg-purple-900/70 border-purple-400/50 text-purple-100"
              : "bg-black/60 border-purple-500/30 text-purple-300 group-hover:text-white"
        }`}
      >
        <span>#{posInfo.position}</span>
        <span className="truncate max-w-[90px]">{posInfo.shortLabel}</span>
      </div>

      {/* Contenedor 3D de la Carta */}
      <div
        className={`relative ${sizeClasses} aspect-[2/3] transition-transform duration-300 ${
          isCrossed ? "sm:rotate-6 hover:rotate-0" : ""
        } ${isSelected ? "scale-105 z-20" : "group-hover:scale-105"}`}
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: slot.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Cara Delantera (Reverso) */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-xl border-2 transition-colors ${
              isSelected
                ? "border-fuchsia-400 shadow-fuchsia-500/30"
                : "border-purple-400/40 group-hover:border-purple-300"
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <Image
              src={REVERSO_PATH}
              alt={`Carta #${posInfo.position} oculta`}
              fill
              className="object-cover"
              sizes="144px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-100 bg-black/70 px-2 py-0.5 rounded-full border border-purple-400/40">
                Revelar
              </span>
            </div>
          </div>

          {/* Cara Trasera (Arcano Revelado) */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl border-2 ${
              isSelected
                ? "border-fuchsia-400 ring-2 ring-fuchsia-400/50"
                : "border-purple-300/60"
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <Image
              src={slot.card.path}
              alt={slot.card.name}
              fill
              className="object-cover"
              sizes="144px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-1.5 text-center">
              <p className="text-[10px] sm:text-xs font-bold text-white leading-tight truncate">
                {slot.card.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LecturaCruzCeltaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-purple-200">
          Preparando el altar de Universe Tarot...
        </div>
      }
    >
      <TarotReadingContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CELTIC_CROSS_POSITIONS,
  CONSULTATION_TOPICS,
  REVERSO_PATH,
} from "@/data/tarotSpread";
import { SupportedLocale } from "@/types/tarot";
import { useTarotSession } from "@/hooks/useTarotSession";
import ReadingProgress from "@/components/reading/ReadingProgress";
import TarotShuffle from "@/components/tarot/TarotShuffle";
import TarotTable from "@/components/tarot/TarotTable";
import CardInspector from "@/components/reading/CardInspector";
import ReadingResult from "@/components/reading/ReadingResult";
import Footer from "@/components/Footer";

const LOCALE_OPTIONS: { code: SupportedLocale; label: string }[] = [
  { code: "es", label: "Español (ES)" },
  { code: "en", label: "English (EN)" },
  { code: "pt", label: "Português (PT)" },
];

export interface TarotReadingRoomProps {
  routeSessionId?: string;
}

export function TarotReadingRoom({ routeSessionId }: TarotReadingRoomProps) {
  const searchParams = useSearchParams();
  const initialTopicId = searchParams.get("tema") || "general";
  const initialQuery = (searchParams.get("consulta") || "").trim();
  const rawLang = searchParams.get("lang");
  const initialLocale: SupportedLocale =
    rawLang === "en" || rawLang === "pt" ? rawLang : "es";
  const effectiveSessionId =
    routeSessionId || searchParams.get("sessionId") || undefined;

  const {
    session,
    isHydrated,
    sessionCorruptedOrMissing,
    selectedPosition,
    setSelectedPosition,
    revealedCount,
    canInterpret,
    interpretation,
    aiError,
    startNewSession,
    proceedToDealing,
    proceedToRevealing,
    selectOrRevealPosition,
    revealNextCard,
    revealAllCards,
    requestInterpretation,
    setSessionLocale,
  } = useTarotSession({
    routeSessionId: effectiveSessionId,
    initialCategory: initialTopicId,
    initialQuestion: initialQuery,
    initialLocale,
  });

  // Estados locales para el formulario de preparación (cuando se entra directo a /lectura)
  const [draftTopicId, setDraftTopicId] = useState<string>(initialTopicId);
  const [draftQuestion, setDraftQuestion] = useState<string>(initialQuery);
  const [draftLocale, setDraftLocale] =
    useState<SupportedLocale>(initialLocale);
  const [questionError, setQuestionError] = useState<string | null>(null);

  // Vista de la mesa virtual: Cruz Celta espacial vs Orden 1-10
  const [layoutMode, setLayoutMode] = useState<"celtic" | "grid">("celtic");

  const aiSectionRef = useRef<HTMLElement | null>(null);

  const draftTopicObj =
    CONSULTATION_TOPICS.find((t) => t.id === draftTopicId) ||
    CONSULTATION_TOPICS[0];

  const activeTopic =
    CONSULTATION_TOPICS.find((t) => t.id === session?.category) ||
    CONSULTATION_TOPICS[0];

  const handleConfirmMandatoryQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftQuestion.trim();
    if (!trimmed || trimmed.length < 5) {
      setQuestionError(
        "Por favor, escribe tu pregunta o intención (mínimo 5 caracteres) para iniciar el ritual y vincular el análisis de IA.",
      );
      return;
    }
    setQuestionError(null);
    startNewSession(draftTopicId, trimmed, draftLocale);
  };

  const handleInterpretSpread = async () => {
    setTimeout(() => {
      aiSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    await requestInterpretation();
  };

  const isInterpreting = session?.phase === "interpreting";

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* Barra superior de la sala de lectura */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/65 border-b border-purple-500/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-purple-200 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/35 px-3.5 py-2 rounded-full transition-all"
            >
              <span>←</span>
              <span>Nueva Consulta</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="relative w-7 h-10 rounded-md overflow-hidden border border-purple-300/60 shadow-md shrink-0">
                <Image
                  src={REVERSO_PATH}
                  alt="Universe Tarot Logo"
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </div>
              <span className="font-bold text-white tracking-wide">
                Universe Tarot
              </span>
              <span className="text-xs text-purple-300/75">
                · Mesa Ritual de Cruz Celta (10 Cartas)
              </span>
            </div>
          </div>

          {/* Indicador compacto de progreso e interpretación en cabecera */}
          {session && (
            <div className="flex items-center gap-2.5">
              <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200">
                <span
                  className={`w-2 h-2 rounded-full ${
                    revealedCount === 10
                      ? "bg-emerald-400"
                      : "bg-fuchsia-400 animate-pulse"
                  }`}
                />
                <span>
                  Reveladas: <strong>{revealedCount}</strong> / 10
                </span>
              </div>

              <button
                type="button"
                onClick={handleInterpretSpread}
                disabled={!canInterpret}
                title={
                  revealedCount < 10
                    ? `Revela las ${10 - revealedCount} cartas restantes para habilitar el Oráculo IA`
                    : "Interpretar Cruz Celta completa con IA"
                }
                className="bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 hover:from-amber-400 hover:via-fuchsia-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg shadow-fuchsia-600/30 border border-amber-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>✦</span>
                <span>
                  {isInterpreting
                    ? "Interpretando..."
                    : revealedCount < 10
                      ? `Revela 10/10 (${revealedCount}/10)`
                      : "Interpretar con IA"}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {!isHydrated ? (
          <div className="min-h-[420px] flex flex-col items-center justify-center bg-black/45 border border-purple-500/25 rounded-3xl p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-fuchsia-400 border-t-transparent animate-spin" />
            <p className="text-sm text-purple-200/85">
              Sincronizando la mesa ritual de Universe Tarot...
            </p>
          </div>
        ) : sessionCorruptedOrMissing && !session ? (
          /* Estado seguro ante sesión expirada, corrupta o inexistente */
          <section className="max-w-xl mx-auto my-10 bg-black/60 backdrop-blur-xl border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-300/40 text-xs font-semibold text-amber-200">
              ⚠ Sesión de Lectura Expirada o No Encontrada
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Esta mesa temporal ya no se encuentra activa
            </h1>
            <p className="text-sm text-purple-200/80 leading-relaxed">
              Por privacidad, las tiradas de Universe Tarot viven únicamente en
              la memoria temporal de tu navegador durante la sesión activa.
              Puedes iniciar una nueva consulta gratuita ahora mismo.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => startNewSession("general", "", "es")}
                className="hidden"
              />
              <Link
                href="/#consulta"
                className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-2xl text-sm shadow-xl transition-all"
              >
                Iniciar Nueva Lectura en Inicio →
              </Link>
              <Link
                href="/lectura"
                className="bg-white/10 hover:bg-white/15 border border-purple-400/35 text-purple-100 font-semibold py-3 px-5 rounded-2xl text-sm transition-all"
              >
                Configurar Pregunta Aquí
              </Link>
            </div>
          </section>
        ) : !session ? (
          /* Fase PREPARING: Paso obligatorio si el usuario entró directo a /lectura sin sesión previa */
          <section className="max-w-2xl mx-auto my-8 bg-black/60 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/40 text-xs font-semibold text-purple-200">
                ✦ Fase 1 del Ritual · Preparación
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Formula tu Pregunta Guía para la Cruz Celta
              </h1>
              <p className="text-sm text-purple-200/80">
                Para que el motor baraje las 78 cartas y el Oráculo de IA
                analice tu tirada con coherencia, define primero el ámbito y tu
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
                  1. Selecciona el ámbito de tu consulta (5 enfoques)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CONSULTATION_TOPICS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDraftTopicId(t.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        t.id === draftTopicId
                          ? "bg-purple-600/40 border-purple-300 text-white shadow"
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
                <textarea
                  id="mandatory-question-input"
                  rows={3}
                  required
                  value={draftQuestion}
                  onChange={(e) => {
                    setDraftQuestion(e.target.value);
                    if (questionError) setQuestionError(null);
                  }}
                  placeholder={draftTopicObj.promptPlaceholder}
                  className={`w-full rounded-2xl bg-purple-950/45 border px-4 py-3 text-sm sm:text-base text-white placeholder-purple-300/45 focus:outline-none focus:ring-2 transition-all resize-none ${
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

                {/* Sugerencias rápidas del ámbito seleccionado */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {draftTopicObj.sampleQuestions.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDraftQuestion(sample);
                        setQuestionError(null);
                      }}
                      className="text-[11px] bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/30 text-purple-200 px-2.5 py-1 rounded-full transition-all cursor-pointer text-left"
                    >
                      + {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2">
                  3. Idioma de la interpretación IA
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LOCALE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => setDraftLocale(opt.code)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        draftLocale === opt.code
                          ? "bg-fuchsia-600/35 border-fuchsia-300 text-white"
                          : "bg-purple-950/35 border-purple-500/25 text-purple-200/80 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-2xl text-base shadow-xl cursor-pointer transition-all"
              >
                Confirmar Intención e Iniciar Barajado Ritual →
              </button>
            </form>
          </section>
        ) : (
          <>
            {/* Barra de Progreso del Ritual y Controles de la Sesión */}
            <ReadingProgress
              phase={session.phase}
              question={session.question}
              categoryId={session.category}
              locale={session.locale}
              revealedCount={revealedCount}
              canInterpret={canInterpret}
              hasInterpretation={Boolean(interpretation)}
              layoutMode={layoutMode}
              onChangeLayoutMode={setLayoutMode}
              onChangeLocale={setSessionLocale}
              onRevealNext={revealNextCard}
              onRevealAll={revealAllCards}
              onRequestInterpretation={handleInterpretSpread}
            />

            {/* ETAPA DE BARAJADO 3D O TABLERO + INSPECTOR */}
            {session.phase === "shuffling" ? (
              <TarotShuffle
                question={session.question}
                categoryLabel={activeTopic.label}
                onCompleteShuffle={proceedToDealing}
              />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* COLUMNA IZQUIERDA (8 cols): MESA VIRTUAL DE LA CRUZ CELTA */}
                <div className="xl:col-span-8">
                  <TarotTable
                    cards={session.cards}
                    phase={session.phase}
                    selectedPosition={selectedPosition}
                    layoutMode={layoutMode}
                    onSelectOrRevealCard={selectOrRevealPosition}
                    onDealComplete={proceedToRevealing}
                  />
                </div>

                {/* COLUMNA DERECHA (4 cols): INSPECTOR LATERAL SINCRONIZADO */}
                <div className="xl:col-span-4">
                  <CardInspector
                    cards={session.cards}
                    selectedPosition={selectedPosition}
                    revealedCount={revealedCount}
                    canInterpret={canInterpret}
                    isInterpreting={isInterpreting}
                    onSelectPosition={setSelectedPosition}
                    onRevealPosition={selectOrRevealPosition}
                    onRevealNext={revealNextCard}
                    onRequestInterpretation={handleInterpretSpread}
                  />
                </div>
              </div>
            )}

            {/* SECCIÓN DE INTERPRETACIÓN DE LA IA GRATUITA (8 CAPÍTULOS) */}
            <section ref={aiSectionRef} className="scroll-mt-24">
              <ReadingResult
                question={session.question}
                topicLabel={activeTopic.label}
                topicIcon={activeTopic.icon}
                locale={session.locale}
                cards={session.cards}
                interpretation={interpretation}
                isInterpreting={isInterpreting}
                aiError={aiError}
                canInterpret={canInterpret}
                selectedPosition={selectedPosition}
                onSelectPosition={setSelectedPosition}
                onRetryOrRefresh={handleInterpretSpread}
              />
            </section>

            {/* RESUMEN COMPLETO DE LAS CARTAS REVELADAS */}
            {revealedCount > 0 && session.phase !== "shuffling" && (
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
                    {!interpretation && canInterpret && (
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
                  {session.cards
                    .filter((s) => s.isRevealed)
                    .map((slot) => {
                      const posInfo = CELTIC_CROSS_POSITIONS.find(
                        (p) => p.position === slot.position,
                      )!;
                      const isReversed = slot.orientation === "reversed";
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
                              className={`object-cover ${
                                isReversed ? "rotate-180" : ""
                              }`}
                              sizes="80px"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-purple-600/40 text-purple-100">
                                #{posInfo.position} · {posInfo.title}
                              </span>
                              <span className="text-[11px] text-fuchsia-300">
                                {slot.card.categoryLabel}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isReversed
                                    ? "bg-amber-500/15 border-amber-400/40 text-amber-200"
                                    : "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                                }`}
                              >
                                {isReversed ? "↺ Invertida" : "↑ Al Derecho"}
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

      {/* Pie de página ampliado */}
      <Footer />
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
      <TarotReadingRoom />
    </Suspense>
  );
}

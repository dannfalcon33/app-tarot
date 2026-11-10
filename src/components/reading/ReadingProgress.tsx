"use client";

import { CONSULTATION_TOPICS } from "@/data/tarotSpread";
import type { ReadingPhase, SupportedLocale } from "@/types/tarot";

export interface ReadingProgressProps {
  question: string;
  categoryId: string;
  locale: SupportedLocale;
  phase: ReadingPhase;
  revealedCount: number;
  canInterpret: boolean;
  hasInterpretation: boolean;
  layoutMode: "celtic" | "grid";
  onChangeLayoutMode: (mode: "celtic" | "grid") => void;
  onChangeLocale: (locale: SupportedLocale) => void;
  onRevealNext: () => void;
  onRevealAll: () => void;
  onRequestInterpretation: () => void;
}

const PHASE_LABELS: Record<ReadingPhase, { text: string; badgeClass: string }> = {
  preparing: {
    text: "Preparando Consulta",
    badgeClass: "bg-purple-900/60 border-purple-400/40 text-purple-200",
  },
  shuffling: {
    text: "Etapa 1 · Barajando Mazo",
    badgeClass: "bg-fuchsia-900/60 border-fuchsia-400/50 text-fuchsia-200",
  },
  dealing: {
    text: "Etapa 2 · Distribuyendo Cruz Celta",
    badgeClass: "bg-indigo-900/60 border-indigo-400/50 text-indigo-200",
  },
  revealing: {
    text: "Etapa 3 · Revelación de Cartas",
    badgeClass: "bg-purple-900/60 border-purple-400/45 text-purple-100",
  },
  ready_to_interpret: {
    text: "Etapa 4 · 10/10 Reveladas · Lista para IA",
    badgeClass: "bg-emerald-950/70 border-emerald-400/50 text-emerald-200",
  },
  interpreting: {
    text: "Consultando al Oráculo IA...",
    badgeClass: "bg-amber-950/70 border-amber-400/50 text-amber-200",
  },
  completed: {
    text: "Lectura Completada ✦",
    badgeClass: "bg-fuchsia-950/70 border-fuchsia-300/60 text-fuchsia-100",
  },
  error: {
    text: "Reintentar Interpretación IA",
    badgeClass: "bg-red-950/70 border-red-400/50 text-red-200",
  },
};

const LOCALE_OPTIONS: { code: SupportedLocale; short: string }[] = [
  { code: "es", short: "ES" },
  { code: "en", short: "EN" },
  { code: "pt", short: "PT" },
];

export default function ReadingProgress({
  question,
  categoryId,
  locale,
  phase,
  revealedCount,
  canInterpret,
  hasInterpretation,
  layoutMode,
  onChangeLayoutMode,
  onChangeLocale,
  onRevealNext,
  onRevealAll,
  onRequestInterpretation,
}: ReadingProgressProps) {
  const activeTopic =
    CONSULTATION_TOPICS.find((t) => t.id === categoryId) ||
    CONSULTATION_TOPICS[0];

  const phaseInfo = PHASE_LABELS[phase];
  const isInterpreting = phase === "interpreting";
  const isShufflingOrDealing = phase === "shuffling" || phase === "dealing";

  return (
    <section className="bg-black/60 backdrop-blur-xl border border-purple-500/35 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Intención / Pregunta Guía Fijada */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/35 border border-purple-400/45 text-xs font-semibold text-purple-100">
              <span>{activeTopic.icon}</span>
              <span>{activeTopic.label}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${phaseInfo.badgeClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{phaseInfo.text}</span>
            </span>

            {/* Selector de idioma de la sesión */}
            <div className="inline-flex items-center rounded-full bg-purple-950/60 border border-purple-500/30 p-0.5 text-[11px]">
              {LOCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => onChangeLocale(opt.code)}
                  className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                    locale === opt.code
                      ? "bg-purple-600 text-white"
                      : "text-purple-300 hover:text-white"
                  }`}
                >
                  {opt.short}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug">
            “{question}”
          </h1>
        </div>

        {/* Controles del Ritual (revelación + vista + interpretación IA bloqueada hasta 10/10) */}
        {phase !== "shuffling" && (
          <div className="flex flex-wrap items-center gap-2.5">
            {revealedCount < 10 && (
              <>
                <button
                  type="button"
                  onClick={onRevealNext}
                  disabled={isShufflingOrDealing}
                  className="bg-purple-950/75 hover:bg-purple-900/85 disabled:opacity-50 border border-purple-400/45 text-purple-100 font-semibold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Revelar #{revealedCount + 1}
                </button>

                <button
                  type="button"
                  onClick={onRevealAll}
                  disabled={isShufflingOrDealing}
                  className="bg-white/10 hover:bg-white/15 disabled:opacity-50 border border-white/20 text-white font-semibold py-2.5 px-4 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Revelar las {10 - revealedCount} restantes
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onRequestInterpretation}
              disabled={!canInterpret}
              title={
                revealedCount < 10
                  ? `Revela primero las 10 cartas (${revealedCount}/10) para habilitar la interpretación con IA`
                  : "Solicitar interpretación completa a la IA"
              }
              className={`font-bold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-xl border transition-all flex items-center gap-1.5 ${
                canInterpret
                  ? "bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 hover:from-amber-400 hover:via-fuchsia-500 hover:to-purple-500 text-white border-amber-300/50 hover:scale-105 active:scale-95 cursor-pointer"
                  : "bg-purple-950/40 border-purple-500/25 text-purple-300/55 cursor-not-allowed"
              }`}
            >
              <span>✦</span>
              <span>
                {isInterpreting
                  ? "Consultando IA..."
                  : revealedCount < 10
                    ? `Interpretar con IA (${revealedCount}/10)`
                    : hasInterpretation
                      ? "Actualizar Lectura IA"
                      : "Interpretar Cruz Celta con IA"}
              </span>
            </button>

            {/* Selector de Vista: Cruz Celta vs Orden 1-10 */}
            <div className="inline-flex rounded-2xl bg-purple-950/60 border border-purple-500/30 p-1">
              <button
                type="button"
                onClick={() => onChangeLayoutMode("celtic")}
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
                onClick={() => onChangeLayoutMode("grid")}
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
        )}
      </div>

      {/* Barra de progreso de revelación */}
      {phase !== "shuffling" && (
        <div className="pt-3 border-t border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-purple-200/85">
          <span>
            {revealedCount < 10 ? (
              <>
                Selecciona cada carta en la mesa para voltearla en 3D.{" "}
                <strong className="text-fuchsia-200">
                  La interpretación con IA se desbloquea al revelar las 10
                  cartas ({10 - revealedCount} pendientes).
                </strong>
              </>
            ) : (
              <strong className="text-emerald-300">
                ✦ Las 10 cartas de tu Cruz Celta han sido reveladas. Ya puedes
                solicitar la interpretación del Oráculo IA.
              </strong>
            )}
          </span>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-36 h-2.5 rounded-full bg-purple-950 overflow-hidden border border-purple-500/35">
              <div
                className={`h-full transition-all duration-500 ${
                  revealedCount === 10
                    ? "bg-gradient-to-r from-emerald-400 via-fuchsia-400 to-amber-300"
                    : "bg-gradient-to-r from-purple-500 to-fuchsia-400"
                }`}
                style={{ width: `${(revealedCount / 10) * 100}%` }}
              />
            </div>
            <span className="font-bold text-white">{revealedCount} / 10</span>
          </div>
        </div>
      )}
    </section>
  );
}


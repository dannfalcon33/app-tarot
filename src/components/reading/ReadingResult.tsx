"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { InterpretResponseData } from "@/app/api/interpretar/route";
import type { SessionSpreadCard, SupportedLocale } from "@/types/tarot";

export interface ReadingResultProps {
  question: string;
  topicLabel: string;
  topicIcon: string;
  locale: SupportedLocale;
  cards: SessionSpreadCard[];
  interpretation: InterpretResponseData | null;
  isInterpreting: boolean;
  aiError: string | null;
  canInterpret: boolean;
  selectedPosition: number;
  onSelectPosition: (positionNumber: number) => void;
  onRetryOrRefresh: () => void;
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

const UI_TEXT: Record<
  SupportedLocale,
  {
    oracleBadge: string;
    heading: string;
    promptAnalyzed: string;
    viewAllChapters: string;
    viewSingleChapter: string;
    regenerateSameSpread: string;
    newConsultation: string;
    relatedCardsLabel: string;
    loadingTitle: string;
    loadingDesc: string;
    retryButton: string;
    prevChapter: string;
    nextChapter: string;
  }
> = {
  es: {
    oracleBadge: "✦ Lectura Editorial en 8 Capítulos · Oráculo IA",
    heading: "Interpretación Profunda de tu Cruz Celta",
    promptAnalyzed: "Pregunta Guía Analizada:",
    viewAllChapters: "Lectura Completa (8 Capítulos)",
    viewSingleChapter: "Paso a Paso",
    regenerateSameSpread: "↻ Reinterpretar Misma Tirada",
    newConsultation: "Nueva Consulta",
    relatedCardsLabel: "Cartas vinculadas a este capítulo:",
    loadingTitle: "Consultando al Oráculo de Inteligencia Artificial...",
    loadingDesc:
      "Integrando tu pregunta guía, el ámbito elegido y las 10 cartas reveladas (con sus orientaciones al derecho o invertidas) en 8 capítulos coherentes.",
    retryButton: "Reintentar con la misma tirada de 10 cartas",
    prevChapter: "← Capítulo Anterior",
    nextChapter: "Siguiente Capítulo →",
  },
  en: {
    oracleBadge: "✦ 8-Chapter Editorial Reading · AI Oracle",
    heading: "In-Depth Interpretation of Your Celtic Cross",
    promptAnalyzed: "Guiding Question Analyzed:",
    viewAllChapters: "Full Reading (8 Chapters)",
    viewSingleChapter: "Chapter by Chapter",
    regenerateSameSpread: "↻ Re-interpret Same Spread",
    newConsultation: "New Reading",
    relatedCardsLabel: "Cards linked to this chapter:",
    loadingTitle: "Consulting the Artificial Intelligence Oracle...",
    loadingDesc:
      "Synthesizing your guiding question, chosen focus, and all 10 revealed cards (including upright and reversed orientations) into 8 coherent chapters.",
    retryButton: "Retry with the exact same 10-card spread",
    prevChapter: "← Previous Chapter",
    nextChapter: "Next Chapter →",
  },
  pt: {
    oracleBadge: "✦ Leitura Editorial em 8 Capítulos · Oráculo IA",
    heading: "Interpretação Profunda da sua Cruz Celta",
    promptAnalyzed: "Pergunta Guia Analisada:",
    viewAllChapters: "Leitura Completa (8 Capítulos)",
    viewSingleChapter: "Capítulo por Capítulo",
    regenerateSameSpread: "↻ Reinterpretar Mesma Tiragem",
    newConsultation: "Nova Consulta",
    relatedCardsLabel: "Cartas vinculadas a este capítulo:",
    loadingTitle: "Consultando o Oráculo de Inteligência Artificial...",
    loadingDesc:
      "Integrando sua pergunta guia, o foco escolhido e as 10 cartas reveladas (com suas orientações ao direito ou invertidas) em 8 capítulos coerentes.",
    retryButton: "Tentar novamente com a mesma tiragem de 10 cartas",
    prevChapter: "← Capítulo Anterior",
    nextChapter: "Próximo Capítulo →",
  },
};

export default function ReadingResult({
  question,
  topicLabel,
  topicIcon,
  locale,
  cards,
  interpretation,
  isInterpreting,
  aiError,
  canInterpret,
  selectedPosition,
  onSelectPosition,
  onRetryOrRefresh,
}: ReadingResultProps) {
  const [viewMode, setViewMode] = useState<"all" | "single">("all");
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);

  const t = UI_TEXT[locale] || UI_TEXT.es;

  const getSlotByPos = (pos: number) =>
    cards.find((s) => s.position === pos);

  if (isInterpreting) {
    return (
      <div className="bg-gradient-to-br from-purple-950/75 via-black/85 to-indigo-950/75 border border-fuchsia-400/50 rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-2xl animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-fuchsia-500 to-purple-600 mx-auto flex items-center justify-center text-2xl text-white shadow-xl animate-spin">
          ✦
        </div>
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/40 text-xs font-semibold text-purple-200">
            <span>{topicIcon}</span>
            <span>{topicLabel}</span>
            <span>·</span>
            <span className="uppercase">{locale}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {t.loadingTitle}
          </h2>
          <p className="text-sm text-purple-200/85 leading-relaxed">
            {t.loadingDesc}
          </p>
          <p className="text-xs text-fuchsia-300 font-medium pt-1">
            “{question}”
          </p>
        </div>
      </div>
    );
  }

  if (aiError && !interpretation) {
    return (
      <div className="bg-red-950/55 border border-red-400/45 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/40 mx-auto flex items-center justify-center text-xl text-red-200">
          ⚠
        </div>
        <div className="space-y-1.5 max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-white">
            Comunicación interrumpida con el Oráculo
          </h3>
          <p className="text-sm text-red-200/90">{aiError}</p>
        </div>
        {canInterpret && (
          <button
            type="button"
            onClick={onRetryOrRefresh}
            className="bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 hover:from-amber-400 hover:via-fuchsia-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>↻</span>
            <span>{t.retryButton}</span>
          </button>
        )}
      </div>
    );
  }

  if (!interpretation) {
    return null;
  }

  const chapters =
    interpretation.chapters && interpretation.chapters.length > 0
      ? interpretation.chapters
      : [
          {
            key: "diagnosticoGeneral" as const,
            numberRoman: "I",
            title: "Diagnóstico General",
            subtitle: "Visión integral de tu Cruz Celta",
            relatedPositions: [1, 2, 10],
            content: interpretation.summary,
          },
          {
            key: "energiaCentral" as const,
            numberRoman: "II",
            title: "Cruz Central y Evolución",
            subtitle: "Raíces, presente, desafío y corona",
            relatedPositions: [1, 2, 3, 4, 5, 6],
            content: interpretation.cruzCentral,
          },
          {
            key: "futuroTendencias" as const,
            numberRoman: "III",
            title: "El Bastón del Destino",
            subtitle: "Actitud, entorno, esperanzas y desenlace",
            relatedPositions: [7, 8, 9, 10],
            content: interpretation.bastonDestino,
          },
          {
            key: "guiaConclusion" as const,
            numberRoman: "IV",
            title: "Guía Práctica y Conclusión",
            subtitle: "Consejo accionable para tu camino",
            relatedPositions: [1, 5, 7, 10],
            content: interpretation.consejoFinal,
          },
        ];

  const safeIdx =
    activeChapterIdx < chapters.length ? activeChapterIdx : 0;
  const visibleChapters =
    viewMode === "all" ? chapters : [chapters[safeIdx]];

  return (
    <div className="bg-gradient-to-br from-purple-950/75 via-black/85 to-indigo-950/75 border-2 border-fuchsia-400/45 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
      {/* Cabecera editorial de la interpretación */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-500/30 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-300/40 text-amber-200 text-xs font-bold">
              {t.oracleBadge}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-200">
              {interpretation.provider} · {interpretation.model}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-fuchsia-950/70 border border-fuchsia-400/35 text-fuchsia-200 uppercase font-bold">
              {interpretation.locale || locale}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
            {t.heading}
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/85">
            {t.promptAnalyzed} <strong>“{question}”</strong> ({topicIcon}{" "}
            {topicLabel})
          </p>
        </div>

        {/* Controles de vista y acciones */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-2xl bg-purple-950/70 border border-purple-500/35 p-1">
            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "all"
                  ? "bg-purple-600 text-white shadow"
                  : "text-purple-300 hover:text-white"
              }`}
            >
              {t.viewAllChapters}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("single")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "single"
                  ? "bg-purple-600 text-white shadow"
                  : "text-purple-300 hover:text-white"
              }`}
            >
              {t.viewSingleChapter}
            </button>
          </div>

          <button
            type="button"
            onClick={onRetryOrRefresh}
            disabled={!canInterpret}
            className="bg-purple-900/60 hover:bg-purple-800/70 border border-purple-400/40 text-purple-100 text-xs font-semibold px-3.5 py-2 rounded-full transition-all cursor-pointer"
          >
            {t.regenerateSameSpread}
          </button>

          <Link
            href="/#consulta"
            className="bg-white/10 hover:bg-white/15 border border-purple-300/40 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
          >
            <span>←</span>
            <span>{t.newConsultation}</span>
          </Link>
        </div>
      </div>

      {/* Índice interactivo de los 8 capítulos */}
      <nav
        aria-label="Capítulos de la interpretación"
        className="flex flex-wrap gap-1.5 pb-1"
      >
        {chapters.map((chapter, idx) => {
          const isCurrent =
            viewMode === "single" && safeIdx === idx;
          return (
            <button
              key={chapter.key}
              type="button"
              onClick={() => {
                setActiveChapterIdx(idx);
                if (viewMode === "all") {
                  const el = document.getElementById(
                    `reading-chapter-${chapter.key}`,
                  );
                  el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isCurrent
                  ? "bg-gradient-to-r from-amber-500/30 to-fuchsia-600/40 border-amber-300/70 text-white shadow"
                  : "bg-black/45 border-purple-500/25 text-purple-200/85 hover:border-purple-400/50 hover:text-white"
              }`}
            >
              <span className="text-amber-300 font-bold">
                {chapter.numberRoman}.
              </span>
              <span>{chapter.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Cuerpo de los capítulos */}
      <div className="space-y-5">
        {visibleChapters.map((chapter) => {
          const isHighlightChapter =
            chapter.key === "diagnosticoGeneral" ||
            chapter.key === "guiaConclusion";

          return (
            <article
              key={chapter.key}
              id={`reading-chapter-${chapter.key}`}
              className={`rounded-2xl p-5 sm:p-6 border transition-all space-y-4 ${
                isHighlightChapter
                  ? "bg-gradient-to-r from-purple-950/60 via-fuchsia-950/40 to-indigo-950/60 border-fuchsia-400/45 shadow-lg"
                  : "bg-black/45 border-purple-500/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-purple-600/35 border border-purple-300/45 flex items-center justify-center text-xs font-extrabold text-amber-200 shrink-0">
                    {chapter.numberRoman}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-purple-300/80">
                      {chapter.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Texto narrativo del capítulo */}
              <div className="text-sm sm:text-base text-purple-100/95 leading-relaxed whitespace-pre-line">
                {renderFormattedText(chapter.content)}
              </div>

              {/* Miniaturas interactivas de las cartas que intervienen en este capítulo */}
              <div className="pt-2 border-t border-purple-500/15 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-purple-300/75 mr-1">
                  {t.relatedCardsLabel}
                </span>
                {chapter.relatedPositions.map((posNum) => {
                  const slot = getSlotByPos(posNum);
                  if (!slot) return null;
                  const isRev = slot.orientation === "reversed";
                  const isSelected = selectedPosition === posNum;

                  return (
                    <button
                      key={posNum}
                      type="button"
                      onClick={() => onSelectPosition(posNum)}
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-fuchsia-600/35 border-fuchsia-300 text-white shadow"
                          : "bg-purple-950/50 border-purple-500/30 text-purple-200 hover:border-purple-300/60 hover:text-white"
                      }`}
                    >
                      <span className="relative w-4 h-6 rounded overflow-hidden border border-purple-300/40 shrink-0">
                        <Image
                          src={slot.card.path}
                          alt={slot.card.name}
                          fill
                          className={`object-cover ${
                            isRev ? "rotate-180" : ""
                          }`}
                          sizes="16px"
                        />
                      </span>
                      <span className="font-bold text-fuchsia-300">
                        #{posNum}
                      </span>
                      <span className="font-medium">{slot.card.name}</span>
                      <span
                        className={`text-[10px] ${
                          isRev ? "text-amber-300" : "text-emerald-300"
                        }`}
                      >
                        {isRev ? "↺" : "↑"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>

      {/* Controles de paginación cuando se explora capítulo por capítulo */}
      {viewMode === "single" && chapters.length > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-purple-500/25">
          <button
            type="button"
            disabled={safeIdx === 0}
            onClick={() => setActiveChapterIdx((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 disabled:opacity-40 border border-purple-500/35 text-xs font-semibold text-purple-100 cursor-pointer transition-all"
          >
            {t.prevChapter}
          </button>
          <span className="text-xs text-purple-300 font-semibold">
            {safeIdx + 1} / {chapters.length}
          </span>
          <button
            type="button"
            disabled={safeIdx >= chapters.length - 1}
            onClick={() =>
              setActiveChapterIdx((prev) =>
                Math.min(chapters.length - 1, prev + 1),
              )
            }
            className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 disabled:opacity-40 border border-purple-500/35 text-xs font-semibold text-purple-100 cursor-pointer transition-all"
          >
            {t.nextChapter}
          </button>
        </div>
      )}
    </div>
  );
}


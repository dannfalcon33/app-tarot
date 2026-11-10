"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CELTIC_CROSS_POSITIONS,
  CONSULTATION_TOPICS,
} from "@/data/tarotSpread";
import type { InterpretResponseData } from "@/app/api/interpretar/route";
import {
  createClientSessionId,
  ReadingPhase,
  SessionSpreadCard,
  SupportedLocale,
  TAROT_SESSION_STORAGE_KEY,
  TarotReadingSession,
} from "@/types/tarot";
import {
  drawCelticCrossSpread,
  isValidReadingSession,
} from "@/services/tarot/draw";

export interface UseTarotSessionOptions {
  routeSessionId?: string;
  initialCategory?: string;
  initialQuestion?: string;
  initialLocale?: SupportedLocale;
}

function saveSessionToStorage(session: TarotReadingSession) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      TAROT_SESSION_STORAGE_KEY,
      JSON.stringify(session),
    );
  } catch {
    // Ignorar errores de cuota en navegadores restringidos
  }
}

export function useTarotSession({
  routeSessionId,
  initialCategory = "general",
  initialQuestion = "",
  initialLocale = "es",
}: UseTarotSessionOptions = {}) {
  const [session, setSession] = useState<TarotReadingSession | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [sessionCorruptedOrMissing, setSessionCorruptedOrMissing] =
    useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<number>(1);
  const [aiError, setAiError] = useState<string | null>(null);

  // Hidratación inicial desde sessionStorage o parámetros de entrada
  useEffect(() => {
    if (typeof window === "undefined") return;

    let restored: TarotReadingSession | null = null;
    try {
      const raw = window.sessionStorage.getItem(TAROT_SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidReadingSession(parsed)) {
          restored = parsed;
        }
      }
    } catch {
      restored = null;
    }

    const trimmedQuery = initialQuestion.trim();

    const Timer = setTimeout(() => {
      // Caso 1: Se solicitó un sessionId específico en la ruta
      if (routeSessionId) {
        if (restored && restored.sessionId === routeSessionId) {
          // Si venía en fase "preparing" desde la landing sin cartas aún, generamos las 10 cartas una única vez
          if (restored.cards.length === 0) {
            const frozenCards = drawCelticCrossSpread();
            const initialized: TarotReadingSession = {
              ...restored,
              cards: frozenCards,
              phase: "shuffling",
            };
            saveSessionToStorage(initialized);
            setSession(initialized);
          } else {
            // Recuperar estado estable si quedó a mitad de animación al recargar F5
            const normalizedPhase: ReadingPhase =
              restored.phase === "dealing"
                ? "revealing"
                : restored.phase === "interpreting"
                  ? "ready_to_interpret"
                  : restored.phase;
            const hydrated: TarotReadingSession = {
              ...restored,
              phase: normalizedPhase,
            };
            saveSessionToStorage(hydrated);
            setSession(hydrated);
          }
          setIsHydrated(true);
          return;
        }

        // Si no coincide con sessionStorage pero trae consulta válida por URL
        if (trimmedQuery.length >= 5) {
          const newSession: TarotReadingSession = {
            sessionId: routeSessionId,
            question: trimmedQuery,
            category: initialCategory,
            locale: initialLocale,
            spreadType: "celtic_cross",
            cards: drawCelticCrossSpread(),
            revealedCardIds: [],
            selectedCardId: null,
            phase: "shuffling",
            interpretation: null,
            interpretationStatus: "idle",
            createdAt: new Date().toISOString(),
          };
          saveSessionToStorage(newSession);
          setSession(newSession);
          setIsHydrated(true);
          return;
        }

        // Sesión inexistente o expirada
        setSessionCorruptedOrMissing(true);
        setIsHydrated(true);
        return;
      }

      // Caso 2: Ruta /lectura con query string nueva o sesión activa en sessionStorage
      if (trimmedQuery.length >= 5) {
        if (
          restored &&
          restored.question === trimmedQuery &&
          restored.category === initialCategory
        ) {
          if (restored.cards.length === 0) {
            const initialized: TarotReadingSession = {
              ...restored,
              cards: drawCelticCrossSpread(),
              phase: "shuffling",
            };
            saveSessionToStorage(initialized);
            setSession(initialized);
          } else {
            const normalizedPhase: ReadingPhase =
              restored.phase === "dealing"
                ? "revealing"
                : restored.phase === "interpreting"
                  ? "ready_to_interpret"
                  : restored.phase;
            const hydrated: TarotReadingSession = {
              ...restored,
              phase: normalizedPhase,
            };
            saveSessionToStorage(hydrated);
            setSession(hydrated);
          }
        } else {
          const newSession: TarotReadingSession = {
            sessionId: createClientSessionId(),
            question: trimmedQuery,
            category: initialCategory,
            locale: initialLocale,
            spreadType: "celtic_cross",
            cards: drawCelticCrossSpread(),
            revealedCardIds: [],
            selectedCardId: null,
            phase: "shuffling",
            interpretation: null,
            interpretationStatus: "idle",
            createdAt: new Date().toISOString(),
          };
          saveSessionToStorage(newSession);
          setSession(newSession);
        }
        setIsHydrated(true);
        return;
      }

      // Si entró a /lectura sin query pero tiene una sesión válida en la pestaña actual, la recuperamos
      if (restored && restored.cards.length === 10) {
        const normalizedPhase: ReadingPhase =
          restored.phase === "dealing"
            ? "revealing"
            : restored.phase === "interpreting"
              ? "ready_to_interpret"
              : restored.phase;
        const hydrated: TarotReadingSession = {
          ...restored,
          phase: normalizedPhase,
        };
        saveSessionToStorage(hydrated);
        setSession(hydrated);
        setIsHydrated(true);
        return;
      }

      // Si no hay sesión previa ni pregunta en la URL, iniciar en fase "preparing"
      setSession(null);
      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(Timer);
  }, [routeSessionId, initialCategory, initialQuestion, initialLocale]);

  const updateSession = useCallback(
    (updater: (prev: TarotReadingSession) => TarotReadingSession) => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        saveSessionToStorage(next);
        return next;
      });
    },
    [],
  );

  // Confirmar pregunta desde el paso de preparación
  const startNewSession = useCallback(
    (
      category: string,
      questionText: string,
      locale: SupportedLocale = "es",
    ) => {
      const trimmed = questionText.trim();
      if (trimmed.length < 5) return null;

      const newSession: TarotReadingSession = {
        sessionId: routeSessionId || createClientSessionId(),
        question: trimmed,
        category,
        locale,
        spreadType: "celtic_cross",
        cards: drawCelticCrossSpread(),
        revealedCardIds: [],
        selectedCardId: null,
        phase: "shuffling",
        interpretation: null,
        interpretationStatus: "idle",
        createdAt: new Date().toISOString(),
      };

      setSessionCorruptedOrMissing(false);
      setAiError(null);
      setSelectedPosition(1);
      saveSessionToStorage(newSession);
      setSession(newSession);
      return newSession;
    },
    [routeSessionId],
  );

  // Finalizar etapa de barajado y pasar a distribución escalonada
  const proceedToDealing = useCallback(() => {
    updateSession((prev) => {
      if (prev.phase !== "shuffling") return prev;
      return {
        ...prev,
        phase: "dealing",
      };
    });
  }, [updateSession]);

  // Finalizar etapa de distribución y habilitar revelación interactiva
  const proceedToRevealing = useCallback(() => {
    updateSession((prev) => {
      if (prev.phase !== "dealing" && prev.phase !== "shuffling") return prev;
      return {
        ...prev,
        phase:
          prev.revealedCardIds.length === 10
            ? "ready_to_interpret"
            : "revealing",
        selectedCardId: prev.cards[0]?.card.uid ?? null,
      };
    });
    setSelectedPosition(1);
  }, [updateSession]);

  // Seleccionar o voltear una carta específica (1..10)
  const selectOrRevealPosition = useCallback(
    (positionNumber: number) => {
      setSelectedPosition(positionNumber);

      updateSession((prev) => {
        if (prev.phase === "preparing" || prev.phase === "shuffling") {
          return prev;
        }

        const updatedCards: SessionSpreadCard[] = prev.cards.map((slot) =>
          slot.position === positionNumber && !slot.isRevealed
            ? { ...slot, isRevealed: true }
            : slot,
        );

        const revealedIds = updatedCards
          .filter((s) => s.isRevealed)
          .map((s) => s.card.uid);

        const selectedSlot = updatedCards.find(
          (s) => s.position === positionNumber,
        );

        const allRevealed = revealedIds.length === 10;
        let nextPhase: ReadingPhase = prev.phase;
        if (
          (prev.phase === "revealing" || prev.phase === "dealing") &&
          allRevealed
        ) {
          nextPhase = prev.interpretation ? "completed" : "ready_to_interpret";
        } else if (prev.phase === "dealing") {
          nextPhase = "revealing";
        }

        return {
          ...prev,
          cards: updatedCards,
          revealedCardIds: revealedIds,
          selectedCardId: selectedSlot?.card.uid ?? prev.selectedCardId,
          phase: nextPhase,
        };
      });
    },
    [updateSession],
  );

  // Revelar la siguiente carta en orden secuencial (1 -> 10)
  const revealNextCard = useCallback(() => {
    if (!session) return;
    const nextUnrevealed = session.cards.find((s) => !s.isRevealed);
    if (nextUnrevealed) {
      selectOrRevealPosition(nextUnrevealed.position);
    }
  }, [session, selectOrRevealPosition]);

  // Revelar las cartas restantes para completar las 10/10
  const revealAllCards = useCallback(() => {
    updateSession((prev) => {
      if (prev.phase === "preparing" || prev.phase === "shuffling") {
        return prev;
      }

      const updatedCards = prev.cards.map((slot) => ({
        ...slot,
        isRevealed: true,
      }));
      const revealedIds = updatedCards.map((s) => s.card.uid);

      return {
        ...prev,
        cards: updatedCards,
        revealedCardIds: revealedIds,
        phase: prev.interpretation ? "completed" : "ready_to_interpret",
      };
    });
  }, [updateSession]);

  // Solicitar interpretación a la IA (restringido estrictamente a 10/10 cartas reveladas)
  const requestInterpretation = useCallback(async () => {
    if (!session) return false;

    const revealedCount = session.cards.filter((c) => c.isRevealed).length;
    if (revealedCount < 10) {
      setAiError(
        "Debes revelar las 10 cartas de la Cruz Celta antes de solicitar la interpretación del Oráculo IA.",
      );
      return false;
    }

    if (session.phase === "interpreting") return false;

    setAiError(null);
    updateSession((prev) => ({
      ...prev,
      phase: "interpreting",
      interpretationStatus: "loading",
    }));

    const topicObj =
      CONSULTATION_TOPICS.find((t) => t.id === session.category) ||
      CONSULTATION_TOPICS[0];

    try {
      const cardsPayload = session.cards.map((slot) => {
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
          orientation: slot.orientation,
        };
      });

      const response = await fetch("/api/interpretar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: session.question,
          topicLabel: topicObj.label,
          locale: session.locale,
          cards: cardsPayload,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al conectar con el oráculo.");
      }

      const data = (await response.json()) as InterpretResponseData;

      updateSession((prev) => ({
        ...prev,
        phase: "completed",
        interpretation: data,
        interpretationStatus: "completed",
      }));

      return true;
    } catch {
      setAiError(
        "No fue posible completar la lectura en este instante. Tu tirada de 10 cartas permanece intacta; puedes reintentar ahora.",
      );
      updateSession((prev) => ({
        ...prev,
        phase: "error",
        interpretationStatus: "error",
      }));
      return false;
    }
  }, [session, updateSession]);

  // Cambiar idioma de salida para la lectura actual sin alterar las 10 cartas
  const setSessionLocale = useCallback(
    (newLocale: SupportedLocale) => {
      updateSession((prev) => ({
        ...prev,
        locale: newLocale,
      }));
    },
    [updateSession],
  );

  const revealedCount = session
    ? session.cards.filter((c) => c.isRevealed).length
    : 0;
  const canInterpret =
    revealedCount === 10 &&
    session !== null &&
    session.phase !== "interpreting" &&
    session.phase !== "shuffling" &&
    session.phase !== "preparing";

  const interpretation =
    (session?.interpretation as InterpretResponseData | null) ?? null;

  return {
    session,
    isHydrated,
    sessionCorruptedOrMissing,
    selectedPosition,
    setSelectedPosition,
    revealedCount,
    canInterpret,
    interpretation,
    aiError,
    setAiError,
    startNewSession,
    proceedToDealing,
    proceedToRevealing,
    selectOrRevealPosition,
    revealNextCard,
    revealAllCards,
    requestInterpretation,
    setSessionLocale,
  };
}


import {
  ALL_TAROT_CARDS,
  CELTIC_CROSS_POSITIONS,
  shuffleDeck,
} from "@/data/tarotSpread";
import type {
  CardOrientation,
  SessionSpreadCard,
  TarotReadingSession,
} from "@/types/tarot";

/**
 * Probabilidad estándar de que una carta salga invertida durante el corte del mazo (25%).
 */
const REVERSED_PROBABILITY = 0.25;

/**
 * Genera y congela las 10 cartas únicas de la Cruz Celta utilizando el
 * algoritmo Fisher-Yates existente en `src/data/tarotSpread.ts`.
 */
export function drawCelticCrossSpread(): SessionSpreadCard[] {
  const shuffled = shuffleDeck(ALL_TAROT_CARDS);

  const dealt: SessionSpreadCard[] = CELTIC_CROSS_POSITIONS.map((pos, idx) => {
    const card = shuffled[idx];
    const orientation: CardOrientation =
      Math.random() < REVERSED_PROBABILITY ? "reversed" : "upright";

    return {
      position: pos.position,
      card: Object.freeze({ ...card }),
      orientation,
      isRevealed: false,
    };
  });

  return dealt;
}

/**
 * Valida la integridad estructural de una sesión recuperada desde `sessionStorage`.
 */
export function isValidReadingSession(
  data: unknown,
): data is TarotReadingSession {
  if (!data || typeof data !== "object") return false;
  const candidate = data as Record<string, unknown>;

  if (
    typeof candidate.sessionId !== "string" ||
    candidate.sessionId.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof candidate.question !== "string" ||
    candidate.question.trim().length < 3
  ) {
    return false;
  }

  if (typeof candidate.category !== "string") {
    return false;
  }

  if (!Array.isArray(candidate.cards)) {
    return false;
  }

  // Si ya tiene cartas asignadas, deben ser exactamente 10 únicas con posiciones 1..10
  if (candidate.cards.length > 0) {
    if (candidate.cards.length !== 10) return false;
    const seenUids = new Set<string>();
    const seenPositions = new Set<number>();

    for (const item of candidate.cards) {
      if (!item || typeof item !== "object") return false;
      const slot = item as Record<string, unknown>;
      if (typeof slot.position !== "number") return false;
      if (slot.position < 1 || slot.position > 10) return false;
      if (
        slot.orientation !== "upright" &&
        slot.orientation !== "reversed"
      ) {
        return false;
      }
      const cardObj = slot.card as Record<string, unknown> | undefined;
      if (!cardObj || typeof cardObj.uid !== "string" || typeof cardObj.path !== "string") {
        return false;
      }
      seenUids.add(cardObj.uid);
      seenPositions.add(slot.position);
    }

    if (seenUids.size !== 10 || seenPositions.size !== 10) {
      return false;
    }
  }

  return true;
}


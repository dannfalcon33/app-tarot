import type { UnifiedTarotCard } from "@/data/tarotSpread";

export type SupportedLocale = "es" | "en" | "pt";

export type SpreadType = "celtic_cross";

export type ReadingPhase =
  | "preparing"
  | "shuffling"
  | "dealing"
  | "revealing"
  | "ready_to_interpret"
  | "interpreting"
  | "completed"
  | "error";

export type CardOrientation = "upright" | "reversed";

export type CardVisualState = "face_down" | "flipping" | "face_up";

export interface SessionSpreadCard {
  position: number;
  card: UnifiedTarotCard;
  orientation: CardOrientation;
  isRevealed: boolean;
}

export interface TarotReadingSession {
  sessionId: string;
  question: string;
  category: string;
  locale: SupportedLocale;
  spreadType: SpreadType;
  cards: SessionSpreadCard[];
  revealedCardIds: string[];
  selectedCardId: string | null;
  phase: ReadingPhase;
  interpretation: unknown | null;
  interpretationStatus: "idle" | "loading" | "completed" | "error";
  createdAt: string;
}

export const TAROT_SESSION_STORAGE_KEY = "universe_tarot_active_session";

export function createClientSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ut-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}


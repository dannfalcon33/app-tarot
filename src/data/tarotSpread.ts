import { MAJOR_ARCANA } from "./majorArcana";
import {
  MINOR_ARCANA_BASTOS,
  MINOR_ARCANA_COPAS,
  MINOR_ARCANA_ESPADAS,
  MINOR_ARCANA_PENTACULOS,
} from "./minorArcana";

export interface UnifiedTarotCard {
  uid: string;
  id: number;
  name: string;
  path: string;
  arcanaType: "Arcano Mayor" | "Arcano Menor";
  suit?: "Bastos" | "Copas" | "Espadas" | "Pentáculos";
  categoryLabel: string;
  description: string;
  meaning: string;
}

export interface CelticCrossPosition {
  position: number;
  title: string;
  subtitle: string;
  shortLabel: string;
  description: string;
  group: "cruz" | "baston";
}

export const REVERSO_PATH = "/tarot/reverse-universe.webp";

export const ALL_TAROT_CARDS: UnifiedTarotCard[] = [
  ...MAJOR_ARCANA.map((card) => ({
    uid: `major-${card.id}`,
    id: card.id,
    name: card.name,
    path: card.path,
    arcanaType: "Arcano Mayor" as const,
    categoryLabel: `Arcano Mayor ${card.id}`,
    description: card.description,
    meaning: card.meaning,
  })),
  ...MINOR_ARCANA_BASTOS.map((card) => ({
    uid: `bastos-${card.id}`,
    id: card.id,
    name: card.name,
    path: card.path,
    arcanaType: "Arcano Menor" as const,
    suit: card.suit,
    categoryLabel: "Arcano Menor · Bastos",
    description: card.description,
    meaning: card.meaning,
  })),
  ...MINOR_ARCANA_COPAS.map((card) => ({
    uid: `copas-${card.id}`,
    id: card.id,
    name: card.name,
    path: card.path,
    arcanaType: "Arcano Menor" as const,
    suit: card.suit,
    categoryLabel: "Arcano Menor · Copas",
    description: card.description,
    meaning: card.meaning,
  })),
  ...MINOR_ARCANA_ESPADAS.map((card) => ({
    uid: `espadas-${card.id}`,
    id: card.id,
    name: card.name,
    path: card.path,
    arcanaType: "Arcano Menor" as const,
    suit: card.suit,
    categoryLabel: "Arcano Menor · Espadas",
    description: card.description,
    meaning: card.meaning,
  })),
  ...MINOR_ARCANA_PENTACULOS.map((card) => ({
    uid: `pentaculos-${card.id}`,
    id: card.id,
    name: card.name,
    path: card.path,
    arcanaType: "Arcano Menor" as const,
    suit: card.suit,
    categoryLabel: "Arcano Menor · Pentáculos",
    description: card.description,
    meaning: card.meaning,
  })),
];

export const CELTIC_CROSS_POSITIONS: CelticCrossPosition[] = [
  {
    position: 1,
    title: "El Presente",
    subtitle: "Situación Actual",
    shortLabel: "Presente",
    description:
      "Representa el núcleo de tu consulta, la energía central que te rodea en este momento y el punto de partida de la lectura.",
    group: "cruz",
  },
  {
    position: 2,
    title: "El Desafío",
    subtitle: "Lo que Cruza",
    shortLabel: "Desafío",
    description:
      "Muestra el obstáculo principal, la tensión inmediata o la fuerza complementaria que se cruza en tu camino actual.",
    group: "cruz",
  },
  {
    position: 3,
    title: "La Base",
    subtitle: "Raíz e Inconsciente",
    shortLabel: "Base / Raíz",
    description:
      "Revela el origen profundo del asunto, las motivaciones inconscientes o los cimientos sobre los que se sostiene el presente.",
    group: "cruz",
  },
  {
    position: 4,
    title: "El Pasado Reciente",
    subtitle: "Lo que Dejas Atrás",
    shortLabel: "Pasado",
    description:
      "Indica los acontecimientos, decisiones o emociones recientes que aún influyen en ti pero que están quedando atrás.",
    group: "cruz",
  },
  {
    position: 5,
    title: "La Corona",
    subtitle: "Potencial y Meta",
    shortLabel: "Corona",
    description:
      "Simboliza tus aspiraciones conscientes, tu visión superior o el mejor potencial alcanzable en esta etapa.",
    group: "cruz",
  },
  {
    position: 6,
    title: "El Futuro Inmediato",
    subtitle: "Lo que se Aproxima",
    shortLabel: "Futuro Próx.",
    description:
      "Señala las nuevas energías, oportunidades o circunstancias que están a punto de manifestarse en el corto plazo.",
    group: "cruz",
  },
  {
    position: 7,
    title: "El Consultante",
    subtitle: "Tu Actitud Interna",
    shortLabel: "Tu Actitud",
    description:
      "Refleja cómo te posicionas frente a la situación, tus recursos internos y tu disposición emocional actual.",
    group: "baston",
  },
  {
    position: 8,
    title: "El Entorno",
    subtitle: "Influencias Externas",
    shortLabel: "Entorno",
    description:
      "Representa el ambiente que te rodea, la energía de otras personas, vínculos o circunstancias externas que impactan tu consulta.",
    group: "baston",
  },
  {
    position: 9,
    title: "Esperanzas y Temores",
    subtitle: "Anhelos e Inquietudes",
    shortLabel: "Esperanzas",
    description:
      "Desvela tus expectativas más profundas, aquello que anhelas lograr o las dudas silenciosas que necesitas iluminar.",
    group: "baston",
  },
  {
    position: 10,
    title: "El Resultado Final",
    subtitle: "Desenlace Cósmico",
    shortLabel: "Resultado",
    description:
      "La síntesis y culminación hacia donde fluyen todas las energías de la Cruz Celta según tu camino actual.",
    group: "baston",
  },
];

export interface ConsultationTopic {
  id: string;
  label: string;
  icon: string;
  promptPlaceholder: string;
  defaultQuestion: string;
}

export const CONSULTATION_TOPICS: ConsultationTopic[] = [
  {
    id: "general",
    label: "Consulta General",
    icon: "✦",
    promptPlaceholder:
      "Ej: ¿Qué energía guía mi momento actual y hacia dónde debo enfocar mi atención?",
    defaultQuestion:
      "Consulta General: ¿Qué mensaje tiene el universo para mi camino actual?",
  },
  {
    id: "amor",
    label: "Amor y Vínculos",
    icon: "♡",
    promptPlaceholder:
      "Ej: ¿Cómo evolucionará mi vida afectiva y qué debo aprender en mis relaciones?",
    defaultQuestion:
      "Amor y Vínculos: ¿Qué energías rodean mi corazón y mis relaciones actuales?",
  },
  {
    id: "trabajo",
    label: "Trabajo y Abundancia",
    icon: "◈",
    promptPlaceholder:
      "Ej: ¿Qué oportunidades profesionales o financieras se abren en mi camino?",
    defaultQuestion:
      "Trabajo y Abundancia: ¿Cómo puedo alinear mis proyectos con la prosperidad?",
  },
  {
    id: "espiritual",
    label: "Crecimiento Interior",
    icon: "☽",
    promptPlaceholder:
      "Ej: ¿Qué aprendizaje espiritual o transformación interior necesito abrazar ahora?",
    defaultQuestion:
      "Crecimiento Interior: ¿Qué necesita despertar en mi consciencia en esta etapa?",
  },
];

// Algoritmo Fisher-Yates para barajar el mazo completo sin sesgos
export function shuffleDeck<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


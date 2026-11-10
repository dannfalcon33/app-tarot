"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MAJOR_ARCANA } from "@/data/majorArcana";
import {
  MINOR_ARCANA_BASTOS,
  MINOR_ARCANA_COPAS,
  MINOR_ARCANA_ESPADAS,
  MINOR_ARCANA_PENTACULOS,
} from "@/data/minorArcana";
import { REVERSO_PATH } from "@/data/tarotSpread";
import type { CardOrientation, SupportedLocale } from "@/types/tarot";
import TarotCard from "@/components/tarot/TarotCard";
import Footer from "@/components/Footer";

export type ArcanaFamilyId =
  | "all"
  | "mayores"
  | "bastos"
  | "copas"
  | "espadas"
  | "pentaculos";

export interface CatalogCardItem {
  uid: string;
  id: number;
  familyId: Exclude<ArcanaFamilyId, "all">;
  numberLabel: string;
  name: string;
  path: string;
  description: string;
  meaning: string;
  elementEs: string;
  elementEn: string;
  elementPt: string;
}

const CATALOG_CARDS: CatalogCardItem[] = [
  ...MAJOR_ARCANA.map((c) => ({
    uid: `major-${c.id}`,
    id: c.id,
    familyId: "mayores" as const,
    numberLabel: `Arcano ${c.id}`,
    name: c.name,
    path: c.path,
    description: c.description,
    meaning: c.meaning,
    elementEs: "Arquetipo Mayor · Quintaesencia",
    elementEn: "Major Archetype · Quintessence",
    elementPt: "Arquétipo Maior · Quinta-essência",
  })),
  ...MINOR_ARCANA_BASTOS.map((c) => ({
    uid: `bastos-${c.id}`,
    id: c.id,
    familyId: "bastos" as const,
    numberLabel: `Bastos #${c.id}`,
    name: c.name,
    path: c.path,
    description: c.description,
    meaning: c.meaning,
    elementEs: "Palo de Bastos · Elemento Fuego",
    elementEn: "Suit of Wands · Fire Element",
    elementPt: "Naipe de Paus · Elemento Fogo",
  })),
  ...MINOR_ARCANA_COPAS.map((c) => ({
    uid: `copas-${c.id}`,
    id: c.id,
    familyId: "copas" as const,
    numberLabel: `Copas #${c.id}`,
    name: c.name,
    path: c.path,
    description: c.description,
    meaning: c.meaning,
    elementEs: "Palo de Copas · Elemento Agua",
    elementEn: "Suit of Cups · Water Element",
    elementPt: "Naipe de Copas · Elemento Água",
  })),
  ...MINOR_ARCANA_ESPADAS.map((c) => ({
    uid: `espadas-${c.id}`,
    id: c.id,
    familyId: "espadas" as const,
    numberLabel: `Espadas #${c.id}`,
    name: c.name,
    path: c.path,
    description: c.description,
    meaning: c.meaning,
    elementEs: "Palo de Espadas · Elemento Aire",
    elementEn: "Suit of Swords · Air Element",
    elementPt: "Naipe de Espadas · Elemento Ar",
  })),
  ...MINOR_ARCANA_PENTACULOS.map((c) => ({
    uid: `pentaculos-${c.id}`,
    id: c.id,
    familyId: "pentaculos" as const,
    numberLabel: `Pentáculos #${c.id}`,
    name: c.name,
    path: c.path,
    description: c.description,
    meaning: c.meaning,
    elementEs: "Palo de Pentáculos · Elemento Tierra",
    elementEn: "Suit of Pentacles · Earth Element",
    elementPt: "Naipe de Pentáculos · Elemento Terra",
  })),
];

interface FamilyMetadata {
  id: ArcanaFamilyId;
  href: string;
  count: number;
  icon: string;
  accentClass: string;
  titles: Record<SupportedLocale, string>;
  subtitles: Record<SupportedLocale, string>;
  descriptions: Record<SupportedLocale, string>;
}

const FAMILY_META: FamilyMetadata[] = [
  {
    id: "mayores",
    href: "/arcanos-mayores",
    count: 22,
    icon: "✦",
    accentClass: "from-purple-600/35 to-fuchsia-600/20 border-purple-400/50",
    titles: {
      es: "Arcanos Mayores",
      en: "Major Arcana",
      pt: "Arcanos Maiores",
    },
    subtitles: {
      es: "22 Arquetipos Universales (0 – XXI)",
      en: "22 Universal Archetypes (0 – XXI)",
      pt: "22 Arquétipos Universais (0 – XXI)",
    },
    descriptions: {
      es: "El viaje del Loco a través de los 22 grandes portales de consciencia, desde el potencial infinito (0) hasta la integración cósmica en El Universo (XXI).",
      en: "The Fool's journey across 22 cosmic portals of consciousness, from pure potential (0) to universal integration in The Universe (XXI).",
      pt: "A jornada do Louco através dos 22 grandes portais da consciência, desde o potencial puro (0) até a integração cósmica em O Universo (XXI).",
    },
  },
  {
    id: "bastos",
    href: "/arcanos-menores/bastos",
    count: 14,
    icon: "🔥",
    accentClass: "from-amber-600/30 to-orange-600/15 border-amber-400/50",
    titles: {
      es: "Arcanos Menores · Bastos",
      en: "Minor Arcana · Wands",
      pt: "Arcanos Menores · Paus",
    },
    subtitles: {
      es: "14 Cartas · Elemento Fuego · Acción y Voluntad",
      en: "14 Cards · Fire Element · Action & Willpower",
      pt: "14 Cartas · Elemento Fogo · Ação e Vontade",
    },
    descriptions: {
      es: "Representan la chispa creativa, el entusiasmo, el coraje, los proyectos profesionales y el impulso vital que transforma las ideas en movimiento.",
      en: "Represents creative spark, enthusiasm, courage, career initiatives, and the vital drive that turns ideas into motion.",
      pt: "Representam a centelha criativa, o entusiasmo, a coragem, os projetos e o impulso vital que transforma ideias em movimento.",
    },
  },
  {
    id: "copas",
    href: "/arcanos-menores/copas",
    count: 14,
    icon: "🌊",
    accentClass: "from-cyan-600/30 to-blue-600/15 border-cyan-400/50",
    titles: {
      es: "Arcanos Menores · Copas",
      en: "Minor Arcana · Cups",
      pt: "Arcanos Menores · Copas",
    },
    subtitles: {
      es: "14 Cartas · Elemento Agua · Emoción e Intuición",
      en: "14 Cards · Water Element · Emotion & Intuition",
      pt: "14 Cartas · Elemento Água · Emoção e Intuição",
    },
    descriptions: {
      es: "Exploran el mundo del corazón, el amor, la empatía, los vínculos familiares, los sueños profundos y la receptividad espiritual.",
      en: "Explores the realm of the heart, love, empathy, family bonds, deep dreams, and spiritual receptivity.",
      pt: "Exploram o mundo do coração, o amor, a empatia, os vínculos afetivos, os sonhos profundos e a receptividade espiritual.",
    },
  },
  {
    id: "espadas",
    href: "/arcanos-menores/espadas",
    count: 14,
    icon: "🌬️",
    accentClass: "from-indigo-600/30 to-violet-600/15 border-indigo-400/50",
    titles: {
      es: "Arcanos Menores · Espadas",
      en: "Minor Arcana · Swords",
      pt: "Arcanos Menores · Espadas",
    },
    subtitles: {
      es: "14 Cartas · Elemento Aire · Mente y Verdad",
      en: "14 Cards · Air Element · Mind & Truth",
      pt: "14 Cartas · Elemento Ar · Mente e Verdade",
    },
    descriptions: {
      es: "Simbolizan el discernimiento intelectual, la comunicación honesta, las decisiones éticas y la capacidad de cortar la confusión mental.",
      en: "Symbolizes intellectual discernment, honest communication, ethical decisions, and the power to cut through mental confusion.",
      pt: "Simbolizam o discernimento intelectual, a comunicação honesta, as decisões éticas e a capacidade de cortar a confusão mental.",
    },
  },
  {
    id: "pentaculos",
    href: "/arcanos-menores/pentaculos",
    count: 14,
    icon: "🌿",
    accentClass: "from-emerald-600/30 to-teal-600/15 border-emerald-400/50",
    titles: {
      es: "Arcanos Menores · Pentáculos",
      en: "Minor Arcana · Pentacles",
      pt: "Arcanos Menores · Pentáculos",
    },
    subtitles: {
      es: "14 Cartas · Elemento Tierra · Materia y Prosperidad",
      en: "14 Cards · Earth Element · Matter & Prosperity",
      pt: "14 Cartas · Elemento Terra · Matéria e Prosperidade",
    },
    descriptions: {
      es: "Reflejan la manifestación concreta, el trabajo constante, los recursos materiales, el bienestar físico y la estabilidad a largo plazo.",
      en: "Reflects tangible manifestation, steady work, material resources, physical well-being, and long-term stability.",
      pt: "Refletem a manifestação concreta, o trabalho constante, os recursos materiais, o bem-estar físico e a estabilidade duradoura.",
    },
  },
  {
    id: "all",
    href: "/arcanos-mayores",
    count: 78,
    icon: "🌌",
    accentClass: "from-fuchsia-600/35 to-purple-600/20 border-fuchsia-400/50",
    titles: {
      es: "Baraja Completa Universe Tarot",
      en: "Complete Universe Tarot Deck",
      pt: "Baralho Completo Universe Tarot",
    },
    subtitles: {
      es: "78 Cartas Oficiales · 22 Mayores + 56 Menores",
      en: "78 Official Cards · 22 Major + 56 Minor",
      pt: "78 Cartas Oficiais · 22 Maiores + 56 Menores",
    },
    descriptions: {
      es: "Explora en un solo lugar las 78 ilustraciones originales de Universe Tarot con acabado holográfico 3D e inspección detallada.",
      en: "Explore all 78 original Universe Tarot illustrations in one place with 3D holographic finish and detailed inspection.",
      pt: "Explore em um só lugar as 78 ilustrações originais do Universe Tarot com acabamento holográfico 3D e inspeção detalhada.",
    },
  },
];

const UI_COPY: Record<
  SupportedLocale,
  {
    backHome: string;
    startReadingCta: string;
    searchPlaceholder: string;
    allDeckTab: string;
    symbolicEssence: string;
    traditionalMeaning: string;
    openModalBtn: string;
    inspectInStageBtn: string;
    uprightLabel: string;
    reversedLabel: string;
    flipCardBtn: string;
    prevCard: string;
    nextCard: string;
    closeModal: string;
    uprightGuideTitle: string;
    reversedGuideTitle: string;
    uprightGuidePrefix: string;
    reversedGuidePrefix: string;
    galleryHeading: string;
    showingCount: string;
    noResults: string;
    clearSearch: string;
    familyRouteHint: string;
  }
> = {
  es: {
    backHome: "← Inicio",
    startReadingCta: "Tirada Cruz Celta ✦",
    searchPlaceholder: "Buscar carta por nombre, número o significado...",
    allDeckTab: "Las 78 Cartas",
    symbolicEssence: "Esencia Simbólica e Ilustración",
    traditionalMeaning: "Significado Tradicional en Lectura",
    openModalBtn: "Abrir Ficha Completa en Modal ✦",
    inspectInStageBtn: "Previsualizar en Altar 3D",
    uprightLabel: "↑ Al Derecho",
    reversedLabel: "↺ Invertida",
    flipCardBtn: "Probar Giro 3D (Reverso / Frente)",
    prevCard: "← Anterior",
    nextCard: "Siguiente →",
    closeModal: "Cerrar (Esc)",
    uprightGuideTitle: "Lectura al Derecho (Flujo Directo)",
    reversedGuideTitle: "Lectura Invertida (Energía Interiorizada)",
    uprightGuidePrefix:
      "Cuando aparece al derecho en la Cruz Celta, activa de forma consciente y constructiva:",
    reversedGuidePrefix:
      "Cuando aparece invertida, invita a desbloquear resistencias internas o trabajar conscientemente:",
    galleryHeading: "Galería Interactiva de Cartas",
    showingCount: "cartas disponibles",
    noResults: "No se encontraron cartas que coincidan con tu búsqueda.",
    clearSearch: "Mostrar todas las cartas",
    familyRouteHint: "Explora cualquier familia o haz clic en una carta para abrir su modal holográfico.",
  },
  en: {
    backHome: "← Home",
    startReadingCta: "Celtic Cross Reading ✦",
    searchPlaceholder: "Search card by name, number, or meaning...",
    allDeckTab: "All 78 Cards",
    symbolicEssence: "Symbolic Essence & Artwork",
    traditionalMeaning: "Traditional Reading Meaning",
    openModalBtn: "Open Full Detail Modal ✦",
    inspectInStageBtn: "Preview on 3D Stage",
    uprightLabel: "↑ Upright",
    reversedLabel: "↺ Reversed",
    flipCardBtn: "Test 3D Flip (Back / Front)",
    prevCard: "← Previous",
    nextCard: "Next →",
    closeModal: "Close (Esc)",
    uprightGuideTitle: "Upright Reading (Direct Flow)",
    reversedGuideTitle: "Reversed Reading (Internalized Energy)",
    uprightGuidePrefix:
      "When drawn upright in the Celtic Cross, it consciously activates:",
    reversedGuidePrefix:
      "When drawn reversed, it invites you to release inner resistance around:",
    galleryHeading: "Interactive Card Gallery",
    showingCount: "cards available",
    noResults: "No cards matched your search query.",
    clearSearch: "Show all cards",
    familyRouteHint: "Browse any arcana family or click a card to open its holographic modal.",
  },
  pt: {
    backHome: "← Início",
    startReadingCta: "Tiragem Cruz Celta ✦",
    searchPlaceholder: "Buscar carta por nome, número ou significado...",
    allDeckTab: "As 78 Cartas",
    symbolicEssence: "Essência Simbólica e Ilustração",
    traditionalMeaning: "Significado Tradicional na Leitura",
    openModalBtn: "Abrir Ficha Completa em Modal ✦",
    inspectInStageBtn: "Pré-visualizar no Altar 3D",
    uprightLabel: "↑ Ao Direito",
    reversedLabel: "↺ Invertida",
    flipCardBtn: "Testar Giro 3D (Verso / Frente)",
    prevCard: "← Anterior",
    nextCard: "Próxima →",
    closeModal: "Fechar (Esc)",
    uprightGuideTitle: "Leitura ao Direito (Fluxo Direto)",
    reversedGuideTitle: "Leitura Invertida (Energia Internalizada)",
    uprightGuidePrefix:
      "Quando surge ao direito na Cruz Celta, ativa de forma consciente:",
    reversedGuidePrefix:
      "Quando surge invertida, convida a liberar resistências internas ligadas a:",
    galleryHeading: "Galeria Interativa de Cartas",
    showingCount: "cartas disponíveis",
    noResults: "Nenhuma carta corresponde à sua busca.",
    clearSearch: "Mostrar todas as cartas",
    familyRouteHint: "Explore qualquer família ou clique em uma carta para abrir seu modal holográfico.",
  },
};

export interface ArcanaCatalogProps {
  initialFamily?: ArcanaFamilyId;
}

export default function ArcanaCatalog({
  initialFamily = "mayores",
}: ArcanaCatalogProps) {
  const [activeFamily, setActiveFamily] =
    useState<ArcanaFamilyId>(initialFamily);
  const [locale, setLocale] = useState<SupportedLocale>("es");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [previewOrientation, setPreviewOrientation] =
    useState<CardOrientation>("upright");
  const [isStageRevealed, setIsStageRevealed] = useState<boolean>(true);
  const [modalCardUid, setModalCardUid] = useState<string | null>(null);
  const [modalOrientation, setModalOrientation] =
    useState<CardOrientation>("upright");
  const [modalIsRevealed, setModalIsRevealed] = useState<boolean>(true);

  const t = UI_COPY[locale];

  const familyMeta =
    FAMILY_META.find((f) => f.id === activeFamily) || FAMILY_META[0];

  const filteredCards = useMemo(() => {
    const byFamily =
      activeFamily === "all"
        ? CATALOG_CARDS
        : CATALOG_CARDS.filter((c) => c.familyId === activeFamily);

    const q = searchQuery.trim().toLowerCase();
    if (!q) return byFamily;

    return byFamily.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.numberLabel.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.meaning.toLowerCase().includes(q),
    );
  }, [activeFamily, searchQuery]);

  const safeIndex =
    selectedIndex < filteredCards.length ? selectedIndex : 0;
  const activeStageCard = filteredCards[safeIndex] || filteredCards[0] || null;

  const modalCardIndex = useMemo(() => {
    if (!modalCardUid) return -1;
    return filteredCards.findIndex((c) => c.uid === modalCardUid);
  }, [modalCardUid, filteredCards]);

  const activeModalCard =
    modalCardIndex >= 0 ? filteredCards[modalCardIndex] : null;

  const handleSelectFamily = (famId: ArcanaFamilyId) => {
    setActiveFamily(famId);
    setSelectedIndex(0);
    setIsStageRevealed(true);
  };

  const goPrevStage = useCallback(() => {
    if (filteredCards.length === 0) return;
    setSelectedIndex((prev) =>
      prev <= 0 ? filteredCards.length - 1 : prev - 1,
    );
    setIsStageRevealed(true);
  }, [filteredCards.length]);

  const goNextStage = useCallback(() => {
    if (filteredCards.length === 0) return;
    setSelectedIndex((prev) => (prev + 1) % filteredCards.length);
    setIsStageRevealed(true);
  }, [filteredCards.length]);

  const goPrevModal = useCallback(() => {
    if (filteredCards.length === 0 || modalCardIndex < 0) return;
    const prevIdx =
      modalCardIndex <= 0 ? filteredCards.length - 1 : modalCardIndex - 1;
    setModalCardUid(filteredCards[prevIdx].uid);
    setSelectedIndex(prevIdx);
    setModalIsRevealed(true);
  }, [filteredCards, modalCardIndex]);

  const goNextModal = useCallback(() => {
    if (filteredCards.length === 0 || modalCardIndex < 0) return;
    const nextIdx = (modalCardIndex + 1) % filteredCards.length;
    setModalCardUid(filteredCards[nextIdx].uid);
    setSelectedIndex(nextIdx);
    setModalIsRevealed(true);
  }, [filteredCards, modalCardIndex]);

  // Navegación por teclado (Flechas izquierda/derecha y Escape para cerrar modal)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (modalCardUid) {
        if (e.key === "Escape") {
          setModalCardUid(null);
        } else if (e.key === "ArrowLeft") {
          goPrevModal();
        } else if (e.key === "ArrowRight") {
          goNextModal();
        }
      } else {
        if (e.key === "ArrowLeft") {
          goPrevStage();
        } else if (e.key === "ArrowRight") {
          goNextStage();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalCardUid, goPrevModal, goNextModal, goPrevStage, goNextStage]);

  const getElementLabel = (card: CatalogCardItem) => {
    if (locale === "en") return card.elementEn;
    if (locale === "pt") return card.elementPt;
    return card.elementEs;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* Cabecera pegajosa de la Biblioteca */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/65 border-b border-purple-500/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-purple-200 hover:text-white bg-purple-950/55 hover:bg-purple-900/65 border border-purple-500/35 px-3.5 py-2 rounded-full transition-all"
            >
              <span>{t.backHome}</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="relative w-7 h-10 rounded-md overflow-hidden border border-purple-300/60 shadow-md shrink-0">
                <Image
                  src={REVERSO_PATH}
                  alt="Universe Tarot"
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </div>
              <span className="font-bold text-white tracking-wide">
                Universe Tarot
              </span>
              <span className="text-xs text-purple-300/75">
                · Biblioteca Interactiva de 78 Arcanos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Selector de idioma ES / EN / PT */}
            <div
              className="inline-flex rounded-full bg-purple-950/65 border border-purple-500/35 p-1"
              role="group"
              aria-label="Idioma de la biblioteca"
            >
              {(["es", "en", "pt"] as SupportedLocale[]).map((langCode) => (
                <button
                  key={langCode}
                  type="button"
                  onClick={() => setLocale(langCode)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                    locale === langCode
                      ? "bg-fuchsia-600 text-white shadow"
                      : "text-purple-300 hover:text-white"
                  }`}
                >
                  {langCode}
                </button>
              ))}
            </div>

            <Link
              href="/lectura"
              className="text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 px-4 py-2 rounded-full shadow-lg border border-purple-300/40 transition-all"
            >
              {t.startReadingCta}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Encabezado y Selector de Familias (22 Mayores + 4 Palos Menores + 78 Completas) */}
        <section className="bg-black/55 border border-purple-500/35 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/40 text-xs font-semibold text-purple-200">
                <span>{familyMeta.icon}</span>
                <span>{familyMeta.subtitles[locale]}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {familyMeta.titles[locale]}
              </h1>
              <p className="text-sm sm:text-base text-purple-200/85 leading-relaxed">
                {familyMeta.descriptions[locale]}
              </p>
            </div>

            {/* Buscador instantáneo */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-2xl bg-purple-950/55 border border-purple-500/40 focus:border-fuchsia-400 px-4 py-3 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Pestañas de familias y enlaces directos entre rutas */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-500/20">
            <div className="flex flex-wrap gap-2">
              {FAMILY_META.map((fam) => {
                const isActive = activeFamily === fam.id;
                const label =
                  fam.id === "all"
                    ? t.allDeckTab
                    : fam.titles[locale].replace("Arcanos Menores · ", "").replace("Minor Arcana · ", "");
                return (
                  <button
                    key={fam.id}
                    type="button"
                    onClick={() => handleSelectFamily(fam.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? `bg-gradient-to-r ${fam.accentClass} text-white shadow-lg scale-[1.02]`
                        : "bg-purple-950/40 border-purple-500/25 text-purple-200/85 hover:border-purple-400/50 hover:text-white"
                    }`}
                  >
                    <span>{fam.icon}</span>
                    <span>{label}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-purple-200">
                      {fam.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Enlaces directos de ruta para SEO y navegación multipágina */}
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-purple-300/75">
              <span>Rutas directas:</span>
              <Link
                href="/arcanos-mayores"
                className="underline hover:text-white px-1"
              >
                Mayores
              </Link>
              <span>·</span>
              <Link
                href="/arcanos-menores/bastos"
                className="underline hover:text-white px-1"
              >
                Bastos
              </Link>
              <span>·</span>
              <Link
                href="/arcanos-menores/copas"
                className="underline hover:text-white px-1"
              >
                Copas
              </Link>
              <span>·</span>
              <Link
                href="/arcanos-menores/espadas"
                className="underline hover:text-white px-1"
              >
                Espadas
              </Link>
              <span>·</span>
              <Link
                href="/arcanos-menores/pentaculos"
                className="underline hover:text-white px-1"
              >
                Pentáculos
              </Link>
            </div>
          </div>
        </section>

        {filteredCards.length === 0 ? (
          <div className="bg-black/50 border border-purple-500/30 rounded-3xl p-10 text-center space-y-4">
            <p className="text-base text-purple-200">{t.noResults}</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-all"
            >
              {t.clearSearch}
            </button>
          </div>
        ) : (
          <>
            {/* ALTAR HOLOGRÁFICO DE PREVISUALIZACIÓN 3D */}
            {activeStageCard && (
              <section className="bg-gradient-to-br from-purple-950/65 via-black/80 to-indigo-950/60 border border-purple-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Columna izquierda (5 cols): Carta Holográfica 3D + Controles Anterior/Siguiente */}
                  <div className="lg:col-span-5 flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center gap-3 sm:gap-6">
                      <button
                        type="button"
                        onClick={goPrevStage}
                        className="w-11 h-11 rounded-full bg-purple-950/70 hover:bg-purple-800/80 border border-purple-400/45 text-white flex items-center justify-center text-xl transition-all cursor-pointer shadow-lg"
                        aria-label={t.prevCard}
                      >
                        ‹
                      </button>

                      <TarotCard
                        key={`${activeStageCard.uid}-${previewOrientation}`}
                        frontSrc={activeStageCard.path}
                        alt={activeStageCard.name}
                        width="min(66vw, 280px)"
                        isRevealed={isStageRevealed}
                        orientation={previewOrientation}
                        activateOnClick={false}
                        showcase={true}
                        variant="showcase"
                        onClick={() => setIsStageRevealed((prev) => !prev)}
                      />

                      <button
                        type="button"
                        onClick={goNextStage}
                        className="w-11 h-11 rounded-full bg-purple-950/70 hover:bg-purple-800/80 border border-purple-400/45 text-white flex items-center justify-center text-xl transition-all cursor-pointer shadow-lg"
                        aria-label={t.nextCard}
                      >
                        ›
                      </button>
                    </div>

                    {/* Controles rápidos de orientación y giro 3D */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewOrientation((prev) =>
                            prev === "upright" ? "reversed" : "upright",
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          previewOrientation === "reversed"
                            ? "bg-amber-500/20 border-amber-300/60 text-amber-200"
                            : "bg-emerald-500/20 border-emerald-300/60 text-emerald-200"
                        }`}
                      >
                        {previewOrientation === "reversed"
                          ? t.reversedLabel
                          : t.uprightLabel}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsStageRevealed((prev) => !prev)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/70 border border-purple-400/40 text-purple-200 cursor-pointer transition-all"
                      >
                        {t.flipCardBtn}
                      </button>
                    </div>
                  </div>

                  {/* Columna derecha (7 cols): Detalle de la carta previsualizada */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-xs font-bold text-fuchsia-200">
                          {activeStageCard.numberLabel}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/35 text-xs font-medium text-purple-200">
                          {getElementLabel(activeStageCard)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-purple-300/80">
                        {safeIndex + 1} / {filteredCards.length}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        {activeStageCard.name}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-black/45 border border-purple-500/30 rounded-2xl p-4 space-y-1.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                          {t.symbolicEssence}
                        </h3>
                        <p className="text-sm text-purple-100/90 leading-relaxed">
                          {activeStageCard.description}
                        </p>
                      </div>

                      <div className="bg-purple-950/40 border border-fuchsia-400/35 rounded-2xl p-4 space-y-1.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
                          {t.traditionalMeaning}
                        </h3>
                        <p className="text-sm text-purple-100/95 leading-relaxed">
                          {activeStageCard.meaning}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setModalCardUid(activeStageCard.uid);
                          setModalOrientation(previewOrientation);
                          setModalIsRevealed(true);
                        }}
                        className="bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 hover:from-amber-400 hover:via-fuchsia-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg border border-amber-300/40 transition-all cursor-pointer"
                      >
                        {t.openModalBtn}
                      </button>

                      <button
                        type="button"
                        onClick={goPrevStage}
                        className="px-4 py-3 rounded-2xl bg-purple-950/60 hover:bg-purple-900/75 border border-purple-500/35 text-xs font-semibold text-purple-100 cursor-pointer transition-all"
                      >
                        {t.prevCard}
                      </button>
                      <button
                        type="button"
                        onClick={goNextStage}
                        className="px-4 py-3 rounded-2xl bg-purple-950/60 hover:bg-purple-900/75 border border-purple-500/35 text-xs font-semibold text-purple-100 cursor-pointer transition-all"
                      >
                        {t.nextCard}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* GALERÍA DE CARTAS DE LA FAMILIA SELECCIONADA */}
            <section className="bg-black/50 border border-purple-500/30 rounded-3xl p-5 sm:p-7 backdrop-blur-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {t.galleryHeading}
                  </h2>
                  <p className="text-xs text-purple-300/80">
                    {t.familyRouteHint}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-950/70 border border-purple-400/35 text-fuchsia-200 self-start sm:self-auto">
                  {filteredCards.length} {t.showingCount}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCards.map((card, index) => {
                  const isSelected = index === safeIndex;
                  return (
                    <div
                      key={card.uid}
                      className={`group rounded-2xl p-3 border transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "bg-purple-900/40 border-fuchsia-400/70 shadow-xl ring-1 ring-fuchsia-400/40"
                          : "bg-purple-950/25 border-purple-500/25 hover:border-purple-400/50 hover:bg-purple-950/45"
                      }`}
                    >
                      <div
                        onClick={() => {
                          setSelectedIndex(index);
                          setModalCardUid(card.uid);
                          setModalOrientation("upright");
                          setModalIsRevealed(true);
                        }}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-purple-300/35 shadow-md group-hover:scale-[1.03] transition-transform">
                          <Image
                            src={card.path}
                            alt={card.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 180px"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-purple-400/40 text-[10px] font-bold text-fuchsia-200">
                            {card.numberLabel}
                          </span>
                        </div>

                        <div className="w-full text-center mt-2.5 space-y-1">
                          <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">
                            {card.name}
                          </h3>
                          <p className="text-[11px] text-purple-200/75 line-clamp-2 leading-relaxed">
                            {card.meaning}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1 border-t border-purple-500/20">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIndex(index);
                            setIsStageRevealed(true);
                            window.scrollTo({ top: 180, behavior: "smooth" });
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-purple-950/60 hover:bg-purple-800/70 text-[10px] font-semibold text-purple-200 hover:text-white transition-all cursor-pointer truncate"
                        >
                          Altar 3D
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIndex(index);
                            setModalCardUid(card.uid);
                            setModalOrientation("upright");
                            setModalIsRevealed(true);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-400/35 text-[10px] font-bold text-fuchsia-100 transition-all cursor-pointer truncate"
                        >
                          Detalle ✦
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      {/* MODAL DE DETALLE PROFUNDO CON HOLOGRAFÍA 3D Y NAVEGACIÓN ENTRE CARTAS */}
      {activeModalCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeModalCard.name}
          onClick={() => setModalCardUid(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-gradient-to-br from-purple-950/95 via-black/95 to-indigo-950/95 border-2 border-fuchsia-400/50 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-auto"
          >
            {/* Barra superior del modal */}
            <div className="flex items-center justify-between gap-4 border-b border-purple-500/30 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/45 text-xs font-bold text-fuchsia-200">
                  {activeModalCard.numberLabel}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/35 text-xs text-purple-200">
                  {getElementLabel(activeModalCard)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setModalCardUid(null)}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-purple-300/35 text-xs font-bold text-white cursor-pointer transition-all"
              >
                ✕ {t.closeModal}
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Carta 3D en el modal */}
              <div className="md:col-span-5 flex flex-col items-center space-y-4">
                <TarotCard
                  key={`modal-${activeModalCard.uid}-${modalOrientation}`}
                  frontSrc={activeModalCard.path}
                  alt={activeModalCard.name}
                  width="min(62vw, 250px)"
                  isRevealed={modalIsRevealed}
                  orientation={modalOrientation}
                  activateOnClick={false}
                  showcase={true}
                  variant="showcase"
                  onClick={() => setModalIsRevealed((prev) => !prev)}
                />

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setModalOrientation((prev) =>
                        prev === "upright" ? "reversed" : "upright",
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      modalOrientation === "reversed"
                        ? "bg-amber-500/20 border-amber-300/60 text-amber-200"
                        : "bg-emerald-500/20 border-emerald-300/60 text-emerald-200"
                    }`}
                  >
                    {modalOrientation === "reversed"
                      ? t.reversedLabel
                      : t.uprightLabel}
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalIsRevealed((prev) => !prev)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-950/70 hover:bg-purple-900 border border-purple-400/40 text-purple-200 cursor-pointer transition-all"
                  >
                    {t.flipCardBtn}
                  </button>
                </div>
              </div>

              {/* Explicación completa de la carta */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {activeModalCard.name}
                  </h2>
                </div>

                <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-4 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    {t.symbolicEssence}
                  </h3>
                  <p className="text-sm text-purple-100/95 leading-relaxed">
                    {activeModalCard.description}
                  </p>
                </div>

                <div className="bg-purple-950/45 border border-fuchsia-400/35 rounded-2xl p-4 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
                    {t.traditionalMeaning}
                  </h3>
                  <p className="text-sm text-purple-100/95 leading-relaxed">
                    {activeModalCard.meaning}
                  </p>
                </div>

                {/* Guía al derecho vs invertida */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-950/25 border border-emerald-400/30 rounded-2xl p-3.5 space-y-1">
                    <h4 className="text-xs font-bold text-emerald-300">
                      ↑ {t.uprightGuideTitle}
                    </h4>
                    <p className="text-xs text-purple-100/85 leading-relaxed">
                      {t.uprightGuidePrefix}{" "}
                      <strong>{activeModalCard.meaning.toLowerCase()}</strong>
                    </p>
                  </div>

                  <div className="bg-amber-950/25 border border-amber-400/30 rounded-2xl p-3.5 space-y-1">
                    <h4 className="text-xs font-bold text-amber-300">
                      ↺ {t.reversedGuideTitle}
                    </h4>
                    <p className="text-xs text-purple-100/85 leading-relaxed">
                      {t.reversedGuidePrefix}{" "}
                      <strong>{activeModalCard.meaning.toLowerCase()}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra inferior de navegación entre cartas en el modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-500/30 pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrevModal}
                  className="px-4 py-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-400/40 text-xs font-bold text-white cursor-pointer transition-all"
                >
                  {t.prevCard}
                </button>
                <span className="text-xs font-semibold text-purple-300 px-2">
                  {modalCardIndex + 1} / {filteredCards.length}
                </span>
                <button
                  type="button"
                  onClick={goNextModal}
                  className="px-4 py-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-400/40 text-xs font-bold text-white cursor-pointer transition-all"
                >
                  {t.nextCard}
                </button>
              </div>

              <Link
                href="/lectura"
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all"
              >
                {t.startReadingCta}
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


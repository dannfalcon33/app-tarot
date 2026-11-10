"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CELTIC_CROSS_POSITIONS,
  CONSULTATION_TOPICS,
  REVERSO_PATH,
} from "@/data/tarotSpread";
import { MAJOR_ARCANA } from "@/data/majorArcana";
import {
  MINOR_ARCANA_BASTOS,
  MINOR_ARCANA_COPAS,
  MINOR_ARCANA_ESPADAS,
  MINOR_ARCANA_PENTACULOS,
} from "@/data/minorArcana";
import {
  createClientSessionId,
  SupportedLocale,
  TAROT_SESSION_STORAGE_KEY,
  TarotReadingSession,
} from "@/types/tarot";
import TarotCard from "@/components/tarot/TarotCard";
import TarotCardBack from "@/components/tarot/TarotCardBack";
import Footer from "@/components/Footer";

const HERO_SPOTLIGHT_CARDS = [
  {
    id: "mago",
    name: "El Mago",
    arcanaLabel: "Arcano Mayor I",
    role: "Posición #1 · El Presente",
    path: "/tarot/Arcanos Mayores/1-mago.webp",
    summary:
      "Canalización consciente de la energía, dominio de recursos y poder de manifestación.",
  },
  {
    id: "estrella",
    name: "La Estrella",
    arcanaLabel: "Arcano Mayor XVII",
    role: "Posición #5 · La Corona",
    path: "/tarot/Arcanos Mayores/17-estrella.webp",
    summary:
      "Faro de esperanza, renovación espiritual y alineación luminosa con el cosmos.",
  },
  {
    id: "universo",
    name: "El Universo",
    arcanaLabel: "Arcano Mayor XXI",
    role: "Posición #10 · Resultado Final",
    path: "/tarot/Arcanos Mayores/21-universo.webp",
    summary:
      "Integración galáctica, plenitud y cierre exitoso de un gran ciclo vital.",
  },
];

const RITUAL_STEPS = [
  {
    step: "01",
    phase: "Preparación",
    title: "Enfoque y Pregunta Guía",
    description:
      "Elige entre los 5 ámbitos vitales y formula tu pregunta. Tu intención queda vinculada a la sesión como eje rector de toda la lectura.",
    detail: "5 enfoques · Validación en tiempo real",
    sampleCard: "/tarot/Arcanos Mayores/2-alta-sacerdotiza.webp",
    sampleLabel: "La Sacerdotisa · Intuición",
    accent: "from-purple-500/30 to-fuchsia-500/10 border-purple-400/40",
  },
  {
    step: "02",
    phase: "Barajado y Reparto",
    title: "Mezcla Fisher-Yates de 78 Cartas",
    description:
      "El motor baraja los 22 Arcanos Mayores y 56 Menores sin sesgos y congela las 10 cartas únicas que se distribuyen sobre la Cruz Celta.",
    detail: "10 posiciones sagradas sin repetición",
    sampleCard: REVERSO_PATH,
    sampleLabel: "Reverso Oficial Universe Tarot",
    accent: "from-fuchsia-500/30 to-purple-500/10 border-fuchsia-400/40",
  },
  {
    step: "03",
    phase: "Revelación 3D",
    title: "Descubre e Inspecciona Cada Arcano",
    description:
      "Voltea personalmente cada carta sobre la mesa virtual para activar su arte holográfico y explorar su simbolismo en la posición que ocupa.",
    detail: "Efecto parallax Reverse Leviathan",
    sampleCard: "/tarot/Arcanos Mayores/10-rueda-fortuna.webp",
    sampleLabel: "La Rueda de la Fortuna · Ciclos",
    accent: "from-cyan-500/25 to-indigo-500/10 border-cyan-400/40",
  },
  {
    step: "04",
    phase: "Oráculo IA",
    title: "Interpretación Editorial Profunda",
    description:
      "Al revelar las 10 cartas, la IA integra tu pregunta, el enfoque y las relaciones entre la Cruz Central y el Bastón en una lectura estructurada.",
    detail: "Síntesis coherente y accionable",
    sampleCard: "/tarot/Arcanos Mayores/19-sol.webp",
    sampleLabel: "El Sol · Claridad y Guía",
    accent: "from-amber-500/25 to-fuchsia-500/10 border-amber-400/40",
  },
];

const POSITION_EXAMPLE_CARDS: Record<
  number,
  { name: string; path: string; note: string }
> = {
  1: {
    name: "El Mago",
    path: "/tarot/Arcanos Mayores/1-mago.webp",
    note: "Muestra la energía nuclear desde la que partes hoy y los recursos disponibles.",
  },
  2: {
    name: "Dos de Espadas",
    path: "/tarot/Espadas/2-dos-espadas.webp",
    note: "Representa la fuerza que cruza el presente: el dilema o bloqueo a integrar.",
  },
  3: {
    name: "La Luna",
    path: "/tarot/Arcanos Mayores/18-luna.webp",
    note: "Ilumina la raíz inconsciente o emocional que dio origen a la consulta.",
  },
  4: {
    name: "Seis de Copas",
    path: "/tarot/Copas/6-seis-copas.webp",
    note: "Señala los eventos o memorias recientes que aún dejan eco en tu presente.",
  },
  5: {
    name: "La Estrella",
    path: "/tarot/Arcanos Mayores/17-estrella.webp",
    note: "Refleja la meta consciente y el mayor potencial alcanzable en este ciclo.",
  },
  6: {
    name: "Ocho de Bastos",
    path: "/tarot/Bastos/8-ocho-bastos.webp",
    note: "Anticipa el movimiento o escenario que se aproxima en el futuro inmediato.",
  },
  7: {
    name: "La Fuerza",
    path: "/tarot/Arcanos Mayores/11-fuerza.webp",
    note: "Describe tu postura interna, temple emocional y madurez ante la situación.",
  },
  8: {
    name: "Tres de Pentáculos",
    path: "/tarot/Pentaculos/3-tres-pentaculos.webp",
    note: "Revela las dinámicas del entorno, vínculos o circunstancias que te rodean.",
  },
  9: {
    name: "El Ermitaño",
    path: "/tarot/Arcanos Mayores/9-hermitano.webp",
    note: "Desvela tanto tus anhelos silenciosos como las dudas que temes enfrentar.",
  },
  10: {
    name: "El Universo",
    path: "/tarot/Arcanos Mayores/21-universo.webp",
    note: "Sintetiza la culminación hacia donde confluyen las 9 energías previas.",
  },
};

const ARCANA_FAMILIES = [
  {
    id: "mayores",
    title: "Arcanos Mayores",
    subtitle: "22 Cartas · El Viaje del Héroe Cósmico",
    element: "Arquetipos Universales",
    description:
      "Los 22 grandes portales evolutivos desde El Loco (0) hasta El Universo (21). Representan lecciones kármicas, despertares de consciencia y giros decisivos.",
    href: "/arcanos-mayores",
    preview: "/tarot/Arcanos Mayores/17-estrella.webp",
    badge: "22 Arcanos",
    accent: "from-purple-500/30 via-fuchsia-500/20 to-indigo-600/30",
    border: "border-purple-400/40 hover:border-purple-300",
    cards: MAJOR_ARCANA.map((c) => ({
      id: `major-${c.id}`,
      numberLabel: `Arcano Mayor ${c.id}`,
      name: c.name,
      path: c.path,
      description: c.description,
      meaning: c.meaning,
    })),
  },
  {
    id: "bastos",
    title: "Bastos",
    subtitle: "14 Cartas · Pilares de Energía",
    element: "Elemento Fuego",
    description:
      "La chispa creativa, la voluntad, el coraje, la pasión y el impulso que pone en marcha proyectos y expediciones.",
    href: "/arcanos-menores/bastos",
    preview: "/tarot/Bastos/4-cuatro-bastos.webp",
    badge: "14 Cartas",
    accent: "from-amber-500/25 via-orange-500/15 to-purple-900/30",
    border: "border-amber-400/35 hover:border-amber-300",
    cards: MINOR_ARCANA_BASTOS.map((c) => ({
      id: `bastos-${c.id}`,
      numberLabel: `Bastos · #${c.id}`,
      name: c.name,
      path: c.path,
      description: c.description,
      meaning: c.meaning,
    })),
  },
  {
    id: "copas",
    title: "Copas",
    subtitle: "14 Cartas · Cáliz de Nebulosa",
    element: "Elemento Agua",
    description:
      "El océano afectivo, los vínculos del corazón, la empatía, los sueños y la sensibilidad psíquica.",
    href: "/arcanos-menores/copas",
    preview: "/tarot/Copas/1-as-copas.webp",
    badge: "14 Cartas",
    accent: "from-cyan-500/25 via-blue-500/15 to-purple-900/30",
    border: "border-cyan-400/35 hover:border-cyan-300",
    cards: MINOR_ARCANA_COPAS.map((c) => ({
      id: `copas-${c.id}`,
      numberLabel: `Copas · #${c.id}`,
      name: c.name,
      path: c.path,
      description: c.description,
      meaning: c.meaning,
    })),
  },
  {
    id: "espadas",
    title: "Espadas",
    subtitle: "14 Cartas · Lanzas de Iones",
    element: "Elemento Aire",
    description:
      "La claridad mental, la verdad, la estrategia, el discernimiento ético y la superación de conflictos internos.",
    href: "/arcanos-menores/espadas",
    preview: "/tarot/Espadas/1-as-espadas.webp",
    badge: "14 Cartas",
    accent: "from-indigo-500/25 via-slate-400/15 to-purple-900/30",
    border: "border-indigo-400/35 hover:border-indigo-300",
    cards: MINOR_ARCANA_ESPADAS.map((c) => ({
      id: `espadas-${c.id}`,
      numberLabel: `Espadas · #${c.id}`,
      name: c.name,
      path: c.path,
      description: c.description,
      meaning: c.meaning,
    })),
  },
  {
    id: "pentaculos",
    title: "Pentáculos",
    subtitle: "14 Cartas · Fragmentos Estelares",
    element: "Elemento Tierra",
    description:
      "La manifestación tangible, el trabajo constante, la prosperidad material, la salud y el legado duradero.",
    href: "/arcanos-menores/pentaculos",
    preview: "/tarot/Pentaculos/1-as-pentaculos.webp",
    badge: "14 Cartas",
    accent: "from-emerald-500/25 via-teal-500/15 to-purple-900/30",
    border: "border-emerald-400/35 hover:border-emerald-300",
    cards: MINOR_ARCANA_PENTACULOS.map((c) => ({
      id: `pentaculos-${c.id}`,
      numberLabel: `Pentáculos · #${c.id}`,
      name: c.name,
      path: c.path,
      description: c.description,
      meaning: c.meaning,
    })),
  },
];

const LOCALE_OPTIONS: { code: SupportedLocale; label: string; short: string }[] = [
  { code: "es", label: "Español", short: "ES" },
  { code: "en", label: "English", short: "EN" },
  { code: "pt", label: "Português", short: "PT" },
];

export default function UniverseTarotLandingPage() {
  const router = useRouter();

  // Estado del formulario de consulta (Sprint 1.2)
  const [selectedTopicId, setSelectedTopicId] = useState<string>("general");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [locale, setLocale] = useState<SupportedLocale>("es");
  const [questionError, setQuestionError] = useState<string | null>(null);
  const questionInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Estado de navegación móvil y hero interactivo (Sprint 1.1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeHeroCardIndex, setActiveHeroCardIndex] = useState<number>(1);

  // Estado de secciones informativas (Sprint 1.3)
  const [highlightedPosition, setHighlightedPosition] = useState<number>(1);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("mayores");
  const [selectedPreviewCardIndex, setSelectedPreviewCardIndex] =
    useState<number>(17); // La Estrella por defecto en Mayores

  const activeTopic =
    CONSULTATION_TOPICS.find((t) => t.id === selectedTopicId) ||
    CONSULTATION_TOPICS[0];

  const activeHeroCard =
    HERO_SPOTLIGHT_CARDS[activeHeroCardIndex] || HERO_SPOTLIGHT_CARDS[0];

  const activeCelticPos =
    CELTIC_CROSS_POSITIONS.find((p) => p.position === highlightedPosition) ||
    CELTIC_CROSS_POSITIONS[0];

  const activePosExample =
    POSITION_EXAMPLE_CARDS[activeCelticPos.position] ||
    POSITION_EXAMPLE_CARDS[1];

  const activeFamily =
    ARCANA_FAMILIES.find((f) => f.id === selectedFamilyId) ||
    ARCANA_FAMILIES[0];

  const safePreviewIndex =
    selectedPreviewCardIndex < activeFamily.cards.length
      ? selectedPreviewCardIndex
      : 0;
  const activePreviewCard = activeFamily.cards[safePreviewIndex];

  const focusConsultationForm = () => {
    setMobileMenuOpen(false);
    const el = document.getElementById("consulta");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      questionInputRef.current?.focus();
    }, 350);
  };

  const handleSelectFamily = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setSelectedPreviewCardIndex(0);
  };

  const handleStartReading = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = customQuestion.trim();
    if (!trimmed || trimmed.length < 5) {
      setQuestionError(
        "Escribe tu pregunta o intención (mínimo 5 caracteres) para iniciar el ritual y vincular el análisis de IA.",
      );
      focusConsultationForm();
      return;
    }

    setQuestionError(null);

    const sessionId = createClientSessionId();
    const initialSession: TarotReadingSession = {
      sessionId,
      question: trimmed,
      category: selectedTopicId,
      locale,
      spreadType: "celtic_cross",
      cards: [],
      revealedCardIds: [],
      selectedCardId: null,
      phase: "preparing",
      interpretation: null,
      interpretationStatus: "idle",
      createdAt: new Date().toISOString(),
    };

    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          TAROT_SESSION_STORAGE_KEY,
          JSON.stringify(initialSession),
        );
      }
    } catch {
      // Continuar mediante parámetros de URL si sessionStorage está restringido
    }

    const params = new URLSearchParams();
    params.set("tema", selectedTopicId);
    params.set("consulta", trimmed);
    params.set("lang", locale);
    router.push(`/lectura/${sessionId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* BARRA DE NAVEGACIÓN SUPERIOR (Sprint 1.1) */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/65 border-b border-purple-500/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-9 h-12 rounded-lg overflow-hidden border border-purple-300/60 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Image
                src={REVERSO_PATH}
                alt="Universe Tarot Logo"
                fill
                className="object-cover"
                sizes="36px"
                priority
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-wide bg-gradient-to-r from-white via-purple-200 to-fuchsia-300 bg-clip-text text-transparent block leading-tight">
                Universe Tarot
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-purple-300/80">
                Ritual de Cruz Celta · 78 Arcanos
              </span>
            </div>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-purple-200/90"
          >
            <a
              href="#consulta"
              className="hover:text-white transition-colors"
            >
              Preparar Consulta
            </a>
            <a
              href="#como-funciona"
              className="hover:text-white transition-colors"
            >
              El Ritual
            </a>
            <a
              href="#cruz-celta"
              className="hover:text-white transition-colors"
            >
              Cruz Celta (10)
            </a>
            <a
              href="#biblioteca"
              className="hover:text-white transition-colors"
            >
              Biblioteca (78)
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Selector de idioma para la sesión */}
            <div
              role="group"
              aria-label="Idioma de interpretación"
              className="hidden sm:inline-flex items-center rounded-full bg-purple-950/60 border border-purple-500/30 p-0.5 text-xs"
            >
              {LOCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLocale(opt.code)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                    locale === opt.code
                      ? "bg-purple-600 text-white shadow"
                      : "text-purple-300 hover:text-white"
                  }`}
                  title={`Idioma de lectura: ${opt.label}`}
                >
                  {opt.short}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (customQuestion.trim().length >= 5) {
                  handleStartReading();
                } else {
                  focusConsultationForm();
                }
              }}
              className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-lg shadow-purple-600/30 border border-purple-300/35 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Iniciar Consulta ✦
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menú de navegación"
              className="lg:hidden w-10 h-10 rounded-full bg-purple-950/60 border border-purple-500/35 flex items-center justify-center text-purple-200 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Menú desplegable móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-500/25 bg-black/90 backdrop-blur-xl px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <a
                href="#consulta"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/25 text-purple-100 hover:text-white"
              >
                ✦ Preparar Consulta
              </a>
              <a
                href="#como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/25 text-purple-100 hover:text-white"
              >
                ◈ El Ritual
              </a>
              <a
                href="#cruz-celta"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/25 text-purple-100 hover:text-white"
              >
                ❖ La Cruz Celta
              </a>
              <a
                href="#biblioteca"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/25 text-purple-100 hover:text-white"
              >
                ☽ 78 Arcanos
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
              <span className="text-xs text-purple-300">
                Idioma de la lectura:
              </span>
              <div className="inline-flex items-center rounded-full bg-purple-950/60 border border-purple-500/30 p-0.5 text-xs">
                {LOCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLocale(opt.code)}
                    className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                      locale === opt.code
                        ? "bg-purple-600 text-white"
                        : "text-purple-300 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1">
        {/* HERO SECTION + FORMULARIO DE CONSULTA (Sprints 1.1 y 1.2) */}
        <section
          id="consulta"
          className="relative pt-8 pb-16 md:pt-14 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Columna Izquierda (7 cols): Presentación y Formulario en 3 pasos */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/75 border border-purple-400/40 text-purple-200 text-xs sm:text-sm font-medium shadow-inner">
                  <span className="text-fuchsia-400">✦</span>
                  <span>
                    Oráculo Cósmico Interactivo · 78 Cartas + Cruz Celta con IA
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12]">
                  Explora tu destino en el ritual de{" "}
                  <span className="bg-gradient-to-r from-purple-200 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">
                    Universe Tarot
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-purple-100/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Conecta tu intención con los 78 arcanos del cosmos. Selecciona
                  el enfoque de tu consulta, formula tu pregunta y descubre
                  personalmente las 10 posiciones de la Cruz Celta junto a una
                  interpretación profunda guiada por IA.
                </p>
              </div>

              {/* FORMULARIO SEPARADO EN 3 BLOQUES VISUALES (Sprint 1.2) */}
              <form
                onSubmit={handleStartReading}
                noValidate
                className="bg-black/65 backdrop-blur-xl border border-purple-400/35 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-purple-950/60 space-y-6"
              >
                {/* PASO 1: SELECCIÓN DE ENFOQUE / CATEGORÍA */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600/50 border border-purple-300/50 inline-flex items-center justify-center text-[11px] text-white">
                        1
                      </span>
                      <span>Elige el enfoque de tu consulta</span>
                    </label>
                    <span className="text-[11px] text-fuchsia-300 font-medium">
                      {activeTopic.shortDesc}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {CONSULTATION_TOPICS.map((topic) => {
                      const isSelected = topic.id === selectedTopicId;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setSelectedTopicId(topic.id)}
                          aria-pressed={isSelected}
                          className={`group flex flex-col items-start justify-between p-3 rounded-2xl text-left border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 ${
                            isSelected
                              ? "bg-gradient-to-br from-purple-600/50 via-fuchsia-600/35 to-indigo-900/50 border-fuchsia-300 text-white shadow-lg shadow-purple-600/25 scale-[1.02]"
                              : "bg-purple-950/30 border-purple-500/25 text-purple-200/85 hover:border-purple-400/60 hover:bg-purple-900/30 hover:text-white"
                          }`}
                        >
                          <div className="w-full flex items-center justify-between mb-1.5">
                            <span
                              className={`text-base ${
                                isSelected
                                  ? "text-amber-200"
                                  : "text-purple-300 group-hover:text-fuchsia-300"
                              }`}
                            >
                              {topic.icon}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-fuchsia-300 shadow-sm shadow-fuchsia-300" />
                            )}
                          </div>
                          <span className="text-xs sm:text-[13px] font-bold leading-snug block">
                            {topic.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PASO 2: PREGUNTA O INTENCIÓN + SUGERENCIAS RÁPIDAS */}
                <div className="space-y-2.5 pt-2 border-t border-purple-500/20">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="consulta-input"
                      className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-purple-600/50 border border-purple-300/50 inline-flex items-center justify-center text-[11px] text-white">
                        2
                      </span>
                      <span>Formula tu pregunta o intención</span>
                      <span className="text-amber-300 font-semibold">
                        (Obligatorio *)
                      </span>
                    </label>
                    <span className="text-[11px] text-purple-300/75">
                      {customQuestion.trim().length} caracteres
                    </span>
                  </div>

                  <textarea
                    ref={questionInputRef}
                    id="consulta-input"
                    rows={2}
                    required
                    value={customQuestion}
                    onChange={(e) => {
                      setCustomQuestion(e.target.value);
                      if (questionError) setQuestionError(null);
                    }}
                    placeholder={activeTopic.promptPlaceholder}
                    className={`w-full rounded-2xl bg-purple-950/45 border px-4 py-3 text-sm sm:text-base text-white placeholder-purple-300/45 focus:outline-none focus:ring-2 transition-all resize-none ${
                      questionError
                        ? "border-amber-400 focus:border-amber-400 focus:ring-amber-400/35"
                        : "border-purple-500/35 focus:border-fuchsia-400 focus:ring-fuchsia-500/30"
                    }`}
                  />

                  {/* Sugerencias rápidas según la categoría elegida */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] text-purple-300/75 mr-1">
                      Ideas para {activeTopic.label}:
                    </span>
                    {activeTopic.sampleQuestions.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCustomQuestion(sample);
                          if (questionError) setQuestionError(null);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-purple-950/60 hover:bg-purple-800/60 border border-purple-400/30 text-purple-200 hover:text-white transition-colors cursor-pointer truncate max-w-full"
                      >
                        “{sample}”
                      </button>
                    ))}
                  </div>

                  {questionError && (
                    <div
                      role="alert"
                      className="rounded-xl bg-amber-500/15 border border-amber-400/40 px-3.5 py-2.5 text-xs sm:text-sm text-amber-200 font-medium flex items-center gap-2"
                    >
                      <span>⚠</span>
                      <span>{questionError}</span>
                    </div>
                  )}
                </div>

                {/* PASO 3: TIPO DE TIRADA E IDIOMA + CTA PRINCIPAL */}
                <div className="space-y-4 pt-2 border-t border-purple-500/20">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Tipo de tirada seleccionado */}
                    <div className="sm:col-span-8 flex items-center justify-between gap-3 rounded-2xl bg-purple-950/40 border border-purple-400/35 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-fuchsia-500/25 border border-fuchsia-400/40 flex items-center justify-center text-sm font-bold text-fuchsia-200 shrink-0">
                          10
                        </span>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-fuchsia-300 font-bold block">
                            3. Tipo de Tirada Seleccionada
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-white">
                            Cruz Celta Clásica · 10 Posiciones
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-semibold shrink-0">
                        Activa ✦
                      </span>
                    </div>

                    {/* Selector de Idioma de Salida */}
                    <div className="sm:col-span-4 rounded-2xl bg-purple-950/40 border border-purple-400/30 px-3.5 py-2.5 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-300">
                        Idioma:
                      </span>
                      <div className="inline-flex rounded-xl bg-black/50 p-0.5 border border-purple-500/25">
                        {LOCALE_OPTIONS.map((opt) => (
                          <button
                            key={opt.code}
                            type="button"
                            onClick={() => setLocale(opt.code)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
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
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white font-bold py-4 px-7 rounded-2xl text-base sm:text-lg shadow-xl shadow-purple-600/35 border border-purple-300/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <span>✦</span>
                    <span>Iniciar Ritual de Cruz Celta (10 Cartas)</span>
                    <span className="text-xl">→</span>
                  </button>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-purple-300/80">
                    <span>✦ 78 Arcanos (22 Mayores + 56 Menores)</span>
                    <span>✦ Sin registro ni pagos</span>
                    <span>✦ Interpretación profunda con IA</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Columna Derecha (5 cols): Altar Holográfico Interactivo (Sprint 1.1) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-24">
              <div className="w-full bg-gradient-to-b from-purple-950/45 via-black/60 to-indigo-950/45 border border-purple-400/35 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-300 block">
                      Arte Original Holográfico
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {activeHeroCard.name} ·{" "}
                      <span className="text-purple-300 font-medium text-sm">
                        {activeHeroCard.role}
                      </span>
                    </h2>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-900/70 border border-purple-400/40 text-purple-200 font-semibold">
                    Interactivo 3D
                  </span>
                </div>

                {/* Escenario con cartas flotantes laterales y carta protagonista HoloTarotCard */}
                <div className="relative py-2 flex items-center justify-center min-h-[340px] sm:min-h-[370px]">
                  {/* Resplandor cósmico */}
                  <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-purple-600/35 via-fuchsia-500/25 to-cyan-400/20 blur-3xl pointer-events-none" />

                  {/* Carta decorativa izquierda (Reverso oficial) */}
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute left-3 top-10 w-28 aspect-[2/3] -rotate-12 opacity-60 pointer-events-none animate-float-slow"
                  >
                    <TarotCardBack sizes="112px" />
                  </div>

                  {/* Carta decorativa derecha */}
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute right-3 top-10 w-28 aspect-[2/3] rotate-12 opacity-60 pointer-events-none animate-float-slow"
                  >
                    <TarotCard
                      frontSrc={
                        HERO_SPOTLIGHT_CARDS[
                          (activeHeroCardIndex + 1) %
                            HERO_SPOTLIGHT_CARDS.length
                        ].path
                      }
                      alt=""
                      width="112px"
                      isRevealed={true}
                      enableHolo={false}
                      variant="thumbnail"
                    />
                  </div>

                  {/* Carta Protagonista Holográfica */}
                  <div className="relative z-10">
                    <TarotCard
                      frontSrc={activeHeroCard.path}
                      alt={activeHeroCard.name}
                      width="min(62vw, 230px)"
                      isRevealed={true}
                      activateOnClick={true}
                      showcase={true}
                      variant="showcase"
                    />
                  </div>
                </div>

                {/* Descripción del arcano en el Hero + Selector de carta protagonista */}
                <div className="bg-black/50 border border-purple-500/25 rounded-2xl p-3.5 text-center space-y-2">
                  <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                    {activeHeroCard.summary}
                  </p>
                  <p className="text-[11px] text-purple-300/75">
                    Pasa el cursor sobre la carta para sentir el relieve
                    holográfico o haz clic sobre ella para ver el reverso{" "}
                    <strong className="text-purple-200">Universe Tarot</strong>.
                  </p>
                </div>

                {/* Selector entre las 3 cartas protagonistas */}
                <div className="grid grid-cols-3 gap-2">
                  {HERO_SPOTLIGHT_CARDS.map((card, idx) => {
                    const isSelected = idx === activeHeroCardIndex;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setActiveHeroCardIndex(idx)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-purple-600/45 border-fuchsia-300 text-white shadow-md"
                            : "bg-purple-950/35 border-purple-500/25 text-purple-300 hover:text-white hover:border-purple-400/50"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-fuchsia-300 block font-semibold">
                          {card.arcanaLabel}
                        </span>
                        <span className="text-xs font-bold block truncate">
                          {card.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN: CÓMO FUNCIONA EL RITUAL EN 4 ETAPAS (Sprint 1.3) */}
        <section
          id="como-funciona"
          className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20 bg-black/35 backdrop-blur-sm scroll-mt-18"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
                Experiencia Progresiva
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                El Ritual de Lectura Paso a Paso
              </h2>
              <p className="text-purple-200/80 text-sm sm:text-base leading-relaxed">
                Universe Tarot transforma la consulta tradicional en un ritual
                continuo donde cada animación e interacción responde a tu
                intención.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {RITUAL_STEPS.map((item) => (
                <div
                  key={item.step}
                  className={`rounded-3xl p-6 bg-gradient-to-b ${item.accent} bg-black/60 border backdrop-blur-md flex flex-col justify-between space-y-5 hover:-translate-y-1 transition-all duration-300 shadow-xl`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-10 h-10 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-center text-sm font-extrabold text-fuchsia-300">
                        {item.step}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/50 text-purple-200 border border-white/10">
                        {item.phase}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 bg-black/45 border border-white/10 rounded-2xl p-2.5">
                      <div className="relative w-12 aspect-[2/3] rounded-lg overflow-hidden border border-purple-300/40 shrink-0">
                        <Image
                          src={item.sampleCard}
                          alt={item.sampleLabel}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-purple-300 block">
                          Ejemplo Visual
                        </span>
                        <span className="text-xs font-bold text-white block truncate">
                          {item.sampleLabel}
                        </span>
                        <span className="text-[11px] text-fuchsia-300 block truncate">
                          {item.detail}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-purple-200">
                    <span>Etapa {item.step} de 04</span>
                    <span className="text-fuchsia-300 font-semibold">✦</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN: ESQUEMA INTERACTIVO DE LA CRUZ CELTA (Sprint 1.3) */}
        <section
          id="cruz-celta"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-18"
        >
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
              Arquitectura de las 10 Posiciones
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Mapa Interactivo de la Cruz Celta
            </h2>
            <p className="text-purple-200/80 text-sm sm:text-base leading-relaxed">
              La Cruz Celta articula 10 cartas en dos estructuras
              complementarias: la{" "}
              <strong className="text-purple-200">
                Cruz Central (Posiciones 1–6)
              </strong>{" "}
              que revela el eje temporal e inconsciente, y el{" "}
              <strong className="text-fuchsia-200">
                Bastón del Destino (Posiciones 7–10)
              </strong>{" "}
              que proyecta tu actitud, el entorno y la síntesis final.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Tablero esquemático de las 10 posiciones */}
            <div className="lg:col-span-7 bg-black/55 border border-purple-500/35 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* I. La Cruz Central (1 a 6) */}
                <div className="sm:col-span-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                    <span className="text-xs uppercase tracking-wider text-purple-300 font-bold">
                      I. La Cruz Central (1 a 6)
                    </span>
                    <span className="text-[11px] text-purple-300/70">
                      Eje Tiempo / Consciencia
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto items-center justify-items-center">
                    {/* Fila Superior: Posición 5 */}
                    <div />
                    <PositionMiniCard
                      pos={5}
                      label="Corona"
                      sub="Meta"
                      active={highlightedPosition === 5}
                      onClick={() => setHighlightedPosition(5)}
                    />
                    <div />

                    {/* Fila Media: Posición 4, Centro (1 y 2), Posición 6 */}
                    <PositionMiniCard
                      pos={4}
                      label="Pasado"
                      sub="Ayer"
                      active={highlightedPosition === 4}
                      onClick={() => setHighlightedPosition(4)}
                    />
                    <div className="flex flex-col gap-2 w-full bg-purple-950/35 border border-fuchsia-400/30 rounded-2xl p-2">
                      <PositionMiniCard
                        pos={1}
                        label="Presente"
                        active={highlightedPosition === 1}
                        onClick={() => setHighlightedPosition(1)}
                        compact
                      />
                      <PositionMiniCard
                        pos={2}
                        label="Desafío"
                        active={highlightedPosition === 2}
                        onClick={() => setHighlightedPosition(2)}
                        compact
                        crossed
                      />
                    </div>
                    <PositionMiniCard
                      pos={6}
                      label="Futuro"
                      sub="Próx."
                      active={highlightedPosition === 6}
                      onClick={() => setHighlightedPosition(6)}
                    />

                    {/* Fila Inferior: Posición 3 */}
                    <div />
                    <PositionMiniCard
                      pos={3}
                      label="Base / Raíz"
                      sub="Origen"
                      active={highlightedPosition === 3}
                      onClick={() => setHighlightedPosition(3)}
                    />
                    <div />
                  </div>
                </div>

                {/* II. El Bastón (7 a 10, de abajo hacia arriba) */}
                <div className="sm:col-span-4 border-t sm:border-t-0 sm:border-l border-purple-500/20 pt-5 sm:pt-0 sm:pl-5 space-y-4">
                  <div className="border-b border-purple-500/20 pb-2 text-center sm:text-left">
                    <span className="text-xs uppercase tracking-wider text-fuchsia-300 font-bold block">
                      II. El Bastón (7 a 10)
                    </span>
                    <span className="text-[11px] text-purple-300/70">
                      Ascenso hacia el resultado
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 max-w-xs mx-auto">
                    {[10, 9, 8, 7].map((posNum) => {
                      const posObj = CELTIC_CROSS_POSITIONS.find(
                        (p) => p.position === posNum,
                      )!;
                      return (
                        <PositionMiniCard
                          key={posNum}
                          pos={posNum}
                          label={posObj.shortLabel}
                          sub={posObj.subtitle}
                          active={highlightedPosition === posNum}
                          onClick={() => setHighlightedPosition(posNum)}
                          compact
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Leyenda inferior del mapa */}
              <div className="pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-xs text-purple-300/80">
                <span>
                  Haz clic en cualquier posición (<strong>#1</strong> a{" "}
                  <strong>#10</strong>) para inspeccionar su función en el
                  ritual.
                </span>
                <span className="text-fuchsia-300 font-semibold">
                  Posición activa: #{activeCelticPos.position}
                </span>
              </div>
            </div>

            {/* Inspector detallado de la posición seleccionada + Carta de ejemplo */}
            <div className="lg:col-span-5 bg-gradient-to-br from-purple-950/60 via-black/70 to-indigo-950/50 border border-purple-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shrink-0">
                    #{activeCelticPos.position}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-300 block">
                      {activeCelticPos.group === "cruz"
                        ? "I · Círculo Central (La Cruz)"
                        : "II · Columna Derecha (El Bastón)"}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white">
                      {activeCelticPos.title}
                    </h3>
                    <p className="text-sm text-purple-300">
                      {activeCelticPos.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed border-t border-purple-500/25 pt-4">
                  {activeCelticPos.description}
                </p>

                {/* Ejemplo de carta en esta posición */}
                <div className="bg-black/50 border border-purple-400/30 rounded-2xl p-4 flex items-center gap-4">
                  <div className="relative w-16 aspect-[2/3] rounded-xl overflow-hidden border border-purple-300/40 shrink-0 shadow-md">
                    <Image
                      src={activePosExample.path}
                      alt={activePosExample.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      Ejemplo en Posición #{activeCelticPos.position}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Si aparece {activePosExample.name}:
                    </h4>
                    <p className="text-xs text-purple-200/85 leading-relaxed">
                      {activePosExample.note}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {/* Selector numérico rápido 1..10 */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                  {CELTIC_CROSS_POSITIONS.map((p) => (
                    <button
                      key={p.position}
                      type="button"
                      onClick={() => setHighlightedPosition(p.position)}
                      className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        p.position === highlightedPosition
                          ? "bg-fuchsia-500 text-white shadow-md scale-105"
                          : "bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white"
                      }`}
                    >
                      {p.position}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={focusConsultationForm}
                  className="w-full bg-white/10 hover:bg-white/15 border border-purple-300/40 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <span>Configurar mi Pregunta e Iniciar Cruz Celta</span>
                  <span>↑</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN: BIBLIOTECA INTERACTIVA DE LOS 78 ARCANOS CON PREVISUALIZACIÓN (Sprint 1.3) */}
        <section
          id="biblioteca"
          className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20 bg-black/35 scroll-mt-18"
        >
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
                  Catálogo Oficial Completo · 78 Cartas
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  Biblioteca Interactiva de los 78 Arcanos
                </h2>
              </div>
              <p className="text-purple-200/80 text-sm sm:text-base max-w-md">
                Explora los 22 Arcanos Mayores y los 56 Arcanos Menores.
                Selecciona una familia para previsualizar sus cartas con efecto
                holográfico o entra a su galería dedicada.
              </p>
            </div>

            {/* Pestañas de selección de familia para el Previsualizador en vivo */}
            <div className="flex flex-wrap gap-2">
              {ARCANA_FAMILIES.map((fam) => {
                const isActive = fam.id === selectedFamilyId;
                return (
                  <button
                    key={fam.id}
                    type="button"
                    onClick={() => handleSelectFamily(fam.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 border-white text-white shadow-lg"
                        : "bg-purple-950/45 border-purple-500/30 text-purple-200 hover:text-white hover:border-purple-400/60"
                    }`}
                  >
                    <span>{fam.title}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-purple-100">
                      {fam.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Panel de Previsualización Interactiva de la Familia Activa */}
            <div className="bg-black/60 border border-purple-400/35 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Carta previsualizada en 3D */}
              <div className="lg:col-span-4 flex flex-col items-center space-y-3">
                <TarotCard
                  frontSrc={activePreviewCard.path}
                  alt={activePreviewCard.name}
                  width="min(60vw, 220px)"
                  isRevealed={true}
                  activateOnClick={true}
                  showcase={false}
                  variant="preview"
                />
                <span className="text-[11px] text-purple-300/75 text-center">
                  Pasa el cursor para inclinar en 3D o haz clic para voltear
                </span>
              </div>

              {/* Detalle de la carta seleccionada + tira de miniaturas de la familia */}
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/25 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-200">
                        {activePreviewCard.numberLabel}
                      </span>
                      <span className="text-xs text-purple-300">
                        · {activeFamily.element}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {activePreviewCard.name}
                    </h3>
                  </div>

                  <Link
                    href={activeFamily.href}
                    className="bg-purple-600/40 hover:bg-purple-600/60 border border-purple-300/50 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-2"
                  >
                    <span>Abrir Galería de {activeFamily.title}</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-purple-950/35 border border-purple-500/25 rounded-2xl p-4 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                      Esencia Simbólica
                    </span>
                    <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                      {activePreviewCard.description}
                    </p>
                  </div>
                  <div className="bg-purple-950/35 border border-fuchsia-500/25 rounded-2xl p-4 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300">
                      Mensaje en Lectura
                    </span>
                    <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                      {activePreviewCard.meaning}
                    </p>
                  </div>
                </div>

                {/* Selector rápido de cartas dentro de la familia */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300">
                    <span>
                      Selecciona un arcano de{" "}
                      <strong className="text-white">
                        {activeFamily.title}
                      </strong>{" "}
                      para previsualizar:
                    </span>
                    <span>
                      {safePreviewIndex + 1} / {activeFamily.cards.length}
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
                    {activeFamily.cards.map((card, idx) => {
                      const isSelected = idx === safePreviewIndex;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setSelectedPreviewCardIndex(idx)}
                          className={`relative w-13 h-20 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                            isSelected
                              ? "border-fuchsia-300 ring-2 ring-fuchsia-400/70 scale-105"
                              : "border-purple-500/35 opacity-70 hover:opacity-100"
                          }`}
                          title={card.name}
                        >
                          <Image
                            src={card.path}
                            alt={card.name}
                            fill
                            className="object-cover"
                            sizes="52px"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjetas de acceso directo a las 5 Galerías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {ARCANA_FAMILIES.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group relative rounded-3xl p-5 bg-gradient-to-b ${item.accent} bg-black/60 border ${item.border} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/50 text-purple-200 border border-white/10">
                        {item.badge}
                      </span>
                      <span className="text-purple-300 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>

                    <div className="relative w-28 aspect-[2/3] mx-auto mb-4 rounded-xl overflow-hidden shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
                      <Image
                        src={item.preview}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-white text-center mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-purple-200/90 text-center font-medium mb-2">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-purple-100/75 text-center leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-center">
                    <span className="text-xs font-semibold text-white group-hover:text-fuchsia-300 transition-colors">
                      Explorar {item.badge} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

interface PositionMiniCardProps {
  pos: number;
  label: string;
  sub?: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
  crossed?: boolean;
}

function PositionMiniCard({
  pos,
  label,
  sub,
  active,
  onClick,
  compact = false,
  crossed = false,
}: PositionMiniCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden ${
        compact ? "w-full py-2.5 px-2" : "w-20 sm:w-24 aspect-[2/3] p-2"
      } ${crossed ? "ring-1 ring-fuchsia-400/40" : ""} ${
        active
          ? "bg-gradient-to-br from-purple-600/85 to-fuchsia-600/85 border-white text-white shadow-lg shadow-purple-500/30 scale-105 z-10"
          : "bg-purple-950/45 border-purple-400/35 text-purple-200 hover:border-purple-300 hover:bg-purple-900/45"
      }`}
    >
      {!compact && (
        <Image
          src={REVERSO_PATH}
          alt=""
          fill
          className="object-cover opacity-20 pointer-events-none"
          sizes="96px"
        />
      )}
      <span className="relative z-10 text-xs sm:text-sm font-extrabold">
        #{pos}
      </span>
      <span className="relative z-10 text-[10px] sm:text-xs font-semibold leading-tight mt-0.5">
        {label}
      </span>
      {sub && (
        <span className="relative z-10 text-[9px] text-purple-200/75 leading-tight mt-0.5 hidden sm:block">
          {sub}
        </span>
      )}
    </button>
  );
}

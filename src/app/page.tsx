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

const HERO_PREVIEW_CARDS = [
  {
    name: "El Mago",
    role: "1 · El Presente",
    path: "/tarot/Arcanos Mayores/1 El Mago.webp",
    rotate: "-rotate-12 -translate-x-10 translate-y-4",
  },
  {
    name: "La Estrella",
    role: "5 · La Corona",
    path: "/tarot/Arcanos Mayores/17 La Estrella.webp",
    rotate: "rotate-0 -translate-y-2 z-20 scale-105",
  },
  {
    name: "El Mundo",
    role: "10 · Resultado Final",
    path: "/tarot/Arcanos Mayores/21 El Mundo.webp",
    rotate: "rotate-12 translate-x-10 translate-y-4",
  },
];

const ARCANA_COLLECTIONS = [
  {
    title: "Arcanos Mayores",
    subtitle: "22 Cartas · El Viaje del Alma",
    description:
      "Los grandes arquetipos cósmicos que marcan lecciones profundas, cambios de ciclo y despertares espirituales.",
    href: "/arcanos-mayores",
    preview: "/tarot/Arcanos Mayores/17 La Estrella.webp",
    badge: "22 Arcanos",
    accent: "from-purple-500/30 via-fuchsia-500/20 to-indigo-600/30",
    border: "border-purple-400/40 hover:border-purple-300",
  },
  {
    title: "Bastos",
    subtitle: "Elemento Fuego · Energía y Acción",
    description:
      "Representan la chispa creativa, la voluntad, la pasión, el impulso emprendedor y el movimiento.",
    href: "/arcanos-menores/bastos",
    preview: "/tarot/Bastos/As de Bastos.webp",
    badge: "14 Cartas",
    accent: "from-amber-500/25 via-orange-500/15 to-purple-900/30",
    border: "border-amber-400/35 hover:border-amber-300",
  },
  {
    title: "Copas",
    subtitle: "Elemento Agua · Emoción e Intuición",
    description:
      "Hablan del mundo afectivo, los vínculos del corazón, la sensibilidad psíquica y los sueños.",
    href: "/arcanos-menores/copas",
    preview: "/tarot/Copas/As de Copas.webp",
    badge: "14 Cartas",
    accent: "from-cyan-500/25 via-blue-500/15 to-purple-900/30",
    border: "border-cyan-400/35 hover:border-cyan-300",
  },
  {
    title: "Espadas",
    subtitle: "Elemento Aire · Mente y Verdad",
    description:
      "Reflejan el pensamiento, las decisiones estratégicas, la comunicación honesta y los desafíos mentales.",
    href: "/arcanos-menores/espadas",
    preview: "/tarot/Espadas/1-as-espadas.webp",
    badge: "14 Cartas",
    accent: "from-indigo-500/25 via-slate-400/15 to-purple-900/30",
    border: "border-indigo-400/35 hover:border-indigo-300",
  },
  {
    title: "Pentáculos",
    subtitle: "Elemento Tierra · Materia y Abundancia",
    description:
      "Conectan con la manifestación tangible, el trabajo, los recursos, el cuerpo y la prosperidad.",
    href: "/arcanos-menores/pentaculos",
    preview: "/tarot/Pentaculos/As de Pentaculos.webp",
    badge: "14 Cartas",
    accent: "from-emerald-500/25 via-teal-500/15 to-purple-900/30",
    border: "border-emerald-400/35 hover:border-emerald-300",
  },
];

export default function UniverseTarotLandingPage() {
  const router = useRouter();
  const [selectedTopicId, setSelectedTopicId] = useState<string>("general");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [highlightedPosition, setHighlightedPosition] = useState<number>(1);
  const questionInputRef = useRef<HTMLInputElement | null>(null);

  const activeTopic =
    CONSULTATION_TOPICS.find((t) => t.id === selectedTopicId) ||
    CONSULTATION_TOPICS[0];

  const activeCelticPos =
    CELTIC_CROSS_POSITIONS.find((p) => p.position === highlightedPosition) ||
    CELTIC_CROSS_POSITIONS[0];

  const focusConsultationForm = () => {
    const el = document.getElementById("consulta");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      questionInputRef.current?.focus();
    }, 300);
  };

  const handleStartReading = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = customQuestion.trim();
    if (!trimmed || trimmed.length < 5) {
      setQuestionError(
        "Por favor, escribe tu pregunta o intención (mínimo 5 caracteres) para que la IA analice tu tirada con coherencia.",
      );
      focusConsultationForm();
      return;
    }

    setQuestionError(null);
    const params = new URLSearchParams();
    params.set("tema", selectedTopicId);
    params.set("consulta", trimmed);
    router.push(`/lectura?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* Barra de Navegación */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <span className="text-xl text-white">✦</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-white via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">
                Universe Tarot
              </span>
              <span className="hidden sm:block text-[11px] uppercase tracking-widest text-purple-300/80">
                Oráculo de Cruz Celta con IA
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-purple-200/90">
            <a
              href="#consulta"
              className="hover:text-white transition-colors"
            >
              Consulta General
            </a>
            <a
              href="#como-funciona"
              className="hover:text-white transition-colors"
            >
              Cómo Funciona
            </a>
            <a
              href="#cruz-celta"
              className="hover:text-white transition-colors"
            >
              La Cruz Celta
            </a>
            <a
              href="#biblioteca"
              className="hover:text-white transition-colors"
            >
              78 Arcanos
            </a>
          </nav>

          <button
            onClick={() => handleStartReading()}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Hacer Tirada ✦
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          id="consulta"
          className="relative pt-10 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Columna Izquierda: Presentación y Caja de Consulta */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-400/35 text-purple-200 text-xs sm:text-sm font-medium shadow-inner">
                <span className="text-fuchsia-400">✦</span>
                <span>
                  Tirada de Cruz Celta · 10 Cartas + Interpretación IA
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Conecta tu consulta con{" "}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                  Universe Tarot
                </span>
              </h1>

              <p className="text-base sm:text-lg text-purple-100/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Un espacio interactivo y moderno para consultar al tarot sobre
                cualquier inquietud de tu vida. Escribe tu pregunta para que el
                mazo de 78 cartas realice tu tirada única de Cruz Celta y la IA
                analice tu respuesta con total coherencia.
              </p>

              {/* Tarjeta Interactiva de Consulta General */}
              <form
                onSubmit={handleStartReading}
                noValidate
                className="bg-black/55 backdrop-blur-xl border border-purple-500/35 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-purple-950/50 text-left space-y-5"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
                    1. Elige el enfoque de tu consulta
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CONSULTATION_TOPICS.map((topic) => {
                      const isSelected = topic.id === selectedTopicId;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-purple-600/40 border-purple-300 text-white shadow-md shadow-purple-500/20"
                              : "bg-purple-950/30 border-purple-500/25 text-purple-200/80 hover:border-purple-400/50 hover:text-white"
                          }`}
                        >
                          <span>{topic.icon}</span>
                          <span className="truncate">{topic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <label
                      htmlFor="consulta-input"
                      className="block text-xs font-semibold uppercase tracking-wider text-purple-300"
                    >
                      2. Escribe tu pregunta o intención{" "}
                      <span className="text-amber-300 font-bold">
                        (Obligatorio *)
                      </span>
                    </label>
                    <span className="text-[11px] text-purple-300/75">
                      Guía para el análisis de IA
                    </span>
                  </div>
                  <input
                    ref={questionInputRef}
                    id="consulta-input"
                    type="text"
                    required
                    value={customQuestion}
                    onChange={(e) => {
                      setCustomQuestion(e.target.value);
                      if (questionError) setQuestionError(null);
                    }}
                    placeholder={activeTopic.promptPlaceholder}
                    className={`w-full rounded-2xl bg-purple-950/40 border px-4 py-3.5 text-sm sm:text-base text-white placeholder-purple-300/45 focus:outline-none focus:ring-2 transition-all ${
                      questionError
                        ? "border-amber-400 focus:border-amber-400 focus:ring-amber-400/30"
                        : "border-purple-500/35 focus:border-fuchsia-400 focus:ring-fuchsia-500/30"
                    }`}
                  />
                  {questionError ? (
                    <p className="mt-2 text-xs sm:text-sm text-amber-300 font-medium flex items-center gap-1.5">
                      <span>⚠</span>
                      <span>{questionError}</span>
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-purple-300/70">
                      Tu pregunta servirá como prompt guía para que la IA
                      conecte las 10 cartas de la Cruz Celta con tu situación.
                    </p>
                  )}
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white font-bold py-4 px-7 rounded-2xl text-base sm:text-lg shadow-xl shadow-purple-600/35 border border-purple-300/30 transition-all hover:scale-[1.02] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Iniciar mi Lectura de 10 Cartas</span>
                    <span className="text-xl">→</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-purple-300/75 border-t border-purple-500/20">
                  <span>✦ Mazo completo: 22 Mayores + 56 Menores</span>
                  <span>✦ Tirada única por consulta</span>
                  <span>✦ Interpretación con IA coherente</span>
                </div>
              </form>
            </div>

            {/* Columna Derecha: Visual Cósmico de Cartas en Abanico */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md h-[380px] sm:h-[430px] flex items-center justify-center">
                {/* Halo luminoso detrás de las cartas */}
                <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-purple-600/35 via-fuchsia-500/25 to-indigo-500/30 blur-3xl pointer-events-none" />

                <div className="relative flex items-center justify-center animate-float-slow">
                  {HERO_PREVIEW_CARDS.map((card, idx) => (
                    <div
                      key={card.name}
                      onClick={() => handleStartReading()}
                      className={`relative w-36 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-purple-300/40 bg-black/80 transition-all duration-500 hover:scale-110 hover:z-30 cursor-pointer ${card.rotate}`}
                      style={{
                        marginLeft: idx === 0 ? "0" : "-48px",
                      }}
                    >
                      <Image
                        src={card.path}
                        alt={card.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 144px, 176px"
                        priority
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-purple-300 font-semibold">
                          {card.role}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-white">
                          {card.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-purple-300/80 text-center max-w-xs mt-2">
                Escribe tu pregunta en el formulario y pulsa el botón principal
                para generar tu tirada de Cruz Celta.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN: CÓMO FUNCIONA */}
        <section
          id="como-funciona"
          className="py-16 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20 bg-black/30 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400">
                El Ritual Interactivo
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
                ¿Cómo realizar tu tirada en Universe Tarot?
              </h2>
              <p className="text-purple-200/80 text-base">
                Una experiencia estructurada donde tu intención guía la mezcla
                del mazo y el análisis del Oráculo de IA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-950/25 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md hover:border-purple-400/60 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-xl font-bold text-purple-200 mb-5">
                  01
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Formula tu Pregunta Guía
                </h3>
                <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed">
                  Escribe de forma clara lo que deseas consultar y selecciona
                  el ámbito de tu pregunta. Este texto es obligatorio porque
                  actúa como el eje rector de toda tu lectura.
                </p>
              </div>

              <div className="bg-purple-950/25 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md hover:border-purple-400/60 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-600/30 border border-fuchsia-400/40 flex items-center justify-center text-xl font-bold text-fuchsia-200 mb-5">
                  02
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Barajado Único y Sagrado
                </h3>
                <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed">
                  Al iniciar tu consulta, el motor mezcla las 78 cartas del
                  tarot mediante el algoritmo Fisher-Yates y fija tus 10 cartas
                  destinadas a responder específicamente a tu pregunta.
                </p>
              </div>

              <div className="bg-purple-950/25 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md hover:border-purple-400/60 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xl font-bold text-indigo-200 mb-5">
                  03
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Revela e Interpreta con IA
                </h3>
                <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed">
                  Descubre cada una de las 10 cartas de la Cruz Celta y solicita
                  la interpretación con IA para obtener una lectura coherente
                  que enlaza cada posición con tu pregunta inicial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN: EXPLICACIÓN INTERACTIVA DE LA CRUZ CELTA (10 CARTAS) */}
        <section
          id="cruz-celta"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-300">
              Estructura de 10 Cartas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
              La Tirada de la Cruz Celta
            </h2>
            <p className="text-purple-200/80 text-base">
              Considerada la tirada más completa del tarot clásico, divide las
              10 cartas en dos secciones: el{" "}
              <strong className="text-purple-200">Círculo Central (1–6)</strong>{" "}
              y el{" "}
              <strong className="text-fuchsia-200">
                Bastón del Destino (7–10)
              </strong>
              . Selecciona cualquier posición para conocer su propósito:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Mapa interactivo de las 10 posiciones */}
            <div className="lg:col-span-7 bg-black/50 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* La Cruz (1 a 6) */}
                <div className="sm:col-span-8">
                  <p className="text-xs uppercase tracking-wider text-purple-300/80 text-center mb-4 font-semibold">
                    I. La Cruz Central (Posiciones 1 a 6)
                  </p>
                  <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto items-center justify-items-center">
                    {/* Fila Superior: Posición 5 */}
                    <div />
                    <PositionMiniCard
                      pos={5}
                      label="Corona"
                      active={highlightedPosition === 5}
                      onClick={() => setHighlightedPosition(5)}
                    />
                    <div />

                    {/* Fila Media: Posición 4, Centro (1 y 2), Posición 6 */}
                    <PositionMiniCard
                      pos={4}
                      label="Pasado"
                      active={highlightedPosition === 4}
                      onClick={() => setHighlightedPosition(4)}
                    />
                    <div className="flex flex-col gap-1.5 w-full">
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
                      active={highlightedPosition === 6}
                      onClick={() => setHighlightedPosition(6)}
                    />

                    {/* Fila Inferior: Posición 3 */}
                    <div />
                    <PositionMiniCard
                      pos={3}
                      label="Base / Raíz"
                      active={highlightedPosition === 3}
                      onClick={() => setHighlightedPosition(3)}
                    />
                    <div />
                  </div>
                </div>

                {/* El Bastón (7 a 10, de abajo hacia arriba como en la tradición) */}
                <div className="sm:col-span-4 border-t sm:border-t-0 sm:border-l border-purple-500/20 pt-5 sm:pt-0 sm:pl-5">
                  <p className="text-xs uppercase tracking-wider text-fuchsia-300/80 text-center mb-4 font-semibold">
                    II. El Bastón (7 a 10)
                  </p>
                  <div className="flex sm:flex-col justify-center gap-2 max-w-xs mx-auto">
                    {[10, 9, 8, 7].map((posNum) => {
                      const posObj = CELTIC_CROSS_POSITIONS.find(
                        (p) => p.position === posNum,
                      )!;
                      return (
                        <PositionMiniCard
                          key={posNum}
                          pos={posNum}
                          label={posObj.shortLabel}
                          active={highlightedPosition === posNum}
                          onClick={() => setHighlightedPosition(posNum)}
                          compact
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalle de la posición seleccionada */}
            <div className="lg:col-span-5 bg-gradient-to-br from-purple-950/50 via-black/60 to-indigo-950/40 border border-purple-400/35 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg">
                  #{activeCelticPos.position}
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-fuchsia-300">
                    {activeCelticPos.group === "cruz"
                      ? "Círculo Central · La Cruz"
                      : "Columna Derecha · El Bastón"}
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    {activeCelticPos.title}
                  </h3>
                  <p className="text-sm text-purple-300">
                    {activeCelticPos.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-purple-100/90 text-base leading-relaxed border-t border-purple-500/25 pt-4">
                {activeCelticPos.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {CELTIC_CROSS_POSITIONS.map((p) => (
                  <button
                    key={p.position}
                    type="button"
                    onClick={() => setHighlightedPosition(p.position)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      p.position === highlightedPosition
                        ? "bg-fuchsia-500 text-white shadow-md scale-105"
                        : "bg-purple-950/50 border border-purple-500/30 text-purple-300 hover:text-white"
                    }`}
                  >
                    {p.position}
                  </button>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleStartReading()}
                  className="w-full bg-white/10 hover:bg-white/15 border border-purple-300/40 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Escribir mi Pregunta e Iniciar Tirada</span>
                  <span>↑</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN: BIBLIOTECA DE LOS 78 ARCANOS */}
        <section
          id="biblioteca"
          className="py-16 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20 bg-black/30"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400">
                  Sabiduría del Mazo
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">
                  Explora la Biblioteca de los 78 Arcanos
                </h2>
              </div>
              <p className="text-purple-200/80 text-sm sm:text-base max-w-md">
                ¿Quieres estudiar el significado individual de cada carta antes
                de tu lectura? Recorre las galerías completas por palo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {ARCANA_COLLECTIONS.map((item) => (
                <Link
                  key={item.title}
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
                      Ver Galería Completa
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-purple-500/20 bg-black/60 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-purple-300/75">
          <div className="flex items-center gap-2">
            <span className="text-fuchsia-400">✦</span>
            <span className="font-semibold text-white">Universe Tarot</span>
            <span>— Oráculo Cósmico de 10 Cartas (Cruz Celta)</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#consulta"
              onClick={(e) => {
                e.preventDefault();
                focusConsultationForm();
              }}
              className="hover:text-white transition-colors"
            >
              Iniciar Consulta
            </a>
            <Link
              href="/arcanos-mayores"
              className="hover:text-white transition-colors"
            >
              Arcanos Mayores
            </Link>
            <Link
              href="/arcanos-menores/bastos"
              className="hover:text-white transition-colors"
            >
              Bastos
            </Link>
            <Link
              href="/arcanos-menores/copas"
              className="hover:text-white transition-colors"
            >
              Copas
            </Link>
            <Link
              href="/arcanos-menores/espadas"
              className="hover:text-white transition-colors"
            >
              Espadas
            </Link>
            <Link
              href="/arcanos-menores/pentaculos"
              className="hover:text-white transition-colors"
            >
              Pentáculos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface PositionMiniCardProps {
  pos: number;
  label: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
  crossed?: boolean;
}

function PositionMiniCard({
  pos,
  label,
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
          ? "bg-gradient-to-br from-purple-600/80 to-fuchsia-600/80 border-white text-white shadow-lg shadow-purple-500/30 scale-105 z-10"
          : "bg-purple-950/40 border-purple-400/35 text-purple-200 hover:border-purple-300 hover:bg-purple-900/40"
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
      <span className="relative z-10 text-[10px] sm:text-xs font-medium leading-tight mt-0.5">
        {label}
      </span>
    </button>
  );
}

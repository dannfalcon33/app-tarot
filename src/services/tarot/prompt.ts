import type { CardOrientation, SupportedLocale } from "@/types/tarot";

export interface SpreadCardInput {
  position: number;
  positionTitle: string;
  positionSubtitle: string;
  cardName: string;
  categoryLabel: string;
  orientation?: CardOrientation;
  description: string;
  meaning: string;
}

export interface InterpretRequestPayload {
  question: string;
  topicLabel: string;
  categoryId?: string;
  locale?: SupportedLocale;
  cards: SpreadCardInput[];
}

export type InterpretationChapterKey =
  | "diagnosticoGeneral"
  | "energiaCentral"
  | "influenciasBloqueos"
  | "pasadoEvolucion"
  | "situacionActual"
  | "futuroTendencias"
  | "relacionesCartas"
  | "guiaConclusion";

export interface InterpretationChapter {
  key: InterpretationChapterKey;
  numberRoman: string;
  title: string;
  subtitle: string;
  relatedPositions: number[];
  content: string;
}

export interface InterpretResponseData {
  provider: string;
  model: string;
  locale: SupportedLocale;
  // Campos compatibles con versiones previas y resumen ejecutivo
  summary: string;
  cruzCentral: string;
  bastonDestino: string;
  consejoFinal: string;
  // Los 8 capítulos estructurados de la Fase 4
  chapters: InterpretationChapter[];
}

const CHAPTER_MARKERS: {
  key: InterpretationChapterKey;
  tag: string;
  numberRoman: string;
  relatedPositions: number[];
  titles: Record<SupportedLocale, { title: string; subtitle: string }>;
}[] = [
  {
    key: "diagnosticoGeneral",
    tag: "DIAGNOSTICO_GENERAL",
    numberRoman: "I",
    relatedPositions: [1, 2, 10],
    titles: {
      es: {
        title: "Diagnóstico General",
        subtitle: "Visión integral y mensaje rector de tu Cruz Celta",
      },
      en: {
        title: "General Diagnosis",
        subtitle: "Holistic overview and core message of your Celtic Cross",
      },
      pt: {
        title: "Diagnóstico Geral",
        subtitle: "Visão integral e mensagem central da sua Cruz Celta",
      },
    },
  },
  {
    key: "energiaCentral",
    tag: "ENERGIA_CENTRAL",
    numberRoman: "II",
    relatedPositions: [1, 5],
    titles: {
      es: {
        title: "Energía Central",
        subtitle: "El núcleo vibrante del presente y tu potencial consciente",
      },
      en: {
        title: "Core Energy",
        subtitle: "The vibrating heart of the present and conscious potential",
      },
      pt: {
        title: "Energia Central",
        subtitle: "O núcleo vibrante do presente e seu potencial consciente",
      },
    },
  },
  {
    key: "influenciasBloqueos",
    tag: "INFLUENCIAS_BLOQUEOS",
    numberRoman: "III",
    relatedPositions: [2, 8, 9],
    titles: {
      es: {
        title: "Influencias y Bloqueos",
        subtitle: "Lo que cruza tu camino, el entorno y tus temores internos",
      },
      en: {
        title: "Influences & Blockages",
        subtitle: "Crossing forces, external environment, and inner fears",
      },
      pt: {
        title: "Influências e Bloqueios",
        subtitle: "O que cruza seu caminho, o ambiente e temores internos",
      },
    },
  },
  {
    key: "pasadoEvolucion",
    tag: "PASADO_EVOLUCION",
    numberRoman: "IV",
    relatedPositions: [3, 4],
    titles: {
      es: {
        title: "Pasado y Evolución",
        subtitle: "Raíz inconsciente y memoria reciente que dieron origen al hoy",
      },
      en: {
        title: "Past & Evolution",
        subtitle: "Subconscious root and recent events shaping today",
      },
      pt: {
        title: "Passado e Evolução",
        subtitle: "Raiz inconsciente e memória recente que moldaram o presente",
      },
    },
  },
  {
    key: "situacionActual",
    tag: "SITUACION_ACTUAL",
    numberRoman: "V",
    relatedPositions: [1, 7, 8],
    titles: {
      es: {
        title: "Situación Actual",
        subtitle: "Tu actitud interna frente a las circunstancias presentes",
      },
      en: {
        title: "Current Situation",
        subtitle: "Your inner stance facing present circumstances",
      },
      pt: {
        title: "Situação Atual",
        subtitle: "Sua atitude interna diante das circunstâncias atuais",
      },
    },
  },
  {
    key: "futuroTendencias",
    tag: "FUTURO_TENDENCIAS",
    numberRoman: "VI",
    relatedPositions: [6, 10],
    titles: {
      es: {
        title: "Futuro y Tendencias",
        subtitle: "El horizonte próximo y la culminación en el Resultado Final",
      },
      en: {
        title: "Future & Trends",
        subtitle: "Near horizon and culmination in the Final Outcome",
      },
      pt: {
        title: "Futuro e Tendências",
        subtitle: "O horizonte próximo e a culminação no Resultado Final",
      },
    },
  },
  {
    key: "relacionesCartas",
    tag: "RELACIONES_CARTAS",
    numberRoman: "VII",
    relatedPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    titles: {
      es: {
        title: "Relaciones entre las Cartas",
        subtitle: "Sinergias, arcanos mayores, elementos y orientaciones",
      },
      en: {
        title: "Card Synergies & Connections",
        subtitle: "Dialogues between Major Arcana, elements, and orientations",
      },
      pt: {
        title: "Relações entre as Cartas",
        subtitle: "Sinergias entre Arcanos Maiores, elementos e orientações",
      },
    },
  },
  {
    key: "guiaConclusion",
    tag: "GUIA_Y_CONCLUSION",
    numberRoman: "VIII",
    relatedPositions: [5, 7, 9, 10],
    titles: {
      es: {
        title: "Guía Práctica y Conclusión",
        subtitle: "Consejo accionable y síntesis espiritual para tu camino",
      },
      en: {
        title: "Practical Guidance & Conclusion",
        subtitle: "Actionable advice and spiritual synthesis for your path",
      },
      pt: {
        title: "Guia Prático e Conclusão",
        subtitle: "Conselho prático e síntese espiritual para o seu caminho",
      },
    },
  },
];

export function normalizeLocale(locale?: string): SupportedLocale {
  if (locale === "en" || locale === "pt") return locale;
  return "es";
}

function getOrientationLabel(
  orientation: CardOrientation | undefined,
  locale: SupportedLocale,
): string {
  const isReversed = orientation === "reversed";
  if (locale === "en") {
    return isReversed
      ? "Reversed (internalized energy, blockage to unblock, or subtle shadow)"
      : "Upright (fluid, direct, and active expression)";
  }
  if (locale === "pt") {
    return isReversed
      ? "Invertida (energia internalizada, bloqueio a liberar ou nuance sutil)"
      : "Ao Direito (expressão fluida, direta e consciente)";
  }
  return isReversed
    ? "Invertida (energía internalizada, bloqueo a destrabar o aprendizaje interno)"
    : "Al Derecho (expresión directa, consciente y fluida)";
}

export function buildSystemPrompt(locale: SupportedLocale = "es"): string {
  const languageDirective =
    locale === "en"
      ? "WRITE YOUR ENTIRE INTERPRETATION IN ENGLISH. Every chapter must be written in clear, empathetic, insightful English."
      : locale === "pt"
        ? "ESCREVA TODA A SUA INTERPRETAÇÃO EM PORTUGUÊS. Cada capítulo deve ser redigido em português claro, empático e profundo."
        : "ESCRIBE TODA TU INTERPRETACIÓN EN ESPAÑOL. Cada capítulo debe redactarse en un español cálido, empático, claro y profundo.";

  return `Eres el Maestro Oráculo de "Universe Tarot", un tarotista experto en la Cruz Celta clásica de 10 cartas.
Tu misión es ofrecer una INTERPRETACIÓN PROFUNDA, COHERENTE Y ENFOCADA EN DAR GUÍA REAL al consultante.
${languageDirective}

REGLAS ESTRICTAS DE INTERPRETACIÓN:
1. PROHIBIDO limitarte a enumerar las cartas como un diccionario ("En la posición 1 salió X..."). El consultante ya ve las 10 cartas en su mesa virtual.
2. INTEGRA LA ORIENTACIÓN (AL DERECHO / INVERTIDA): Explica con naturalidad cómo influye que cada carta aparezca al derecho (expresión fluida) o invertida (energía interiorizada, resistencia o aspecto que pide desbloqueo).
3. COHERENCIA ENTRE LAS 10 CARTAS: Conecta las cartas entre sí (cómo dialoga la posición #1 con la #2, cómo las raíces #3 y #4 explican el presente, y cómo el Bastón #7-#10 conduce al desenlace).
4. Usa **negritas** al mencionar los nombres de las cartas e ideas clave para facilitar la lectura editorial.

ESTRUCTURA OBLIGATORIA EN 8 CAPÍTULOS:
Divide tu respuesta usando EXACTAMENTE estos 8 encabezados entre corchetes (no cambies el nombre de las etiquetas entre corchetes, aunque redactes el contenido en el idioma solicitado) y desarrolla de 1 a 2 párrafos sustanciosos en cada uno:

[DIAGNOSTICO_GENERAL]
(Visión panorámica que responde directamente a la pregunta y categoría del consultante, conectando la carta #1, el desafío #2 y el desenlace #10.)

[ENERGIA_CENTRAL]
(Análisis profundo del eje central de la tirada: la carta #1 en el Presente y la carta #5 en la Corona/Meta superior.)

[INFLUENCIAS_BLOQUEOS]
(Qué fuerzas cruzan el camino en la carta #2, cómo impacta el entorno en la #8 y qué revelan las esperanzas o temores en la #9.)

[PASADO_EVOLUCION]
(Cómo la raíz inconsciente #3 y el pasado reciente #4 explican el origen emocional, mental o práctico de la situación actual.)

[SITUACION_ACTUAL]
(Cómo interactúa el estado presente #1 con la actitud interna del consultante #7 y su realidad exterior #8.)

[FUTURO_TENDENCIAS]
(La evolución desde el futuro inmediato #6 hacia la culminación en el Resultado Final #10, teniendo en cuenta su orientación.)

[RELACIONES_CARTAS]
(Síntesis de las conexiones más reveladoras entre las 10 cartas: predominio de Arcanos Mayores o palos elementales, contrastes entre cartas al derecho e invertidas, y el hilo conductor de la mesa.)

[GUIA_Y_CONCLUSION]
(Consejo práctico, espiritual y accionable en 3 pasos concretos para que el consultante tome decisiones con claridad frente a su pregunta.)`;
}

export function buildUserPrompt(payload: InterpretRequestPayload): string {
  const locale = normalizeLocale(payload.locale);
  const sorted = [...payload.cards].sort((a, b) => a.position - b.position);

  const cardsList = sorted
    .map((c) => {
      const orientText = getOrientationLabel(c.orientation, locale);
      return `- Posición #${c.position} (${c.positionTitle} / ${c.positionSubtitle}): **${c.cardName}** [${c.categoryLabel}] — Orientación: ${orientText} | Esencia: ${c.description} | Significado: ${c.meaning}`;
    })
    .join("\n");

  const langName =
    locale === "en"
      ? "English (en)"
      : locale === "pt"
        ? "Português (pt)"
        : "Español (es)";

  return `=== DATOS DE LA SESIÓN DE LECTURA ===
Ámbito / Categoría: ${payload.topicLabel}
Idioma solicitado de respuesta: ${langName}
Pregunta o intención guía del consultante: "${payload.question}"

=== LAS 10 CARTAS DE LA CRUZ CELTA EN LA MESA ===
${cardsList}

Por favor, genera la lectura completa en ${langName} conectando estas 10 cartas exactas y sus orientaciones con la pregunta "${payload.question}". Incluye obligatoriamente los 8 marcadores exactos:
[DIAGNOSTICO_GENERAL], [ENERGIA_CENTRAL], [INFLUENCIAS_BLOQUEOS], [PASADO_EVOLUCION], [SITUACION_ACTUAL], [FUTURO_TENDENCIAS], [RELACIONES_CARTAS] y [GUIA_Y_CONCLUSION].`;
}

function buildChaptersArray(
  locale: SupportedLocale,
  contentsByKey: Record<InterpretationChapterKey, string>,
): InterpretationChapter[] {
  return CHAPTER_MARKERS.map((marker) => ({
    key: marker.key,
    numberRoman: marker.numberRoman,
    title: marker.titles[locale].title,
    subtitle: marker.titles[locale].subtitle,
    relatedPositions: marker.relatedPositions,
    content: contentsByKey[marker.key],
  }));
}

export function parseAndValidateInterpretation(
  rawText: string,
  payload: InterpretRequestPayload,
): Omit<InterpretResponseData, "provider" | "model"> {
  const locale = normalizeLocale(payload.locale);
  const cleaned = rawText.replace(/```markdown|```json|```/gi, "").trim();
  const fallback = buildDeepGuidedSynthesis(payload);

  const allTags = CHAPTER_MARKERS.map((m) => m.tag);

  const extractTagContent = (
    startTag: string,
    otherTags: string[],
  ): string | null => {
    const startRegex = new RegExp(
      `(?:###?\\s*)?\\*?\\*?\\[${startTag}\\]\\*?\\*?[:\\s]*`,
      "i",
    );
    const startMatch = cleaned.match(startRegex);
    if (!startMatch || startMatch.index === undefined) return null;

    const contentStart = startMatch.index + startMatch[0].length;
    const remaining = cleaned.slice(contentStart);

    let earliestEnd = remaining.length;
    for (const nextTag of otherTags) {
      if (nextTag === startTag) continue;
      const nextRegex = new RegExp(
        `(?:###?\\s*)?\\*?\\*?\\[${nextTag}\\]\\*?\\*?`,
        "i",
      );
      const nextMatch = remaining.match(nextRegex);
      if (
        nextMatch &&
        nextMatch.index !== undefined &&
        nextMatch.index < earliestEnd
      ) {
        earliestEnd = nextMatch.index;
      }
    }

    const extracted = remaining.slice(0, earliestEnd).trim();
    return extracted.length >= 40 ? extracted : null;
  };

  const extractedMap: Partial<Record<InterpretationChapterKey, string>> = {};
  let foundCount = 0;

  for (const marker of CHAPTER_MARKERS) {
    const sectionText = extractTagContent(marker.tag, allTags);
    if (sectionText) {
      extractedMap[marker.key] = sectionText;
      foundCount++;
    }
  }

  // Si la IA devolvió al menos 5 de los 8 marcadores, completamos cualquier faltante con la síntesis coherente de respaldo
  if (foundCount >= 5) {
    const fallbackByKey = Object.fromEntries(
      fallback.chapters.map((ch) => [ch.key, ch.content]),
    ) as Record<InterpretationChapterKey, string>;

    const finalByKey: Record<InterpretationChapterKey, string> = {
      diagnosticoGeneral:
        extractedMap.diagnosticoGeneral || fallbackByKey.diagnosticoGeneral,
      energiaCentral:
        extractedMap.energiaCentral || fallbackByKey.energiaCentral,
      influenciasBloqueos:
        extractedMap.influenciasBloqueos || fallbackByKey.influenciasBloqueos,
      pasadoEvolucion:
        extractedMap.pasadoEvolucion || fallbackByKey.pasadoEvolucion,
      situacionActual:
        extractedMap.situacionActual || fallbackByKey.situacionActual,
      futuroTendencias:
        extractedMap.futuroTendencias || fallbackByKey.futuroTendencias,
      relacionesCartas:
        extractedMap.relacionesCartas || fallbackByKey.relacionesCartas,
      guiaConclusion:
        extractedMap.guiaConclusion || fallbackByKey.guiaConclusion,
    };

    const chapters = buildChaptersArray(locale, finalByKey);

    return {
      locale,
      summary: finalByKey.diagnosticoGeneral,
      cruzCentral: `${finalByKey.energiaCentral}\n\n${finalByKey.pasadoEvolucion}`,
      bastonDestino: `${finalByKey.situacionActual}\n\n${finalByKey.futuroTendencias}`,
      consejoFinal: finalByKey.guiaConclusion,
      chapters,
    };
  }

  //Si el modelo devolvió párrafos extensos libres sin las etiquetas exactas (mínimo 6 bloques ricos)
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((b) =>
      b
        .replace(/^#+\s*.*$/gm, "")
        .replace(/^\[[A-Z_]+\]\s*/gim, "")
        .trim(),
    )
    .filter((b) => b.length > 65);

  if (paragraphs.length >= 6) {
    const fallbackByKey = Object.fromEntries(
      fallback.chapters.map((ch) => [ch.key, ch.content]),
    ) as Record<InterpretationChapterKey, string>;

    const finalByKey: Record<InterpretationChapterKey, string> = {
      diagnosticoGeneral: paragraphs[0] || fallbackByKey.diagnosticoGeneral,
      energiaCentral: paragraphs[1] || fallbackByKey.energiaCentral,
      influenciasBloqueos: paragraphs[2] || fallbackByKey.influenciasBloqueos,
      pasadoEvolucion: paragraphs[3] || fallbackByKey.pasadoEvolucion,
      situacionActual: paragraphs[4] || fallbackByKey.situacionActual,
      futuroTendencias: paragraphs[5] || fallbackByKey.futuroTendencias,
      relacionesCartas: paragraphs[6] || fallbackByKey.relacionesCartas,
      guiaConclusion:
        paragraphs.slice(7).join("\n\n") ||
        paragraphs[paragraphs.length - 1] ||
        fallbackByKey.guiaConclusion,
    };

    const chapters = buildChaptersArray(locale, finalByKey);
    return {
      locale,
      summary: finalByKey.diagnosticoGeneral,
      cruzCentral: `${finalByKey.energiaCentral}\n\n${finalByKey.pasadoEvolucion}`,
      bastonDestino: `${finalByKey.situacionActual}\n\n${finalByKey.futuroTendencias}`,
      consejoFinal: finalByKey.guiaConclusion,
      chapters,
    };
  }

  return fallback;
}

/**
 * Motor narrativo determinista en 8 capítulos (ES / EN / PT)
 * que garantiza que la lectura siempre responda a las 10 cartas exactas,
 * sus posiciones, sus orientaciones y la pregunta guía del usuario.
 */
export function buildDeepGuidedSynthesis(
  payload: InterpretRequestPayload,
): Omit<InterpretResponseData, "provider" | "model"> {
  const locale = normalizeLocale(payload.locale);
  const sorted = [...payload.cards].sort((a, b) => a.position - b.position);
  const c = (pos: number) =>
    sorted.find((item) => item.position === pos) || sorted[0];

  const c1 = c(1);
  const c2 = c(2);
  const c3 = c(3);
  const c4 = c(4);
  const c5 = c(5);
  const c6 = c(6);
  const c7 = c(7);
  const c8 = c(8);
  const c9 = c(9);
  const c10 = c(10);

  const majorCards = sorted.filter((item) =>
    item.categoryLabel.includes("Arcano Mayor"),
  );
  const reversedCards = sorted.filter(
    (item) => item.orientation === "reversed",
  );

  const suitCounts = {
    Bastos: sorted.filter((i) => i.categoryLabel.includes("Bastos")).length,
    Copas: sorted.filter((i) => i.categoryLabel.includes("Copas")).length,
    Espadas: sorted.filter((i) => i.categoryLabel.includes("Espadas")).length,
    Pentaculos: sorted.filter((i) => i.categoryLabel.includes("Pentáculos"))
      .length,
  };

  const formatCardWithOrientation = (card: SpreadCardInput) => {
    const isRev = card.orientation === "reversed";
    if (locale === "en") {
      return `**${card.cardName}** (${isRev ? "Reversed" : "Upright"})`;
    }
    if (locale === "pt") {
      return `**${card.cardName}** (${isRev ? "Invertida" : "Ao Direito"})`;
    }
    return `**${card.cardName}** (${isRev ? "Invertida" : "Al Derecho"})`;
  };

  const orientationNuance = (card: SpreadCardInput) => {
    const isRev = card.orientation === "reversed";
    if (locale === "en") {
      return isRev
        ? "because it appears reversed, its energy asks you to release inner resistance and process this lesson from within before forcing external results"
        : "appearing upright, its archetype flows openly and offers direct momentum you can consciously channel right now";
    }
    if (locale === "pt") {
      return isRev
        ? "por surgir invertida, sua energia pede que você libere resistências internas e trabalhe essa lição interiormente antes de forçar resultados externos"
        : "ao surgir ao direito, seu arquétipo flui de forma aberta e oferece um impulso direto que você pode canalizar conscientemente agora";
    }
    return isRev
      ? "al manifestarse en posición invertida, su energía indica un proceso que primero debe destrabarse o asimilarse en tu mundo interno antes de forzar resultados externos"
      : "al presentarse al derecho, su arquetipo fluye con claridad directa y te brinda un impulso activo que puedes canalizar conscientemente";
  };

  if (locale === "en") {
    const byKey: Record<InterpretationChapterKey, string> = {
      diagnosticoGeneral: `Connecting with your consultation on **${payload.topicLabel}** (“${payload.question}”), your Celtic Cross reveals a central dialogue between ${formatCardWithOrientation(c1)} at the heart of the present and ${formatCardWithOrientation(c2)} crossing your path. This opening axis shows that your question arises at a pivotal moment where ${c1.description.toLowerCase()}, calling you to integrate the principle of ${c1.meaning.toLowerCase()}.\n\nWith **${majorCards.length} Major Arcana** and **${reversedCards.length} reversed cards** across the 10 positions, the spread indicates that your situation is moving toward ${formatCardWithOrientation(c10)} as the Final Outcome—reminding you that conscious alignment transforms tension into evolution.`,
      energiaCentral: `The core vitality of your reading rests on the vertical link between Position #1, ${formatCardWithOrientation(c1)}, and Position #5 (The Crown), ${formatCardWithOrientation(c5)}. In your immediate present, **${c1.cardName}** signals ${c1.description.toLowerCase()}; ${orientationNuance(c1)}.\n\nAbove it, ${formatCardWithOrientation(c5)} illuminates your highest conscious goal: ${c5.meaning.toLowerCase()}. Aligning your daily choices with the wisdom of **${c5.cardName}** allows you to elevate your perspective above temporary doubts.`,
      influenciasBloqueos: `The main challenge crossing your present is represented by Position #2, ${formatCardWithOrientation(c2)}, which brings the theme of ${c2.meaning.toLowerCase()}. Rather than an immovable obstacle, ${orientationNuance(c2)}.\n\nThis tension interacts with Position #8 (Environment), ${formatCardWithOrientation(c8)}, and Position #9 (Hopes & Fears), ${formatCardWithOrientation(c9)}. External circumstances reflect ${c8.description.toLowerCase()}, while deep within you **${c9.cardName}** highlights the need to honor ${c9.meaning.toLowerCase()} without letting silent doubts hold you back.`,
      pasadoEvolucion: `Looking at the origin of your inquiry, Position #3 (The Root), ${formatCardWithOrientation(c3)}, reveals that the unconscious foundation of this cycle stems from ${c3.description.toLowerCase()} (${c3.meaning.toLowerCase()}).\n\nMeanwhile, Position #4 (Recent Past), ${formatCardWithOrientation(c4)}, shows the stage you have just walked through: ${c4.description.toLowerCase()}. Recognizing how **${c3.cardName}** and **${c4.cardName}** shaped your current expectations frees you from repeating old patterns.`,
      situacionActual: `Your present dynamic is defined by the triad of Position #1 (${formatCardWithOrientation(c1)}), Position #7 (${formatCardWithOrientation(c7)} as your inner attitude), and Position #8 (${formatCardWithOrientation(c8)} as your surroundings). Through **${c7.cardName}**, your internal posture seeks ${c7.meaning.toLowerCase()}, and ${orientationNuance(c7)}.\n\nBalancing your inner stance (**${c7.cardName}**) with what the external environment (**${c8.cardName}**) demands is key to preserving your emotional and mental center.`,
      futuroTendencias: `As the timeline unfolds, Position #6 (Near Future) brings ${formatCardWithOrientation(c6)}, heralding a near-term transition marked by ${c6.description.toLowerCase()} (${c6.meaning.toLowerCase()}).\n\nThis trajectory culminates in Position #10 (Final Outcome) with ${formatCardWithOrientation(c10)}. Here, **${c10.cardName}** points toward ${c10.description.toLowerCase()}, where ${orientationNuance(c10)}, enfatizing ${c10.meaning.toLowerCase()}.`,
      relacionesCartas: `Across all 10 cards, the spread weaves a coherent tapestry: ${majorCards.length} Major Arcana set the spiritual milestones, while the elemental distribution (${suitCounts.Bastos} Wands, ${suitCounts.Copas} Cups, ${suitCounts.Espadas} Swords, ${suitCounts.Pentaculos} Pentacles) shows how passion, emotion, intellect, and tangible action interact.\n\nNotice the bridge between **${c1.cardName}** (#1), **${c6.cardName}** (#6), and **${c10.cardName}** (#10): your present awareness directly shapes the near horizon and unlocks the final resolution.`,
      guiaConclusion: `**1. What to understand and release now:** Acknowledge the lesson of ${formatCardWithOrientation(c2)} and avoid clinging to the past vibration of **${c4.cardName}**.\n\n**2. Concrete action to take:** Lean on the strength of ${formatCardWithOrientation(c7)} and aim toward the potential shown by ${formatCardWithOrientation(c5)} (${c5.meaning.toLowerCase()}).\n\n**3. Integrating the outcome:** Trust the step that opens with **${c6.cardName}** and transform the deep message of **${c9.cardName}** into clarity as you build the fulfillment of ${formatCardWithOrientation(c10)}.`,
    };

    const chapters = buildChaptersArray(locale, byKey);
    return {
      locale,
      summary: byKey.diagnosticoGeneral,
      cruzCentral: `${byKey.energiaCentral}\n\n${byKey.pasadoEvolucion}`,
      bastonDestino: `${byKey.situacionActual}\n\n${byKey.futuroTendencias}`,
      consejoFinal: byKey.guiaConclusion,
      chapters,
    };
  }

  if (locale === "pt") {
    const byKey: Record<InterpretationChapterKey, string> = {
      diagnosticoGeneral: `Ao conectar com sua consulta sobre **${payload.topicLabel}** (“${payload.question}”), a Cruz Celta revela um diálogo central entre ${formatCardWithOrientation(c1)} no núcleo do presente e ${formatCardWithOrientation(c2)} cruzando o seu caminho. Esse eixo inicial mostra que sua pergunta nasce em um momento onde ${c1.description.toLowerCase()}, convidando você a integrar ${c1.meaning.toLowerCase()}.\n\nCom **${majorCards.length} Arcanos Maiores** e **${reversedCards.length} cartas invertidas** nas 10 posições, a tirada aponta para ${formatCardWithOrientation(c10)} como Resultado Final, confirmando que sua consciência atual tem o poder de conduzir essa transição.`,
      energiaCentral: `A energia vital da leitura apoia-se na conexão entre a Posição #1, ${formatCardWithOrientation(c1)}, e a Posição #5 (A Coroa), ${formatCardWithOrientation(c5)}. No momento presente, **${c1.cardName}** expressa ${c1.description.toLowerCase()}; ${orientationNuance(c1)}.\n\nNo topo da Cruz Central, ${formatCardWithOrientation(c5)} ilumina sua meta consciente mais elevada: ${c5.meaning.toLowerCase()}. Alinhar suas decisões diárias com **${c5.cardName}** permite superar dúvidas passageiras.`,
      influenciasBloqueos: `O desafio que cruza o seu presente na Posição #2 é ${formatCardWithOrientation(c2)}, trazendo a temática de ${c2.meaning.toLowerCase()}. Mais do que um obstáculo fixo, ${orientationNuance(c2)}.\n\nEssa força dialoga com a Posição #8 (Ambiente), ${formatCardWithOrientation(c8)}, e com a Posição #9 (Esperanças e Temores), ${formatCardWithOrientation(c9)}. O entorno reflete ${c8.description.toLowerCase()}, enquanto no seu íntimo **${c9.cardName}** pede atenção a ${c9.meaning.toLowerCase()}.`,
      pasadoEvolucion: `Observando a origem da questão, a Posição #3 (A Base), ${formatCardWithOrientation(c3)}, mostra que a raiz inconsciente deste ciclo nasceu de ${c3.description.toLowerCase()} (${c3.meaning.toLowerCase()}).\n\nJá a Posição #4 (Passado Recente), ${formatCardWithOrientation(c4)}, retrata a etapa da qual você está saindo: ${c4.description.toLowerCase()}. Compreender como **${c3.cardName}** e **${c4.cardName}** moldaram o seu olhar libera você para agir de forma renovada.`,
      situacionActual: `Sua dinâmica atual une a Posição #1 (${formatCardWithOrientation(c1)}), a Posição #7 (${formatCardWithOrientation(c7)} como sua atitude interna) e a Posição #8 (${formatCardWithOrientation(c8)} como fatores externos). Através de **${c7.cardName}**, sua postura interior busca ${c7.meaning.toLowerCase()}, sendo que ${orientationNuance(c7)}.\n\nHarmonizar o que você sente e decide (**${c7.cardName}**) diante do cenário ao redor (**${c8.cardName}**) é essencial para manter seu equilíbrio.`,
      futuroTendencias: `No horizonte próximo, a Posição #6 (Futuro Imediato) apresenta ${formatCardWithOrientation(c6)}, anunciando uma movimentação marcada por ${c6.description.toLowerCase()} (${c6.meaning.toLowerCase()}).\n\nEsse fluxo desemboca na Posição #10 (Resultado Final) com ${formatCardWithOrientation(c10)}, apontando para ${c10.description.toLowerCase()}, onde ${orientationNuance(c10)}, destacando ${c10.meaning.toLowerCase()}.`,
      relacionesCartas: `Entre as 10 cartas da mesa, observa-se uma sinergia profunda: ${majorCards.length} Arcanos Maiores marcam lições de alma, enquanto o equilíbrio dos naipes (${suitCounts.Bastos} Paus, ${suitCounts.Copas} Copas, ${suitCounts.Espadas} Espadas, ${suitCounts.Pentaculos} Pentáculos) revela como ação, emoção, mente e matéria se entrelaçam.\n\nA ponte direta entre **${c1.cardName}** (#1), **${c6.cardName}** (#6) e **${c10.cardName}** (#10) confirma que cada escolha consciente no presente transforma o desfecho.`,
      guiaConclusion: `**1. O que compreender e liberar agora:** Integre o aprendizado de ${formatCardWithOrientation(c2)} sem ficar preso à memória passada de **${c4.cardName}**.\n\n**2. Ação prática recomendada:** Apoie-se na força de ${formatCardWithOrientation(c7)} e direcione seu foco para o potencial de ${formatCardWithOrientation(c5)} (${c5.meaning.toLowerCase()}).\n\n**3. Caminho para a realização:** Receba a transição de **${c6.cardName}** com serenidade e transforme a mensagem de **${c9.cardName}** em sabedoria rumo a ${formatCardWithOrientation(c10)}.`,
    };

    const chapters = buildChaptersArray(locale, byKey);
    return {
      locale,
      summary: byKey.diagnosticoGeneral,
      cruzCentral: `${byKey.energiaCentral}\n\n${byKey.pasadoEvolucion}`,
      bastonDestino: `${byKey.situacionActual}\n\n${byKey.futuroTendencias}`,
      consejoFinal: byKey.guiaConclusion,
      chapters,
    };
  }

  // Español (por defecto)
  let dominantElementExplanation =
    "El equilibrio entre los cuatro elementos en tu mesa indica que la respuesta a tu consulta pide alinear pensamiento, emoción, impulso vital y pasos concretos.";
  if (suitCounts.Copas >= 3) {
    dominantElementExplanation =
      "El predominio del elemento Agua (Copas) revela que el corazón de tu consulta es profundamente afectivo e intuitivo: prioriza tu paz emocional y la autenticidad en tus vínculos.";
  } else if (suitCounts.Espadas >= 3) {
    dominantElementExplanation =
      "La notable presencia del elemento Aire (Espadas) señala una intensa actividad mental y la necesidad de cortar la incertidumbre mediante decisiones claras y comunicación honesta.";
  } else if (suitCounts.Bastos >= 3) {
    dominantElementExplanation =
      "El empuje del elemento Fuego (Bastos) domina la lectura, invitándote a recuperar la iniciativa, confiar en tu creatividad y pasar a la acción con determinación.";
  } else if (suitCounts.Pentaculos >= 3) {
    dominantElementExplanation =
      "El peso del elemento Tierra (Pentáculos) aconseja paciencia, realismo y constancia: lo que buscas requiere bases tangibles y pasos bien cimentados.";
  }

  const byKeyEs: Record<InterpretationChapterKey, string> = {
    diagnosticoGeneral: `Al conectar con tu consulta sobre **${payload.topicLabel}** (“${payload.question}”), la tirada abre un diálogo central sumamente revelador entre ${formatCardWithOrientation(c1)} en el corazón del presente y ${formatCardWithOrientation(c2)} como la fuerza que cruza tu camino. Te encuentras en una etapa donde ${c1.description.toLowerCase()}, lo cual te invita a enfocarte en ${c1.meaning.toLowerCase()}.\n\nLa presencia de **${majorCards.length} Arcanos Mayores** y **${reversedCards.length} cartas en orientación invertida** dentro de tus 10 posiciones muestra un proceso de transformación real que converge hacia ${formatCardWithOrientation(c10)} como Resultado Final.`,
    energiaCentral: `El eje energético principal de tu Cruz Celta nace de la relación directa entre la Posición #1, ${formatCardWithOrientation(c1)}, y la Posición #5 (La Corona), ${formatCardWithOrientation(c5)}. En tu presente inmediato actúa **${c1.cardName}**: ${orientationNuance(c1)}, recordándote la importancia de ${c1.meaning.toLowerCase()}.\n\nEn lo alto de la cruz, ${formatCardWithOrientation(c5)} ilumina tu mayor potencial consciente (${c5.description.toLowerCase()}). Cuando alineas tu energía actual con la meta que señala **${c5.cardName}** (${c5.meaning.toLowerCase()}), adquieres la claridad necesaria para dirigir la situación.`,
    influenciasBloqueos: `El principal nudo o desafío que cruza tu consulta aparece en la Posición #2 con ${formatCardWithOrientation(c2)}. Lejos de ser una barrera definitiva, esta carta señala que el verdadero aprendizaje actual radica en ${c2.meaning.toLowerCase()}, y ${orientationNuance(c2)}.\n\nEsta dinámica se entrelaza con las influencias externas de la Posición #8, ${formatCardWithOrientation(c8)}, y con tus esperanzas o temores profundos en la Posición #9, ${formatCardWithOrientation(c9)}. Mientras el entorno refleja ${c8.description.toLowerCase()}, en tu interior **${c9.cardName}** te pide atender ${c9.meaning.toLowerCase()} con serenidad y consciencia.`,
    pasadoEvolucion: `Para comprender cómo se gestó esta situación frente a “${payload.question}”, la Posición #3 (La Base Inconsciente) muestra a ${formatCardWithOrientation(c3)}. Esto revela que la raíz profunda del proceso proviene de ${c3.description.toLowerCase()}, dejando como enseñanza ${c3.meaning.toLowerCase()}.\n\nPor su parte, la Posición #4 (Pasado Recente) sitúa a ${formatCardWithOrientation(c4)}, indicando que vienes saliendo de una etapa marcada por ${c4.description.toLowerCase()}. Reconocer el tránsito desde **${c3.cardName}** y **${c4.cardName}** hasta hoy te permite agradecer lo aprendido sin quedarte atado al ayer.`,
    situacionActual: `Tu realidad presente se comprende al unir la Posición #1 (${formatCardWithOrientation(c1)}), tu actitud interna en la Posición #7 (${formatCardWithOrientation(c7)}) y el clima exterior en la Posición #8 (${formatCardWithOrientation(c8)}). Desde la energía de **${c7.cardName}**, hoy te plantas ante tu consulta buscando ${c7.meaning.toLowerCase()}, donde ${orientationNuance(c7)}.\n\nDiferenciar con nitidez tu postura interior (**${c7.cardName}**) de las presiones o expectativas del entorno (**${c8.cardName}**, ${c8.meaning.toLowerCase()}) te dará una enorme libertad emocional y práctica.`,
    futuroTendencias: `La evolución temporal de la tirada se proyecta primero en la Posición #6 (Futuro Inmediato) con ${formatCardWithOrientation(c6)}, anunciando que los próximos pasos estarán marcados por ${c6.description.toLowerCase()} (${c6.meaning.toLowerCase()}).\n\nEsta corriente desemboca en la Posición #10 (Resultado Final) a través de ${formatCardWithOrientation(c10)}. Su presencia en la cima del Bastón señala una culminación caracterizada por ${c10.description.toLowerCase()}; ${orientationNuance(c10)}, invitándote a integrar ${c10.meaning.toLowerCase()}.`,
    relacionesCartas: `${dominantElementExplanation}\n\nAl observar cómo dialogan las 10 cartas entre sí, destaca el puente evolutivo que une a **${c1.cardName}** (#1) con **${c5.cardName}** (#5), **${c7.cardName}** (#7) y **${c10.cardName}** (#10). ${
      reversedCards.length > 0
        ? `Las ${reversedCards.length} cartas en posición invertida (${reversedCards.map((rc) => `**${rc.cardName}** en #${rc.position}`).join(", ")}) no niegan el avance: señalan los puntos exactos donde conviene reflexionar, soltar bloqueos internos y ajustar el ritmo antes de dar el siguiente paso.`
        : `El hecho de que las cartas fluyan mayoritariamente al derecho subraya un momento de apertura, sincronicidad y claridad para avanzar con confianza.`
    }`,
    guiaConclusion: `**1. Qué patrón comprender y transformar hoy:** Integra la enseñanza que plantea ${formatCardWithOrientation(c2)} en el cruce central (${c2.meaning.toLowerCase()}) y suelta la inercia del pasado reciente representada por **${c4.cardName}**.\n\n**2. Qué decisión o actitud priorizar:** Apóyate conscientemente en tu recurso interno de la Posición #7 (${formatCardWithOrientation(c7)}) y enfoca tus acciones hacia el potencial que ilumina ${formatCardWithOrientation(c5)} (${c5.meaning.toLowerCase()}).\n\n**3. Síntesis hacia el desenlace:** Avanza con confianza hacia el escenario próximo de **${c6.cardName}**, escucha la voz intuitiva de **${c9.cardName}** y construye paso a paso la realización que anuncia ${formatCardWithOrientation(c10)} en respuesta a tu consulta.`,
  };

  const chapters = buildChaptersArray(locale, byKeyEs);

  return {
    locale,
    summary: byKeyEs.diagnosticoGeneral,
    cruzCentral: `${byKeyEs.energiaCentral}\n\n${byKeyEs.pasadoEvolucion}`,
    bastonDestino: `${byKeyEs.situacionActual}\n\n${byKeyEs.futuroTendencias}`,
    consejoFinal: byKeyEs.guiaConclusion,
    chapters,
  };
}


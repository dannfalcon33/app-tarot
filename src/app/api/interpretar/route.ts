import { NextRequest, NextResponse } from "next/server";

export interface SpreadCardInput {
  position: number;
  positionTitle: string;
  positionSubtitle: string;
  cardName: string;
  categoryLabel: string;
  description: string;
  meaning: string;
}

export interface InterpretRequestPayload {
  question: string;
  topicLabel: string;
  cards: SpreadCardInput[];
}

export interface InterpretResponseData {
  provider: string;
  model: string;
  summary: string;
  cruzCentral: string;
  bastonDestino: string;
  consejoFinal: string;
}

function buildSystemPrompt(): string {
  return `Eres el Maestro Oráculo de "Universe Tarot", un tarotista profundo, sabio, empático y orientador.
Tu misión es ofrecer una INTERPRETACIÓN PROFUNDA, EXPLICATIVA Y ENFOCADA EN DAR GUÍA REAL al consultante a través de su tirada de Cruz Celta de 10 cartas.

REGLAS ESTRICTAS DE INTERPRETACIÓN:
1. PROHIBIDO limitarte a enumerar qué carta salió en cada posición o repetir sus significados de diccionario ("En la posición 1 salió X, en la 2 salió Y..."). El usuario ya ve las cartas en pantalla.
2. DEBES INTERPRETAR Y EXPLICAR EL PORQUÉ: Analiza cómo dialogan las cartas entre sí, qué dinámicas emocionales, mentales o prácticas están ocurriendo detrás de la pregunta del usuario, por qué existe ese bloqueo o desafío y cómo superarlo.
3. ENFOQUE 100% EN GUÍA Y ORIENTACIÓN: Cada párrafo debe ayudar al consultante a comprender su situación en detalle, darle claridad sobre sus dudas y orientar sus decisiones frente a lo que preguntó.
4. Usa **negritas** cuando menciones una carta o una idea clave para facilitar la lectura, pero intégralas de forma natural dentro de una narrativa fluida, cálida y reflexiva.

ESTRUCTURA OBLIGATORIA DE TU RESPUESTA:
Divide tu respuesta usando EXACTAMENTE estos 4 encabezados (incluyendo los corchetes) y escribe de 2 a 3 párrafos detallados dentro de cada uno:

[VISION_GENERAL]
(Explica en profundidad qué revela la tirada en su conjunto frente a la pregunta del consultante. Conecta el núcleo del presente con el desafío principal y el desenlace, explicando cuál es el verdadero trasfondo de lo que está viviendo y qué mensaje central le transmite el tarot.)

[CRUZ_CENTRAL]
(Interpreta y explica con detalle la historia y evolución que muestran las primeras 6 cartas: cómo el origen inconsciente y el pasado reciente han llevado al consultante al punto actual, por qué se presenta el desafío que cruza su camino, qué le pide alcanzar su Corona/Potencial y cómo debe prepararse para lo que se aproxima en el futuro inmediato.)

[BASTON_DESTINO]
(Analiza en profundidad la psicología y el camino hacia el resultado de las cartas 7 a 10: explica cómo la actitud interna del consultante está interactuando con las influencias de su entorno, desentraña el mensaje detrás de sus esperanzas o temores ocultos, y explica con detalle qué significa el Resultado Final y cómo construirlo o transformarlo a su favor.)

[GUIA_Y_CONSEJO]
(Ofrece una guía práctica, espiritual y accionable dividida en pasos claros para la vida del consultante: 1. Qué patrón, duda o actitud debe comprender y soltar ahora; 2. Qué acción concreta o decisión le aconseja tomar la tirada; y 3. Cómo alinear su energía para obtener el mayor bienestar y claridad frente a su consulta.)`;
}

function buildUserPrompt(payload: InterpretRequestPayload): string {
  const sorted = [...payload.cards].sort((a, b) => a.position - b.position);
  const cardsList = sorted
    .map(
      (c) =>
        `- Posición #${c.position} (${c.positionTitle} / ${c.positionSubtitle}): ${c.cardName} (${c.categoryLabel}) — Esencia simbólica: ${c.description} | Clave: ${c.meaning}`,
    )
    .join("\n");

  return `=== CONSULTA Y PROMPT GUÍA DEL USUARIO ===
Ámbito de la consulta: ${payload.topicLabel}
Pregunta o intención del consultante: "${payload.question}"

=== CONFIGURACIÓN DE LA CRUZ CELTA (10 CARTAS) ===
${cardsList}

Por favor, realiza una interpretación profunda, detallada y orientadora (sin limitarte a listar las cartas), enfocada en guiar al consultante respecto a "${payload.question}". Usa exactamente los 4 marcadores: [VISION_GENERAL], [CRUZ_CENTRAL], [BASTON_DESTINO] y [GUIA_Y_CONSEJO].`;
}

function parseStructuredSections(
  rawText: string,
  payload: InterpretRequestPayload,
): Omit<InterpretResponseData, "provider" | "model"> {
  const cleaned = rawText.replace(/```markdown|```json|```/gi, "").trim();

  // Intentar extraer por marcadores [VISION_GENERAL], [CRUZ_CENTRAL], [BASTON_DESTINO], [GUIA_Y_CONSEJO]
  const extractSection = (
    startTag: string,
    nextTags: string[],
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
    for (const nextTag of nextTags) {
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

    return remaining.slice(0, earliestEnd).trim();
  };

  const summary = extractSection("VISION_GENERAL", [
    "CRUZ_CENTRAL",
    "BASTON_DESTINO",
    "GUIA_Y_CONSEJO",
  ]);
  const cruzCentral = extractSection("CRUZ_CENTRAL", [
    "BASTON_DESTINO",
    "GUIA_Y_CONSEJO",
  ]);
  const bastonDestino = extractSection("BASTON_DESTINO", ["GUIA_Y_CONSEJO"]);
  const consejoFinal = extractSection("GUIA_Y_CONSEJO", []);

  if (summary && cruzCentral && bastonDestino && consejoFinal) {
    return {
      summary,
      cruzCentral,
      bastonDestino,
      consejoFinal,
    };
  }

  // Si la IA respondió en JSON o en párrafos libres extensos sin los corchetes exactos
  try {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.summary && parsed.cruzCentral && parsed.bastonDestino) {
        return {
          summary: String(parsed.summary),
          cruzCentral: String(parsed.cruzCentral),
          bastonDestino: String(parsed.bastonDestino),
          consejoFinal: String(
            parsed.consejoFinal || buildDeepGuidedSynthesis(payload).consejoFinal,
          ),
        };
      }
    }
  } catch {
    // Continuar a separación por bloques de texto si el texto es rico
  }

  const blocks = cleaned
    .split(/\n\s*\n/)
    .map((b) => b.replace(/^#+\s*.*$/gm, "").trim())
    .filter((b) => b.length > 60);

  if (blocks.length >= 4) {
    const quarter = Math.ceil(blocks.length / 4);
    return {
      summary: blocks.slice(0, quarter).join("\n\n"),
      cruzCentral: blocks.slice(quarter, quarter * 2).join("\n\n"),
      bastonDestino: blocks.slice(quarter * 2, quarter * 3).join("\n\n"),
      consejoFinal: blocks.slice(quarter * 3).join("\n\n"),
    };
  }

  return buildDeepGuidedSynthesis(payload);
}

// Motor de interpretación narrativa y guía profunda (respaldo local enriquecido)
function buildDeepGuidedSynthesis(
  payload: InterpretRequestPayload,
): Omit<InterpretResponseData, "provider" | "model"> {
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

  const SuitCounts = {
    Bastos: sorted.filter((i) => i.categoryLabel.includes("Bastos")).length,
    Copas: sorted.filter((i) => i.categoryLabel.includes("Copas")).length,
    Espadas: sorted.filter((i) => i.categoryLabel.includes("Espadas")).length,
    Pentaculos: sorted.filter((i) => i.categoryLabel.includes("Pentáculos"))
      .length,
  };

  let dominantElementExplanation =
    "En el conjunto de tu tirada se percibe una combinación equilibrada de energías emocionales, mentales y prácticas, lo que indica que la respuesta a tu consulta depende de alinear lo que piensas con lo que sientes y haces.";
  if (SuitCounts.Copas >= 3) {
    dominantElementExplanation =
      "El predominio del elemento Agua (Copas) en tu mesa revela que el corazón de esta consulta es profundamente emocional e intuitivo: más allá de las apariencias externas, lo que realmente busca sanación y respuesta aquí son tus vínculos afectivos y tu paz interior.";
  } else if (SuitCounts.Espadas >= 3) {
    dominantElementExplanation =
      "La fuerte presencia del elemento Aire (Espadas) muestra que has estado dándole muchas vueltas mentales a esta situación. La tirada te pide cortar con la incertidumbre, hablar con honestidad y tomar decisiones desde la claridad mental en lugar de la ansiedad.";
  } else if (SuitCounts.Bastos >= 3) {
    dominantElementExplanation =
      "El elemento Fuego (Bastos) domina tu lectura, señalando que este no es un momento para quedarte esperando en la duda: hay una gran fuerza vital, deseo de avance y capacidad de iniciativa que te pide pasar a la acción con determinación.";
  } else if (SuitCounts.Pentaculos >= 3) {
    dominantElementExplanation =
      "El peso del elemento Tierra (Pentáculos) indica que tu consulta requiere pasos tangibles, paciencia y realismo. No se trata de promesas en el aire, sino de construir bases sólidas, cuidar tus recursos y dar tiempo a que lo sembrado madure.";
  }

  const summary = `Al conectar con tu consulta sobre ${payload.topicLabel.toLowerCase()} (“${payload.question}”), la tirada muestra un diálogo central muy revelador entre **${c1.cardName}** y **${c2.cardName}**. En este momento te encuentras en una etapa donde ${c1.description.toLowerCase()}, lo cual te invita a poner atención en ${c1.meaning.toLowerCase()}. Sin embargo, la razón por la que sientes inquietud o necesidad de orientación se debe a la tensión que plantea **${c2.cardName}** cruzando tu camino: el aprendizaje inmediato no consiste en forzar las cosas, sino en comprender que ${c2.meaning.toLowerCase()}.\n\n${dominantElementExplanation} ${
    majorCards.length >= 4
      ? `Además, al aparecer ${majorCards.length} Arcanos Mayores en tu Cruz Celta, el tarot subraya que este proceso marca un antes y un después importante en tu crecimiento personal, llevándote finalmente hacia la energía de **${c10.cardName}**.`
      : `El flujo general hacia **${c10.cardName}** confirma que tienes en tus manos la capacidad de encauzar esta situación si actúas con consciencia.`
  }`;

  const cruzCentral = `Para comprender por qué has llegado a este punto respecto a “${payload.question}”, es necesario mirar hacia la raíz de la situación. En la base inconsciente actúa **${c3.cardName}**, lo que explica que en el fondo todo este proceso nació de ${c3.description.toLowerCase()}. A esto se suma que vienes saliendo de una etapa reciente marcada por **${c4.cardName}**, cuya experiencia (${c4.meaning.toLowerCase()}) todavía deja huella en tu forma de ver el presente. Es completamente natural que hoy sientas el contraste entre lo que ya pasó y lo que intentas construir ahora.\n\nLo más alentador dentro de tu Cruz Central es la guía que ofrece **${c5.cardName}** en la Corona de tu tirada, seguida por **${c6.cardName}** en tu futuro inmediato. La presencia de **${c5.cardName}** te dice que tu mayor potencial ahora mismo se alcanza al enfocarte en ${c5.meaning.toLowerCase()}. Si adoptas esa visión más elevada, el tránsito hacia el corto plazo (**${c6.cardName}**) abrirá un escenario donde ${c6.description.toLowerCase()}, permitiéndote destrabar el desafío actual y avanzar con paso mucho más firme.`;

  const bastonDestino = `El Bastón del Destino revela cómo tu mundo interno y las circunstancias que te rodean están moldeando el desenlace de tu consulta. Actualmente te posicionas frente a este tema desde la energía de **${c7.cardName}**, lo que refleja que tu estado interior busca ${c7.meaning.toLowerCase()}. Al mismo tiempo, el ambiente externo o las personas involucradas están actuando bajo la influencia de **${c8.cardName}** (${c8.description.toLowerCase()}). Comprender esta diferencia entre lo que tú aportas y lo que el entorno ofrece es clave para no cargar con responsabilidades ajenas ni perder tu centro.\n\nEn lo más profundo de tu corazón, **${c9.cardName}** ilumina tus esperanzas y temores silenciosos: existe el anhelo —o el miedo— de enfrentar ${c9.description.toLowerCase()}, recordándote la importancia de ${c9.meaning.toLowerCase()}. Cuando integras esa lección, toda la tirada desemboca en **${c10.cardName}** como Resultado Final. Esta carta no dicta un destino rígido, sino que te muestra la culminación hacia la que fluye tu energía: un horizonte caracterizado por ${c10.description.toLowerCase()}, donde la clave definitiva será ${c10.meaning.toLowerCase()}.`;

  const consejoFinal = `**1. Qué debes comprender y transformar ahora:** Reconoce que el desafío representado por **${c2.cardName}** no está ahí para detenerte, sino para mostrarte qué aspecto de tu situación requiere mayor equilibrio (${c2.meaning.toLowerCase()}). Evita quedarte anclado en la energía pasada de **${c4.cardName}** y permítete mirar la situación con ojos nuevos.\n\n**2. Qué acción o actitud tomar frente a tu consulta:** Apóyate conscientemente en la fortaleza que te señala **${c7.cardName}** y dirígete hacia la meta que ilumina **${c5.cardName}**. Ante las influencias externas (**${c8.cardName}**), actúa desde la serenidad, priorizando decisiones que estén alineadas con ${c1.meaning.toLowerCase()}.\n\n**3. Tu guía hacia el desenlace:** Confía en la transición que se abre en tu futuro cercano con **${c6.cardName}**. Si escuchas tu intuición frente a lo que revela **${c9.cardName}**, estarás preparando el terreno perfecto para vivir la plenitud y el aprendizaje que promete **${c10.cardName}** en respuesta a tu pregunta.`;

  return {
    summary,
    cruzCentral,
    bastonDestino,
    consejoFinal,
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as InterpretRequestPayload;

    if (
      !payload ||
      !payload.question ||
      payload.question.trim().length < 3 ||
      !Array.isArray(payload.cards) ||
      payload.cards.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Se requiere una pregunta guía obligatoria y las 10 cartas de la tirada para realizar la interpretación.",
        },
        { status: 400 },
      );
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(payload);

    // 1. Si el usuario configuró GEMINI_API_KEY (Google AI Studio Free Tier)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
                },
              ],
              generationConfig: {
                temperature: 0.75,
              },
            }),
            signal: AbortSignal.timeout(25000),
          },
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text && text.length > 100) {
            const parsed = parseStructuredSections(text, payload);
            return NextResponse.json({
              provider: "Google Gemini AI",
              model: "gemini-2.0-flash",
              ...parsed,
            } satisfies InterpretResponseData);
          }
        }
      } catch {
        // Continúa al siguiente proveedor gratuito
      }
    }

    // 2. Si el usuario configuró GROQ_API_KEY
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groqRes = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0.75,
            }),
            signal: AbortSignal.timeout(20000),
          },
        );

        if (groqRes.ok) {
          const data = await groqRes.json();
          const text = data?.choices?.[0]?.message?.content || "";
          if (text && text.length > 100) {
            const parsed = parseStructuredSections(text, payload);
            return NextResponse.json({
              provider: "Groq Cloud AI",
              model: "llama-3.1-8b-instant",
              ...parsed,
            } satisfies InterpretResponseData);
          }
        }
      } catch {
        // Continúa al siguiente proveedor gratuito
      }
    }

    // 3. API Pública Gratuita sin API Key: Pollinations AI Text Endpoint (OpenAI compatible)
    try {
      const pollinationsRes = await fetch(
        "https://text.pollinations.ai/openai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai-fast",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.75,
          }),
          signal: AbortSignal.timeout(35000),
        },
      );

      if (pollinationsRes.ok) {
        const data = await pollinationsRes.json();
        const text =
          data?.choices?.[0]?.message?.content ||
          (typeof data === "string" ? data : "");
        if (text && text.length > 120) {
          const parsed = parseStructuredSections(text, payload);
          return NextResponse.json({
            provider: "Oráculo IA (Pollinations Free)",
            model: data?.model || "openai-fast",
            ...parsed,
          } satisfies InterpretResponseData);
        }
      }
    } catch {
      // Continúa al respaldo narrativo profundo
    }

    // 4. Motor de Interpretación Narrativa y Guía Profunda (Respaldo garantizado)
    const fallbackSynthesis = buildDeepGuidedSynthesis(payload);
    return NextResponse.json({
      provider: "Oráculo Guía Universe Tarot",
      model: "celtic-cross-guide-v2",
      ...fallbackSynthesis,
    } satisfies InterpretResponseData);
  } catch {
    return NextResponse.json(
      { error: "No fue posible procesar la lectura en este momento." },
      { status: 500 },
    );
  }
}

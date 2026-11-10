import { NextRequest, NextResponse } from "next/server";
import {
  buildDeepGuidedSynthesis,
  buildSystemPrompt,
  buildUserPrompt,
  InterpretationChapter,
  InterpretationChapterKey,
  InterpretRequestPayload,
  InterpretResponseData,
  normalizeLocale,
  parseAndValidateInterpretation,
  SpreadCardInput,
} from "@/services/tarot/prompt";

export type {
  SpreadCardInput,
  InterpretRequestPayload,
  InterpretationChapter,
  InterpretationChapterKey,
  InterpretResponseData,
};

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as InterpretRequestPayload;

    if (
      !payload ||
      !payload.question ||
      payload.question.trim().length < 3 ||
      !Array.isArray(payload.cards) ||
      payload.cards.length !== 10
    ) {
      return NextResponse.json(
        {
          error:
            "Se requiere una pregunta guía obligatoria y exactamente las 10 cartas reveladas de la Cruz Celta para realizar la interpretación.",
        },
        { status: 400 },
      );
    }

    const locale = normalizeLocale(payload.locale);
    const normalizedPayload: InterpretRequestPayload = {
      ...payload,
      locale,
    };

    const systemPrompt = buildSystemPrompt(locale);
    const userPrompt = buildUserPrompt(normalizedPayload);

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
          if (text && text.length > 140) {
            const parsed = parseAndValidateInterpretation(
              text,
              normalizedPayload,
            );
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
          if (text && text.length > 140) {
            const parsed = parseAndValidateInterpretation(
              text,
              normalizedPayload,
            );
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
        if (text && text.length > 140) {
          const parsed = parseAndValidateInterpretation(
            text,
            normalizedPayload,
          );
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

    // 4. Motor de Interpretación Narrativa y Guía Profunda en 8 Capítulos (Respaldo garantizado)
    const fallbackSynthesis = buildDeepGuidedSynthesis(normalizedPayload);
    return NextResponse.json({
      provider: "Oráculo Guía Universe Tarot",
      model: "celtic-cross-guide-v3",
      ...fallbackSynthesis,
    } satisfies InterpretResponseData);
  } catch {
    return NextResponse.json(
      { error: "No fue posible procesar la lectura en este momento." },
      { status: 500 },
    );
  }
}

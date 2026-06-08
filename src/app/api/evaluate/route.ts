import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  try {
    const { question, correctAnswer, userAnswer, type } = await req.json();

    if (type === "multiple_choice") {
      return NextResponse.json({
        isCorrect: userAnswer === correctAnswer,
        explanation: "",
      });
    }

    if (type === "concept") {
      return NextResponse.json({
        isCorrect: userAnswer === "understood",
        explanation: "",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const exact = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      return NextResponse.json({
        isCorrect: exact,
        explanation: exact ? "" : `Expected something like "${correctAnswer}"`,
      });
    }

    const openai = createOpenAI({ apiKey });

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are a friendly coding tutor that evaluates student answers.
Judge if the student's answer is semantically correct for the given question.
Be lenient with typos, capitalization, and minor wording differences.
Focus on whether the student understood the core concept.
Return ONLY valid JSON: {"isCorrect": boolean, "explanation": string}
If correct, explanation should be empty string. If incorrect, give a brief helpful hint.`,
      prompt: `Question: "${question}"
Expected answer: "${correctAnswer}"
Student's answer: "${userAnswer}"

Is this correct?`,
    });

    const result = JSON.parse(text);
    return NextResponse.json({
      isCorrect: result.isCorrect,
      explanation: result.explanation || "",
    });
  } catch {
    return NextResponse.json({ isCorrect: false, explanation: "Could not evaluate. Please try again." });
  }
}

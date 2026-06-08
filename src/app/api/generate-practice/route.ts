import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { curriculum } from "@/lib/curriculum";

function buildCurriculumContext(completedLessonIds: string[]): string {
  const topics: string[] = [];
  for (const [, groups] of Object.entries(curriculum)) {
    for (const group of groups) {
      if (completedLessonIds.includes(group.lessonId) && group.content) {
        const titles = group.content.map((c) => c.title).join(", ");
        topics.push(`${group.lessonId}: ${titles}`);
      }
    }
  }
  return topics.length > 0
    ? topics.join("\n")
    : "General programming basics";
}

function extractLanguage(completedLessonIds: string[]): string {
  const courseMap: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    rust: "Rust",
    cpp: "C++",
    go: "Go",
    typescript: "TypeScript",
  };
  for (const id of completedLessonIds) {
    const prefix = id.split("-u")[0];
    if (courseMap[prefix]) return courseMap[prefix];
  }
  return "Python";
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Beginner — basic concepts like syntax, variables, and simple functions",
  2: "Easy — conditionals, loops, and basic data structures",
  3: "Intermediate — functions, lists, dicts, and string manipulation",
  4: "Hard — error handling, comprehensions, and algorithmic thinking",
  5: "Advanced — complex algorithms, design patterns, and optimization",
};

export async function POST(req: NextRequest) {
  try {
    const { completedLessonIds, difficulty } = await req.json();
    const count = 10;

    const context = buildCurriculumContext(completedLessonIds || []);
    const language = extractLanguage(completedLessonIds || []);
    const diffLabel = DIFFICULTY_LABELS[difficulty] || DIFFICULTY_LABELS[1];

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const allExercises = Object.values(curriculum)
        .flatMap((groups) => groups.flatMap((g) => g.exercises))
        .filter((ex) => ex.type !== "concept");

      const shuffled = [...allExercises].sort(() => Math.random() - 0.5);
      return NextResponse.json({
        exercises: shuffled.slice(0, count).map((ex, i) => ({
          ...ex,
          id: `ai-fallback-${i}`,
          lesson_id: "ai-practice",
        })),
        topic: "Mixed Practice",
      });
    }

    const openai = createOpenAI({ apiKey });

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are an AI tutor generating practice questions for a programming student.
Generate questions at difficulty level: ${diffLabel}
Language: ${language}

Rules:
- Generate exactly ${count} questions
- Mix of multiple_choice and fill_blank types (at least 3 fill_blank)
- Each question must test real understanding, not just memorization
- For multiple_choice: provide 4 options, one correct
- For fill_blank: the correct_answer should be a short word/phrase
- Include a brief explanation for each
- Assign difficulty 1-5 matching the requested level
- Vary the question styles (syntax, concepts, debugging, output prediction)

Return ONLY valid JSON array of objects with fields:
id (string like "ai-q-1"), type ("multiple_choice" | "fill_blank"), question (string), options (string[] or empty array for fill_blank), correct_answer (string), explanation (string), difficulty (number 1-5)`,
      prompt: `The student has completed these lessons:
${context}

Generate ${count} practice questions in ${language} at difficulty ${difficulty}.`,
    });

    let exercises;
    try {
      const parsed = JSON.parse(text);
      exercises = Array.isArray(parsed) ? parsed : [];
    } catch {
      exercises = [];
    }

    return NextResponse.json({
      exercises: exercises.map((ex: Record<string, unknown>) => ({
        ...ex,
        lesson_id: "ai-practice",
        code_snippet: undefined,
      })),
      topic: `${language} Practice (Level ${difficulty})`,
    });
  } catch (error) {
    console.error("Generate practice error:", error);
    return NextResponse.json(
      { exercises: [], topic: "Practice" },
      { status: 500 }
    );
  }
}

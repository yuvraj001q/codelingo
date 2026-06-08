export async function evaluateAnswer(
  question: string,
  correctAnswer: string,
  userAnswer: string,
  type: string
): Promise<{ isCorrect: boolean; explanation: string }> {
  try {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, correctAnswer, userAnswer, type }),
    });
    return await res.json();
  } catch {
    return { isCorrect: false, explanation: "Could not evaluate. Try again." };
  }
}

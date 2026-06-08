"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Check,
  RefreshCw,
  BookOpen,
  ChevronRight,
  Sparkles,
  BrainCircuit,
  AlertTriangle,
  Trash2,
  BarChart3,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import ProgressBar from "@/components/ui/ProgressBar";
import CodeBlock from "@/components/ui/CodeBlock";
import SyntaxDrag from "@/components/ui/SyntaxDrag";
import AIMascot from "@/components/ui/AIMascot";
import CodeBuddy from "@/components/ui/CodeBuddy";
import { useStore } from "@/lib/store";
import { curriculum } from "@/lib/curriculum";
import type { Exercise } from "@/lib/types";

type Tab = "ai" | "mistakes";
type Mode = "idle" | "loading" | "quiz" | "summary";

const TOTAL_QUESTIONS = 30;
const BATCH_SIZE = 10;

const mascotMessages: Record<string, string[]> = {
  ai_idle: [
    "Ready to practice what you've learned? I'll generate fresh questions just for you!",
    "Let me create a custom practice session based on your progress!",
    "AI-powered practice — every question is unique, just like you!",
  ],
  mistakes_idle: [
    "Let's fix those mistakes once and for all!",
    "Every mistake is a chance to learn. I'm here to help!",
    "Review your past mistakes and turn them into strengths!",
  ],
  quiz: [
    "Think carefully — you know this!",
    "Take your time, there's no rush!",
    "You've got this, keep going!",
  ],
  correct: [
    "Brilliant! Nailed it!",
    "Perfect answer! You're on fire!",
    "Excellent! See? You know your stuff!",
  ],
  incorrect: [
    "Not quite — give it another go!",
    "Almost there, you're close!",
    "Don't give up! Each attempt builds understanding!",
  ],
  summary: [
    "Great session! Look at how much you've improved!",
    "Amazing work! Keep this up and you'll master it in no time!",
    "Solid practice! Every session makes you stronger!",
  ],
};

function randomMsg(category: string): string {
  const msgs = mascotMessages[category] || mascotMessages.quiz;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function readMistakes(): { mistakeId: string; exercise: Exercise }[] {
  try {
    const mistakenIds: string[] = JSON.parse(
      localStorage.getItem("opencodeLingo_mistakes") || "[]"
    );
    const allExercises = Object.values(curriculum)
      .flatMap((groups) => groups.flatMap((g) => g.exercises));
    return mistakenIds
      .map((id) => {
        const ex = allExercises.find((e) => e.id === id);
        return ex ? { mistakeId: id, exercise: ex } : null;
      })
      .filter(Boolean) as { mistakeId: string; exercise: Exercise }[];
  } catch {
    return [];
  }
}

function getCompletedLessonIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem("opencodeLingo_completedLessons") || "[]");
  } catch {
    return [];
  }
}

export default function PracticePage() {
  const { addXp } = useStore();

  // Tab & mode
  const [tab, setTab] = useState<Tab>("ai");
  const [mode, setMode] = useState<Mode>("idle");
  const [mascotMsg, setMascotMsg] = useState("");

  // Difficulty & progress tracking
  const [difficulty, setDifficulty] = useState(1);
  const [aiCorrect, setAiCorrect] = useState(0);
  const [aiIncorrect, setAiIncorrect] = useState(0);

  // Quiz state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
  const [filledBlank, setFilledBlank] = useState("");
  const [dragOrder, setDragOrder] = useState<string[]>([]);

  // Mistakes state
  const [mistakes, setMistakes] = useState<{ mistakeId: string; exercise: Exercise }[]>([]);
  const [mistakeMode, setMistakeMode] = useState<"list" | "quiz">("list");
  const [activeMistake, setActiveMistake] = useState<{ mistakeId: string; exercise: Exercise } | null>(null);

  const completedLessons = getCompletedLessonIds();

  // Init mascot message
  useEffect(() => {
    setMascotMsg(randomMsg("ai_idle"));
  }, []);

  // Refresh mistakes list on focus/mount
  useEffect(() => {
    setMistakes(readMistakes());
  }, []);

  const currentExercise = exercises[currentIndex];
  const hasAnswer = selectedAnswer || filledBlank || dragOrder.length > 0;

  // --- AI Practice: Start Session ---
  const startAiPractice = useCallback(async () => {
    setMode("loading");
    setAiCorrect(0);
    setAiIncorrect(0);
    setMascotMsg("Generating your personalized questions...");

    const allExercises: Exercise[] = [];

    for (let batch = 0; batch < TOTAL_QUESTIONS / BATCH_SIZE; batch++) {
      try {
        const res = await fetch("/api/generate-practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completedLessonIds: completedLessons,
            difficulty,
          }),
        });
        const data = await res.json();
        if (data.exercises && data.exercises.length > 0) {
          allExercises.push(...data.exercises);
        }
      } catch {
        // continue even if a batch fails
      }
    }

    if (allExercises.length === 0) {
      // Fallback: use curriculum exercises
      const fallback = Object.values(curriculum)
        .flatMap((groups) => groups.flatMap((g) => g.exercises))
        .filter((ex) => ex.type !== "concept")
        .sort(() => Math.random() - 0.5)
        .slice(0, TOTAL_QUESTIONS);
      allExercises.push(...fallback);
    }

    const shuffled = allExercises.sort(() => Math.random() - 0.5);
    setExercises(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setFilledBlank("");
    setDragOrder([]);
    setFeedback("none");
    setMode("quiz");
    setMascotMsg(randomMsg("quiz"));
  }, [completedLessons, difficulty]);

  // --- Quiz Actions ---
  const doCheck = () => {
    if (!currentExercise) return;

    let correct = false;

    if (currentExercise.type === "concept") {
      correct = selectedAnswer === "understood";
    } else if (currentExercise.type === "multiple_choice") {
      correct = selectedAnswer === currentExercise.correct_answer;
    } else if (currentExercise.type === "fill_blank") {
      const trimmed = filledBlank.trim().toLowerCase();
      const expected = currentExercise.correct_answer.trim().toLowerCase();
      correct = trimmed === expected;
    } else if (currentExercise.type === "syntax_drag") {
      correct = dragOrder.join("\n").trim() === currentExercise.correct_answer.trim();
    }

    if (correct) {
      setFeedback("correct");
      addXp(10);
      setMascotMsg(randomMsg("correct"));
      if (tab === "ai") setAiCorrect((c) => c + 1);
    } else {
      setFeedback("incorrect");
      setMascotMsg(randomMsg("incorrect"));
      if (tab === "ai") setAiIncorrect((c) => c + 1);
    }
  };

  const doNext = () => {
    if (feedback !== "correct") return;

    if (tab === "ai") {
      // AI mode: wrong answers go to end
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex((i) => i + 1);
        resetQuizInputs();
        setMascotMsg(randomMsg("quiz"));
      } else {
        // Check for retry queue
        setMascotMsg(randomMsg("summary"));
        setMode("summary");
      }
    } else if (tab === "mistakes" && activeMistake) {
      // Mistakes mode: remove from list on correct
      const updated = mistakes.filter(
        (m) => m.mistakeId !== activeMistake.mistakeId
      );
      setMistakes(updated);
      try {
        const stored: string[] = JSON.parse(
          localStorage.getItem("opencodeLingo_mistakes") || "[]"
        );
        const filtered = stored.filter((id) => id !== activeMistake.mistakeId);
        localStorage.setItem("opencodeLingo_mistakes", JSON.stringify(filtered));
      } catch {}
      setMistakeMode("list");
      setActiveMistake(null);
      setExercises([]);
      resetQuizInputs();
      setFeedback("none");
      setMascotMsg(randomMsg("mistakes_idle"));
    }
  };

  const attemptAgain = () => {
    setFeedback("none");
    setSelectedAnswer("");
    setFilledBlank("");
    setDragOrder([]);
  };

  const resetQuizInputs = () => {
    setSelectedAnswer("");
    setFilledBlank("");
    setDragOrder([]);
    setFeedback("none");
  };

  // --- Mistakes Tab ---
  const startMistakeQuiz = (item: { mistakeId: string; exercise: Exercise }) => {
    setActiveMistake(item);
    setExercises([item.exercise]);
    setCurrentIndex(0);
    resetQuizInputs();
    setMistakeMode("quiz");
    setMode("quiz");
    setMascotMsg(randomMsg("quiz"));
  };

  const clearAllMistakes = () => {
    localStorage.setItem("opencodeLingo_mistakes", "[]");
    setMistakes([]);
    setMascotMsg("All cleared! No mistakes to review.");
  };

  // Sync drag order for syntax_drag
  useEffect(() => {
    if (currentExercise?.type === "syntax_drag" && currentExercise.options) {
      setDragOrder([...currentExercise.options].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, currentExercise]);

  // --- Switch tab handler ---
  const switchTab = (newTab: Tab) => {
    if (mode === "quiz" || mode === "loading") return; // prevent during quiz
    setTab(newTab);
    setMode("idle");
    setExercises([]);
    setMascotMsg(randomMsg(newTab === "ai" ? "ai_idle" : "mistakes_idle"));
    if (newTab === "mistakes") setMistakes(readMistakes());
  };

  // --- Renders ---
  const renderDifficultySelector = () => (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>
      {[1, 2, 3, 4, 5].map((d) => (
        <button
          key={d}
          onClick={() => setDifficulty(d)}
          className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
            difficulty === d
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  );

  // --- AI Page (Idle) ---
  const renderAiIdle = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="w-7 h-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Practice-de-Learnt</h1>
          <p className="text-sm text-muted-foreground">
            AI-generated questions based on your progress
          </p>
        </div>
      </div>

      <AIMascot message={mascotMsg || "Ready to practice?"} mood="neutral" size="sm" className="mb-6" />

      {completedLessons.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Lessons Completed Yet</h2>
          <p className="text-muted-foreground mb-6">
            Complete a lesson first so I know what to quiz you on!
          </p>
        </div>
      ) : (
        <div className="card-bouncy p-6 mb-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Session Settings
          </h3>

          {renderDifficultySelector()}

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Check className="w-4 h-4 text-accent" />
            <span>{TOTAL_QUESTIONS} questions per session</span>
            <span className="mx-2">•</span>
            <BarChart3 className="w-4 h-4" />
            <span>Adaptive to your level</span>
            <span className="mx-2">•</span>
            <BrainCircuit className="w-4 h-4" />
            <span>AI-generated on-the-fly</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={startAiPractice}
            className="btn-3d-primary w-full text-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start {TOTAL_QUESTIONS}-Question Session
          </motion.button>
        </div>
      )}
    </motion.div>
  );

  // --- Mistakes Page (List) ---
  const renderMistakesList = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-7 h-7 text-destructive" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Mistakes</h1>
          <p className="text-sm text-muted-foreground">
            Review and correct your past mistakes
          </p>
        </div>
        {mistakes.length > 0 && (
          <button
            onClick={clearAllMistakes}
            className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
            title="Clear all mistakes"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <AIMascot message={mascotMsg || "Let's fix those mistakes!"} mood="encouraging" size="sm" className="mb-6" />

      {mistakes.length === 0 ? (
        <div className="text-center py-16">
          <CodeBuddy state="coding" size="lg" className="mx-auto mb-4" message="No bugs found! You're writing clean code." />
          <h2 className="text-xl font-bold mb-2">No Mistakes!</h2>
          <p className="text-muted-foreground">
            You&apos;re doing great — all mistakes have been corrected!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-2">
            {mistakes.length} mistake{mistakes.length !== 1 ? "s" : ""} to review
          </p>
          {mistakes.map((item) => (
            <motion.div
              key={item.mistakeId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card-bouncy p-4 flex items-start gap-3 cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => startMistakeQuiz(item)}
            >
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-2">
                  {item.exercise.question}
                </p>
                <p className="text-xs text-accent mt-1">
                  Correct answer: <span className="font-bold">{item.exercise.correct_answer}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.exercise.explanation}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  // --- Quiz View (shared between AI & Mistakes) ---
  const renderQuiz = () => (
    <div className="flex flex-col min-h-[60vh]">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="flex-1"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              {tab === "ai" ? "AI Practice" : "Mistake Review"}
            </span>
            <h2 className="text-lg font-bold mt-0.5">
              Question {currentIndex + 1} of {exercises.length}
            </h2>
          </div>
          <AIMascot message={mascotMsg} mood="neutral" size="sm" />
        </div>

        <ProgressBar
          value={((currentIndex + (feedback === "correct" ? 1 : 0)) / exercises.length) * 100}
          className="mb-6"
        />

        {/* Question */}
        {currentExercise && (
          <>
            <div className="card-bouncy p-5 mb-5">
              <p className="text-base font-medium">{currentExercise.question}</p>
            </div>

            {currentExercise.code_snippet && (
              <div className="mb-5">
                <CodeBlock code={currentExercise.code_snippet} />
              </div>
            )}

            {currentExercise.type === "concept" && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground italic mb-4">
                  {currentExercise.explanation}
                </p>
                {feedback === "none" && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFeedback("correct");
                      setSelectedAnswer("understood");
                      addXp(10);
                      setMascotMsg(randomMsg("correct"));
                      if (tab === "ai") setAiCorrect((c) => c + 1);
                    }}
                    className="btn-3d-primary px-8"
                  >
                    I Understand — Continue
                  </motion.button>
                )}
              </div>
            )}

            {currentExercise.type === "multiple_choice" &&
              currentExercise.options && currentExercise.options.length > 0 && (
                <div className="space-y-3">
                  {currentExercise.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedAnswer(opt)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedAnswer === opt
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      } ${
                        feedback === "correct" && selectedAnswer === opt
                          ? "border-accent bg-accent/5"
                          : ""
                      } ${
                        feedback === "incorrect" && selectedAnswer === opt
                          ? "border-destructive bg-destructive/5"
                          : ""
                      }`}
                    >
                      <span className="text-sm font-medium">{opt}</span>
                    </motion.button>
                  ))}
                </div>
              )}

            {currentExercise.type === "fill_blank" && (
              <div className="mt-4">
                <input
                  type="text"
                  value={filledBlank}
                  onChange={(e) => setFilledBlank(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 rounded-xl border-2 bg-background focus:outline-none focus:border-primary transition-all text-lg font-mono"
                  autoFocus
                />
              </div>
            )}

            {currentExercise.type === "syntax_drag" && (
              <div className="mt-4">
                <SyntaxDrag
                  blocks={currentExercise.options || []}
                  onOrderChange={setDragOrder}
                />
              </div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {feedback === "correct" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 p-3 md:p-4 rounded-xl bg-accent/10 border border-accent/30"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 md:w-5 h-4 md:h-5 text-accent" />
                    <span className="font-bold text-sm md:text-base text-accent">Correct!</span>
                    <span className="text-xs md:text-sm text-muted-foreground ml-auto">+10 XP</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {currentExercise?.explanation}
                  </p>
                </motion.div>
              )}
              {feedback === "incorrect" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 p-3 md:p-4 rounded-xl bg-destructive/10 border border-destructive/30"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 md:w-5 h-4 md:h-5 text-destructive" />
                    <span className="font-bold text-sm md:text-base text-destructive">Not quite</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-6">
              {feedback === "none" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={doCheck}
                  disabled={!hasAnswer}
                  className="btn-3d-primary w-full text-base md:text-lg"
                >
                  Check Answer
                </motion.button>
              )}
              {feedback === "incorrect" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={attemptAgain}
                  className="btn-3d-primary w-full text-base md:text-lg"
                >
                  Try Again
                </motion.button>
              )}
              {feedback === "correct" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={doNext}
                  className="btn-3d-primary w-full text-base md:text-lg"
                >
                  {currentIndex < exercises.length - 1 ? "Next Question" : "Finish"}
                </motion.button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );

  // --- Summary View (AI only) ---
  const renderSummary = () => {
    const total = aiCorrect + aiIncorrect;
    const pct = total > 0 ? Math.round((aiCorrect / total) * 100) : 0;
    const newDifficulty = pct >= 80 ? Math.min(difficulty + 1, 5) : pct <= 30 ? Math.max(difficulty - 1, 1) : difficulty;
    const xpEarned = aiCorrect * 10;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-8 text-center"
      >
        <Sparkles className="w-16 h-16 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
        <p className="text-muted-foreground mb-6">
          You answered {aiCorrect} of {total} questions correctly
        </p>

        <AIMascot message={mascotMsg} mood={pct >= 60 ? "happy" : "encouraging"} size="lg" className="mx-auto mb-6" />

        <div className="card-bouncy p-6 mb-6 max-w-sm mx-auto text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Score</span>
            <span className="text-lg font-bold">{pct}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              className="h-full rounded-full bg-accent"
            />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Correct</span>
            <span className="text-sm font-bold text-accent">{aiCorrect}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Incorrect</span>
            <span className="text-sm font-bold text-destructive">{aiIncorrect}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">XP Earned</span>
            <span className="text-sm font-bold">{xpEarned} XP</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-muted-foreground">Next Difficulty</span>
            <span className="text-sm font-bold">{newDifficulty} / 5</span>
          </div>
        </div>

        <div className="flex gap-3 max-w-sm mx-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setDifficulty(newDifficulty);
              setMode("idle");
              setMascotMsg(randomMsg("ai_idle"));
            }}
            className="btn-3d-primary flex-1"
          >
            Practice Again
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMode("idle");
              setMascotMsg(randomMsg("ai_idle"));
            }}
            className="btn-3d flex-1"
          >
            Change Settings
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // --- Loading State ---
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
      <AIMascot message="Generating questions just for you..." mood="neutral" size="sm" />
      <p className="text-sm text-muted-foreground mt-4">
        Creating personalized practice questions based on your progress...
      </p>
    </div>
  );

  return (
    <AuthGuard>
      <Navigation />
      <div className="min-h-screen pb-24 md:pt-20 px-4 max-w-2xl mx-auto">
        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 rounded-2xl bg-secondary mb-4 sticky top-0 z-10">
          <button
            onClick={() => switchTab("ai")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === "ai"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            } ${(mode === "quiz" || mode === "loading") ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <BrainCircuit className="w-4 h-4" />
            AI Practice
          </button>
          <button
            onClick={() => switchTab("mistakes")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === "mistakes"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            } ${(mode === "quiz" || mode === "loading") ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Target className="w-4 h-4" />
            Mistakes
            {mistakes.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {mistakes.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {mode === "loading" && renderLoading()}
          {mode === "quiz" && <div key="quiz">{renderQuiz()}</div>}
          {mode === "summary" && <div key="summary">{renderSummary()}</div>}
          {mode === "idle" && tab === "ai" && <div key="ai-idle">{renderAiIdle()}</div>}
          {mode === "idle" && tab === "mistakes" && mistakeMode === "list" && (
            <div key="mistakes-list">{renderMistakesList()}</div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}

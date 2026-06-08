"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check, RefreshCw } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import ProgressBar from "@/components/ui/ProgressBar";
import { useStore } from "@/lib/store";
import { curriculum } from "@/lib/curriculum";
import type { Exercise } from "@/lib/types";

export default function PracticePage() {
  const { addXp } = useStore();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
  const [filledBlank, setFilledBlank] = useState("");

  useEffect(() => {
    const mistakenIds = JSON.parse(
      localStorage.getItem("opencodeLingo_mistakes") || "[]"
    );
    if (mistakenIds.length > 0) {
      const allExercises = Object.values(curriculum)
        .flatMap((groups) => groups.flatMap((g) => g.exercises));
      const filtered = allExercises.filter((ex) => mistakenIds.includes(ex.id));
      setExercises(filtered.length > 0 ? filtered : allExercises.slice(0, 4));
    } else {
      const allExercises = Object.values(curriculum)
        .flatMap((groups) => groups.flatMap((g) => g.exercises));
      setExercises(allExercises.slice(0, 4));
    }
  }, []);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? currentIndex / exercises.length : 0;

  const handleCheck = () => {
    if (!currentExercise) return;
    const correct =
      currentExercise.type === "fill_blank"
        ? filledBlank.trim().toLowerCase() ===
          currentExercise.correct_answer.toLowerCase()
        : selectedAnswer === currentExercise.correct_answer;

    if (correct) {
      setFeedback("correct");
      addXp(20);
      const mistakenIds = JSON.parse(
        localStorage.getItem("opencodeLingo_mistakes") || "[]"
      );
      const updated = mistakenIds.filter(
        (id: string) => id !== currentExercise.id
      );
      localStorage.setItem("opencodeLingo_mistakes", JSON.stringify(updated));
    } else {
      setFeedback("incorrect");
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer("");
      setFilledBlank("");
      setFeedback("none");
    }
  };

  if (exercises.length === 0) {
    return (
      <AuthGuard>
        <Navigation />
        <div className="min-h-screen pb-24 md:pt-20 px-4 max-w-3xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <Target className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">All Clear!</h2>
            <p className="text-muted-foreground">
              No mistakes to practice. You&apos;re on fire!
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Navigation />
      <div className="min-h-screen pb-24 md:pt-20 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Targeted Practice</h1>
              <p className="text-sm text-muted-foreground">
                Master your mistakes and earn bonus XP
              </p>
            </div>
          </div>

          <ProgressBar value={progress * 100} className="mb-8" />

          <AnimatePresence mode="wait">
            {currentExercise && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="mb-6">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {currentExercise.type.replace("_", " ")}
                  </span>
                  <h2 className="text-xl font-bold mt-1">
                    {currentExercise.question}
                  </h2>
                </div>

                {currentExercise.code_snippet && (
                  <pre className="bg-muted p-4 rounded-xl mb-6 overflow-x-auto">
                    <code className="text-sm">
                      {currentExercise.code_snippet}
                    </code>
                  </pre>
                )}

                {currentExercise.type === "fill_blank" ? (
                  <input
                    type="text"
                    value={filledBlank}
                    onChange={(e) => setFilledBlank(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 rounded-xl border-2 bg-background focus:outline-none focus:border-primary transition-all text-lg font-mono"
                    autoFocus
                  />
                ) : (
                  currentExercise.options && (
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
                          }`}
                        >
                          <span className="text-sm font-medium">{opt}</span>
                        </motion.button>
                      ))}
                    </div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {feedback === "correct" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/30"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="font-bold text-accent">Mastered!</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    +20 Bonus XP
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentExercise?.explanation}
                </p>
              </motion.div>
            )}
            {feedback === "incorrect" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-destructive" />
                  <span className="font-bold text-destructive">
                    Keep trying
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6">
            {feedback === "none" && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheck}
                disabled={!selectedAnswer && !filledBlank}
                className="btn-3d-primary w-full text-lg"
              >
                Check Answer
              </motion.button>
            )}
            {feedback === "incorrect" && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setFeedback("none")}
                className="btn-3d-primary w-full text-lg"
              >
                Try Again
              </motion.button>
            )}
            {feedback === "correct" && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="btn-3d-primary w-full text-lg"
              >
                {currentIndex < exercises.length - 1
                  ? "Next Exercise"
                  : "Done! 🎉"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}

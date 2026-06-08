"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, RefreshCw } from "lucide-react";
import { useStore } from "@/lib/store";
import { getExercisesForLesson } from "@/lib/curriculum";
import ProgressBar from "@/components/ui/ProgressBar";
import FlashCard from "@/components/ui/FlashCard";
import type { Exercise } from "@/lib/types";

type FeedbackState = "none" | "correct" | "incorrect";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { addXp } = useStore();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [filledBlank, setFilledBlank] = useState("");
  const [dragOrder, setDragOrder] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("opencodeLingo_currentExercises");
    if (stored) {
      setExercises(JSON.parse(stored));
      return;
    }

    const courseId = (params.id as string).split("-u")[0];
    const exercises = getExercisesForLesson(courseId, params.id as string);
    if (exercises.length > 0) {
      setExercises(exercises);
      localStorage.setItem(
        "opencodeLingo_currentExercises",
        JSON.stringify(exercises)
      );
    }
  }, [params.id]);

  useEffect(() => {
    if (exercises.length > 0 && exercises[currentIndex]?.type === "syntax_drag") {
      const options = exercises[currentIndex].options || [];
      setDragOrder([...options].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, exercises]);

  const currentExercise = exercises[currentIndex];
  const progress = currentIndex / exercises.length;

  const handleCheck = useCallback(() => {
    if (!currentExercise) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps

    let isCorrect = false;

    switch (currentExercise.type) {
      case "concept":
      case "multiple_choice":
        isCorrect = selectedAnswer === currentExercise.correct_answer;
        break;
      case "fill_blank":
        isCorrect =
          filledBlank.trim().toLowerCase() ===
          currentExercise.correct_answer.toLowerCase();
        break;
      case "syntax_drag":
        isCorrect =
          dragOrder.join("\n").trim() ===
          currentExercise.correct_answer.trim();
        break;
    }

    if (isCorrect) {
      setFeedback("correct");
      playSound(true);
    } else {
      setFeedback("incorrect");
      playSound(false);
    }
  }, [currentExercise, selectedAnswer, filledBlank, dragOrder]);

  const handleNext = useCallback(() => {
    if (feedback === "correct") {
      const xpGain = (currentExercise?.difficulty || 1) * 10;
      addXp(xpGain);

      const completed = JSON.parse(
        localStorage.getItem("opencodeLingo_completedLessons") || "[]"
      );
      if (!completed.includes(params.id)) {
        completed.push(params.id);
        localStorage.setItem(
          "opencodeLingo_completedLessons",
          JSON.stringify(completed)
        );
      }

      if (currentIndex < exercises.length - 1) {
        setCurrentIndex((i) => i + 1);
        setSelectedAnswer("");
        setFilledBlank("");
        setFeedback("none");
      } else {
        setShowCelebration(true);
        setTimeout(() => {
          localStorage.removeItem("opencodeLingo_currentExercises");
          router.push("/learn");
        }, 3000);
      }
    }
  }, [feedback, currentIndex, exercises.length, currentExercise, addXp, router, params.id]);

  const handleQuit = () => {
    localStorage.removeItem("opencodeLingo_currentExercises");
    router.push("/learn");
  };

  const playSound = (correct: boolean) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = correct ? 880 : 220;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-4 p-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleQuit}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>
        <div className="flex-1">
          <ProgressBar value={progress * 100} />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1}/{exercises.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col px-4 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col py-8"
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
                <code className="text-sm">{currentExercise.code_snippet}</code>
              </pre>
            )}

            {currentExercise.type === "concept" && (
              <FlashCard
                question={currentExercise.question}
                explanation={currentExercise.explanation}
              />
            )}

            {(currentExercise.type === "concept" ||
              currentExercise.type === "multiple_choice") &&
              currentExercise.options && (
                <div className="space-y-3 mt-4">
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
              <div className="space-y-2 mt-4">
                {dragOrder.map((item, i) => (
                  <motion.div
                    key={item}
                    layout
                    draggable
                    onDragStart={() => {}}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      const newOrder = [...dragOrder];
                      const idx = newOrder.indexOf(item);
                      newOrder.splice(idx, 1);
                      newOrder.splice(i, 0, item);
                      setDragOrder(newOrder);
                    }}
                    className="p-3 rounded-xl bg-muted border-2 border-border cursor-grab active:cursor-grabbing font-mono text-sm"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 p-4 border-t bg-background">
        <AnimatePresence>
          {feedback === "correct" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 p-4 rounded-xl bg-accent/10 border border-accent/30"
            >
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-5 h-5 text-accent" />
                <span className="font-bold text-accent">Correct!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentExercise.explanation}
              </p>
              <p className="text-sm font-medium text-accent mt-1">
                +{currentExercise.difficulty * 10} XP
              </p>
            </motion.div>
          )}

          {feedback === "incorrect" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30"
            >
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="w-5 h-5 text-destructive" />
                <span className="font-bold text-destructive">
                  Not quite — try again
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                No worries, you can retry as many times as you need.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          {feedback === "none" && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheck}
              disabled={
                !selectedAnswer && !filledBlank && dragOrder.length === 0
              }
              className="btn-3d-primary flex-1 text-lg"
            >
              Check
            </motion.button>
          )}
          {feedback === "incorrect" && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setFeedback("none")}
              className="btn-3d-primary flex-1 text-lg"
            >
              Try Again
            </motion.button>
          )}
          {feedback === "correct" && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="btn-3d-primary flex-1 text-lg"
            >
              {currentIndex < exercises.length - 1 ? "Next" : "Finish"}
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              <Sparkles className="w-20 h-20 text-accent mx-auto mb-4 animate-celebration" />
              <h2 className="text-3xl font-extrabold mb-2">
                Lesson Complete!
              </h2>
              <p className="text-muted-foreground">
                Amazing work! Keep up the streak.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

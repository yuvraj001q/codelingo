"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check, RefreshCw, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import ProgressBar from "@/components/ui/ProgressBar";
import CodeBlock from "@/components/ui/CodeBlock";
import SyntaxDrag from "@/components/ui/SyntaxDrag";
import AIMascot from "@/components/ui/AIMascot";
import { useStore } from "@/lib/store";
import { curriculum, getLessonContent } from "@/lib/curriculum";
import type { ContentItem, Exercise } from "@/lib/types";

type Phase = "learn" | "quiz" | "done";

const mascotMessages: Record<string, string[]> = {
  learn: [
    "Let's review what tripped you up before!",
    "Take your time — understanding beats speed.",
    "I'll help you master these concepts!",
  ],
  quiz: [
    "Let's try these again — you've got this!",
    "Think carefully before answering.",
    "Practice makes perfect, let's go!",
  ],
  correct: [
    "Brilliant! You've mastered this one!",
    "Excellent! That's the right answer!",
    "Perfect! See, you knew it all along!",
  ],
  incorrect: [
    "Not quite — give it another shot!",
    "Almost there, keep going!",
    "Don't worry, each attempt teaches you something!",
  ],
  done: [
    "All caught up! You're unstoppable!",
    "Great work — no mistakes left!",
    "You've conquered every single one!",
  ],
};

function randomMsg(category: string): string {
  const msgs = mascotMessages[category] || mascotMessages.neutral;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export default function PracticePage() {
  const { addXp } = useStore();
  const [phase, setPhase] = useState<Phase>("learn");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentIndex, setContentIndex] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
  const [filledBlank, setFilledBlank] = useState("");
  const [dragOrder, setDragOrder] = useState<string[]>([]);
  const [mascotMsg, setMascotMsg] = useState("");

  useEffect(() => {
    const mistakenIds = JSON.parse(
      localStorage.getItem("opencodeLingo_mistakes") || "[]"
    );

    const allExercises = Object.values(curriculum)
      .flatMap((groups) => groups.flatMap((g) => g.exercises));

    let quizExercises: Exercise[];
    let reviewContent: ContentItem[] = [];

    if (mistakenIds.length > 0) {
      quizExercises = allExercises.filter((ex) => mistakenIds.includes(ex.id));
      if (quizExercises.length === 0) {
        quizExercises = allExercises.slice(0, 3);
      }

      const lessonIds = Array.from(new Set(quizExercises.map((ex) => ex.lesson_id)));
      for (const lid of lessonIds) {
        const courseId = lid.split("-u")[0];
        const lesson = getLessonContent(courseId, lid);
        if (lesson.content.length > 0) {
          reviewContent.push(...lesson.content);
        }
      }
      if (reviewContent.length > 3) {
        reviewContent = reviewContent.slice(0, 3);
      }
    } else {
      quizExercises = allExercises.slice(0, 3);
    }

    setContentItems(reviewContent);
    setExercises(quizExercises);
    setMascotMsg(randomMsg("learn"));

    if (reviewContent.length === 0) {
      setPhase("quiz");
      setMascotMsg(randomMsg("quiz"));
    }
  }, []);

  const currentExercise = exercises[currentIndex];
  const totalSteps = contentItems.length + exercises.length;
  const currentStep = phase === "learn"
    ? contentIndex
    : contentItems.length + currentIndex;
  const progress = totalSteps > 0 ? currentStep / totalSteps : 0;

  const handleCheck = () => {
    if (!currentExercise) return;

    let isCorrect = false;
    switch (currentExercise.type) {
      case "concept":
        isCorrect = selectedAnswer === "understood";
        break;
      case "multiple_choice":
        isCorrect = selectedAnswer === currentExercise.correct_answer;
        break;
      case "fill_blank":
        isCorrect = filledBlank.trim().toLowerCase() === currentExercise.correct_answer.toLowerCase();
        break;
      case "syntax_drag":
        isCorrect = dragOrder.join("\n").trim() === currentExercise.correct_answer.trim();
        break;
    }

    if (isCorrect) {
      setFeedback("correct");
      addXp(20);
      setMascotMsg(randomMsg("correct"));
    } else {
      setFeedback("incorrect");
      setMascotMsg(randomMsg("incorrect"));
    }
  };

  const handleNext = () => {
    if (feedback !== "correct") return;

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer("");
      setFilledBlank("");
      setDragOrder([]);
      setFeedback("none");
      setMascotMsg(randomMsg("quiz"));
    } else {
      const mistakenIds = JSON.parse(
        localStorage.getItem("opencodeLingo_mistakes") || "[]"
      );
      if (currentExercise) {
        const updated = mistakenIds.filter((id: string) => id !== currentExercise.id);
        localStorage.setItem("opencodeLingo_mistakes", JSON.stringify(updated));
      }
      setMascotMsg(randomMsg("done"));
      setPhase("done");
    }
  };

  useEffect(() => {
    if (currentExercise?.type === "syntax_drag") {
      const options = currentExercise.options || [];
      setDragOrder([...options].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, currentExercise]);

  const currentContent = contentItems[contentIndex];
  const isLastContent = contentIndex >= contentItems.length - 1;

  const handleLearnNext = () => {
    if (!isLastContent) {
      setContentIndex((i) => i + 1);
      setMascotMsg(randomMsg("learn"));
    } else {
      setPhase("quiz");
      setMascotMsg(randomMsg("quiz"));
    }
  };

  if (phase === "done") {
    return (
      <AuthGuard>
        <Navigation />
        <div className="min-h-screen pb-24 md:pt-20 px-4 max-w-3xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
            <p className="text-muted-foreground mb-6">
              Great job mastering those mistakes. You&apos;re leveling up!
            </p>
            <AIMascot message={mascotMsg} mood="happy" size="lg" className="mx-auto" />
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Targeted Practice</h1>
              <p className="text-sm text-muted-foreground">
                Master your mistakes and earn bonus XP
              </p>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {phase === "learn"
                ? `Review ${contentIndex + 1}/${contentItems.length}`
                : `${currentIndex + 1}/${exercises.length}`}
            </span>
          </div>

          <ProgressBar value={progress * 100} className="mb-6" />

          <AIMascot message={mascotMsg} mood={feedback === "correct" ? "happy" : feedback === "incorrect" ? "encouraging" : "neutral"} size="sm" className="mb-6" />

          {/* LEARN PHASE */}
          {phase === "learn" && currentContent && (
            <motion.div
              key={currentContent.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-accent">
                  Review • Step {contentIndex + 1} of {contentItems.length}
                </span>
                <h2 className="text-xl font-bold mt-1">{currentContent.title}</h2>
              </div>
              <div className="card-bouncy p-5 mb-5">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {currentContent.body}
                </p>
              </div>
              {currentContent.code_snippet && (
                <div className="mb-6">
                  <CodeBlock code={currentContent.code_snippet} />
                </div>
              )}
              <div className="mt-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLearnNext}
                  className="btn-3d-primary w-full flex items-center justify-center gap-2"
                >
                  {!isLastContent ? (
                    <>Next <ChevronRight className="w-4 h-4" /></>
                  ) : (
                    "Start Practice Quiz"
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* QUIZ PHASE */}
          {phase === "quiz" && currentExercise && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    Quiz • Question {currentIndex + 1} of {exercises.length}
                  </span>
                  <h2 className="text-xl font-bold mt-1">{currentExercise.question}</h2>
                </div>

                {currentExercise.code_snippet && (
                  <div className="mb-5">
                    <CodeBlock code={currentExercise.code_snippet} />
                  </div>
                )}

                {currentExercise.type === "concept" && (
                  <div className="card-bouncy p-6 text-center">
                    <p className="text-base leading-relaxed mb-4">{currentExercise.question}</p>
                    <p className="text-sm text-muted-foreground italic">{currentExercise.explanation}</p>
                    {feedback === "none" && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedAnswer("understood");
                          setTimeout(() => handleCheck(), 50);
                        }}
                        className="btn-3d-primary mt-6 px-8"
                      >
                        I Understand — Continue
                      </motion.button>
                    )}
                  </div>
                )}

                {currentExercise.type === "multiple_choice" &&
                  currentExercise.options && currentExercise.options.length > 0 && (
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
                  <div className="mt-4">
                    <SyntaxDrag
                      blocks={currentExercise.options || []}
                      onOrderChange={setDragOrder}
                    />
                  </div>
                )}

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
                        <span className="text-sm text-muted-foreground ml-auto">+20 Bonus XP</span>
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
                        <span className="font-bold text-destructive">Keep trying</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6">
                  {feedback === "none" && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheck}
                      disabled={!selectedAnswer && !filledBlank && dragOrder.length === 0}
                      className="btn-3d-primary w-full text-lg"
                    >
                      Check Answer
                    </motion.button>
                  )}
                  {feedback === "incorrect" && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setFeedback("none");
                        setSelectedAnswer("");
                      }}
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
                      {currentIndex < exercises.length - 1 ? "Next Question" : "Done!"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* No content fallback */}
          {phase === "quiz" && exercises.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Mistakes Yet!</h2>
              <p className="text-muted-foreground">
                You&apos;re doing great — keep learning and check back after a lesson.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AuthGuard>
  );
}

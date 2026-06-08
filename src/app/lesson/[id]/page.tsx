"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, RefreshCw, ChevronRight, Flame } from "lucide-react";
import AIMascot from "@/components/ui/AIMascot";
import { useStore } from "@/lib/store";
import { getLessonContent } from "@/lib/curriculum";
import ProgressBar from "@/components/ui/ProgressBar";
import CodeBlock from "@/components/ui/CodeBlock";
import SyntaxDrag from "@/components/ui/SyntaxDrag";
import type { ContentItem, Exercise } from "@/lib/types";
import { updateStreak, getLeagueEmoji, getLeagueForXp } from "@/lib/utils";
import { syncUserToNeon } from "@/lib/syncUser";

type Phase = "learn" | "quiz" | "complete";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { addXp } = useStore();

  const [phase, setPhase] = useState<Phase>("learn");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentIndex, setContentIndex] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [queue, setQueue] = useState<number[]>([]);
  const [currentPtr, setCurrentPtr] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
  const [filledBlank, setFilledBlank] = useState("");
  const [dragOrder, setDragOrder] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [streak, setStreak] = useState(0);
  const [streakPopup, setStreakPopup] = useState(0);

  useEffect(() => {
    const courseId = (params.id as string).split("-u")[0];
    const lessonContent = getLessonContent(courseId, params.id as string);

    if (lessonContent.content.length > 0) {
      setContentItems(lessonContent.content);
    }

    const stored = localStorage.getItem("opencodeLingo_currentExercises");
    if (stored) {
      const parsed: Exercise[] = JSON.parse(stored);
      setExercises(parsed);
      setQueue(parsed.map((_, i) => i).sort(() => Math.random() - 0.5));
      return;
    }

    if (lessonContent.exercises.length > 0) {
      setExercises(lessonContent.exercises);
      localStorage.setItem(
        "opencodeLingo_currentExercises",
        JSON.stringify(lessonContent.exercises)
      );
      setQueue(lessonContent.exercises.map((_, i) => i).sort(() => Math.random() - 0.5));
    }
  }, [params.id]);

  useEffect(() => {
    const idx = queue[currentPtr] ?? 0;
    if (exercises.length > 0 && exercises[idx]?.type === "syntax_drag") {
      const options = exercises[idx].options || [];
      setDragOrder([...options].sort(() => Math.random() - 0.5));
    }
  }, [queue, currentPtr, exercises]);

  const currentIndex = queue[currentPtr] ?? 0;
  const currentExercise = exercises[currentIndex];
  const doneCount = exercises.length - queue.length;
  const totalSteps = contentItems.length + exercises.length;
  const currentStep = contentItems.length > 0 && phase === "learn"
    ? contentIndex
    : contentItems.length + doneCount;
  const progress = totalSteps > 0 ? currentStep / totalSteps : 0;

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
      if (!correct) {
        setAiHint(`Hint: Think about "${currentExercise.correct_answer}"`);
      }
    } else if (currentExercise.type === "syntax_drag") {
      correct = dragOrder.join("\n").trim() === currentExercise.correct_answer.trim();
    }

    if (correct) {
      setFeedback("correct");
      playSound(true);
      setAiHint("");
      const newStreak = streak + 1;
      setStreak(newStreak);
      setStreakPopup(newStreak);
      setTimeout(() => setStreakPopup(0), 1200);
      // Fire AI for semantic check (non-blocking, enhances UX)
      if (currentExercise.type === "fill_blank") {
        fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: currentExercise.question,
            correctAnswer: currentExercise.correct_answer,
            userAnswer: filledBlank,
            type: "fill_blank",
          }),
        })
          .then((r) => r.json())
          .then((res) => {
            if (!res.isCorrect) {
              setAiHint(res.explanation || `Expected something like "${currentExercise.correct_answer}"`);
            }
          })
          .catch(() => {});
      }
    } else {
      setFeedback("incorrect");
      playSound(false);
      setStreak(0);
    }
  };

  const doNext = () => {
    if (feedback !== "correct") return;

    const bonusMultiplier = 1 + Math.min(streak - 1, 5) * 0.2;
    const baseXp = (currentExercise?.difficulty || 1) * 10;
    const xpGain = Math.round(baseXp * bonusMultiplier);
    addXp(xpGain);

    const totalXp = parseInt(localStorage.getItem("opencodeLingo_totalXp") || "0", 10);
    localStorage.setItem("opencodeLingo_totalXp", String(totalXp + xpGain));

    // Remove current from queue (answered correctly)
    const newQueue = queue.filter((_, i) => i !== currentPtr);
    if (currentPtr >= newQueue.length && newQueue.length > 0) {
      setCurrentPtr(0);
    } else if (currentPtr >= newQueue.length) {
      setCurrentPtr(0);
    }
    setQueue(newQueue);

    if (newQueue.length === 0) {
      updateStreak();
      const completed = JSON.parse(localStorage.getItem("opencodeLingo_completedLessons") || "[]");
      if (!completed.includes(params.id)) {
        completed.push(params.id);
        localStorage.setItem("opencodeLingo_completedLessons", JSON.stringify(completed));
      }
      syncUserToNeon();
      setShowCelebration(true);
      setTimeout(() => {
        localStorage.removeItem("opencodeLingo_currentExercises");
        router.push("/learn");
      }, 3000);
      return;
    }

    setSelectedAnswer("");
    setFilledBlank("");
    setDragOrder([]);
    setFeedback("none");
    setAiHint("");
  };

  const attemptAgain = () => {
    // Move current question to end of queue
    const current = queue[currentPtr];
    const remaining = queue.filter((_, i) => i !== currentPtr);
    const newQueue = [...remaining, current];
    setQueue(newQueue);
    setCurrentPtr(0);
    setFeedback("none");
    setSelectedAnswer("");
    setFilledBlank("");
    setDragOrder([]);
    setAiHint("");
    setStreak(0);
  };

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

  const startQuiz = () => {
    setPhase("quiz");
  };

  const currentContent = contentItems[contentIndex];
  const isLastContent = contentIndex >= contentItems.length - 1;

  const hasAnswer = selectedAnswer || filledBlank || dragOrder.length > 0;

  if (exercises.length === 0 && contentItems.length === 0) {
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
        {phase === "quiz" && streak > 0 && (
          <motion.div
            key={streak}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 mr-3"
          >
            <Flame className={`w-5 h-5 ${streak >= 3 ? "text-orange-500" : "text-orange-400"}`} />
            <span className="text-sm font-extrabold text-orange-500">{streak}</span>
          </motion.div>
        )}
        {(() => {
          const totalXp = parseInt(localStorage.getItem("opencodeLingo_totalXp") || "0", 10);
          const league = getLeagueForXp(totalXp);
          return (
            <span className="text-sm" title={`${league} — ${totalXp} XP`}>
              {getLeagueEmoji(league)}
            </span>
          );
        })()}
        <span className="text-sm font-medium text-muted-foreground">
          {phase === "learn"
            ? `Learn ${contentIndex + 1}/${contentItems.length}`
            : `Done ${doneCount}/${exercises.length}`}
        </span>
      </div>

      <div className="flex-1 flex flex-col px-4 max-w-2xl mx-auto w-full">
        {/* LEARN PHASE */}
        {phase === "learn" && currentContent && (
          <motion.div
            key={currentContent.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col py-6"
          >
            <div className="mb-4 flex items-start gap-3">
              <AIMascot size="sm" mood="neutral" className="mt-1 shrink-0" />
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-accent mb-1 block">
                  Learning • Step {contentIndex + 1} of {contentItems.length}
                </span>
                <h2 className="text-2xl font-bold">{currentContent.title}</h2>
              </div>
            </div>

            <div className="card-bouncy p-6 mb-6">
              <p className="text-base leading-relaxed text-foreground/90">
                {currentContent.body}
              </p>
            </div>

            {currentContent.code_snippet && (
              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Example
                </p>
                <CodeBlock
                  code={currentContent.code_snippet}
                  language={currentContent.language || "python"}
                />
              </div>
            )}

            <div className="mt-auto pt-4">
              {!isLastContent ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setContentIndex((i) => i + 1)}
                  className="btn-3d-primary w-full text-lg flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={startQuiz}
                  className="btn-3d-primary w-full text-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Quiz
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* CONTENT-LESS FALLBACK */}
        {phase === "learn" && contentItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-12"
          >
            <AIMascot size="lg" mood="happy" className="mb-4" message="Ready to test your knowledge?" />
            <h2 className="text-xl font-bold mb-2">Ready to Practice?</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Let&apos;s test what you know with a few questions.
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={startQuiz}
              className="btn-3d-primary text-lg"
            >
              Start
            </motion.button>
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
              className="flex-1 flex flex-col py-6"
            >
              <div className="mb-6">
                <span className="text-xs font-medium uppercase tracking-wider text-primary mb-2 block">
                  Quiz • {queue.length} remaining
                </span>
                <h2 className="text-xl font-bold">{currentExercise.question}</h2>
              </div>

              {currentExercise.code_snippet && (
                <div className="mb-6">
                  <CodeBlock
                    code={currentExercise.code_snippet}
                    language={(params.id as string).split("-u")[0] === "python" ? "python" : "javascript"}
                  />
                </div>
              )}

              {currentExercise.type === "concept" && (
                <div className="mt-4 card-bouncy p-6 text-center">
                  <p className="text-base leading-relaxed mb-4">{currentExercise.question}</p>
                  <p className="text-sm text-muted-foreground italic">{currentExercise.explanation}</p>
                  {feedback === "none" && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setFeedback("correct");
                        setSelectedAnswer("understood");
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

              {aiHint && feedback === "incorrect" && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground mt-4 italic text-center"
                >
                  {aiHint}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* BOTTOM BAR */}
      {phase === "quiz" && (
        <div className="sticky bottom-0 p-3 md:p-4 border-t bg-background">
          <AnimatePresence>
            {feedback === "correct" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-3 p-3 md:p-4 rounded-xl bg-accent/10 border border-accent/30 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 md:w-5 h-4 md:h-5 text-accent" />
                  <span className="font-bold text-sm md:text-base text-accent">Correct!</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {currentExercise?.explanation}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs md:text-sm font-medium text-accent">
                    +{Math.round(((currentExercise?.difficulty || 1) * 10) * (1 + Math.min(streak - 1, 5) * 0.2))} XP
                    {streak > 1 && <span className="text-orange-500 ml-1">x{1 + Math.min(streak - 1, 5) * 0.2}</span>}
                  </p>
                </div>
                {streakPopup > 0 && (
                  <motion.div
                    key={streakPopup}
                    initial={{ scale: 0.5, opacity: 0, y: 10 }}
                    animate={{ scale: 1.3, opacity: 1, y: -5 }}
                    exit={{ scale: 2, opacity: 0, y: -20 }}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1"
                  >
                    <Flame className="w-5 md:w-6 h-5 md:h-6 text-orange-500" />
                    <span className="text-base md:text-lg font-extrabold text-orange-500">{streakPopup}</span>
                  </motion.div>
                )}
              </motion.div>
            )}
            {feedback === "incorrect" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-3 p-3 md:p-4 rounded-xl bg-destructive/10 border border-destructive/30"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 md:w-5 h-4 md:h-5 text-destructive" />
                  <span className="font-bold text-sm md:text-base text-destructive">Not quite — try again</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 md:gap-3">
            {feedback === "none" && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={doCheck}
                disabled={!hasAnswer}
                className="btn-3d-primary flex-1 text-base md:text-lg"
              >
                Check
              </motion.button>
            )}
            {feedback === "incorrect" && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={attemptAgain}
                className="btn-3d-primary flex-1 text-base md:text-lg"
              >
                Try Again
              </motion.button>
            )}
            {feedback === "correct" && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={doNext}
                className="btn-3d-primary flex-1 text-base md:text-lg"
              >
                <span className="md:hidden">{doneCount < exercises.length ? "Next" : "Finish"}</span>
                <span className="hidden md:inline">{doneCount < exercises.length ? "Next Question" : "Finish Lesson"}</span>
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* CELEBRATION */}
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
              <AIMascot size="lg" mood="happy" className="mx-auto mb-4" message="You crushed it!" />
              <h2 className="text-3xl font-extrabold mb-2">Lesson Complete!</h2>
              <p className="text-muted-foreground">
                Amazing work! Keep the streak going.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

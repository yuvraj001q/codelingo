"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Flame, Zap, Trophy, Map } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import AIMascot from "@/components/ui/AIMascot";
import HexNode from "@/components/ui/HexNode";
import { useStore } from "@/lib/store";
import { sampleUnits, getLeagueEmoji, getLeagueForXp, getStreakData } from "@/lib/utils";

interface JourneyLesson {
  id: string;
  title: string;
  unitTitle: string;
  unitIndex: number;
  lessonIndex: number;
  type: "challenge" | "quiz" | "mastery" | "project";
}

const lessonTypes: string[] = ["challenge", "quiz", "challenge", "mastery", "challenge", "quiz", "challenge", "project", "challenge", "quiz", "challenge", "challenge"];

function hashRange(index: number, min: number, max: number): number {
  const x = Math.sin(index * 12.9898) * 43758.5453;
  return min + (x - Math.floor(x)) * (max - min);
}

export default function LearnPage() {
  const router = useRouter();
  const { activeCourse } = useStore();
  const [nodes, setNodes] = useState<JourneyLesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeCourse) {
      const stored = localStorage.getItem("opencodeLingo_activeCourse");
      if (stored) {
        const course = JSON.parse(stored);
        useStore.getState().setActiveCourse(course);
      } else {
        router.push("/courses");
        return;
      }
    }

    const storedProgress = localStorage.getItem("opencodeLingo_completedLessons");
    if (storedProgress) {
      setCompletedLessons(new Set(JSON.parse(storedProgress)));
    }
  }, [activeCourse, router]);

  useEffect(() => {
    if (!activeCourse) return;
    const units = sampleUnits[activeCourse.id];
    if (!units) return;

    const lessonNodes: JourneyLesson[] = [];
    units.forEach((unit, ui) => {
      unit.lessons.forEach((lesson, li) => {
        lessonNodes.push({
          id: lesson.lessonId,
          title: lesson.title,
          unitTitle: unit.unitTitle,
          unitIndex: ui,
          lessonIndex: li,
          type: (lessonTypes[li % lessonTypes.length] || "challenge") as JourneyLesson["type"],
        });
      });
    });
    setNodes(lessonNodes);
  }, [activeCourse]);

  const positions = useMemo(() => {
    return nodes.map((_, i) => {
      const x = hashRange(i * 3 + 1, 12, 82);
      const yOffset = hashRange(i * 7 + 5, -15, 15);
      const y = i * 120 + 60 + yOffset;
      return { x, y };
    });
  }, [nodes]);

  const getNodeState = (id: string) => {
    if (completedLessons.has(id)) return "completed" as const;
    const idx = nodes.findIndex((n) => n.id === id);
    if (idx === 0) return "active" as const;
    const prev = nodes[idx - 1];
    if (prev && completedLessons.has(prev.id)) return "active" as const;
    return "locked" as const;
  };

  const totalXp = parseInt(localStorage.getItem("opencodeLingo_totalXp") || "0", 10);
  const streak = getStreakData();
  const completedCount = completedLessons.size;

  if (!activeCourse) return null;

  return (
    <AuthGuard>
      <Navigation />
      <div className="min-h-screen pb-24 md:pt-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">{activeCourse?.language_name || "Select a Course"}</h1>
                <p className="text-sm text-muted-foreground">Your learning journey</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold">{streak.days}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold">{totalXp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-lg">{getLeagueEmoji(getLeagueForXp(totalXp))}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${nodes.length > 0 ? (completedCount / nodes.length) * 100 : 0}%` }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <span className="text-sm text-muted-foreground font-medium shrink-0">
                {completedCount}/{nodes.length}
              </span>
            </div>

            <div className="text-center mb-8">
              <AIMascot size="md" mood="happy" message={`${completedCount} lessons down — keep going!`} className="mx-auto" />
            </div>
          </motion.div>

          {nodes.length > 0 && (
            <div ref={containerRef} className="relative pb-20" style={{ height: nodes.length * 120 + 120 }}>
              {/* SVG connector lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {positions.map((pos, i) => {
                  if (i === 0) return null;
                  const prev = positions[i - 1];
                  return (
                    <line
                      key={i}
                      x1={`${prev.x}%`}
                      y1={prev.y}
                      x2={`${pos.x}%`}
                      y2={pos.y}
                      stroke="hsl(var(--border))"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {/* Unit badges + Nodes */}
              {nodes.map((node, i) => {
                const isNewUnit = i === 0 || node.unitIndex !== nodes[i - 1].unitIndex;
                const state = getNodeState(node.id);
                const pos = positions[i];

                return (
                  <div key={node.id}>
                    {isNewUnit && (
                      <div
                        className="absolute z-20"
                        style={{ left: "50%", top: pos.y - 50, transform: "translateX(-50%)" }}
                      >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary border shadow-sm">
                          <Map className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">{node.unitTitle}</span>
                        </div>
                      </div>
                    )}
                    <div
                      className="absolute z-10"
                      style={{ left: `${pos.x}%`, top: pos.y, transform: "translate(-50%, -50%)" }}
                    >
                      <HexNode
                        title={node.title}
                        state={state}
                        lessonType={node.type}
                        onClick={state !== "locked" ? () => router.push(`/lesson/${node.id}`) : undefined}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Finish flag */}
              <div className="absolute z-10" style={{ left: "50%", top: nodes.length * 120 + 80, transform: "translateX(-50%)" }}>
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold">Course Complete!</span>
                </div>
              </div>
            </div>
          )}

          {activeCourse && nodes.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No lessons available yet for {activeCourse.language_name}.
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

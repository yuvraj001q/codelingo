"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Flame, Zap, Trophy, Map } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import CodeBuddyVisor from "@/components/ui/CodeBuddyVisor";
import HexNode from "@/components/ui/HexNode";
import CourseCertificate from "@/components/ui/CourseCertificate";
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

function sCurveX(index: number, total: number): number {
  const t = index / Math.max(total - 1, 1);
  return 50 + 30 * Math.sin(t * Math.PI * 2);
}

export default function LearnPage() {
  const router = useRouter();
  const { user, activeCourse } = useStore();
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
      const x = sCurveX(i, nodes.length);
      const y = i * 150 + 130;
      return { x, y };
    });
  }, [nodes]);

  const allCompleted = nodes.length > 0 && nodes.every((n) => completedLessons.has(n.id));

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
  const courseName = activeCourse?.language_name || "";
  const userName = user?.username || "Coder";
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (!activeCourse) return null;

  return (
    <AuthGuard>
      <Navigation />
      <div className="min-h-screen pb-24 md:pt-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {activeCourse?.icon_svg && (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 p-2"
                    dangerouslySetInnerHTML={{ __html: activeCourse.icon_svg }}
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">{courseName}</h1>
                  <p className="text-sm text-muted-foreground">Your learning journey</p>
                </div>
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
              <div className="flex flex-col items-center gap-2 mx-auto">
  <CodeBuddyVisor size="md" state="success" />
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-2.5 rounded-2xl bg-secondary text-sm font-medium text-foreground text-center shadow-sm max-w-[220px]">{completedCount} lessons down — keep going!</motion.div>
</div>
            </div>
          </motion.div>

          {nodes.length > 0 && (
            <div ref={containerRef} className="relative pt-10 pb-24" style={{ height: positions.length > 0 ? positions[positions.length - 1].y + 200 : 400 }}>
              {/* Curved SVG paths between nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {positions.map((pos, i) => {
                  if (i === 0) return null;
                  const prev = positions[i - 1];
                  const midX = (prev.x + pos.x) / 2;
                  const midY = (prev.y + pos.y) / 2;
                  const isPrevCompleted = completedLessons.has(nodes[i - 1].id);
                  const isCompleted = completedLessons.has(nodes[i].id);
                  const allDone = isPrevCompleted && isCompleted;

                  return (
                    <path
                      key={i}
                      d={`M ${prev.x}% ${prev.y} Q ${midX}% ${midY} ${pos.x}% ${pos.y}`}
                      fill="none"
                      stroke={allDone ? "#22c55e" : "hsl(var(--border))"}
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity={allDone ? 0.8 : 0.5}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node, i) => {
                const isNewUnit = i === 0 || node.unitIndex !== nodes[i - 1].unitIndex;
                const state = getNodeState(node.id);
                const pos = positions[i];

                return (
                  <div key={node.id}>
                    {isNewUnit && (
                      <div className="absolute z-0" style={{ left: "50%", top: pos.y - 90, transform: "translateX(-50%)" }}>
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary border shadow-sm">
                          <Map className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">{node.unitTitle}</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute z-10" style={{ left: `${pos.x}%`, top: pos.y, transform: "translate(-50%, -50%)" }}>
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

              {/* Certificate when all lessons completed */}
              {allCompleted && (
                <div className="absolute z-10" style={{ left: "50%", top: positions[positions.length - 1].y + 110, transform: "translateX(-50%)" }}>
                  <CourseCertificate
                    courseName={courseName}
                    userName={userName}
                    completedDate={today}
                  />
                </div>
              )}

              {/* Finish flag when not all completed */}
              {!allCompleted && (
                <div className="absolute z-10" style={{ left: "50%", top: positions[positions.length - 1].y + 100, transform: "translateX(-50%)" }}>
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold">Finish Line</span>
                  </div>
                  <CodeBuddyVisor state="idle" size="lg" className="mt-6" />
                </div>
              )}
            </div>
          )}

          {activeCourse && nodes.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No lessons available yet for {courseName}.
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

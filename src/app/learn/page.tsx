"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Check, ChevronRight, BookOpen } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import { useStore } from "@/lib/store";
import { sampleUnits } from "@/lib/utils";

interface LessonNode {
  unitIndex: number;
  lessonIndex: number;
  unitTitle: string;
  lessonTitle: string;
  lessonId: string;
  id: string;
}

export default function LearnPage() {
  const router = useRouter();
  const { activeCourse } = useStore();
  const [nodes, setNodes] = useState<LessonNode[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

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

    const storedProgress = localStorage.getItem(
      "opencodeLingo_completedLessons"
    );
    if (storedProgress) {
      setCompletedLessons(new Set(JSON.parse(storedProgress)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeCourse) return;

    const units = sampleUnits[activeCourse.id];
    if (!units) return;

    const lessonNodes: LessonNode[] = [];
    units.forEach((unit, ui) => {
      unit.lessons.forEach((lesson, li) => {
        lessonNodes.push({
          unitIndex: ui,
          lessonIndex: li,
          unitTitle: unit.unitTitle,
          lessonTitle: lesson.title,
          lessonId: lesson.lessonId,
          id: lesson.lessonId,
        });
      });
    });
    setNodes(lessonNodes);
  }, [activeCourse]);

  const getNodeState = (node: LessonNode) => {
    if (completedLessons.has(node.id)) return "completed";
    const nodeIndex = nodes.findIndex((n) => n.id === node.id);
    if (nodeIndex === 0) return "active";
    const prevNode = nodes[nodeIndex - 1];
    if (prevNode && completedLessons.has(prevNode.id)) return "active";
    return "locked";
  };

  const handleNodeClick = (node: LessonNode) => {
    const state = getNodeState(node);
    if (state !== "locked") {
      router.push(`/lesson/${node.id}`);
    }
  };

  return (
    <AuthGuard>
      <Navigation />
      <div className="min-h-screen pb-24 md:pt-20 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">
              {activeCourse?.language_name || "Select a Course"}
            </h1>
            <p className="text-muted-foreground">Your learning pathway</p>
          </div>

          {!activeCourse && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No course selected.{" "}
                <button
                  onClick={() => router.push("/courses")}
                  className="text-primary font-medium hover:underline"
                >
                  Browse courses
                </button>
              </p>
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

          <div className="relative flex flex-col items-center">
            <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>

            {nodes.map((node, i) => {
              const state = getNodeState(node);
              const isNewUnit =
                i === 0 || node.unitIndex !== nodes[i - 1].unitIndex;

              return (
                <div key={node.id} className="relative w-full max-w-md">
                  {isNewUnit && (
                    <div className="text-center py-8">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm font-medium text-muted-foreground">
                        {node.unitTitle}
                      </div>
                    </div>
                  )}

                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileTap={state !== "locked" ? { scale: 0.95 } : {}}
                    onClick={() => handleNodeClick(node)}
                    className="relative flex items-center gap-4 w-full py-3 px-4 rounded-xl hover:bg-secondary/50 transition-colors disabled:opacity-50"
                    disabled={state === "locked"}
                  >
                    <div
                      className={`node-${state} shrink-0 ${
                        state === "active" ? "animate-float" : ""
                      }`}
                    >
                      {state === "completed" ? (
                        <Check className="w-6 h-6" />
                      ) : state === "locked" ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{i + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{node.lessonTitle}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {state}
                      </p>
                    </div>

                    {state !== "locked" && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}

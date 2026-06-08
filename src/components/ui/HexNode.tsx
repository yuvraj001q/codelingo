"use client";

import { motion } from "framer-motion";

interface HexNodeProps {
  index: number;
  title: string;
  state: "locked" | "active" | "completed";
  lessonType?: "challenge" | "quiz" | "mastery" | "project";
  onClick?: () => void;
}

const typeIcons: Record<string, string> = {
  challenge: "\u{1F4A1}",
  quiz: "\u{2753}",
  mastery: "\u{2B50}",
  project: "\u{1F4CB}",
};

const stateColors = {
  locked: {
    base: "fill-muted/30",
    top: "fill-muted/20",
    stroke: "stroke-muted/40",
    text: "text-muted-foreground/50",
    bg: "bg-muted/10",
  },
  active: {
    base: "fill-primary",
    top: "fill-primary/80",
    stroke: "stroke-primary",
    text: "text-primary-foreground",
    bg: "bg-primary/20",
  },
  completed: {
    base: "fill-accent",
    top: "fill-accent/80",
    stroke: "stroke-accent",
    text: "text-accent-foreground",
    bg: "bg-accent/20",
  },
};

export default function HexNode({
  index,
  title,
  state,
  lessonType = "challenge",
  onClick,
}: HexNodeProps) {
  const colors = stateColors[state];
  const side = index % 2 === 0 ? "left" : "right";

  return (
    <div className={`relative flex items-center w-full ${side === "right" ? "flex-row-reverse" : ""}`}>
      {/* Connector line */}
      <div className="flex-1 h-px border-t border-dashed border-border/50 mx-4" />

      {/* Hexagon */}
      <motion.button
        whileTap={state !== "locked" ? { scale: 0.93 } : {}}
        onClick={onClick}
        disabled={state === "locked"}
        className={`relative flex flex-col items-center justify-center w-24 h-28 shrink-0 cursor-pointer ${
          state === "locked" ? "cursor-not-allowed" : ""
        }`}
      >
        <svg
          viewBox="0 0 100 110"
          className="absolute inset-0 w-full h-full"
        >
          {/* Shadow */}
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="rgba(0,0,0,0.08)"
            transform="translate(0, 2)"
          />
          {/* Base */}
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            className={colors.base}
            stroke={colors.stroke.replace("stroke-", "")}
            strokeWidth="1.5"
          />
          {/* Top highlight */}
          <polygon
            points="50,5 95,27.5 95,50 50,72.5 5,50 5,27.5"
            className={colors.top}
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          {state === "completed" ? (
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : state === "locked" ? (
            <svg className="w-5 h-5 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <span className="text-lg">{typeIcons[lessonType] || "\u{1F4A1}"}</span>
          )}
          <span className={`text-[10px] font-bold mt-1 leading-tight text-center px-1 ${colors.text}`}>
            {title}
          </span>
          {state === "active" && (
            <span className="text-[8px] font-semibold text-primary-foreground bg-primary/90 rounded-full px-2 py-0.5 mt-1">
              Continue
            </span>
          )}
        </div>
      </motion.button>
    </div>
  );
}

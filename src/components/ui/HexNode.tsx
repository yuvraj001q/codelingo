"use client";

import { motion } from "framer-motion";

interface HexNodeProps {
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
    face: "#2a2a2a",
    edge: "#1a1a1a",
    top: "#3a3a3a",
    text: "#666",
    accent: "#444",
  },
  active: {
    face: "#4f8cf7",
    edge: "#2d5fc7",
    top: "#6ba3ff",
    text: "#fff",
    accent: "#fff",
  },
  completed: {
    face: "#22c55e",
    edge: "#16a34a",
    top: "#4ade80",
    text: "#fff",
    accent: "#fff",
  },
};

export default function HexNode({
  title,
  state,
  lessonType = "challenge",
  onClick,
}: HexNodeProps) {
  const c = stateColors[state];
  const isClickable = state !== "locked";
  const points = "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5";
  const topPoints = "50,5 95,27.5 95,50 50,72.5 5,50 5,27.5";

  return (
    <motion.button
      onClick={onClick}
      disabled={!isClickable}
      whileTap={isClickable ? { scale: 0.88, y: 4, transition: { type: "spring", stiffness: 400, damping: 12 } } : {}}
      whileHover={isClickable ? { scale: 1.05, transition: { type: "spring", stiffness: 200 } } : {}}
      className={`relative flex flex-col items-center justify-center w-24 h-28 shrink-0 cursor-pointer select-none ${
        !isClickable ? "cursor-not-allowed" : ""
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <svg viewBox="0 0 100 110" className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))" }}>
        {/* Deep shadow for 3D effect */}
        <polygon points={points} fill={c.edge} transform="translate(0, 5)" />
        {/* Side face (3D edge) */}
        <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill={c.face} />
        {/* Top highlight face */}
        <polygon points={topPoints} fill={c.top} />
        {/* Inner accent stroke */}
        <polygon
          points={points}
          fill="none"
          stroke={c.accent}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          transform="scale(0.82) translate(11, 14)"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {state === "completed" ? (
          <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : state === "locked" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : (
          <span className="text-lg">{typeIcons[lessonType]}</span>
        )}
        <span className="text-[10px] font-bold mt-1 leading-tight text-center px-1" style={{ color: c.text }}>
          {title}
        </span>
        {state === "active" && (
          <span className="text-[8px] font-semibold text-white bg-blue-600/90 rounded-full px-2 py-0.5 mt-1 shadow-sm">
            Continue
          </span>
        )}
      </div>
    </motion.button>
  );
}

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

const hex = "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5";

export default function HexNode({
  title,
  state,
  lessonType = "challenge",
  onClick,
}: HexNodeProps) {
  const isClickable = state !== "locked";
  const icon = state === "completed" ? "check" : state === "locked" ? "lock" : typeIcons[lessonType];

  return (
    <motion.button
      onClick={onClick}
      disabled={!isClickable}
      whileTap={isClickable ? { scale: 0.88, y: 3, transition: { type: "spring", stiffness: 500, damping: 14 } } : {}}
      whileHover={isClickable ? { scale: 1.06, transition: { type: "spring", stiffness: 250 } } : {}}
      className="relative flex flex-col items-center justify-center w-24 h-28 shrink-0 cursor-pointer select-none outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <svg viewBox="0 0 100 110" className="absolute inset-0 w-full h-full">
        {/* Completed state */}
        {state === "completed" && (
          <>
            <polygon points={hex} fill="#16a34a" transform="translate(0, 4)" />
            <polygon points={hex} fill="#22c55e" />
            <polygon points="50,5 95,27.5 95,50 50,72.5 5,50 5,27.5" fill="#4ade80" />
            <polygon points={hex} fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.5"
              transform="scale(0.82) translate(11, 14)" />
          </>
        )}

        {/* Active state */}
        {state === "active" && (
          <>
            <polygon points={hex} fill="#1d4ed8" transform="translate(0, 4)" />
            <polygon points={hex} fill="#2563eb" />
            <polygon points="50,5 95,27.5 95,50 50,72.5 5,50 5,27.5" fill="#3b82f6" />
            <polygon points={hex} fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.5"
              transform="scale(0.82) translate(11, 14)" />
          </>
        )}

        {/* Locked state */}
        {state === "locked" && (
          <>
            <polygon points={hex} fill="#1a1a2e" transform="translate(0, 4)" />
            <polygon points={hex} fill="#252540" />
            <polygon points="50,5 95,27.5 95,50 50,72.5 5,50 5,27.5" fill="#2e2e4a" />
            <polygon points={hex} fill="none" stroke="#444466" strokeWidth="1.5" opacity="0.4"
              transform="scale(0.82) translate(11, 14)" />
          </>
        )}

        {/* Glow ring on active */}
        {state === "active" && (
          <polygon
            points={hex}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            opacity="0.5"
          >
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </polygon>
        )}
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {icon === "check" ? (
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : icon === "lock" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : (
          <span className="text-lg">{icon}</span>
        )}
        <span className={`text-[10px] font-bold mt-1 leading-tight text-center px-1 ${
          state === "locked" ? "text-[#666]" : "text-white"
        }`}>
          {title}
        </span>
        {state === "active" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[8px] font-semibold text-white bg-blue-600 rounded-full px-2 py-0.5 mt-1 shadow"
          >
            Continue
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}

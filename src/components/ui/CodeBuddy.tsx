"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CodeBuddyProps {
  state: "idle" | "success" | "error" | "thinking" | "coding";
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

const sizeMap = { sm: { w: 44, h: 48 }, md: { w: 60, h: 65 }, lg: { w: 82, h: 88 } };
const stateLabels: Record<string, string> = {
  idle: "CodeBuddy",
  success: "Excited CodeBuddy",
  error: "Encouraging CodeBuddy",
  thinking: "Thinking CodeBuddy",
  coding: "Coding CodeBuddy",
};

const stateFiles: Record<string, string> = {
  idle: "/mascot/idle.svg",
  success: "/mascot/excited.svg",
  error: "/mascot/error.svg",
  thinking: "/mascot/thinking.svg",
  coding: "/mascot/coding.svg",
};

export default function CodeBuddy({ state, size = "md", className = "", message }: CodeBuddyProps) {
  const dims = sizeMap[size];
  const [imgError, setImgError] = useState(false);

  const fallbackEmoji: Record<string, string> = {
    idle: "🤖",
    success: "🎉",
    error: "💪",
    thinking: "🤔",
    coding: "👨‍💻",
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {imgError ? (
              <div
                className="rounded-full bg-primary/10 flex items-center justify-center select-none"
                style={{ width: dims.w, height: dims.h }}
              >
                <span className="text-2xl">{fallbackEmoji[state]}</span>
              </div>
            ) : (
              <Image
                src={stateFiles[state]}
                alt={stateLabels[state]}
                width={dims.w}
                height={dims.h}
                className="object-contain select-none pointer-events-none"
                onError={() => setImgError(true)}
                unoptimized
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative max-w-[220px] px-4 py-2.5 rounded-2xl bg-secondary text-sm font-medium text-foreground text-center shadow-sm"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

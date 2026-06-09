"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type MascotState = "idle" | "success" | "error" | "thinking" | "coding";

interface CodeBuddyVisorProps {
  state?: MascotState;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const faceVariants = {
  initial: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  exit: { opacity: 0, scale: 1.2, filter: "blur(4px)", transition: { duration: 0.2 } }
};

export default function CodeBuddyVisor({ state = "idle", className, size = "md" }: CodeBuddyVisorProps) {
  const sizeClasses = {
    sm: "w-16 h-16 border-2",
    md: "w-32 h-32 border-4",
    lg: "w-48 h-48 border-4",
  };

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={clsx(
        "relative flex items-center justify-center rounded-full overflow-hidden",
        "bg-gradient-to-br from-gray-800 via-black to-gray-900",
        "shadow-[inset_0_-10px_20px_rgba(255,255,255,0.15),_0_0_20px_rgba(0,240,255,0.4)]",
        "border-gray-800",
        sizeClasses[size],
        className
      )}
    >
      {/* Curved Screen Glare */}
      <div className="absolute top-2 left-4 w-3/4 h-1/3 bg-white/10 rounded-full blur-md transform -rotate-12 pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.svg
          key={state}
          variants={faceVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          viewBox="0 0 100 100"
          className="w-3/4 h-3/4 drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {state === "idle" && (
            <>
              {/* Blinking Eyes */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                style={{ transformOrigin: "50% 40%" }}
              >
                <path d="M 25 40 Q 35 30 40 40" />
                <path d="M 60 40 Q 65 30 75 40" />
              </motion.g>
              {/* Breathing Smile */}
              <motion.path 
                d="M 35 60 Q 50 70 65 60" 
                animate={{ scaleX: [1, 1.05, 1] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "50% 60%" }}
              />
            </>
          )}

          {state === "success" && (
            <>
              {/* Bouncing Happy Eyes */}
              <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, type: "spring" }}>
                <path d="M 20 45 L 30 35 L 40 45" />
                <path d="M 60 45 L 70 35 L 80 45" />
              </motion.g>
              <path d="M 35 65 Q 50 75 65 65" />
            </>
          )}

          {state === "error" && (
            <motion.g animate={{ x: [-2, 2, -2, 2, 0] }} transition={{ duration: 0.4, delay: 0.5 }}>
              {/* Drooping Sad Eyes */}
              <motion.path d="M 25 35 L 40 45" animate={{ y: [0, 2, 0] }} transition={{ duration: 2, repeat: Infinity }} />
              <motion.path d="M 60 45 L 75 35" animate={{ y: [0, 2, 0] }} transition={{ duration: 2, repeat: Infinity }} />
              <path d="M 40 65 Q 50 60 60 65" />
            </motion.g>
          )}

          {state === "thinking" && (
            <>
              <circle cx="30" cy="40" r="8" fill="#00f0ff" />
              {/* Pulsing Small Eye */}
              <motion.circle cx="70" cy="40" r="4" fill="#00f0ff" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              {/* Twitching Mouth */}
              <motion.path d="M 45 65 L 55 65" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ transformOrigin: "50% 65%" }} />
            </>
          )}

          {state === "coding" && (
            <>
              <path d="M 25 40 L 40 40" />
              <path d="M 60 40 L 75 40" />
              {/* Scrolling Data Mouth */}
              <motion.path 
                d="M 30 65 L 70 65" 
                strokeDasharray="6, 12" 
                animate={{ strokeDashoffset: [0, -18] }} 
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} 
              />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </motion.div>
  );
}

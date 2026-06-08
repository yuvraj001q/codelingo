"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AIMascotProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  mood?: "neutral" | "happy" | "encouraging";
}

const sizeMap = { sm: 56, md: 72, lg: 96 };

const moods: Record<string, { eyes: string; trunk: string }> = {
  neutral: {
    eyes: "M38 48 Q40 46 42 48 M58 48 Q60 46 62 48",
    trunk: "M45 62 C43 74 55 80 58 76 C60 73 56 70 52 68",
  },
  happy: {
    eyes: "M36 46 Q40 42 44 46 M56 46 Q60 42 64 46",
    trunk: "M45 62 C43 72 57 78 60 74 C62 71 56 68 52 66",
  },
  encouraging: {
    eyes: "M37 49 Q40 45 43 49 M57 49 Q60 45 63 49",
    trunk: "M44 62 C42 76 56 82 59 78 C61 75 55 72 51 69",
  },
};

export default function AIMascot({ message, className = "", size = "md", mood = "neutral" }: AIMascotProps) {
  const px = sizeMap[size];
  const m = moods[mood];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
      >
        {/* Left ear */}
        <ellipse cx="16" cy="45" rx="18" ry="24" fill="#42A5F5" />
        <ellipse cx="16" cy="45" rx="10" ry="15" fill="#90CAF9" />
        {/* Right ear */}
        <ellipse cx="84" cy="45" rx="18" ry="24" fill="#42A5F5" />
        <ellipse cx="84" cy="45" rx="10" ry="15" fill="#90CAF9" />
        {/* Face */}
        <circle cx="50" cy="54" r="34" fill="#64B5F6" />
        <circle cx="50" cy="54" r="30" fill="#90CAF9" />
        {/* Eyes */}
        <circle cx="38" cy="46" r="6" fill="white" />
        <circle cx="62" cy="46" r="6" fill="white" />
        <circle cx="38" cy="46" r="3.5" fill="#1a1a2e" />
        <circle cx="62" cy="46" r="3.5" fill="#1a1a2e" />
        <circle cx="39.5" cy="44.5" r="1.5" fill="white" />
        <circle cx="63.5" cy="44.5" r="1.5" fill="white" />
        {/* Blush */}
        <ellipse cx="26" cy="60" rx="6" ry="4" fill="#FF8A80" opacity="0.35" />
        <ellipse cx="74" cy="60" rx="6" ry="4" fill="#FF8A80" opacity="0.35" />
        {/* Eyebrows */}
        <path d="M32 38 Q40 34 46 38" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
        <path d="M54 38 Q60 34 68 38" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
        {/* Trunk */}
        <path d={m.trunk} fill="none" stroke="#42A5F5" strokeWidth="4" strokeLinecap="round" />
        {/* Smile */}
        <path d="M40 67 Q50 74 60 67" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
      </motion.svg>

      {message && (
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative max-w-[220px] px-4 py-2.5 rounded-2xl bg-secondary text-sm font-medium text-foreground text-center shadow-sm before:content-[''] before:absolute before:top-[-6px] before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-secondary"
          >
            {message}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

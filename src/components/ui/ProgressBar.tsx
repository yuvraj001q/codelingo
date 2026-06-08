"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  className = "",
  color,
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div
      className={`w-full h-3 bg-muted rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{
          backgroundColor: color || "hsl(var(--accent))",
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FlashCardProps {
  question: string;
  explanation: string;
  onFlip?: (isFlipped: boolean) => void;
}

export default function FlashCard({ question, explanation, onFlip }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const next = !isFlipped;
    setIsFlipped(next);
    onFlip?.(next);
  };

  return (
    <div
      className="perspective-1000 w-full max-w-lg mx-auto cursor-pointer"
      onClick={handleFlip}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="relative w-full min-h-[250px] preserve-3d"
      >
        <div className="absolute inset-0 backface-hidden card-bouncy p-8 flex items-center justify-center">
          <p className="text-xl font-semibold text-center">{question}</p>
        </div>
        <div
          className="absolute inset-0 backface-hidden card-bouncy p-8 flex items-center justify-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <p className="text-lg text-center text-muted-foreground">
            {explanation}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

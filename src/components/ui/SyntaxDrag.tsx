"use client";

import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";

interface SyntaxDragProps {
  blocks: string[];
  onOrderChange: (order: string[]) => void;
}

export default function SyntaxDrag({ blocks, onOrderChange }: SyntaxDragProps) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems([...blocks].sort(() => Math.random() - 0.5));
  }, [blocks]);

  const handleReorder = (reordered: string[]) => {
    setItems(reordered);
    onOrderChange(reordered);
  };

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={handleReorder}
      className="space-y-2"
    >
      {items.map((item) => (
        <Reorder.Item
          key={item}
          value={item}
          as="div"
          className="cursor-grab active:cursor-grabbing"
        >
          <motion.div
            layout
            whileDrag={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted border-2 border-border font-mono text-sm"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{item}</span>
          </motion.div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

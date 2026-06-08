"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Award, Download } from "lucide-react";
import { toPng } from "html-to-image";

interface CourseCertificateProps {
  courseName: string;
  userName: string;
  completedDate: string;
}

export default function CourseCertificate({ courseName, userName, completedDate }: CourseCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    try {
      const dataUrl = await toPng(certRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `CodeLingo-${courseName.replace(/\s+/g, "-")}-Certificate.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // fallback: nothing
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="mx-auto max-w-md"
    >
      <div
        ref={certRef}
        className="relative rounded-2xl border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-yellow-950/20 dark:via-background dark:to-amber-950/20 p-8 text-center shadow-xl overflow-hidden"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-500 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-500 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-500 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-500 rounded-br-2xl" />

        <div className="relative z-10">
          <Award className="w-14 h-14 text-yellow-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-foreground">Certificate of Completion</h2>
          <p className="text-xs text-muted-foreground mt-1">This certifies that</p>
          <p className="text-xl font-extrabold text-primary mt-2">{userName}</p>
          <p className="text-xs text-muted-foreground mt-2">has successfully completed</p>
          <p className="text-lg font-bold text-foreground mt-1">{courseName}</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>{completedDate}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs font-bold text-foreground">CodeLingo</p>
            <p className="text-[10px] text-muted-foreground">codelingo.app</p>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        className="btn-3d-primary mx-auto mt-4 flex items-center gap-2 text-sm"
      >
        <Download className="w-4 h-4" />
        Download Certificate
      </motion.button>
    </motion.div>
  );
}

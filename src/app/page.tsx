"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, Sparkles, Infinity } from "lucide-react";
import { useStore } from "@/lib/store";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const { user } = useStore();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Code2 className="w-8 h-8 text-primary" />
          <span>OpenCodeLingo</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Link href="/learn" className="btn-3d-primary text-sm">
              Go to Learn
            </Link>
          ) : (
            <Link href="/login" className="btn-3d-primary text-sm">
              Get Started
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Completely Free & Open Source
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Learn to Code.
            <br />
            <span className="text-primary">Unrestricted.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Master any programming language with interactive lessons, competitive
            leagues, and zero restrictions. No hearts, no lives — just pure
            learning.
          </p>

          <div className="flex items-center gap-3 justify-center mb-16">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Infinity className="w-5 h-5 text-accent" />
              <span>Unlimited retries</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-accent" />
              <span>6+ languages</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code2 className="w-5 h-5 text-accent" />
              <span>Free forever</span>
            </div>
          </div>

          {!user && (
            <div className="flex items-center gap-4 justify-center">
              <Link href="/register" className="btn-3d-primary text-lg px-10 py-4">
                Start Learning Free
              </Link>
              <Link
                href="/login"
                className="btn-3d-secondary text-lg px-10 py-4"
              >
                I have an account
              </Link>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

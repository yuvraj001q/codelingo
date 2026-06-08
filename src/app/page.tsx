"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Infinity, Code2, Star, Flame, Zap, ChevronRight, AppWindow, Smartphone } from "lucide-react";
import { useStore } from "@/lib/store";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/ui/Logo";
import CodeBuddy from "@/components/ui/CodeBuddy";

const languages = [
  { name: "Python", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", color: "#3776AB" },
  { name: "JavaScript", icon: "M0 0h24v24H0V0zm22 12l-4-4 1.41-1.41L24 12l-4.59 4.59L18 16l4-4z", color: "#F7DF1E" },
  { name: "TypeScript", icon: "M2 2h20v20H2V2zm11.75 10.38h2.11v-.86c0-.65-.42-1.07-1.43-1.07-1.25 0-1.82.61-1.82 1.66 0 1.03.53 1.58 1.62 1.58 1.07 0 1.72-.52 1.72-1.48h-.55c0 .6-.32.9-.9.9-.66 0-1.05-.43-1.05-1.19 0-.73.35-1.19 1.01-1.19.52 0 .82.26.96.65h.33v2.6h-2.11v.53H18v-5.12h-4.25v-.53h-2.97l-1.07 1.1-1.07-1.1H6v5.13h-.13c-.25 0-.37.12-.37.24s.12.24.37.24h.75v.73h-.75c-.63 0-.94-.3-.94-.73 0-.42.31-.48.56-.48V12.1c-.25 0-.56-.06-.56-.48 0-.43.31-.73.94-.73h.56l1.31-1.35V8.62h2.63v.92l1.31 1.35h5.75v4.27h.13z", color: "#3178C6" },
  { name: "Rust", icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z", color: "#DEA584" },
  { name: "C++", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", color: "#00599C" },
  { name: "Go", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", color: "#00ADD8" },
];

export default function Home() {
  const { user } = useStore();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link href="/learn" className="btn-3d-primary text-sm px-5 py-2.5">
              Continue Learning
            </Link>
          ) : (
            <Link href="/register" className="btn-3d-primary text-sm px-5 py-2.5">
              GET STARTED
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto">
            <CodeBuddy size="lg" state="success" className="mx-auto mb-6" message="Your coding companion!" />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              The free, fun, and effective way
              <br />
              to <span className="text-primary">learn to code!</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of coders learning interactively. No downloads, no setup — just write code and learn.
            </p>
            {!user && (
              <div className="flex items-center gap-4 justify-center flex-wrap">
                <Link href="/register" className="btn-3d-primary text-lg px-10 py-4">
                  GET STARTED
                </Link>
                <Link href="/login" className="btn-3d-secondary text-lg px-10 py-4">
                  I already have an account
                </Link>
              </div>
            )}
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span>4.9 App Store (1K+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span>4.8 Google Play (5K+)</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Language Grid */}
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Browse the full catalog</h2>
            <p className="text-muted-foreground">
              Interactive lessons across 20+ programming languages, runnable in your browser.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {languages.map((lang, i) => (
              <motion.button
                key={lang.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (!user) { router.push("/register"); return; }
                  router.push("/courses");
                }}
                className="card-bouncy p-4 flex flex-col items-center gap-2"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: lang.color + "20" }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill={lang.color}>
                    <path d={lang.icon} />
                  </svg>
                </div>
                <span className="text-sm font-semibold">{lang.name}</span>
              </motion.button>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/courses" className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1">
              See all courses <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Learn by Doing */}
        <section className="py-12 px-4 bg-secondary/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Learn by Doing</h2>
              <p className="text-muted-foreground">
                Write real code, solve challenges, and build projects — all in your browser.
              </p>
            </div>
            <div className="card-bouncy p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Code2 className="w-4 h-4" />
                <span>playground.py</span>
                <div className="ml-auto flex items-center gap-3">
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Ask AI</span>
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Run Code</span>
                </div>
              </div>
              <pre className="text-sm font-mono bg-background rounded-xl p-4 border overflow-x-auto">
                <code>
                  <span className="text-purple-500">def</span> <span className="text-yellow-500">greet</span>(name):
                  {"\n"}    <span className="text-blue-500">print</span>(                  <span className="text-green-500">f{'"Hello, {name}!"'}</span>)
                  {"\n"}{"\n"}<span className="text-purple-500">for</span> i <span className="text-purple-500">in</span> <span className="text-blue-500">range</span>(<span className="text-orange-500">3</span>):
                  {"\n"}    greet(<span className="text-green-500">{'"Coddy"'}</span>)
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-bouncy p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Infinity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Unlimited Practice</h3>
              <p className="text-sm text-muted-foreground">No hearts, no lives, no limits. Keep practicing until you master it.</p>
            </div>
            <div className="card-bouncy p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">AI-Powered Help</h3>
              <p className="text-sm text-muted-foreground">Get hints and explanations from your AI elephant mascot when you get stuck.</p>
            </div>
            <div className="card-bouncy p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold mb-2">Build Your Streak</h3>
              <p className="text-sm text-muted-foreground">Stay consistent and watch your progress grow with daily streaks.</p>
            </div>
          </div>
        </section>

        {/* Code Anywhere */}
        <section className="py-12 px-4 bg-secondary/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Code Anywhere, Anytime</h2>
            <p className="text-muted-foreground mb-6">
              No setup, no downloads — just open and start coding. Available on all devices.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-background border shadow-sm">
                <AppWindow className="w-5 h-5" />
                <span className="text-sm font-medium">Web App</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-background border shadow-sm">
                <Smartphone className="w-5 h-5" />
                <span className="text-sm font-medium">Mobile App</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <CodeBuddy size="md" state="success" className="mx-auto mb-4" message="Ready to start coding?" />
          <h2 className="text-3xl font-bold mb-4">Learn to code with OpenCodeLingo</h2>
          {!user ? (
            <Link href="/register" className="btn-3d-primary text-lg px-10 py-4 inline-flex">
              GET STARTED
            </Link>
          ) : (
            <Link href="/learn" className="btn-3d-primary text-lg px-10 py-4 inline-flex">
              Continue Learning
            </Link>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/courses">Courses</Link></li>
              <li><Link href="/leaderboard">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/learn">Learn</Link></li>
              <li><Link href="/practice">Practice</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Languages</h4>
            <ul className="space-y-2 text-muted-foreground">
              {languages.slice(0, 6).map((l) => (
                <li key={l.name}>{l.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-8 pt-6 border-t">
          Made with ❤️ — OpenCodeLingo
        </div>
      </footer>
    </div>
  );
}

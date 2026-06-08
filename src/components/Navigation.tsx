"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Target,
  User,
  GraduationCap,
  Code2,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useStore } from "@/lib/store";
import { formatXp, getLeagueEmoji, getStreakData } from "@/lib/utils";

const navItems = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/practice", label: "Practice", icon: Target },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/learn" className="hidden md:flex items-center gap-2 font-bold text-lg">
            <Code2 className="w-6 h-6 text-primary" />
            <span>OpenCodeLingo</span>
          </Link>

          <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto justify-around md:justify-normal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="relative flex items-center justify-center h-full">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium hidden md:block">
                      {item.label}
                    </span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="hidden md:block absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>{getLeagueEmoji(user.league)}</span>
                <span className="text-muted-foreground">
                  {formatXp(
                    parseInt(
                      localStorage.getItem("opencodeLingo_totalXp") || "0",
                      10
                    )
                  )}{" "}
                  XP
                </span>
                <span className="text-orange-500">
                  🔥 {getStreakData().days}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

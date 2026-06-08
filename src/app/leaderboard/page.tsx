"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, TrendingDown, TrendingUp } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import { useStore } from "@/lib/store";
import { formatXp, getLeagueEmoji } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  username: string;
  total_xp: number;
  league: string;
  rank: number;
}

const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", username: "code_ninja", total_xp: 12450, league: "Gold", rank: 1 },
  { id: "2", username: "rust_dev", total_xp: 11200, league: "Gold", rank: 2 },
  { id: "3", username: "pythonista", total_xp: 10800, league: "Gold", rank: 3 },
  { id: "4", username: "js_wizard", total_xp: 9500, league: "Gold", rank: 4 },
  { id: "5", username: "algo_master", total_xp: 9200, league: "Gold", rank: 5 },
  { id: "6", username: "byte_builder", total_xp: 8800, league: "Gold", rank: 6 },
  { id: "7", username: "data_diver", total_xp: 8100, league: "Silver", rank: 7 },
  { id: "8", username: "stack_queen", total_xp: 7900, league: "Silver", rank: 8 },
  { id: "9", username: "loop_hero", total_xp: 7400, league: "Silver", rank: 9 },
  { id: "10", username: "null_ptr", total_xp: 7100, league: "Silver", rank: 10 },
  { id: "11", username: "crash_coder", total_xp: 6800, league: "Silver", rank: 11 },
  { id: "12", username: "bug_hunter", total_xp: 6200, league: "Bronze", rank: 12 },
  { id: "13", username: "hello_world", total_xp: 5800, league: "Bronze", rank: 13 },
  { id: "14", username: "zero_day", total_xp: 5100, league: "Bronze", rank: 14 },
  { id: "15", username: "newbie_coder", total_xp: 4200, league: "Bronze", rank: 15 },
];

export default function LeaderboardPage() {
  const { user } = useStore();
  const [entries] = useState(DEMO_LEADERBOARD);
  const [userLeague] = useState("Gold");

  const promotionZone = entries.filter((e) => e.rank <= 5);
  const safeZone = entries.filter((e) => e.rank > 5 && e.rank <= 10);
  const demotionZone = entries.filter((e) => e.rank > 10);

  const getZoneColor = (rank: number) => {
    if (rank <= 5) return "bg-accent/5 border-accent/30";
    if (rank <= 10) return "bg-card border-border";
    return "bg-destructive/5 border-destructive/30";
  };

  const getZoneLabel = (rank: number) => {
    if (rank <= 5)
      return { text: "Promotion Zone", icon: TrendingUp, color: "text-accent" };
    if (rank <= 10)
      return { text: "Safe Zone", icon: Medal, color: "text-muted-foreground" };
    return {
      text: "Demotion Zone",
      icon: TrendingDown,
      color: "text-destructive",
    };
  };

  return (
    <AuthGuard>
      <Navigation />
      <div className="min-h-screen pb-24 md:pt-20 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <div className="text-center mb-8">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold mb-1">Leaderboard</h1>
            <p className="text-muted-foreground">
              {getLeagueEmoji(userLeague)} {userLeague} League
            </p>
          </div>

          <div className="space-y-6">
            {[promotionZone, safeZone, demotionZone].map((zone, zi) => {
              if (zone.length === 0) return null;
              const labelInfo = getZoneLabel(zi === 0 ? 1 : zi === 1 ? 6 : 11);
              const Icon = labelInfo.icon;

              return (
                <div key={zi}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-4 h-4 ${labelInfo.color}`} />
                    <span
                      className={`text-sm font-medium ${labelInfo.color}`}
                    >
                      {labelInfo.text}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {zone.map((entry, i) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getZoneColor(
                          entry.rank
                        )} ${
                          user?.username === entry.username
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                      >
                        <span className="text-lg font-bold text-muted-foreground w-8 text-center">
                          {entry.rank <= 3 ? (
                            <span className="text-2xl">
                              {["🥇", "🥈", "🥉"][entry.rank - 1]}
                            </span>
                          ) : (
                            `#${entry.rank}`
                          )}
                        </span>

                        <div className="flex-1">
                          <p className="font-semibold">
                            {entry.username}
                            {user?.username === entry.username && (
                              <span className="text-xs text-primary ml-2">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getLeagueEmoji(entry.league)} {entry.league}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-primary">
                            {formatXp(entry.total_xp)}
                          </p>
                          <p className="text-xs text-muted-foreground">XP</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}

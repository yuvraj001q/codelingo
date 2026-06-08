"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import TierEmblem from "@/components/ui/TierEmblem";
import { useStore } from "@/lib/store";
import { formatXp, getLeagueForXp } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  username: string;
  total_xp: number;
  league: string;
  streak_days: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { user } = useStore();
  const [entries, setEntries] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const totalXp = parseInt(localStorage.getItem("opencodeLingo_totalXp") || "0", 10);
  const userLeague = getLeagueForXp(totalXp);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => setEntries(data.users || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

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
    return { text: "Demotion Zone", icon: TrendingDown, color: "text-destructive" };
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
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <TierEmblem tier={userLeague} size="sm" />
              {userLeague} League
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No leaderboard data yet</p>
              <p className="text-sm mt-1">Complete lessons to appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {[promotionZone, safeZone, demotionZone].map((zone, zi) => {
                if (zone.length === 0) return null;
                const labelInfo = getZoneLabel(zi === 0 ? 1 : zi === 1 ? 6 : 11);
                const Icon = labelInfo.icon;

                return (
                  <div key={zi}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-4 h-4 ${labelInfo.color}`} />
                      <span className={`text-sm font-medium ${labelInfo.color}`}>
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
                            user?.id === entry.id ? "ring-2 ring-primary" : ""
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
                              {user?.id === entry.id && (
                                <span className="text-xs text-primary ml-2">(you)</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <TierEmblem tier={entry.league} size="sm" />
                              {entry.league}
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
          )}
        </motion.div>
      </div>
    </AuthGuard>
  );
}

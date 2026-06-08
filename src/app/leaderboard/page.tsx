"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import TierEmblem from "@/components/ui/TierEmblem";
import { getLeagueForXp } from "@/lib/utils";

export default function LeaderboardPage() {
  const totalXp = parseInt(localStorage.getItem("opencodeLingo_totalXp") || "0", 10);
  const userLeague = getLeagueForXp(totalXp);

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

          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No leaderboard data yet</p>
            <p className="text-sm mt-1">Complete lessons to appear here</p>
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}

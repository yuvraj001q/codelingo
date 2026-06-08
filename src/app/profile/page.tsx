"use client";

import { motion } from "framer-motion";
import { User, Flame, Trophy, Code2, LogOut } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useStore } from "@/lib/store";
import { formatXp, getLeagueEmoji, getLeagueProgress, getStreakData } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ui/ProgressBar";

export default function ProfilePage() {
  const { user } = useStore();
  const router = useRouter();

  const totalXp = parseInt(
    localStorage.getItem("opencodeLingo_totalXp") || "0",
    10
  );
  const streak = getStreakData();
  const leagueInfo = getLeagueProgress(totalXp);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    useStore.getState().setUser(null);
    useStore.getState().setSession(null);
    router.push("/");
  };

  return (
    <AuthGuard>
      <Navigation />
      <div className="min-h-screen pb-24 md:pt-20 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{user?.username || "Coder"}</h1>
            <p className="text-muted-foreground">
              {getLeagueEmoji(leagueInfo.current)} {leagueInfo.current} League
            </p>
            {leagueInfo.next && (
              <div className="mt-3 max-w-xs mx-auto">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{leagueInfo.current}</span>
                  <span>{leagueInfo.next}</span>
                </div>
                <ProgressBar value={leagueInfo.progress * 100} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card-bouncy p-4 text-center">
              <Code2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatXp(totalXp)}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
            <div className="card-bouncy p-4 text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{streak.days}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="card-bouncy p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{getLeagueEmoji(leagueInfo.current)}</p>
              <p className="text-xs text-muted-foreground">League</p>
            </div>
          </div>

          <div className="card-bouncy p-6">
            <h2 className="font-bold text-lg mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <ThemeToggle />
              </div>
              <div className="border-t pt-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="btn-3d w-full bg-destructive text-destructive-foreground border-b-destructive/40 rounded-2xl px-6 py-3 font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}

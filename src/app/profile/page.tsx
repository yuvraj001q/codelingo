"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Code2, LogOut, Save, Eye, EyeOff, Upload } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import TierEmblem from "@/components/ui/TierEmblem";
import { useStore } from "@/lib/store";
import { formatXp, getLeagueEmoji, getLeagueProgress, getStreakData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ui/ProgressBar";
import { syncUserToNeon } from "@/lib/syncUser";

export default function ProfilePage() {
  const { user } = useStore();
  const router = useRouter();

  const creds = JSON.parse(
    localStorage.getItem("opencodeLingo_credentials") || '{"email":"","password":""}'
  );

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(creds.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);

  const totalXp = parseInt(
    localStorage.getItem("opencodeLingo_totalXp") || "0", 10
  );
  const streak = getStreakData();
  const leagueInfo = getLeagueProgress(totalXp);

  const handleSave = () => {
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    const stored = localStorage.getItem("opencodeLingo_user");
    if (stored) {
      const userData = JSON.parse(stored);
      userData.username = username.trim();
      localStorage.setItem("opencodeLingo_user", JSON.stringify(userData));
      useStore.getState().setUser(userData);
    }

    const newCreds: { email: string; password?: string } = { email: email.trim() };

    if (newPassword) {
      if (currentPassword !== creds.password) {
        setError("Current password is incorrect.");
        return;
      }
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
      newCreds.password = newPassword;
    } else {
      newCreds.password = creds.password;
    }

    localStorage.setItem("opencodeLingo_credentials", JSON.stringify(newCreds));
    setCurrentPassword("");
    setNewPassword("");
    setSuccess("Changes saved!");
    setTimeout(() => setSuccess(""), 2500);
  };

  const handleSync = async () => {
    setSyncing(true);
    const ok = await syncUserToNeon();
    if (ok) {
      setSuccess("Synced to leaderboard!");
    } else {
      setError("Sync failed — is Neon connected?");
    }
    setSyncing(false);
    setTimeout(() => { setSuccess(""); setError(""); }, 3000);
  };

  const handleSignOut = () => {
    localStorage.removeItem("opencodeLingo_user");
    useStore.getState().setUser(null);
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
            <div className="mx-auto mb-4">
              <TierEmblem tier={leagueInfo.current} size="lg" animate />
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
              <div className="mx-auto mb-2">
                <TierEmblem tier={leagueInfo.current} size="sm" animate />
              </div>
              <p className="text-xs text-muted-foreground">League</p>
            </div>
          </div>

          <AnimatePresence>
            {(success || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-center text-sm mb-4 p-3 rounded-xl ${
                  error ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"
                }`}
              >
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="card-bouncy p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-3 font-medium">
                  Change Password (leave blank to keep current)
                </p>
                <div className="space-y-3">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Current password"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="New password (min 6 chars)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="btn-3d-primary w-full flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </motion.button>
            </div>
          </div>

          <div className="card-bouncy p-6">
            <h2 className="font-bold text-lg mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <span>Theme</span>
                <ThemeToggle />
              </div>
              <div className="border-t pt-4 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSync}
                  disabled={syncing}
                  className="btn-3d w-full bg-primary/10 text-primary border-b-primary/20 rounded-2xl px-6 py-3 font-bold flex items-center justify-center gap-2"
                >
                  <Upload className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Syncing..." : "Sync to Leaderboard"}
                </motion.button>
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

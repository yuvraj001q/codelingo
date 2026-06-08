"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Flame, Trophy, Code2, LogOut, Edit3, Check, X, Eye, EyeOff } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useStore } from "@/lib/store";
import { formatXp, getLeagueEmoji, getLeagueProgress, getStreakData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ui/ProgressBar";

export default function ProfilePage() {
  const { user } = useStore();
  const router = useRouter();
  const [editing, setEditing] = useState<"username" | "email" | "password" | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const totalXp = parseInt(
    localStorage.getItem("opencodeLingo_totalXp") || "0", 10
  );
  const streak = getStreakData();
  const leagueInfo = getLeagueProgress(totalXp);

  const creds = JSON.parse(
    localStorage.getItem("opencodeLingo_credentials") || '{"email":"","password":""}'
  );

  const updateUserField = (field: string, value: string) => {
    const stored = localStorage.getItem("opencodeLingo_user");
    if (!stored) return;
    const userData = JSON.parse(stored);
    userData[field] = value;
    localStorage.setItem("opencodeLingo_user", JSON.stringify(userData));
    useStore.getState().setUser(userData);
  };

  const handleSaveUsername = () => {
    if (!newUsername.trim()) return;
    updateUserField("username", newUsername.trim());
    setEditing(null);
    setNewUsername("");
    setSuccess("Username updated!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleSaveEmail = () => {
    if (!newEmail.trim()) return;
    const newCreds = { ...creds, email: newEmail.trim() };
    localStorage.setItem("opencodeLingo_credentials", JSON.stringify(newCreds));
    setEditing(null);
    setNewEmail("");
    setSuccess("Email updated!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleSavePassword = () => {
    if (currentPassword !== creds.password) {
      setSuccess("Current password is incorrect.");
      setTimeout(() => setSuccess(""), 2000);
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setSuccess("New password must be at least 6 characters.");
      setTimeout(() => setSuccess(""), 2000);
      return;
    }
    const newCreds = { ...creds, password: newPassword };
    localStorage.setItem("opencodeLingo_credentials", JSON.stringify(newCreds));
    setEditing(null);
    setCurrentPassword("");
    setNewPassword("");
    setSuccess("Password updated!");
    setTimeout(() => setSuccess(""), 2000);
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
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
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

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-center text-sm mb-4 p-3 rounded-xl ${
                  success.includes("incorrect") || success.includes("must")
                    ? "bg-destructive/10 text-destructive"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="card-bouncy p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Account</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-xs text-muted-foreground">Username</p>
                  {editing === "username" ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={user?.username}
                        autoFocus
                      />
                      <button onClick={handleSaveUsername} className="text-accent hover:text-accent/80">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-medium">{user?.username}</p>
                  )}
                </div>
                {editing !== "username" && (
                  <button onClick={() => { setEditing("username"); setNewUsername(""); }} className="text-muted-foreground hover:text-foreground">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  {editing === "email" ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={creds.email}
                        autoFocus
                      />
                      <button onClick={handleSaveEmail} className="text-accent hover:text-accent/80">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-medium">{creds.email || "Not set"}</p>
                  )}
                </div>
                {editing !== "email" && (
                  <button onClick={() => { setEditing("email"); setNewEmail(""); }} className="text-muted-foreground hover:text-foreground">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-xs text-muted-foreground">Password</p>
                  {editing === "password" ? (
                    <div className="flex flex-col gap-2 mt-1">
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Current password"
                      />
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-1.5 pr-8 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="New password (min 6 chars)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSavePassword} className="text-xs text-accent font-medium hover:underline">
                          Save
                        </button>
                        <button onClick={() => setEditing(null)} className="text-xs text-muted-foreground hover:underline">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="font-medium">••••••••</p>
                  )}
                </div>
                {editing !== "password" && (
                  <button onClick={() => { setEditing("password"); setCurrentPassword(""); setNewPassword(""); }} className="text-muted-foreground hover:text-foreground">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card-bouncy p-6">
            <h2 className="font-bold text-lg mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
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

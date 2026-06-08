import { getLeagueForXp } from "./utils";

export function syncUserToNeon() {
  try {
    const raw = localStorage.getItem("opencodeLingo_user");
    if (!raw) return;
    const user = JSON.parse(raw);
    const totalXp = parseInt(localStorage.getItem("opencodeLingo_totalXp") || "0", 10);
    const streakData = JSON.parse(localStorage.getItem("opencodeLingo_streakData") || '{"days":0}');

    fetch("/api/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email || "",
        total_xp: totalXp,
        streak_days: streakData.days || 0,
        league: getLeagueForXp(totalXp),
      }),
    });
  } catch {
    // silent — Neon might not be connected
  }
}

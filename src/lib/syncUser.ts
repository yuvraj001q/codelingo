import { getLeagueForXp } from "./utils";

export function syncUserToNeon(): Promise<boolean> {
  try {
    const raw = localStorage.getItem("opencodeLingo_user");
    if (!raw) return Promise.resolve(false);
    const user = JSON.parse(raw);
    const totalXp = parseInt(localStorage.getItem("opencodeLingo_totalXp") || "0", 10);
    const streakData = JSON.parse(localStorage.getItem("opencodeLingo_streakData") || '{"days":0}');

    return fetch("/api/sync-user", {
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
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) console.warn("sync-user failed:", data.reason);
        return data.ok === true;
      })
      .catch((err) => {
        console.warn("sync-user error:", err);
        return false;
      });
  } catch (err) {
    console.warn("sync-user exception:", err);
    return Promise.resolve(false);
  }
}

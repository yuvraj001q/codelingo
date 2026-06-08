import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || "";

interface ProfileRow {
  id: string;
  username: string;
  total_xp: number;
  league: string;
  streak_days: number;
}

export async function GET() {
  if (!DATABASE_URL) {
    return Response.json({ users: [] });
  }

  try {
    const sql = neon(DATABASE_URL);
    const rows = await sql`
      SELECT id, username, total_xp, league, streak_days
      FROM profiles
      WHERE total_xp >= 0
      ORDER BY total_xp DESC
      LIMIT 50
    `;
    const users = (rows as ProfileRow[]).map((r, i) => ({
      id: r.id,
      username: r.username,
      total_xp: r.total_xp || 0,
      league: r.league || "Iron",
      streak_days: r.streak_days || 0,
      rank: i + 1,
    }));
    return Response.json({ users });
  } catch {
    return Response.json({ users: [] });
  }
}

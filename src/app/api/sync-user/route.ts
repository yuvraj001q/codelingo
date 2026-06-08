import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || "";

export async function POST(req: Request) {
  if (!DATABASE_URL) {
    return Response.json({ ok: false, reason: "No DB" });
  }

  try {
    const { id, username, email, total_xp, streak_days, league } = await req.json();
    if (!id) {
      return Response.json({ ok: false, reason: "Missing id" }, { status: 400 });
    }

    const sql = neon(DATABASE_URL);
    await sql`
      INSERT INTO profiles (id, username, email, total_xp, streak_days, league, created_at)
      VALUES (${id}, ${username || "Coder"}, ${email || null}, ${total_xp || 0}, ${streak_days || 0}, ${league || "Iron"}, NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        total_xp = EXCLUDED.total_xp,
        streak_days = EXCLUDED.streak_days,
        league = EXCLUDED.league
    `;

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, reason: "Error" }, { status: 500 });
  }
}

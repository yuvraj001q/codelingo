import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || "";

export async function GET() {
  const info: Record<string, unknown> = {
    has_db_url: !!DATABASE_URL,
    db_url_prefix: DATABASE_URL ? DATABASE_URL.substring(0, 20) + "..." : "none",
  };

  if (!DATABASE_URL) {
    info.status = "Neon not connected — add DATABASE_URL in Vercel env vars";
    return Response.json(info);
  }

  try {
    const sql = neon(DATABASE_URL);
    await sql`SELECT 1`;
    info.connection = "ok";

    const tables = await sql`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `;
    info.tables = (tables as { table_name: string }[]).map((r) => r.table_name);

    const count = await sql`SELECT COUNT(*) AS cnt FROM profiles`;
    info.profile_count = (count as { cnt: number }[])[0]?.cnt || 0;

    const users = await sql`SELECT id, username, total_xp FROM profiles ORDER BY total_xp DESC LIMIT 5`;
    info.top_users = users as { id: string; username: string; total_xp: number }[];

    info.status = "Database looks good";
  } catch (err) {
    info.status = "Database error";
    info.error = String(err);
  }

  return Response.json(info);
}

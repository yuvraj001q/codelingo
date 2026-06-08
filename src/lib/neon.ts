import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "";

let _sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!_sql) {
    if (!DATABASE_URL) {
      throw new Error(
        "No database connection string. Connect Neon to Vercel, or set DATABASE_URL."
      );
    }
    _sql = neon(DATABASE_URL);
  }
  return _sql;
}

export async function initDatabase() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT,
      total_xp INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      league TEXT DEFAULT 'Bronze',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      language_name TEXT UNIQUE NOT NULL,
      icon_svg TEXT,
      theme_color TEXT DEFAULT '#6366f1',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_courses (
      user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
      course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
      is_active BOOLEAN DEFAULT false,
      PRIMARY KEY (user_id, course_id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      completed BOOLEAN DEFAULT false,
      xp_earned INTEGER DEFAULT 0,
      completed_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, lesson_id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS daily_streaks (
      user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      xp_earned INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, date)
    );
  `;
}

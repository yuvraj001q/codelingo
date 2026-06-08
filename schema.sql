-- OpenCodeLingo Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE (no hearts/lives column)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  league TEXT DEFAULT 'Bronze',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COURSES TABLE
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_name TEXT UNIQUE NOT NULL,
  icon_svg TEXT,
  theme_color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER_COURSES (junction table)
CREATE TABLE user_courses (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT false,
  PRIMARY KEY (user_id, course_id)
);

-- UNITS TABLE
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LESSONS TABLE
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXERCISES TABLE
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('concept', 'multiple_choice', 'fill_blank', 'syntax_drag')),
  question TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER_MISTAKES (no blocking — purely for practice targeting)
CREATE TABLE user_mistakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  wrong_answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LESSON_PROGRESS TABLE
CREATE TABLE lesson_progress (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, lesson_id)
);

-- DAILY_STREAKS TABLE
CREATE TABLE daily_streaks (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

-- WEEKLY_XP for leaderboard
CREATE TABLE weekly_xp (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  xp INTEGER DEFAULT 0
);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_xp ENABLE ROW LEVEL SECURITY;

-- POLICIES (authenticated users)
CREATE POLICY "Users can read any profile"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read courses"
  ON courses FOR SELECT USING (true);

CREATE POLICY "Users can read own course enrollments"
  ON user_courses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course enrollments"
  ON user_courses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course enrollments"
  ON user_courses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read units"
  ON units FOR SELECT USING (true);

CREATE POLICY "Anyone can read lessons"
  ON lessons FOR SELECT USING (true);

CREATE POLICY "Anyone can read exercises"
  ON exercises FOR SELECT USING (true);

CREATE POLICY "Users can read own mistakes"
  ON user_mistakes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mistakes"
  ON user_mistakes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mistakes"
  ON user_mistakes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own progress"
  ON lesson_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own progress"
  ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON lesson_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own daily streaks"
  ON daily_streaks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily streaks"
  ON daily_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read weekly_xp for leaderboard"
  ON weekly_xp FOR SELECT USING (true);

CREATE POLICY "Users can upsert own weekly_xp"
  ON weekly_xp FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly_xp"
  ON weekly_xp FOR UPDATE USING (auth.uid() = user_id);

-- Seed default courses
INSERT INTO courses (language_name, icon_svg, theme_color) VALUES
  ('Python', '<svg>...</svg>', '#3776AB'),
  ('JavaScript', '<svg>...</svg>', '#F7DF1E'),
  ('Rust', '<svg>...</svg>', '#DEA584'),
  ('C++', '<svg>...</svg>', '#00599C'),
  ('Go', '<svg>...</svg>', '#00ADD8'),
  ('TypeScript', '<svg>...</svg>', '#3178C6')
ON CONFLICT (language_name) DO NOTHING;

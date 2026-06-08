export interface Profile {
  id: string;
  username: string;
  total_xp: number;
  streak_days: number;
  league: string;
  created_at: string;
}

export interface Course {
  id: string;
  language_name: string;
  icon_svg: string;
  theme_color: string;
}

export interface UserCourse {
  user_id: string;
  course_id: string;
  is_active: boolean;
}

export interface Unit {
  id: string;
  course_id: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  unit_id: string;
  order: number;
  title: string;
}

export interface Exercise {
  id: string;
  lesson_id: string;
  type: "concept" | "multiple_choice" | "fill_blank" | "syntax_drag";
  question: string;
  code_snippet?: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: number;
}

export interface UserMistake {
  id: string;
  user_id: string;
  exercise_id: string;
  lesson_id: string;
  wrong_answer: string;
  created_at: string;
}

export interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  xp_earned: number;
}

export type Theme = "light" | "dark";

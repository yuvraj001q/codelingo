import { create } from "zustand";
import type { Profile, Course, Lesson, Exercise, UserMistake } from "./types";

interface AppState {
  // Auth
  user: Profile | null;
  session: object | null;
  setUser: (user: Profile | null) => void;
  setSession: (session: object | null) => void;

  // Courses
  activeCourse: Course | null;
  courses: Course[];
  setActiveCourse: (course: Course | null) => void;
  setCourses: (courses: Course[]) => void;

  // Learning
  currentLesson: Lesson | null;
  currentExercises: Exercise[];
  lessonProgress: number;
  xpEarned: number;
  setCurrentLesson: (lesson: Lesson | null) => void;
  setCurrentExercises: (exercises: Exercise[]) => void;
  setLessonProgress: (progress: number) => void;
  addXp: (xp: number) => void;
  resetLesson: () => void;

  // Mistakes
  mistakes: UserMistake[];
  setMistakes: (mistakes: UserMistake[]) => void;
  removeMistake: (id: string) => void;

  // UI
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),

  activeCourse: null,
  courses: [],
  setActiveCourse: (course) => set({ activeCourse: course }),
  setCourses: (courses) => set({ courses }),

  currentLesson: null,
  currentExercises: [],
  lessonProgress: 0,
  xpEarned: 0,
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  setCurrentExercises: (exercises) => set({ currentExercises: exercises }),
  setLessonProgress: (progress) => set({ lessonProgress: progress }),
  addXp: (xp) => set((state) => ({ xpEarned: state.xpEarned + xp })),
  resetLesson: () =>
    set({
      currentLesson: null,
      currentExercises: [],
      lessonProgress: 0,
      xpEarned: 0,
    }),

  mistakes: [],
  setMistakes: (mistakes) => set({ mistakes }),
  removeMistake: (id) =>
    set((state) => ({
      mistakes: state.mistakes.filter((m) => m.id !== id),
    })),

  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

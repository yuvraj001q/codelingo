import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXp(xp: number): string {
  if (xp >= 1000) {
    return (xp / 1000).toFixed(1) + "k";
  }
  return xp.toString();
}

export function getLeagueEmoji(league: string): string {
  const emojis: Record<string, string> = {
    Iron: "⚙️",
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
    Platinum: "💠",
    Emerald: "💚",
    Diamond: "💎",
    Master: "👑",
    Grandmaster: "🏆",
    Challenger: "🌟",
  };
  return emojis[league] || "🏅";
}

export const LEAGUES = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];

export const LEAGUE_XP_THRESHOLDS: Record<string, number> = {
  Iron: 0,
  Bronze: 500,
  Silver: 1500,
  Gold: 3000,
  Platinum: 5500,
  Emerald: 9000,
  Diamond: 14000,
  Master: 20000,
  Grandmaster: 28000,
  Challenger: 38000,
};

export function getLeagueForXp(xp: number): string {
  let current = "Bronze";
  for (const league of LEAGUES) {
    if (xp >= LEAGUE_XP_THRESHOLDS[league]) {
      current = league;
    }
  }
  return current;
}

export function getLeagueProgress(xp: number): { current: string; next: string | null; progress: number } {
  const current = getLeagueForXp(xp);
  const currentIdx = LEAGUES.indexOf(current);
  if (currentIdx >= LEAGUES.length - 1) {
    return { current, next: null, progress: 1 };
  }
  const next = LEAGUES[currentIdx + 1];
  const currentMin = LEAGUE_XP_THRESHOLDS[current];
  const nextMin = LEAGUE_XP_THRESHOLDS[next];
  const progress = (xp - currentMin) / (nextMin - currentMin);
  return { current, next, progress: Math.min(progress, 1) };
}

export function getStreakData() {
  const stored = localStorage.getItem("opencodeLingo_streak");
  if (!stored) return { days: 0, lastDate: null };

  const data = JSON.parse(stored);
  const today = new Date().toISOString().split("T")[0];
  const lastDate = data.lastDate;

  if (lastDate === today) return data;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastDate === yesterdayStr) return data;

  return { days: 0, lastDate: null };
}

export function updateStreak() {
  const today = new Date().toISOString().split("T")[0];
  const stored = localStorage.getItem("opencodeLingo_streak");
  let days = 1;

  if (stored) {
    const data = JSON.parse(stored);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (data.lastDate === today) {
      return data.days;
    } else if (data.lastDate === yesterdayStr) {
      days = data.days + 1;
    }
  }

  localStorage.setItem(
    "opencodeLingo_streak",
    JSON.stringify({ days, lastDate: today })
  );
  return days;
}

export const defaultCourses = [
  {
    id: "python",
    language_name: "Python",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#306998"/><path d="M15.5 3C13 3 12 4.5 12 6H9c-2.5 0-4 1.8-4 4s1.5 4 4 4h2v-2c0-2 2-3 4-3h2c2 0 3.5-1.5 3.5-3.5S17.5 3 15.5 3zm-2 3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="#FFD43B"/><path d="M8.5 21c2.5 0 3.5-1.5 3.5-3h3c2.5 0 4-1.8 4-4s-1.5-4-4-4h-2v2c0 2-2 3-4 3H7c-2 0-3.5 1.5-3.5 3.5S5 21 8.5 21zm2-3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" fill="#FFD43B"/></svg>`,
    theme_color: "#3776AB",
  },
  {
    id: "javascript",
    language_name: "JavaScript",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#F7DF1E"/><text x="12" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="12" fill="#000">JS</text></svg>`,
    theme_color: "#F7DF1E",
  },
  {
    id: "rust",
    language_name: "Rust",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#DEA584"/><circle cx="12" cy="12" r="7" stroke="white" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="3" fill="white"/><line x1="12" y1="5" x2="12" y2="9" stroke="white" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="19" stroke="white" stroke-width="1.5"/><line x1="5" y1="12" x2="9" y2="12" stroke="white" stroke-width="1.5"/><line x1="15" y1="12" x2="19" y2="12" stroke="white" stroke-width="1.5"/></svg>`,
    theme_color: "#DEA584",
  },
  {
    id: "cpp",
    language_name: "C++",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#00599C"/><text x="8" y="16" font-family="Arial,sans-serif" font-weight="bold" font-size="11" fill="white">C</text><text x="14" y="16" font-family="Arial,sans-serif" font-weight="bold" font-size="11" fill="white">++</text></svg>`,
    theme_color: "#00599C",
  },
  {
    id: "go",
    language_name: "Go",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#00ADD8"/><text x="12" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="12" fill="white">GO</text></svg>`,
    theme_color: "#00ADD8",
  },
  {
    id: "typescript",
    language_name: "TypeScript",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#3178C6"/><text x="12" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="12" fill="white">TS</text></svg>`,
    theme_color: "#3178C6",
  },
];

export interface UnitLesson {
  unitTitle: string;
  lessons: { title: string; lessonId: string }[];
}

export const sampleUnits: Record<string, UnitLesson[]> = {
  python: [
    {
      unitTitle: "Hello, World!",
      lessons: [
        { title: "Introduction to Python", lessonId: "python-u0-l0" },
        { title: "Your First Program", lessonId: "python-u0-l1" },
        { title: "Variables & Data Types", lessonId: "python-u0-l2" },
        { title: "Simple Input & Output", lessonId: "python-u0-l3" },
      ],
    },
    {
      unitTitle: "Control Flow",
      lessons: [
        { title: "If Statements", lessonId: "python-u1-l0" },
        { title: "For Loops", lessonId: "python-u1-l1" },
        { title: "While Loops", lessonId: "python-u1-l2" },
        { title: "List Comprehensions", lessonId: "python-u1-l3" },
      ],
    },
    {
      unitTitle: "Functions & Modules",
      lessons: [
        { title: "Defining Functions", lessonId: "python-u2-l0" },
        { title: "Parameters & Return Values", lessonId: "python-u2-l1" },
        { title: "Built-in Functions", lessonId: "python-u2-l2" },
        { title: "Importing Modules", lessonId: "python-u2-l3" },
      ],
    },
  ],
  javascript: [
    {
      unitTitle: "JavaScript Basics",
      lessons: [
        { title: "What is JavaScript?", lessonId: "javascript-u0-l0" },
        { title: "Variables: let, const, var", lessonId: "javascript-u0-l1" },
        { title: "Data Types & typeof", lessonId: "javascript-u0-l2" },
        { title: "Console & Debugging", lessonId: "javascript-u0-l3" },
      ],
    },
    {
      unitTitle: "Functions & Scope",
      lessons: [
        { title: "Function Declarations", lessonId: "javascript-u1-l0" },
        { title: "Arrow Functions", lessonId: "javascript-u1-l1" },
        { title: "Scope & Closures", lessonId: "javascript-u1-l2" },
        { title: "Higher-Order Functions", lessonId: "javascript-u1-l3" },
      ],
    },
    {
      unitTitle: "DOM & Events",
      lessons: [
        { title: "Selecting Elements", lessonId: "javascript-u2-l0" },
        { title: "Manipulating the DOM", lessonId: "javascript-u2-l1" },
        { title: "Event Listeners", lessonId: "javascript-u2-l2" },
        { title: "Creating Elements", lessonId: "javascript-u2-l3" },
      ],
    },
  ],
  rust: [
    {
      unitTitle: "Getting Started",
      lessons: [
        { title: "What is Rust?", lessonId: "rust-u0-l0" },
        { title: "Installing & Hello World", lessonId: "rust-u0-l1" },
        { title: "Variables & Mutability", lessonId: "rust-u0-l2" },
        { title: "Data Types", lessonId: "rust-u0-l3" },
      ],
    },
    {
      unitTitle: "Ownership & Control Flow",
      lessons: [
        { title: "Ownership Rules", lessonId: "rust-u1-l0" },
        { title: "References & Borrowing", lessonId: "rust-u1-l1" },
        { title: "If & Match", lessonId: "rust-u1-l2" },
        { title: "Loops", lessonId: "rust-u1-l3" },
      ],
    },
    {
      unitTitle: "Structs & Enums",
      lessons: [
        { title: "Defining Structs", lessonId: "rust-u2-l0" },
        { title: "Method Syntax", lessonId: "rust-u2-l1" },
        { title: "Enums & Pattern Matching", lessonId: "rust-u2-l2" },
        { title: "Option & Result", lessonId: "rust-u2-l3" },
      ],
    },
  ],
  cpp: [
    {
      unitTitle: "C++ Fundamentals",
      lessons: [
        { title: "Introduction to C++", lessonId: "cpp-u0-l0" },
        { title: "Variables & I/O", lessonId: "cpp-u0-l1" },
        { title: "Conditionals", lessonId: "cpp-u0-l2" },
        { title: "Loops", lessonId: "cpp-u0-l3" },
      ],
    },
    {
      unitTitle: "Functions & Arrays",
      lessons: [
        { title: "Functions", lessonId: "cpp-u1-l0" },
        { title: "Pass by Value vs Reference", lessonId: "cpp-u1-l1" },
        { title: "Arrays & Strings", lessonId: "cpp-u1-l2" },
        { title: "Vectors", lessonId: "cpp-u1-l3" },
      ],
    },
    {
      unitTitle: "OOP",
      lessons: [
        { title: "Classes & Objects", lessonId: "cpp-u2-l0" },
        { title: "Constructors & Destructors", lessonId: "cpp-u2-l1" },
        { title: "Inheritance", lessonId: "cpp-u2-l2" },
        { title: "Polymorphism", lessonId: "cpp-u2-l3" },
      ],
    },
  ],
  go: [
    {
      unitTitle: "Go Basics",
      lessons: [
        { title: "What is Go?", lessonId: "go-u0-l0" },
        { title: "Packages & Imports", lessonId: "go-u0-l1" },
        { title: "Variables & Constants", lessonId: "go-u0-l2" },
        { title: "Basic Types", lessonId: "go-u0-l3" },
      ],
    },
    {
      unitTitle: "Control Flow",
      lessons: [
        { title: "For Loops", lessonId: "go-u1-l0" },
        { title: "If & Switch", lessonId: "go-u1-l1" },
        { title: "Functions", lessonId: "go-u1-l2" },
        { title: "Multiple Returns", lessonId: "go-u1-l3" },
      ],
    },
    {
      unitTitle: "Data Structures",
      lessons: [
        { title: "Arrays & Slices", lessonId: "go-u2-l0" },
        { title: "Maps", lessonId: "go-u2-l1" },
        { title: "Structs", lessonId: "go-u2-l2" },
        { title: "Interfaces", lessonId: "go-u2-l3" },
      ],
    },
  ],
  typescript: [
    {
      unitTitle: "TypeScript Basics",
      lessons: [
        { title: "What is TypeScript?", lessonId: "typescript-u0-l0" },
        { title: "Type Annotations", lessonId: "typescript-u0-l1" },
        { title: "Interfaces", lessonId: "typescript-u0-l2" },
        { title: "Type Aliases", lessonId: "typescript-u0-l3" },
      ],
    },
    {
      unitTitle: "Advanced Types",
      lessons: [
        { title: "Union & Intersection", lessonId: "typescript-u1-l0" },
        { title: "Generics", lessonId: "typescript-u1-l1" },
        { title: "Enums", lessonId: "typescript-u1-l2" },
        { title: "Type Guards", lessonId: "typescript-u1-l3" },
      ],
    },
    {
      unitTitle: "Practical TypeScript",
      lessons: [
        { title: "Functions with Types", lessonId: "typescript-u2-l0" },
        { title: "Classes & Access Modifiers", lessonId: "typescript-u2-l1" },
        { title: "Modules", lessonId: "typescript-u2-l2" },
        { title: "Declaration Files", lessonId: "typescript-u2-l3" },
      ],
    },
  ],
};

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
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
    Sapphire: "💎",
    Ruby: "🔴",
    Emerald: "🟢",
    Amethyst: "🟣",
    Obsidian: "⚫",
  };
  return emojis[league] || "🏅";
}

export const LEAGUES = [
  "Bronze",
  "Silver",
  "Gold",
  "Sapphire",
  "Ruby",
  "Emerald",
  "Amethyst",
  "Obsidian",
];

export const LEAGUE_XP_THRESHOLDS: Record<string, number> = {
  Bronze: 0,
  Silver: 1000,
  Gold: 3000,
  Sapphire: 6000,
  Ruby: 10000,
  Emerald: 15000,
  Amethyst: 22000,
  Obsidian: 30000,
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
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#3776AB"/><path d="M12 2C8 2 7 4 7 6h3c0-1 1-2 2-2s2 1 2 2v1H7c-2 0-4 1-4 4s1 4 4 4h2v-2c0-2 2-3 4-3h2c2 0 4-1 4-4s-2-4-4-4zM10 5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="white"/><path d="M17 10v2c0 2-2 3-4 3h-2c-2 0-4 1-4 4s2 4 4 4h2c3 0 4-2 4-4h-3c0 1-1 2-2 2s-2-1-2-2v-1h5c2 0 4-1 4-4s-2-4-4-4zm-1 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" fill="white"/></svg>`,
    theme_color: "#3776AB",
  },
  {
    id: "javascript",
    language_name: "JavaScript",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M5 3h14v18H5V3zm9 14c1.5 0 2.5-.8 2.5-2 0-1-.5-1.5-1.5-2l-1-.5c-.7-.3-1-.7-1-1.2 0-.7.6-1.2 1.4-1.2.8 0 1.3.4 1.6.8l1.2-.8c-.5-.8-1.3-1.4-2.8-1.4-1.6 0-2.6.9-2.6 2.2 0 1 .5 1.6 1.3 2l1 .5c.7.3 1.1.7 1.1 1.3 0 .7-.6 1.2-1.5 1.2s-1.5-.4-1.9-.9l-1.2.8c.5.9 1.5 1.5 3.1 1.5zm-5 0c.4 0 .8-.1 1-.2v-2.2c-.3.1-.5.1-.8.1-.8 0-1.2-.4-1.2-1.2v-2.5H7v2.7c0 1.6.8 2.5 2 2.5z" fill="#000"/></svg>`,
    theme_color: "#F7DF1E",
  },
  {
    id: "rust",
    language_name: "Rust",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#DEA584"/><path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z" fill="white"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`,
    theme_color: "#DEA584",
  },
  {
    id: "cpp",
    language_name: "C++",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#00599C"/><path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z" fill="white"/><path d="M8 12c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2l-1.7 1c-.3-.6-1-1-1.8-1-1.1 0-2 .9-2 2s.9 2 2 2c.8 0 1.5-.4 1.8-1l1.7 1c-.7 1.2-2 2-3.5 2-2.2 0-4-1.8-4-4z" fill="#00599C"/><path d="M14 11h1v1h1v-1h1v-1h-1V9h-1v1h-1v1zm3 0h1v1h1v-1h1v-1h-1V9h-1v1h-1v1z" fill="#00599C"/></svg>`,
    theme_color: "#00599C",
  },
  {
    id: "go",
    language_name: "Go",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#00ADD8"/><path d="M6 15c0 .6-.4 1-1 1s-1-.4-1-1 .4-1 1-1 1 .4 1 1zm14-1c0 .6-.4 1-1 1s-1-.4-1-1 .4-1 1-1 1 .4 1 1z" fill="white"/><path d="M12 5C7 5 3 7 3 12c0 2 1 4 2 5l2-1c-1-1-1.5-2.5-1.5-4 0-3 3-5 6.5-5s6.5 2 6.5 5c0 1.5-.5 3-1.5 4l2 1c1-1 2-3 2-5 0-5-4-7-9-7z" fill="white"/></svg>`,
    theme_color: "#00ADD8",
  },
  {
    id: "typescript",
    language_name: "TypeScript",
    icon_svg: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#3178C6"/><path d="M3 3h18v18H3V3zm12 10v-2h4v-2h-4V7h-2v2h-2v2h2v2h2zm-6 2c0 .6-.4 1-1 1H6v2h2c1.7 0 3-1.3 3-3s-1.3-3-3-3H7v-2h2c.6 0 1-.4 1-1s-.4-1-1-1H6V6h2c1.7 0 3 1.3 3 3s-1.3 3-3 3H7v2h2c.6 0 1 .4 1 1z" fill="white"/></svg>`,
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

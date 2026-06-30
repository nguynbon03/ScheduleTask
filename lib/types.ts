export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "in_progress" | "done" | "cancelled";
export type ViewMode = "day" | "week" | "habits" | "projects" | "settings";

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string; // YYYY-MM-DD
  scheduledStart?: string; // HH:mm
  scheduledEnd?: string; // HH:mm
  estimatedMinutes?: number;
  tags: string[];
  subtasks: Subtask[];
  reminders: Reminder[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface HabitCompletion {
  date: string; // YYYY-MM-DD
  completed: boolean;
  count: number;
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  frequency: "daily" | "weekly";
  targetCount: number;
  completions: HabitCompletion[];
  streak: number;
  bestStreak: number;
  order: number;
  createdAt: string;
}

export interface Reminder {
  id: string;
  minutesBefore: number; // e.g. 15, 30, 60
  type: "browser" | "email";
  sent: boolean;
  sentAt?: string;
}

export interface UserSettings {
  accentColor: string;
  theme: "light" | "dark" | "system";
  timezone: string;
  email?: string;
  notificationsEnabled: boolean;
}

export const REMINDER_OPTIONS = [
  { label: "15 phút", value: 15 },
  { label: "30 phút", value: 30 },
  { label: "1 giờ", value: 60 },
  { label: "2 giờ", value: 120 },
  { label: "1 ngày", value: 1440 },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  urgent: "#FF3B30",
  high: "#FF9500",
  medium: "#FFCC00",
  low: "#34C759",
};

export const DEFAULT_PROJECTS: Project[] = [
  { id: "p1", name: "Cá nhân", color: "#007AFF", icon: "User", order: 0, createdAt: new Date().toISOString() },
  { id: "p2", name: "Công việc", color: "#FF9500", icon: "Briefcase", order: 1, createdAt: new Date().toISOString() },
  { id: "p3", name: "Học tập", color: "#34C759", icon: "BookOpen", order: 2, createdAt: new Date().toISOString() },
];

export const DEFAULT_HABITS: Habit[] = [
  {
    id: "h1",
    name: "Uống nước",
    color: "#007AFF",
    icon: "Droplets",
    frequency: "daily",
    targetCount: 8,
    completions: [],
    streak: 0,
    bestStreak: 0,
    order: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "h2",
    name: "Đọc sách",
    color: "#FF9500",
    icon: "BookOpen",
    frequency: "daily",
    targetCount: 1,
    completions: [],
    streak: 0,
    bestStreak: 0,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "h3",
    name: "Tập thể dục",
    color: "#34C759",
    icon: "Dumbbell",
    frequency: "daily",
    targetCount: 1,
    completions: [],
    streak: 0,
    bestStreak: 0,
    order: 2,
    createdAt: new Date().toISOString(),
  },
];

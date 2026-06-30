import { useState, useEffect } from "react";
import {
  Task,
  Habit,
  Project,
  UserSettings,
  DEFAULT_PROJECTS,
  DEFAULT_HABITS,
} from "./types";

const STORAGE_KEY = "schedule-task-data";
const SETTINGS_KEY = "schedule-task-settings";

interface AppData {
  projects: Project[];
  tasks: Task[];
  habits: Habit[];
}

function loadData(): AppData {
  if (typeof window === "undefined") {
    return { projects: DEFAULT_PROJECTS, tasks: [], habits: DEFAULT_HABITS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return { projects: DEFAULT_PROJECTS, tasks: [], habits: DEFAULT_HABITS };
}

function saveData(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSettings(): UserSettings {
  if (typeof window === "undefined") {
    return {
      accentColor: "#007AFF",
      theme: "system",
      timezone: "Asia/Ho_Chi_Minh",
    };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    accentColor: "#007AFF",
    theme: "system",
    timezone: "Asia/Ho_Chi_Minh",
  };
}

function saveSettings(settings: UserSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useAppStore() {
  const [data, setData] = useState<AppData>(loadData);
  const [settings, setSettingsState] = useState<UserSettings>(loadSettings);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const setSettings = (s: Partial<UserSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...s }));
  };

  // Tasks
  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setData((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    }));
  };

  const deleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const toggleTaskStatus = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "done" ? "todo" : "done",
              completedAt: t.status === "done" ? undefined : new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    }));
  };

  // Habits
  const addHabit = (habit: Omit<Habit, "id" | "createdAt" | "streak" | "bestStreak" | "completions">) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      streak: 0,
      bestStreak: 0,
      completions: [],
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const deleteHabit = (id: string) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));
  };

  const toggleHabitCheck = (id: string, date: string) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== id) return h;
        const existing = h.completions.find((c) => c.date === date);
        let newCompletions: typeof h.completions;
        if (existing) {
          newCompletions = h.completions.filter((c) => c.date !== date);
        } else {
          newCompletions = [...h.completions, { date, completed: true, count: 1 }];
        }
        // Recalculate streak
        const sorted = [...newCompletions]
          .filter((c) => c.completed)
          .map((c) => c.date)
          .sort();
        let streak = 0;
        let best = h.bestStreak;
        const today = new Date().toISOString().split("T")[0];
        const checkDate = new Date(today);
        while (true) {
          const ds = checkDate.toISOString().split("T")[0];
          if (sorted.includes(ds)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        if (streak > best) best = streak;
        return { ...h, completions: newCompletions, streak, bestStreak: best };
      }),
    }));
  };

  // Projects
  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      tasks: prev.tasks.filter((t) => t.projectId !== id),
    }));
  };

  return {
    ...data,
    settings,
    setSettings,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addHabit,
    deleteHabit,
    toggleHabitCheck,
    addProject,
    deleteProject,
  };
}

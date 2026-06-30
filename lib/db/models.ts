import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    projectId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    status: { type: String, enum: ["todo", "in_progress", "done", "cancelled"], default: "todo" },
    dueDate: String,
    scheduledStart: String,
    scheduledEnd: String,
    estimatedMinutes: Number,
    tags: [String],
    subtasks: [
      {
        title: String,
        completed: { type: Boolean, default: false },
      },
    ],
    completedAt: String,
  },
  { timestamps: true }
);

const HabitSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    color: { type: String, default: "#007AFF" },
    icon: { type: String, default: "Flame" },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    targetCount: { type: Number, default: 1 },
    completions: [
      {
        date: String,
        completed: Boolean,
        count: Number,
        note: String,
      },
    ],
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, default: "#007AFF" },
    icon: { type: String, default: "Folder" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export const HabitModel = mongoose.models.Habit || mongoose.model("Habit", HabitSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

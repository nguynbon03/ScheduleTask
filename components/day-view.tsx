"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, Priority, Project } from "@/lib/types";
import { PRIORITY_COLORS } from "@/lib/types";

interface DayViewProps {
  tasks: Task[];
  projects: Project[];
  habitsCount: number;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onQuickAdd: () => void;
  selectedDate?: Date;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6:00 - 23:00

function formatTime(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

function getTaskPriorityColor(priority: Priority): string {
  return PRIORITY_COLORS[priority] || "#86868B";
}

function parseTime(timeStr: string): number {
  const [h] = timeStr.split(":").map(Number);
  return h;
}

export function DayView({
  tasks,
  projects,
  habitsCount,
  onToggleTask,
  onEditTask,
  onQuickAdd,
  selectedDate = new Date(),
}: DayViewProps) {
  const dateStr = selectedDate.toISOString().split("T")[0];

  const { scheduledTasks, unscheduledTasks } = useMemo(() => {
    const todayTasks = tasks.filter((t) => t.dueDate === dateStr || !t.dueDate);
    const scheduled = todayTasks.filter(
      (t) => t.scheduledStart && t.status !== "done" && t.status !== "cancelled"
    );
    const unscheduled = todayTasks.filter(
      (t) => !t.scheduledStart && t.status !== "done" && t.status !== "cancelled"
    );
    return { scheduledTasks: scheduled, unscheduledTasks: unscheduled };
  }, [tasks, dateStr]);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const dayName = selectedDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight capitalize">{dayName}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tasks.filter((t) => t.status === "done" && t.completedAt?.startsWith(dateStr)).length} /{" "}
            {tasks.filter((t) => t.dueDate === dateStr || !t.dueDate).length} hoàn thành
            {habitsCount > 0 && ` · ${habitsCount} thói quen`}
          </p>
        </div>
        <button
          onClick={onQuickAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm nhiệm vụ</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative px-6 py-4 min-h-[800px]">
          {/* Current time line */}
          {currentHour >= 6 && currentHour <= 23 && (
            <div
              className="absolute left-16 right-6 z-10 pointer-events-none"
              style={{
                top: `${(currentHour - 6) * 60 + currentMinute + 16}px`,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="flex-1 h-px bg-red-500/60" />
                <span className="text-xs font-medium text-red-500 tabular-nums">
                  {String(currentHour).padStart(2, "0")}:{String(currentMinute).padStart(2, "0")}
                </span>
              </div>
            </div>
          )}

          {HOURS.map((hour) => {
            const hourTasks = scheduledTasks.filter((t) => {
              if (!t.scheduledStart) return false;
              const startH = parseTime(t.scheduledStart);
              return startH === hour;
            });

            return (
              <div key={hour} className="flex gap-4 min-h-[60px]">
                <div className="w-12 text-right pt-1">
                  <span
                    className={cn(
                      "text-xs font-medium tabular-nums",
                      hour === currentHour ? "text-red-500" : "text-muted-foreground"
                    )}
                  >
                    {formatTime(hour)}
                  </span>
                </div>
                <div className="flex-1 border-t border-border/60 pt-1 relative">
                  {hourTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const priorityColor = getTaskPriorityColor(task.priority);
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group flex items-start gap-2 p-2.5 rounded-xl bg-card border border-border/60 mb-1.5 cursor-pointer hover:border-primary/30 transition-colors"
                        onClick={() => onEditTask(task)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(task.id);
                          }}
                          className={cn(
                            "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                            task.status === "done"
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/40 hover:border-primary"
                          )}
                        >
                          {task.status === "done" && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-medium truncate",
                                task.status === "done" && "line-through text-muted-foreground"
                              )}
                            >
                              {task.title}
                            </span>
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: priorityColor }}
                            />
                          </div>
                          {task.scheduledStart && task.scheduledEnd && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Clock className="w-3 h-3" />
                              {task.scheduledStart} - {task.scheduledEnd}
                            </div>
                          )}
                        </div>
                        {project && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: project.color + "20",
                              color: project.color,
                            }}
                          >
                            {project.name}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unscheduled tasks */}
        {unscheduledTasks.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Chưa lên lịch
            </h3>
            <div className="space-y-2">
              {unscheduledTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const priorityColor = getTaskPriorityColor(task.priority);
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-card border border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => onEditTask(task)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        task.status === "done"
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/40 hover:border-primary"
                      )}
                    >
                      {task.status === "done" && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "text-sm font-medium flex-1",
                        task.status === "done" && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: priorityColor }}
                    />
                    {project && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: project.color + "20",
                          color: project.color,
                        }}
                      >
                        {project.name}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

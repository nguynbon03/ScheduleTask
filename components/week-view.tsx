"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, Project } from "@/lib/types";

interface WeekViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  currentDate: Date;
  onDateChange: (d: Date) => void;
}

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function getWeekDates(base: Date): Date[] {
  const day = base.getDay(); // 0 = Sun, 1 = Mon
  const diff = base.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  const monday = new Date(base);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function WeekView({
  tasks,
  projects,
  onToggleTask,
  onEditTask,
  currentDate,
  onDateChange,
}: WeekViewProps) {
  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {};
    weekDates.forEach((d) => {
      const ds = d.toISOString().split("T")[0];
      map[ds] = tasks.filter(
        (t) =>
          (t.dueDate === ds || !t.dueDate) &&
          t.status !== "done" &&
          t.status !== "cancelled"
      );
    });
    return map;
  }, [tasks, weekDates]);

  const weekRange = `${weekDates[0].getDate()}/${weekDates[0].getMonth() + 1} - ${weekDates[6].getDate()}/${weekDates[6].getMonth() + 1}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() - 7);
              onDateChange(d);
            }}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Tuần {weekRange}</h1>
          <button
            onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() + 7);
              onDateChange(d);
            }}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => onDateChange(new Date())}
          className="text-sm font-medium text-primary hover:opacity-80 transition-opacity"
        >
          Hôm nay
        </button>
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {weekDates.map((date, i) => {
            const ds = date.toISOString().split("T")[0];
            const dayTasks = tasksByDay[ds] || [];
            const isToday = isSameDate(date, today);

            return (
              <div key={i} className="flex flex-col">
                {/* Day header */}
                <div
                  className={cn(
                    "text-center py-3 rounded-xl mb-2",
                    isToday ? "bg-primary/10" : "bg-card border border-border/60"
                  )}
                >
                  <div className="text-xs font-medium text-muted-foreground">{DAYS[i]}</div>
                  <div
                    className={cn(
                      "text-lg font-bold mt-0.5",
                      isToday ? "text-primary" : "text-foreground"
                    )}
                  >
                    {date.getDate()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {date.getMonth() + 1}/{date.getFullYear()}
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex-1 space-y-2">
                  {dayTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group p-2.5 rounded-xl bg-card border border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
                        onClick={() => onEditTask(task)}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTask(task.id);
                            }}
                            className={cn(
                              "mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                              task.status === "done"
                                ? "bg-primary border-primary"
                                : "border-muted-foreground/40 hover:border-primary"
                            )}
                          >
                            {task.status === "done" && (
                              <Check className="w-2.5 h-2.5 text-primary-foreground" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-xs font-medium truncate leading-tight",
                                task.status === "done" &&
                                  "line-through text-muted-foreground"
                              )}
                            >
                              {task.title}
                            </p>
                            {task.scheduledStart && (
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground">
                                  {task.scheduledStart}
                                </span>
                              </div>
                            )}
                            {project && (
                              <div
                                className="w-full h-1 rounded-full mt-1.5"
                                style={{ backgroundColor: project.color }}
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  {dayTasks.length === 0 && (
                    <div className="text-center py-4 text-xs text-muted-foreground/60">
                      Không có nhiệm vụ
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

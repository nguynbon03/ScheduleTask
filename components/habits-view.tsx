"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Habit } from "@/lib/types";
import { getIcon } from "@/lib/icons";

interface HabitsViewProps {
  habits: Habit[];
  onToggleCheck: (id: string, date: string) => void;
  onAddHabit: (habit: Omit<Habit, "id" | "createdAt" | "streak" | "bestStreak" | "completions">) => void;
  onDeleteHabit: (id: string) => void;
}

function getWeekDays(): string[] {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today);
  monday.setDate(diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function HabitsView({
  habits,
  onToggleCheck,
  onAddHabit,
  onDeleteHabit,
}: HabitsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", color: "#007AFF", icon: "Flame" });
  const weekDays = getWeekDays();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Thói quen</h1>
            <p className="text-sm text-muted-foreground">
              {habits.length} thói quen · {habits.reduce((sum, h) => sum + h.streak, 0)} ngày streak
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm thói quen</span>
        </button>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Thói quen mới</h2>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-1 rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tên</label>
                  <input
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="VD: Uống nước, Đọc sách..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Màu</label>
                  <div className="flex gap-2 flex-wrap">
                    {["#007AFF", "#FF9500", "#34C759", "#FF3B30", "#AF52DE", "#5856D6", "#FF2D55", "#00C7BE"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewHabit({ ...newHabit, color: c })}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all",
                          newHabit.color === c && "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (newHabit.name.trim()) {
                      onAddHabit({ ...newHabit, frequency: "daily", targetCount: 1, order: habits.length });
                      setNewHabit({ name: "", color: "#007AFF", icon: "Flame" });
                      setShowAdd(false);
                    }
                  }}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Tạo thói quen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Flame className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Chưa có thói quen nào</p>
            <p className="text-xs mt-1">Thêm thói quen để bắt đầu theo dõi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {habits.map((habit) => {
              const Icon = getIcon(habit.icon);
              const isDoneToday = habit.completions.some(
                (c) => c.date === today && c.completed
              );

              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: habit.color + "15" }}
                      >
                        <Icon className="w-5 h-5" style={{ color: habit.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{habit.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span className={cn(habit.streak > 0 && "text-orange-500 font-medium")}>
                            {habit.streak} ngày
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Weekly tracker */}
                  <div className="flex items-center justify-between mb-4">
                    {weekDays.map((day, i) => {
                      const completed = habit.completions.some(
                        (c) => c.date === day && c.completed
                      );
                      const isTodayCol = day === today;
                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">{DAY_LABELS[i]}</span>
                          <button
                            onClick={() => onToggleCheck(habit.id, day)}
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs font-medium",
                              completed
                                ? "text-white"
                                : isTodayCol
                                  ? "border-2 border-dashed border-primary/40 text-primary"
                                  : "border border-border text-muted-foreground"
                            )}
                            style={completed ? { backgroundColor: habit.color } : undefined}
                          >
                            {completed && <Check className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Today check */}
                  <button
                    onClick={() => onToggleCheck(habit.id, today)}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                      isDoneToday
                        ? "bg-primary/10 text-primary"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {isDoneToday ? (
                      <>
                        <Check className="w-4 h-4" />
                        Đã hoàn thành
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Đánh dấu hôm nay
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

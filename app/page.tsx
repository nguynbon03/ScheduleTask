"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Plus, Sun, Moon, Keyboard } from "lucide-react";
import { useTheme } from "next-themes";
import { ViewMode, Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { DayView } from "@/components/day-view";
import { WeekView } from "@/components/week-view";
import { HabitsView } from "@/components/habits-view";
import { ProjectsView } from "@/components/projects-view";
import { SettingsView } from "@/components/settings-view";
import { TaskModal } from "@/components/task-modal";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>("day");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { theme, setTheme } = useTheme();

  const store = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "k":
            e.preventDefault();
            setEditingTask(null);
            setTaskModalOpen(true);
            break;
          case "d":
            e.preventDefault();
            setActiveView("day");
            break;
          case "w":
            e.preventDefault();
            setActiveView("week");
            break;
          case "h":
            e.preventDefault();
            setActiveView("habits");
            break;
        }
      }
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        setShowShortcuts((v) => !v);
      }
      if (e.key === "Escape") {
        setTaskModalOpen(false);
        setShowShortcuts(false);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  }, []);

  const handleQuickAdd = useCallback(() => {
    setEditingTask(null);
    setTaskModalOpen(true);
  }, []);

  const todayTasks = store.tasks.filter(
    (t) =>
      (t.dueDate === new Date().toISOString().split("T")[0] || !t.dueDate) &&
      t.status !== "done"
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        taskCount={todayTasks.length}
        isMobile={false}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile Sidebar Overlay */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        taskCount={todayTasks.length}
        isMobile={true}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold">Schedule</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleQuickAdd}
              className="p-2 rounded-lg bg-primary text-primary-foreground"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-hidden"
          >
            {activeView === "day" && (
              <DayView
                tasks={store.tasks}
                projects={store.projects}
                habitsCount={store.habits.length}
                onToggleTask={store.toggleTaskStatus}
                onEditTask={handleEditTask}
                onQuickAdd={handleQuickAdd}
                selectedDate={currentDate}
              />
            )}
            {activeView === "week" && (
              <WeekView
                tasks={store.tasks}
                projects={store.projects}
                onToggleTask={store.toggleTaskStatus}
                onEditTask={handleEditTask}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
            )}
            {activeView === "habits" && (
              <HabitsView
                habits={store.habits}
                onToggleCheck={store.toggleHabitCheck}
                onAddHabit={store.addHabit}
                onDeleteHabit={store.deleteHabit}
              />
            )}
            {activeView === "projects" && (
              <ProjectsView
                projects={store.projects}
                tasks={store.tasks}
                onAddProject={store.addProject}
                onDeleteProject={store.deleteProject}
                onFilterByProject={() => {
                  setActiveView("day");
                }}
              />
            )}
            {activeView === "settings" && (
              <SettingsView
                settings={store.settings}
                onUpdateSettings={store.setSettings}
                onClearData={() => {
                  localStorage.removeItem("schedule-task-data");
                  window.location.reload();
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        projects={store.projects}
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={(t) =>
          store.addTask({
            ...t,
            projectId: t.projectId || store.projects[0]?.id || "",
          })
        }
        onUpdate={(id, updates) => store.updateTask(id, updates)}
        onDelete={(id) => store.deleteTask(id)}
      />

      {/* Floating Quick Add (Desktop) */}
      <button
        onClick={handleQuickAdd}
        className="fixed bottom-6 right-6 hidden lg:flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40"
        title="Thêm nhiệm vụ (Cmd+K)"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  Phím tắt
                </h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-1 rounded-lg hover:bg-accent"
                >
                  <span className="text-xs text-muted-foreground">ESC</span>
                </button>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { keys: "Cmd + K", desc: "Thêm nhiệm vụ" },
                  { keys: "Cmd + D", desc: "Xem ngày" },
                  { keys: "Cmd + W", desc: "Xem tuần" },
                  { keys: "Cmd + H", desc: "Thói quen" },
                  { keys: "ESC", desc: "Đóng modal" },
                  { keys: "?", desc: "Hiện phím tắt" },
                ].map((item) => (
                  <div key={item.keys} className="flex items-center justify-between py-1.5">
                    <span className="text-muted-foreground">{item.desc}</span>
                    <kbd className="px-2 py-0.5 rounded-lg bg-accent text-xs font-mono">
                      {item.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

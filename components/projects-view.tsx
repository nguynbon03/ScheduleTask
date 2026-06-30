"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Plus, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, Task } from "@/lib/types";

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onAddProject: (project: Omit<Project, "id" | "createdAt">) => void;
  onDeleteProject: (id: string) => void;
  onFilterByProject: (id: string) => void;
}

const COLORS = [
  "#007AFF", "#FF9500", "#34C759", "#FF3B30", "#AF52DE",
  "#5856D6", "#FF2D55", "#00C7BE", "#FFCC00", "#8E8E93",
];

export function ProjectsView({
  projects,
  tasks,
  onAddProject,
  onDeleteProject,
  onFilterByProject,
}: ProjectsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);

  const getTaskCount = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId && t.status !== "done").length;

  const getDoneCount = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId && t.status === "done").length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Folder className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dự án</h1>
            <p className="text-sm text-muted-foreground">
              {projects.length} dự án · {tasks.filter((t) => t.status !== "done").length} nhiệm vụ đang làm
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm dự án</span>
        </button>
      </div>

      {/* Add Project Modal */}
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
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Dự án mới</h2>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-1 rounded-lg hover:bg-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tên</label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Tên dự án..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Màu</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewColor(c)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all",
                          newColor === c && "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (newName.trim()) {
                      onAddProject({
                        name: newName.trim(),
                        color: newColor,
                        icon: "Folder",
                        order: projects.length,
                      });
                      setNewName("");
                      setNewColor(COLORS[0]);
                      setShowAdd(false);
                    }
                  }}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Tạo dự án
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const taskCount = getTaskCount(project.id);
            const doneCount = getDoneCount(project.id);
            const total = taskCount + doneCount;
            const progress = total > 0 ? (doneCount / total) * 100 : 0;

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/20 transition-colors cursor-pointer group"
                onClick={() => onFilterByProject(project.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: project.color + "15" }}
                    >
                      <Folder className="w-5 h-5" style={{ color: project.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {taskCount} đang làm · {doneCount} hoàn thành
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-muted-foreground">
                    {Math.round(progress)}% hoàn thành
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {total} nhiệm vụ
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

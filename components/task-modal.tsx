"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, Project, Priority, Status, Subtask } from "@/lib/types";
import { PRIORITY_COLORS } from "@/lib/types";

interface TaskModalProps {
  task?: Task | null;
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onDelete?: (id: string) => void;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "urgent", label: "Khẩn cấp" },
  { value: "high", label: "Cao" },
  { value: "medium", label: "Trung bình" },
  { value: "low", label: "Thấp" },
];

export function TaskModal({
  task,
  projects,
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
}: TaskModalProps) {
  const isEditing = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduledEnd, setScheduledEnd] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setProjectId(task.projectId);
      setPriority(task.priority);
      setDueDate(task.dueDate || "");
      setScheduledStart(task.scheduledStart || "");
      setScheduledEnd(task.scheduledEnd || "");
      setTags(task.tags || []);
      setSubtasks(task.subtasks || []);
    } else {
      setTitle("");
      setDescription("");
      setProjectId(projects[0]?.id || "");
      setPriority("medium");
      setDueDate(new Date().toISOString().split("T")[0]);
      setScheduledStart("");
      setScheduledEnd("");
      setTags([]);
      setSubtasks([]);
    }
  }, [task, projects, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    const payload = {
      projectId,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: (task?.status || "todo") as Status,
      dueDate: dueDate || undefined,
      scheduledStart: scheduledStart || undefined,
      scheduledEnd: scheduledEnd || undefined,
      estimatedMinutes: undefined as number | undefined,
      tags,
      subtasks,
      reminders: [],
    };
    if (isEditing && task && onUpdate) {
      onUpdate(task.id, payload);
    } else {
      onSave(payload);
    }
    onClose();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const addSubtask = () => {
    const t = subtaskInput.trim();
    if (t) {
      setSubtasks([
        ...subtasks,
        { id: crypto.randomUUID(), title: t, completed: false },
      ]);
      setSubtaskInput("");
    }
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Chỉnh sửa nhiệm vụ" : "Nhiệm vụ mới"}
              </h2>
              <div className="flex items-center gap-2">
                {isEditing && onDelete && (
                  <button
                    onClick={() => {
                      if (task) onDelete(task.id);
                      onClose();
                    }}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Tiêu đề <span className="text-destructive">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tên nhiệm vụ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  autoFocus
                />
              </div>

              {/* Project */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Dự án</label>
                <div className="flex gap-2 flex-wrap">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProjectId(p.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                        projectId === p.id
                          ? "border-transparent text-white"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                      style={
                        projectId === p.id
                          ? { backgroundColor: p.color }
                          : undefined
                      }
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Mức độ ưu tiên</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-medium transition-all border",
                        priority === p.value
                          ? "border-transparent text-white"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                      style={
                        priority === p.value
                          ? { backgroundColor: PRIORITY_COLORS[p.value] }
                          : undefined
                      }
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Hạn chót</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Khung giờ</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={scheduledStart}
                      onChange={(e) => setScheduledStart(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="time"
                      value={scheduledEnd}
                      onChange={(e) => setScheduledEnd(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Mô tả</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chi tiết nhiệm vụ..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  Nhãn
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-accent text-xs"
                    >
                      {t}
                      <button
                        onClick={() => removeTag(t)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Thêm nhãn..."
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 rounded-xl bg-accent text-sm font-medium hover:bg-accent/80 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Công việc con</label>
                <div className="space-y-1.5 mb-2">
                  {subtasks.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-accent/50"
                    >
                      <button
                        onClick={() => toggleSubtask(s.id)}
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all",
                          s.completed
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {s.completed && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                      </button>
                      <span
                        className={cn(
                          "text-sm flex-1",
                          s.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {s.title}
                      </span>
                      <button
                        onClick={() => removeSubtask(s.id)}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                    placeholder="Thêm công việc con..."
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={addSubtask}
                    className="px-3 py-2 rounded-xl bg-accent text-sm font-medium hover:bg-accent/80 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-card">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isEditing ? "Lưu thay đổi" : "Tạo nhiệm vụ"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

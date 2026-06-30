"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserSettings } from "@/lib/types";

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (s: Partial<UserSettings>) => void;
  onClearData: () => void;
}

const ACCENT_COLORS = [
  "#007AFF", "#FF9500", "#34C759", "#FF3B30", "#AF52DE",
  "#5856D6", "#FF2D55", "#00C7BE", "#FFCC00", "#5AC8FA",
];

export function SettingsView({
  settings,
  onUpdateSettings,
  onClearData,
}: SettingsViewProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tùy chỉnh giao diện và màu sắc
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 max-w-2xl">
        {/* Theme */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Giao diện
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "Sáng", icon: Sun },
              { value: "dark", label: "Tối", icon: Moon },
              { value: "system", label: "Tự động", icon: Monitor },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <Icon className={cn("w-6 h-6", isActive && "text-primary")} />
                  <span className={cn("text-sm font-medium", isActive && "text-primary")}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Accent Color */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Màu chủ đạo
          </h2>
          <div className="flex gap-3 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onUpdateSettings({ accentColor: c })}
                className={cn(
                  "w-10 h-10 rounded-full transition-all",
                  settings.accentColor === c
                    ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                    : "hover:scale-105"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </section>

        {/* Data */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Dữ liệu
          </h2>
          <button
            onClick={() => {
              if (confirm("Xóa tất cả dữ liệu? Không thể hoàn tác.")) {
                onClearData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Xóa tất cả dữ liệu
          </button>
        </section>

        {/* About */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Thông tin
          </h2>
          <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
            <p className="text-sm">
              <span className="font-medium">Schedule Task</span> — Trình quản lý lịch và thói quen cá nhân
            </p>
            <p className="text-xs text-muted-foreground">
              Xây dựng với Next.js + Tailwind CSS + shadcn/ui
            </p>
            <p className="text-xs text-muted-foreground">
              Tham khảo: habit, will-be-done, DeyWeaver, DooTask
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

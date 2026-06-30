"use client";

import { useEffect, useCallback } from "react";
import { Task } from "@/lib/types";

function getMinutesUntil(scheduledStart: string, dueDate: string): number {
  const now = new Date();
  const [h, m] = scheduledStart.split(":").map(Number);
  const [year, month, day] = dueDate.split("-").map(Number);
  const target = new Date(year, month - 1, day, h, m);
  return Math.floor((target.getTime() - now.getTime()) / 60000);
}

export function useNotifications(tasks: Task[]) {
  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      return result === "granted";
    }
    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  }, []);

  useEffect(() => {
    if (!("Notification" in window)) return;

    const interval = setInterval(() => {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];

      tasks.forEach((task) => {
        if (task.status === "done" || task.status === "cancelled") return;
        if (!task.scheduledStart || !task.dueDate) return;
        if (task.dueDate !== dateStr) return;

        const minutesUntil = getMinutesUntil(task.scheduledStart, task.dueDate);

        task.reminders?.forEach((reminder) => {
          if (reminder.sent) return;
          if (reminder.type !== "browser") return;

          if (minutesUntil <= reminder.minutesBefore && minutesUntil > 0) {
            sendNotification(
              `⏰ Sắp đến giờ: ${task.title}`,
              `Còn ${minutesUntil} phút — ${task.scheduledStart}`
            );
            reminder.sent = true;
          }
        });
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [tasks, sendNotification]);

  return { requestPermission };
}

// src/client/utils.ts
import { useState, useEffect } from "react";

/** Пример: форматирует дату */
export function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Хук для получения текущего пользователя */
export function useAuth() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  useEffect(() => {
    fetch("/api/me")
      .then((r) => {
        if (!r.ok) throw new Error("Не авторизован");
        return r.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);
  return user;
}

/** Хук для показа тостов */
type ToastFn = (message: string, type?: "success" | "error") => void;
export function useToast(): ToastFn {
  return (message, type = "success") => {
    // Простая заглушка: на реальном проекте замените на вашу систему тостов
    const prefix = type === "error" ? "❌ " : "✅ ";
    window.alert(prefix + message);
  };
}

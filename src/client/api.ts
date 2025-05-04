// src/client/api.ts
// Здесь будут функции для обращения к бэку.
// Сейчас делаем минимальный заглушечный модуль, чтобы сборка шла без ошибок.

export async function getHealth() {
  const res = await fetch('/api/health');
  return res.json();
}

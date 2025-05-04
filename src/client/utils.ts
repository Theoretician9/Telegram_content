// src/client/utils.ts
/** Пример: форматирует дату */
export function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
}

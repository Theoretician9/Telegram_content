// src/components/ui/index.tsx
import React from 'react';

/**
 * Заглушечная кнопка — стилизуйте или замените на свою логику позже
 */
export function Button(props: React.ComponentProps<'button'>) {
  return <button {...props} />;
}

/**
 * Можно добавить другие компоненты по аналогии:
 * export function Card(props) { ... }
 * export function Input(props) { ... }
 */

// server/actions.ts

/**
 * Заглушка — аутентификация пользователя
 */
export async function getAuth(...args: any[]): Promise<{ userId: string }> {
  // TODO: вытягивать из JWT/сессии
  return { userId: 'dummy-user-id' };
}

/**
 * Заглушка — запрос к мультимодели (GPT, DALL·E и т.п.)
 * Принимает любые поля, в т.ч. system, prompt, model и т.п.
 */
export async function requestMultimodalModel(
  req: { model: string; prompt: string; [key: string]: any }
): Promise<{ title: string; text: string; imagePrompt: string; imageUrl?: string }> {
  // TODO: здесь реальный вызов AI-API
  return {
    title: 'Заголовок, сгенерированный AI',
    text: 'Текст, сгенерированный AI',
    imagePrompt: 'Описание изображения для генератора',
    imageUrl: undefined, // если нужно
  };
}

/**
 * Заглушка — постановка фоновой задачи.
 * Принимает либо (имя задачи, payload), либо просто произвольные аргументы.
 */
export async function queueTask(...args: any[]): Promise<{ id: string }> {
  // TODO: записать в Bull/RabbitMQ/БД
  console.log('queueTask args:', args);
  return { id: 'dummy-task-id' };
}

/**
 * Заглушка — проверка статуса фоновой задачи.
 * Принимает либо строку, либо объект { taskId: string }
 */
export async function getTaskStatus(...args: any[]): Promise<{
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  error?: { message: string };
}> {
  console.log('getTaskStatus args:', args);
  return { status: 'COMPLETED' };
}

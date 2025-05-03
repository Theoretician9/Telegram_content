// server/actions.ts

import { randomUUID } from 'crypto';

/**
 * Результат аутентификации
 */
export interface AuthResult {
  userId: string;
}

/**
 * Параметры запроса к мультимодели
 */
export interface MultimodalRequest {
  model: string;
  prompt: string;
  // любые другие поля, которые потребуются AI-API
}

/**
 * Ответ от мультимодели
 */
export interface MultimodalResult {
  title: string;
  text: string;
  imagePrompt: string;
}

/**
 * Результат помещения задачи в очередь
 */
export interface QueueTaskResult {
  id: string;
}

/**
 * Возможные статусы фоновой задачи
 */
export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

/**
 * Ответ при запросе статуса задачи
 */
export interface TaskStatusResult {
  status: TaskStatus;
  error?: { message: string };
}

/**
 * Заглушка — аутентификация пользователя.
 * Позже сюда можно вставить проверку JWT/сессии.
 */
export async function getAuth(opts: { required: boolean }): Promise<AuthResult> {
  if (opts.required) {
    // TODO: взять userId из JWT / cookies / headers
    return { userId: 'dummy-user-id' };
  }
  return { userId: '' };
}

/**
 * Заглушка — отправка запроса мультимодели (GPT-4, DALL·E и т.п.)
 */
export async function requestMultimodalModel(
  req: MultimodalRequest
): Promise<MultimodalResult> {
  // TODO: здесь должен быть реальный вызов к AI-API
  return {
    title: 'AI-сгенерированный заголовок',
    text:  'AI-сгенерированный текст',
    imagePrompt: 'Описание изображения для генератора',
  };
}

/**
 * Заглушка — запись задачи в очередь на фоновую обработку
 */
export async function queueTask(
  taskName: string,
  payload: unknown
): Promise<QueueTaskResult> {
  const id = randomUUID();
  console.log(`Queued task "${taskName}" with payload:`, payload);
  // TODO: здесь пушить задачу в реальную очередь (Bull, RabbitMQ и т.п.)
  return { id };
}

/**
 * Заглушка — получение статуса фоновой задачи
 */
export async function getTaskStatus(
  input: { taskId: string }
): Promise<TaskStatusResult> {
  console.log(`Checking status of task ${input.taskId}`);
  // TODO: читать реальный статус из БД/очереди
  return { status: 'COMPLETED' };
}

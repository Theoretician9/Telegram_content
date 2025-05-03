// server/actions.ts
import { randomUUID } from 'crypto'

/** Результат аутентификации */
export interface AuthResult {
  userId: string
}

/** Параметры запроса к мультимодели */
export interface MultimodalRequest {
  model: string
  prompt: string
}

/** Ответ от мультимодели */
export interface MultimodalResult {
  title: string
  text: string
  imagePrompt: string
}

/** Результат помещения задачи в очередь */
export interface QueueTaskResult {
  id: string
}

/** Возможные статусы фоновой задачи */
export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

/** Ответ при запросе статуса задачи */
export interface TaskStatusResult {
  status: TaskStatus
  error?: { message: string }
}

/** Заглушка — аутентификация пользователя */
export async function getAuth(opts: { required: boolean }): Promise<AuthResult> {
  if (opts.required) {
    // TODO: вытянуть userId из JWT/кук/хедера
    return { userId: 'dummy-user-id' }
  }
  return { userId: '' }
}

/** Заглушка — запрос к мультимодели (GPT-4, DALL·E и т.п.) */
export async function requestMultimodalModel(
  req: MultimodalRequest
): Promise<MultimodalResult> {
  // TODO: реальный вызов AI-API
  return {
    title: 'AI-сгенерированный заголовок',
    text:  'AI-сгенерированный текст',
    imagePrompt: 'Описание картинки для генератора'
  }
}

/** Заглушка — поставить задачу в очередь */
export async function queueTask(
  taskName: string,
  payload: unknown
): Promise<QueueTaskResult> {
  const id = randomUUID()
  console.log(`Queued task "${taskName}"`, payload)
  return { id }
}

/** Заглушка — проверить статус фоновой задачи */
export async function getTaskStatus(
  input: { taskId: string }
): Promise<TaskStatusResult> {
  console.log(`Checking status of ${input.taskId}`)
  return { status: 'COMPLETED' }
}

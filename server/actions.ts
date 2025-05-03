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
    return { userId: 'dummy-user-id' }
  }
  return { userId: '' }
}

/** Заглушка — запрос к мультимодели (GPT-4, DALL·E и т.п.) */
export async function requestMultimodalModel(
  req: MultimodalRequest
): Promise<MultimodalResult> {
  return {
    title: 'AI-generated title',
    text: 'AI-generated text',
    imagePrompt: 'Prompt for image generation',
  }
}

/** Заглушка — поставить задачу в очередь */
export async function queueTask(
  taskName: string,
  payload: unknown
): Promise<QueueTaskResult> {
  const id = randomUUID()
  console.log(`Queued task "${taskName}" with payload:`, payload)
  return { id }
}

/** Заглушка — проверить статус фоновой задачи */
export async function getTaskStatus(
  input: { taskId: string }
): Promise<TaskStatusResult> {
  console.log(`Checking status of task ${input.taskId}`)
  return { status: 'COMPLETED' }
}

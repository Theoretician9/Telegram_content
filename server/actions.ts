// server/actions.ts
import { randomUUID } from 'crypto'

/**
 * Результат аутентификации
 */
export interface AuthResult {
  userId: string
}

/**
 * Параметры запроса к мультимодели
 */
export interface MultimodalRequest {
  model: string
  prompt: string
  // сюда можно добавить любые другие поля, нужные для вызова
}

/**
 * Ответ от мультимодели
 */
export interface MultimodalResult {
  title: string
  text: string
  imagePrompt: string
}

/**
 * Результат помещения задачи в очередь
 */
export interface QueueTaskResult {
  id: string
}

/**
 * Статус задачи
 */
export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

/**
 * Ответ при запросе статуса задачи
 */
export interface TaskStatusResult {
  status: TaskStatus
  error?: { message: string }
}

/**
 * Заглушка — аутентификация пользователя.
 * В дальнейшем сюда вставишь проверку JWT или сессии.
 */
export async function getAuth(opts: { required: boolean }): Promise<AuthResult> {
  if (opts.required) {
    // TODO: взять userId из JWT / cookies / headers
    return { userId: 'dummy-user-id' }
  }
  return { userId: '' }
}

/**
 * Заглушка — отправка запроса мультимодели (GPT-4, DALL·E и т.п.)
 */
export async function requestMultimodalModel(
  req: MultimodalRequest
): Promise<MultimodalResult> {
  // TODO: здесь вызов AI-API
  return {
    title: 'Заголовок, сгенерированный AI',
    text: 'Текст, сгенерированный AI',
    imagePrompt: 'Описание изображения, чтобы отправить в генератор'
  }
}

/**
 * Заглушка — запись задачи в очередь на фоновую обработку
 */
export async function queueTask(
  taskName: string,
  payload: unknown
): Promise<QueueTaskResult> {
  const id = randomUUID()
  // TODO: записать в базу или в очередь (Bull, RabbitMQ и т.п.)
  console.log(`Queued task "${taskName}" with payload:`, payload)
  return { id }
}

/**
 * Заглушка — получение статуса фоновой задачи
 */
export async function getTaskStatus(
  input: { taskId: string }
): Promise<TaskStatusResult> {
  // TODO: читать статус из БД или очереди
  console.log(`Checking status of task ${input.taskId}`)
  return { status: 'COMPLETED' }
}

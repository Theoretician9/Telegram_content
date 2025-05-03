// server/actions.ts

// Заглушка—аутентификация пользователя
export async function getAuth(opts: { required: boolean }) {
  // TODO: Реализовать получение userId из заголовков/JWT/сессии
  return { userId: 'dummy-user-id' };
}

// Заглушка — отправка запроса мультимодели
export async function requestMultimodalModel(...args: any[]) {
  throw new Error('requestMultimodalModel not implemented');
}

// Заглушка — добавление в очередь задач
export async function queueTask(...args: any[]) {
  throw new Error('queueTask not implemented');
}

// Заглушка — проверка статуса задачи
export async function getTaskStatus(...args: any[]) {
  throw new Error('getTaskStatus not implemented');
}

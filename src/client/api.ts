// src/client/api.ts

/**
 * Заглушка для клиента API;
 * Здесь должны быть реальные методы, которые делают HTTP-запросы
 */
export const apiClient = {
  listChannels: async (): Promise<any[]> => [],
  listContent: async (params: { channelId: string }): Promise<any[]> => [],
  addChannel: async (data: any): Promise<any> => ({}),
  deleteContent: async (data: { id: string }): Promise<any> => ({}),
  updateContent: async (data: any): Promise<any> => ({}),
  generateContent: async (data: any): Promise<{ taskId: string }> => ({ taskId: 'stub' }),
  getGeneratedContent: async (data: { taskId: string }): Promise<{ status: string; content?: any }> => ({ status: 'COMPLETED' }),
};

/**
 * Вывод типа RPC-метода
 */
export type inferRPCOutputType<Key extends keyof typeof apiClient> =
  typeof apiClient[Key] extends (...args: any[]) => Promise<infer U> ? U : never;

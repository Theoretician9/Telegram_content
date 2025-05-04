// src/client/api.ts
import type { inferRPCOutputType } from "./types"; // если вам нужны типы

async function callRPC<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`RPC ${path} failed: ${await res.text()}`);
  return await res.json();
}

export const apiClient = {
  listChannels: (): Promise<inferRPCOutputType<"listChannels">> =>
    callRPC("listChannels"),

  getChannel: (input: { id: string }): Promise<inferRPCOutputType<"getChannel">> =>
    callRPC("getChannel", input),

  addChannel: (
    data: { name: string; telegramId: string; accessToken: string },
  ): Promise<inferRPCOutputType<"addChannel">> =>
    callRPC("addChannel", data),

  deleteChannel: (input: { id: string }): Promise<inferRPCOutputType<"deleteChannel">> =>
    callRPC("deleteChannel", input),

  updateChannelTheme: (
    data: { channelId: string; theme: string },
  ): Promise<inferRPCOutputType<"updateChannelTheme">> =>
    callRPC("updateChannelTheme", data),

  getChannelSettings: (
    data: { channelId: string },
  ): Promise<inferRPCOutputType<"getChannelSettings">> =>
    callRPC("getChannelSettings", data),

  updateAnalysisSettings: (
    data: {
      channelId: string;
      minSubscribers?: number;
      minAverageViews?: number;
      numChannelsToAnalyze?: number;
      specificChannels?: string[];
    },
  ): Promise<inferRPCOutputType<"updateAnalysisSettings">> =>
    callRPC("updateAnalysisSettings", data),

  analyzeCompetitiveChannels: (
    data: { channelId: string },
  ): Promise<inferRPCOutputType<"analyzeCompetitiveChannels">> =>
    callRPC("analyzeCompetitiveChannels", data),

  getAnalysisStatus: (
    data: { taskId: string },
  ): Promise<inferRPCOutputType<"getAnalysisStatus">> =>
    callRPC("getAnalysisStatus", data),

  listContent: (
    data: { channelId: string },
  ): Promise<inferRPCOutputType<"listContent">> =>
    callRPC("listContent", data),

  getContent: (data: { id: string }): Promise<inferRPCOutputType<"getContent">> =>
    callRPC("getContent", data),

  createContent: (
    data: {
      channelId: string;
      title: string;
      text: string;
      imageUrl?: string;
      scheduledAt?: Date;
    },
  ): Promise<inferRPCOutputType<"createContent">> =>
    callRPC("createContent", data),

  updateContent: (
    data: {
      id: string;
      title?: string;
      text?: string;
      imageUrl?: string;
      status?: string;
      scheduledAt?: Date | null;
    },
  ): Promise<inferRPCOutputType<"updateContent">> =>
    callRPC("updateContent", data),

  deleteContent: (
    data: { id: string },
  ): Promise<inferRPCOutputType<"deleteContent">> =>
    callRPC("deleteContent", data),

  generateContent: (
    data: { channelId: string; topic?: string },
  ): Promise<inferRPCOutputType<"generateContent">> =>
    callRPC("generateContent", data),

  getGeneratedContent: (
    data: { taskId: string },
  ): Promise<inferRPCOutputType<"getGeneratedContent">> =>
    callRPC("getGeneratedContent", data),

  publishContentNow: (
    data: { channelId: string },
  ): Promise<inferRPCOutputType<"publishContentNow">> =>
    callRPC("publishContentNow", data),

  startAutomaticContentGeneration: (
    data: { channelId: string },
  ): Promise<inferRPCOutputType<"startAutomaticContentGeneration">> =>
    callRPC("startAutomaticContentGeneration", data),
};

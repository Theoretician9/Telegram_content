import path from 'path';
import express from 'express';
import { db } from "./server/db";
import {
  getAuth,
  requestMultimodalModel,
  queueTask,
  getTaskStatus,
} from "./server/actions";
import { z } from "zod";

// Channel Management
export async function getChannel(input: { id: string }) {
  const { userId } = await getAuth({ required: true });
  const channel = await db.channel.findUnique({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!channel) {
    throw new Error("Channel not found");
  }

  return channel;
}

// Channel Management
export async function listChannels() {
  const { userId } = await getAuth({ required: true });
  return await db.channel.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addChannel(input: {
  name: string;
  telegramId: string;
  accessToken: string;
}) {
  const { userId } = await getAuth({ required: true });
  return await db.channel.create({
    data: {
      ...input,
      userId,
    },
  });
}

export async function deleteChannel(input: { id: string }) {
  const { userId } = await getAuth({ required: true });
  return await db.channel.delete({
    where: {
      id: input.id,
      userId,
    },
  });
}

// Channel Theme and Analysis Settings
export async function updateChannelTheme(input: {
  channelId: string;
  theme: string;
}) {
  const { userId } = await getAuth({ required: true });
  console.log(`Updating theme for channel ${input.channelId} to "${input.theme}"`);
  
  const channel = await db.channel.findUnique({
    where: {
      id: input.channelId,
      userId,
    },
  });

  if (!channel) {
    console.error(`Channel not found: ${input.channelId}`);
    throw new Error("Канал не найден");
  }

  // Ensure theme is not empty
  if (!input.theme.trim()) {
    console.error(`Empty theme provided for channel ${input.channelId}`);
    throw new Error("Тема канала не может быть пустой");
  }

  const updatedChannel = await db.channel.update({
    where: { id: input.channelId },
    data: { theme: input.theme.trim() },
  });
  
  console.log(`Theme updated successfully for channel ${input.channelId}: "${updatedChannel.theme}"`);
  return updatedChannel;
}

export async function getChannelSettings(input: { channelId: string }) {
  const { userId } = await getAuth({ required: true });
  const channel = await db.channel.findUnique({
    where: {
      id: input.channelId,
      userId,
    },
    include: {
      analysisSettings: true,
      channelAnalysis: true,
    },
  });

  if (!channel) {
    throw new Error("Канал не найден");
  }

  return {
    channel,
    analysisSettings: channel.analysisSettings,
    channelAnalysis: channel.channelAnalysis,
  };
}

export async function updateAnalysisSettings(input: {
  channelId: string;
  minSubscribers?: number;
  minAverageViews?: number;
  numChannelsToAnalyze?: number;
  specificChannels?: string[];
}) {
  const { userId } = await getAuth({ required: true });
  const channel = await db.channel.findUnique({
    where: {
      id: input.channelId,
      userId,
    },
    include: { analysisSettings: true },
  });

  if (!channel) {
    throw new Error("Канал не найден");
  }

  const { channelId, ...settingsData } = input;
  const specificChannelsJson = settingsData.specificChannels
    ? JSON.stringify(settingsData.specificChannels)
    : undefined;

  if (channel.analysisSettings) {
    // Update existing settings
    return await db.analysisSettings.update({
      where: { channelId },
      data: {
        ...(settingsData.minSubscribers !== undefined
          ? { minSubscribers: settingsData.minSubscribers }
          : {}),
        ...(settingsData.minAverageViews !== undefined
          ? { minAverageViews: settingsData.minAverageViews }
          : {}),
        ...(settingsData.numChannelsToAnalyze !== undefined
          ? {
              numChannelsToAnalyze: Math.min(
                settingsData.numChannelsToAnalyze,
                10,
              ),
            }
          : {}),
        ...(specificChannelsJson !== undefined
          ? { specificChannels: specificChannelsJson }
          : {}),
      },
    });
  } else {
    // Create new settings
    return await db.analysisSettings.create({
      data: {
        channelId,
        ...(settingsData.minSubscribers !== undefined
          ? { minSubscribers: settingsData.minSubscribers }
          : {}),
        ...(settingsData.minAverageViews !== undefined
          ? { minAverageViews: settingsData.minAverageViews }
          : {}),
        ...(settingsData.numChannelsToAnalyze !== undefined
          ? {
              numChannelsToAnalyze: Math.min(
                settingsData.numChannelsToAnalyze,
                10,
              ),
            }
          : {}),
        ...(specificChannelsJson !== undefined
          ? { specificChannels: specificChannelsJson }
          : {}),
      },
    });
  }
}

// Channel Analysis
export async function analyzeCompetitiveChannels(input: { channelId: string }) {
  const { userId } = await getAuth({ required: true });
  const channel = await db.channel.findUnique({
    where: {
      id: input.channelId,
      userId,
    },
    include: { analysisSettings: true },
  });

  if (!channel) {
    throw new Error("Канал не найден");
  }

  if (!channel.theme) {
    throw new Error("Необходимо установить тему канала перед анализом");
  }

  // Store the channelId to use in the task
  const channelIdForTask = input.channelId;
  const channelTheme = channel.theme;
  const settings = channel.analysisSettings || {
    minSubscribers: 50000,
    minAverageViews: 4000,
    numChannelsToAnalyze: 3,
    specificChannels: null,
  };

  const task = await queueTask(async (): Promise<void> => {
    try {
      console.log(
        `Starting competitive channel analysis for channel: ${channel.name} with theme: ${channelTheme}`,
      );

      // Parse specificChannels if available
      const specificChannels = settings.specificChannels
        ? (JSON.parse(settings.specificChannels as string) as string[])
        : [];

      // Mock analysis result for now
      // In a real implementation, this would involve scraping tgstat.com and analyzing channels
      // Replace ${theme} with actual channel theme in prompts
      const themePlaceholder = "${theme}";
      const promptsWithTheme = [
        "Создайте пост о последних трендах в ${theme} с акцентом на визуальный контент",
        "Опишите 5 главных инноваций в сфере ${theme} с соответствующими изображениями",
        "Сравните различные подходы к ${theme} с наглядными примерами",
        "Поделитесь историей успеха в ${theme} с вдохновляющими визуалами",
        "Создайте обучающий пост по ${theme} с пошаговыми иллюстрациями",
        "Обсудите будущее ${theme} с концептуальными изображениями",
        "Проанализируйте влияние ${theme} на современное общество с графиками",
        "Составьте список ТОП-10 ресурсов по ${theme} с превью каждого ресурса",
        "Поделитесь интересными фактами о ${theme} с соответствующими изображениями",
        "Создайте опрос по теме ${theme} с визуализацией возможных ответов",
      ].map((prompt) =>
        prompt.replace(themePlaceholder, channelTheme || "вашей теме"),
      );

      // Fix the style prompt string with proper formatting
      const stylePrompt = `Стиль постов должен быть информативным, но доступным. Используйте профессиональную лексику по теме ${channelTheme || ""}, но объясняйте сложные концепции простыми словами. Каждый пост должен содержать эмодзи для разделения абзацев и выделения ключевых моментов. Изображения должны быть высокого качества, преимущественно в синих и белых тонах, с минималистичным дизайном. Текст должен быть структурирован с использованием маркированных списков и подзаголовков для лучшей читаемости.`;

      const mockAnalysisResult = {
        postPrompts: JSON.stringify(promptsWithTheme),
        stylePrompt: stylePrompt,
        postingFrequency: 2, // posts per day
        postingTimes: JSON.stringify([10, 18]), // 10:00 and 18:00
      };

      console.log(
        "Analysis data prepared - prompts count:",
        promptsWithTheme.length,
      );
      console.log(
        "Analysis data prepared - style prompt length:",
        stylePrompt.length,
      );
      console.log("Analysis data prepared - posting times:", [10, 18]);

      // Create or update channel analysis
      const analysis = await db.channelAnalysis.upsert({
        where: { channelId: channelIdForTask },
        update: mockAnalysisResult,
        create: {
          ...mockAnalysisResult,
          channelId: channelIdForTask,
        },
      });

      console.log(`Analysis completed and saved with ID: ${analysis.id}`);
    } catch (error) {
      console.error("Error in competitive channel analysis task:", error);
      throw error; // Re-throw to mark the task as failed
    }
  });

  console.log(`Analysis task queued with ID: ${task.id}`);
  return { taskId: task.id };
}

export async function getAnalysisStatus(input: { taskId: string }) {
  try {
    const { userId } = await getAuth({ required: true });
    console.log(`Checking analysis task status for taskId: ${input.taskId}`);

    // First check the task status
    const taskStatus = await getTaskStatus(input.taskId);
    console.log(`Task status for ${input.taskId}: ${taskStatus.status}`);

    if (taskStatus.status === "RUNNING") {
      return { status: "PENDING" as const, analysis: null };
    }

    if (taskStatus.status === "FAILED") {
      const errorMessage = taskStatus.error?.message || "Неизвестная ошибка";
      console.error(`Task failed: ${errorMessage}`);
      throw new Error(`Анализ не удался: ${errorMessage}`);
    }

    // If the task is completed, find the latest channel analysis for this user
    const channels = await db.channel.findMany({
      where: { userId },
      include: { channelAnalysis: true },
    });

    const channelWithAnalysis = channels.find(
      (c) => c.channelAnalysis !== null,
    );

    if (!channelWithAnalysis || !channelWithAnalysis.channelAnalysis) {
      return { status: "PENDING" as const, analysis: null };
    }

    // Ensure postPrompts and postingTimes are valid JSON
    try {
      const analysis = channelWithAnalysis.channelAnalysis;
      // Validate JSON strings by parsing them
      const postPrompts = JSON.parse(analysis.postPrompts);
      const postingTimes = JSON.parse(analysis.postingTimes);

      // If we got here, parsing was successful
      return {
        status: "COMPLETED" as const,
        analysis: analysis,
      };
    } catch (error) {
      console.error("Error parsing analysis JSON data:", error);
      return { status: "PENDING" as const, analysis: null };
    }
  } catch (error) {
    console.error("Error in getAnalysisStatus:", error);
    if (error instanceof Error) {
      throw new Error(`Ошибка при получении статуса анализа: ${error.message}`);
    } else {
      throw new Error(
        "Произошла непредвиденная ошибка при получении статуса анализа. Пожалуйста, попробуйте позже.",
      );
    }
  }
}

// Function to actually send content to Telegram
async function sendToTelegram(channel: any, content: any) {
  try {
    console.log(`Sending content to Telegram channel: ${channel.telegramId}`);

    // Log detailed channel and content information for debugging
    console.log('Channel details:', {
      id: channel.id,
      name: channel.name,
      telegramId: channel.telegramId,
      // Don't log the full access token for security
      accessTokenLength: channel.accessToken ? channel.accessToken.length : 0
    });
    console.log('Content details:', {
      id: content.id,
      title: content.title,
      textLength: content.text ? content.text.length : 0,
      imageUrl: content.imageUrl ? 'Present' : 'Missing',
      status: content.status
    });

    // Prepare the message text with title and content
    // Changed from **title** to *title* to match Telegram's Markdown format
    const title = content.title.trim();
    const text = content.text.trim();
    
    // Telegram caption limit is 1024 characters
    const TELEGRAM_CAPTION_LIMIT = 1024;
    let messageText = `*${title}*\n\n${text}`;
    
    // Check if the message exceeds Telegram's caption limit
    if (messageText.length > TELEGRAM_CAPTION_LIMIT) {
      console.log(`Caption exceeds Telegram's limit of ${TELEGRAM_CAPTION_LIMIT} characters (current: ${messageText.length})`);
      
      // Calculate how much text we can keep after the title and spacing
      const titlePart = `*${title}*\n\n`;
      const remainingChars = TELEGRAM_CAPTION_LIMIT - titlePart.length - 3; // -3 for the ellipsis
      
      // Truncate the text content, preserving the title
      const truncatedText = text.substring(0, remainingChars);
      messageText = `${titlePart}${truncatedText}...`;
      
      console.log(`Caption truncated to ${messageText.length} characters`);
    }
    
    console.log(`Message text (first 100 chars): ${messageText.substring(0, 100)}...`);

    // Create the Telegram API URL for sending message
    const telegramApiUrl = `https://api.telegram.org/bot${channel.accessToken}/sendPhoto`;

    console.log(`Preparing Telegram API request with chat_id: ${channel.telegramId}, content title: ${title}`);

    // Check if the telegramId starts with @ (public username)
    if (channel.telegramId.startsWith('@')) {
      console.log('Using public username format for chat_id');
    } else {
      console.log('Using numeric ID format for chat_id');
    }

    // Create form data for the request
    const formData = {
      chat_id: channel.telegramId,
      photo: content.imageUrl,
      caption: messageText,
      parse_mode: "Markdown",
    };

    console.log(`Sending request to Telegram API: ${telegramApiUrl}`);
    console.log('Request payload - chat_id:', formData.chat_id);
    console.log('Request payload - parse_mode:', formData.parse_mode);
    console.log('Request payload - photo URL length:', formData.photo ? formData.photo.length : 0);
    console.log('Request payload - caption length:', formData.caption ? formData.caption.length : 0);

    try {
      // Send the request to Telegram API
      console.log('Executing fetch request to Telegram API...');
      const response = await fetch(telegramApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(`Fetch completed with status: ${response.status}`);

      const responseText = await response.text();
      console.log(`Telegram API raw response: ${responseText}`);
      
      if (!response.ok) {
        console.error(`Telegram API error: Status ${response.status}, Response: ${responseText}`);
        
        // Check for specific error types
        if (responseText.includes("caption") && responseText.includes("too long")) {
          // Try sending without a caption as a fallback
          console.log("Attempting to send without caption as fallback");
          return await sendTelegramWithoutCaption(channel, content);
        }
        
        // Check for chat not found error
        if (responseText.includes("chat not found")) {
          console.error("Chat not found error - Telegram channel ID may be incorrect or the bot may not be added to the channel");
          throw new Error(
            `Telegram channel not found. Please make sure the channel ID is correct and the bot has been added to the channel.`,
          );
        }
        
        // Check for unauthorized error
        if (responseText.includes("unauthorized")) {
          console.error("Unauthorized error - Bot token may be invalid");
          throw new Error(
            `Bot token appears to be invalid. Please check your Telegram bot token and try again.`,
          );
        }
        
        // Check for bad request errors
        if (responseText.includes("Bad Request")) {
          console.error("Bad Request error - The request was improperly formatted");
          // Try an alternative approach with just text
          console.log("Attempting to send text-only message as fallback");
          return await sendTelegramTextOnly(channel, content);
        }
        
        throw new Error(
          `Telegram API error: Status ${response.status}, Response: ${responseText}`,
        );
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log("Telegram API parsed response:", responseData);
      } catch (jsonError) {
        console.error("Failed to parse Telegram API response:", jsonError);
        throw new Error(`Failed to parse Telegram API response: ${responseText}`);
      }

      return responseData;
    } catch (fetchError) {
      console.error("Fetch operation failed:", fetchError);
      console.log("Attempting to send text-only message as fallback due to fetch error");
      return await sendTelegramTextOnly(channel, content);
    }
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    throw error;
  }
}

// Fallback function to send content without a caption
async function sendTelegramWithoutCaption(channel: any, content: any) {
  try {
    console.log(`Sending content to Telegram channel without caption: ${channel.telegramId}`);
    
    // Create the Telegram API URL for sending message
    const telegramApiUrl = `https://api.telegram.org/bot${channel.accessToken}/sendPhoto`;
    
    // Create form data for the request - without caption
    const formData = {
      chat_id: channel.telegramId,
      photo: content.imageUrl,
      // No caption this time
    };
    
    console.log('Sending request without caption as fallback');
    
    // Try alternative method - first check if bot has access to the channel
    console.log('First checking if bot has access to the channel...');
    const checkUrl = `https://api.telegram.org/bot${channel.accessToken}/getChat`;
    const checkFormData = {
      chat_id: channel.telegramId
    };
    
    try {
      const checkResponse = await fetch(checkUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkFormData),
      });
      
      const checkResponseText = await checkResponse.text();
      console.log(`Telegram getChat API response: ${checkResponseText}`);
      
      // If we can't access the chat, provide a more helpful error
      if (!checkResponse.ok) {
        if (checkResponseText.includes("chat not found")) {
          console.error("Bot does not have access to the specified channel or chat ID is incorrect");
          throw new Error(
            `Bot does not have access to the channel. Please make sure the bot has been added to the channel as an administrator and the channel ID (${channel.telegramId}) is correct.`
          );
        }
      }
    } catch (checkError) {
      console.error("Error checking bot access to channel:", checkError);
      // Continue with the photo send attempt anyway
    }
    
    // Send the request to Telegram API
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    
    const responseText = await response.text();
    console.log(`Telegram API fallback raw response: ${responseText}`);
    
    if (!response.ok) {
      console.error(`Telegram API fallback error: Status ${response.status}, Response: ${responseText}`);
      
      // Try one more fallback with a direct URL to the image instead of a URL reference
      if (responseText.includes("Wrong file identifier") || responseText.includes("Bad Request")) {
        console.log("Attempting final fallback: checking if channel exists and bot has proper permissions");
        
        // Try sending just text as a last resort
        return await sendTelegramTextOnly(channel, content);
      }
      
      throw new Error(`Telegram API fallback error: ${responseText}`);
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error sending to Telegram without caption:", error);
    throw error;
  }
}

// Final fallback function to send only text
async function sendTelegramTextOnly(channel: any, content: any) {
  try {
    console.log(`Sending text-only message to Telegram channel: ${channel.telegramId}`);
    
    // Create the Telegram API URL for sending text message
    const telegramApiUrl = `https://api.telegram.org/bot${channel.accessToken}/sendMessage`;
    
    // Prepare the message text with title and content
    const title = content.title.trim();
    const text = content.text.trim();
    
    // Telegram message limit is 4096 characters
    const TELEGRAM_MESSAGE_LIMIT = 4096;
    let messageText = `*${title}*\n\n${text}`;
    
    // Check if the message exceeds Telegram's limit
    if (messageText.length > TELEGRAM_MESSAGE_LIMIT) {
      console.log(`Message exceeds Telegram's limit of ${TELEGRAM_MESSAGE_LIMIT} characters (current: ${messageText.length})`);
      
      // Calculate how much text we can keep after the title and spacing
      const titlePart = `*${title}*\n\n`;
      const remainingChars = TELEGRAM_MESSAGE_LIMIT - titlePart.length - 3; // -3 for the ellipsis
      
      // Truncate the text content, preserving the title
      const truncatedText = text.substring(0, remainingChars);
      messageText = `${titlePart}${truncatedText}...`;
      
      console.log(`Message truncated to ${messageText.length} characters`);
    }
    
    // Create form data for the request
    const formData = {
      chat_id: channel.telegramId,
      text: messageText,
      parse_mode: "Markdown",
    };
    
    console.log('Sending text-only message as final fallback');
    console.log('Request payload - chat_id:', formData.chat_id);
    console.log('Request payload - parse_mode:', formData.parse_mode);
    console.log('Request payload - text length:', formData.text ? formData.text.length : 0);
    
    // Send the request to Telegram API
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    
    const responseText = await response.text();
    console.log(`Telegram API text-only raw response: ${responseText}`);
    
    if (!response.ok) {
      console.error(`Telegram API text-only error: Status ${response.status}, Response: ${responseText}`);
      
      // If even text-only fails, try with plain text without markdown
      if (responseText.includes("Bad Request") || responseText.includes("can't parse entities")) {
        console.log("Attempting plain text without markdown formatting");
        
        // Try without markdown
        const plainFormData = {
          chat_id: channel.telegramId,
          text: `${title}\n\n${text.substring(0, 4000)}`,
          // No parse_mode
        };
        
        const plainResponse = await fetch(telegramApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(plainFormData),
        });
        
        const plainResponseText = await plainResponse.text();
        console.log(`Telegram API plain text raw response: ${plainResponseText}`);
        
        if (!plainResponse.ok) {
          throw new Error(`Failed to send even plain text message: ${plainResponseText}`);
        }
        
        return JSON.parse(plainResponseText);
      }
      
      throw new Error(`Telegram API text-only error: ${responseText}`);
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error sending text-only message to Telegram:", error);
    throw error;
  }
}

// Immediate Content Publication
export async function publishContentNow(input: { channelId: string }) {
  const { userId } = await getAuth({ required: true });
  const channel = await db.channel.findUnique({
    where: {
      id: input.channelId,
      userId,
    },
    include: {
      channelAnalysis: true,
    },
  });

  if (!channel) {
    throw new Error("Канал не найден");
  }

  if (!channel.theme) {
    throw new Error("Необходимо установить тему канала");
  }

  if (!channel.channelAnalysis) {
    throw new Error("Необходимо сначала провести анализ конкурентных каналов");
  }

  // Store the channelId to use in the task
  const channelIdForTask = input.channelId;
  const channelTheme = channel.theme;
  const analysis = channel.channelAnalysis;

  const task = await queueTask(async (): Promise<void> => {
    try {
      console.log(
        `Starting immediate content generation for channel: ${channel.name}`,
      );

      // Parse post prompts
      const postPrompts = JSON.parse(analysis.postPrompts) as string[];

      // For immediate publication, generate one post
      const randomPromptIndex = Math.floor(Math.random() * postPrompts.length);
      const promptTemplate =
        postPrompts[randomPromptIndex] || "Создайте пост о ${theme}";
      const prompt = promptTemplate.replace(/\$\{theme\}/g, channelTheme || "");

      console.log(`Generating content with prompt: ${prompt}`);

      // Generate content based on the prompt and style
      const result = await requestMultimodalModel({
        system: `You are an expert content creator for Telegram channels about ${channelTheme}. ${analysis.stylePrompt}`,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        returnType: z.object({
          title: z.string(),
          text: z.string(),
          imagePrompt: z.string(),
        }),
      });

      console.log(`Generated content title: ${result.title}`);

      // Generate image based on the prompt
      console.log(`Generating image with prompt: ${result.imagePrompt}`);
      const imageResult = await requestMultimodalModel({
        system:
          "You are an AI that generates high-quality images based on prompts.",
        messages: [
          {
            role: "user",
            content: `Generate an image for a Telegram post about ${channelTheme} with the following description: ${result.imagePrompt}`,
          },
        ],
        returnType: z.object({
          imageUrl: z.string(),
        }),
      });

      console.log(`Image generated successfully`);

      // Create content with generated text and image, set as PUBLISHED immediately
      console.log(
        `Saving content to database for channel: ${channelIdForTask}`,
      );
      const now = new Date();
      const content = await db.content.create({
        data: {
          title: result.title,
          text: result.text,
          imageUrl: imageResult.imageUrl,
          status: "PUBLISHED",
          publishedAt: now,
          channelId: channelIdForTask,
        },
      });

      console.log(
        `Content published with ID: ${content.id} at ${now.toISOString()}`,
      );

      // Actually send the content to Telegram
      try {
        console.log(`Attempting to send content to Telegram channel ${channel.telegramId}`);
        const telegramResponse = await sendToTelegram(channel, content);
        console.log(
          `Content successfully sent to Telegram channel ${channel.telegramId}`,
          telegramResponse,
        );
      } catch (telegramError) {
        console.error("Failed to send content to Telegram:", telegramError);
        if (telegramError instanceof Error) {
          console.error("Error details:", {
            message: telegramError.message,
            stack: telegramError.stack
          });
        }
        // We don't re-throw here to avoid marking the entire task as failed
        // The content is still created in our database, just not sent to Telegram
      }
    } catch (error) {
      console.error("Error in immediate content publication task:", error);
      throw error; // Re-throw to mark the task as failed
    }
  });

  console.log(`Immediate publication task queued with ID: ${task.id}`);
  return { taskId: task.id };
}

// Auto Content Generation and Publishing
export async function startAutomaticContentGeneration(input: {
  channelId: string;
}) {
  const { userId } = await getAuth({ required: true });
  const channel = await db.channel.findUnique({
    where: {
      id: input.channelId,
      userId,
    },
    include: {
      channelAnalysis: true,
    },
  });

  if (!channel) {
    throw new Error("Канал не найден");
  }

  if (!channel.theme) {
    throw new Error("Необходимо установить тему канала");
  }

  if (!channel.channelAnalysis) {
    throw new Error("Необходимо сначала провести анализ конкурентных каналов");
  }

  // Store the channelId to use in the task
  const channelIdForTask = input.channelId;
  const channelTheme = channel.theme;
  const analysis = channel.channelAnalysis;

  const task = await queueTask(async (): Promise<void> => {
    try {
      console.log(
        `Starting automatic content generation for channel: ${channel.name}`,
      );

      // Parse post prompts and posting times
      const postPrompts = JSON.parse(analysis.postPrompts) as string[];
      const postingTimes = JSON.parse(analysis.postingTimes) as number[];

      // For demonstration, generate one post
      const randomPromptIndex = Math.floor(Math.random() * postPrompts.length);
      const promptTemplate =
        postPrompts[randomPromptIndex] || "Создайте пост о ${theme}";
      const prompt = promptTemplate.replace(/\$\{theme\}/g, channelTheme || "");

      console.log(`Generating content with prompt: ${prompt}`);

      // Generate content based on the prompt and style
      const result = await requestMultimodalModel({
        system: `You are an expert content creator for Telegram channels about ${channelTheme}. ${analysis.stylePrompt}`,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        returnType: z.object({
          title: z.string(),
          text: z.string(),
          imagePrompt: z.string(),
        }),
      });

      console.log(`Generated content title: ${result.title}`);

      // Generate image based on the prompt
      console.log(`Generating image with prompt: ${result.imagePrompt}`);
      const imageResult = await requestMultimodalModel({
        system:
          "You are an AI that generates high-quality images based on prompts.",
        messages: [
          {
            role: "user",
            content: `Generate an image for a Telegram post about ${channelTheme} with the following description: ${result.imagePrompt}`,
          },
        ],
        returnType: z.object({
          imageUrl: z.string(),
        }),
      });

      console.log(`Image generated successfully`);

      // Calculate scheduled time based on posting frequency and times
      const now = new Date();
      const currentHour = now.getHours();

      // Find the next posting time
      let scheduledHour = postingTimes[0] || 12; // Default to noon if no posting times
      for (const hour of postingTimes) {
        if (hour > currentHour) {
          scheduledHour = hour;
          break;
        }
      }

      const scheduledAt = new Date(now);
      scheduledAt.setHours(scheduledHour, 0, 0, 0);

      // If the scheduled time is earlier than current time, move to next day
      if (scheduledAt <= now) {
        scheduledAt.setDate(scheduledAt.getDate() + 1);
      }

      // Create content with generated text and image
      console.log(
        `Saving content to database for channel: ${channelIdForTask}`,
      );
      const content = await db.content.create({
        data: {
          title: result.title,
          text: result.text,
          imageUrl: imageResult.imageUrl,
          status: "SCHEDULED",
          scheduledAt,
          channelId: channelIdForTask,
        },
      });

      console.log(
        `Content scheduled with ID: ${content.id} for ${scheduledAt.toISOString()}`,
      );

      // If the scheduled time is very close (within 2 minutes), publish it immediately
      const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);
      if (scheduledAt <= twoMinutesFromNow) {
        console.log(
          `Scheduled time is very close, publishing to Telegram immediately`,
        );
        try {
          // Update the content status to PUBLISHED
          await db.content.update({
            where: { id: content.id },
            data: {
              status: "PUBLISHED",
              publishedAt: new Date(),
            },
          });

          // Send to Telegram
          await sendToTelegram(channel, content);
          console.log(
            `Content immediately published to Telegram channel: ${channel.telegramId}`,
          );
        } catch (telegramError) {
          console.error(
            "Failed to immediately publish to Telegram:",
            telegramError,
          );
          // We continue execution even if Telegram publishing fails
        }
      } else {
        console.log(
          `Content will be published at scheduled time: ${scheduledAt.toISOString()}`,
        );
      }
    } catch (error) {
      console.error("Error in automatic content generation task:", error);
      throw error; // Re-throw to mark the task as failed
    }
  });

  console.log(`Automatic content generation task queued with ID: ${task.id}`);
  return { taskId: task.id };
}

// Cron job to publish scheduled content
export async function _publishScheduledContent() {
  console.log("Running scheduled content publishing job");

  try {
    // Find all scheduled content that is due to be published
    const now = new Date();
    const scheduledContent = await db.content.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: now, // Less than or equal to current time
        },
      },
      include: {
        channel: true,
      },
    });

    console.log(
      `Found ${scheduledContent.length} scheduled posts ready to publish`,
    );

    // Process each scheduled content item
    for (const content of scheduledContent) {
      try {
        console.log(
          `Publishing content ID: ${content.id} for channel: ${content.channel.name}`,
        );

        // Update content status to PUBLISHED
        await db.content.update({
          where: { id: content.id },
          data: {
            status: "PUBLISHED",
            publishedAt: now,
          },
        });

        // Send to Telegram
        await sendToTelegram(content.channel, content);
        console.log(
          `Successfully published content ID: ${content.id} to Telegram channel: ${content.channel.telegramId}`,
        );
      } catch (error) {
        console.error(`Error publishing content ID: ${content.id}:`, error);
        // Continue processing other content items even if one fails
      }
    }

    return { published: scheduledContent.length };
  } catch (error) {
    console.error("Error in _publishScheduledContent:", error);
    throw error;
  }
}

// Content Management
export async function listContent(input: { channelId: string }) {
  const { userId } = await getAuth({ required: true });
  const channel = await db.channel.findUnique({
    where: {
      id: input.channelId,
      userId,
    },
  });

  if (!channel) {
    throw new Error("Channel not found");
  }

  return await db.content.findMany({
    where: { channelId: input.channelId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getContent(input: { id: string }) {
  const { userId } = await getAuth({ required: true });
  const content = await db.content.findUnique({
    where: { id: input.id },
    include: { channel: true },
  });

  if (!content || content.channel.userId !== userId) {
    throw new Error("Content not found");
  }

  return content;
}

export async function createContent(input: {
  channelId: string;
  title: string;
  text: string;
  imageUrl?: string;
  scheduledAt?: Date;
}) {
  const { userId } = await getAuth({ required: true });
  const channel = await db.channel.findUnique({
    where: {
      id: input.channelId,
      userId,
    },
  });

  if (!channel) {
    throw new Error("Channel not found");
  }

  const status = input.scheduledAt ? "SCHEDULED" : "DRAFT";

  return await db.content.create({
    data: {
      title: input.title,
      text: input.text,
      imageUrl: input.imageUrl,
      status,
      scheduledAt: input.scheduledAt,
      channelId: input.channelId,
    },
  });
}

export async function updateContent(input: {
  id: string;
  title?: string;
  text?: string;
  imageUrl?: string;
  status?: string;
  scheduledAt?: Date | null;
}) {
  const { userId } = await getAuth({ required: true });
  const content = await db.content.findUnique({
    where: { id: input.id },
    include: { channel: true },
  });

  if (!content || content.channel.userId !== userId) {
    throw new Error("Content not found");
  }

  const { id, ...updateData } = input;

  // Check if status is being changed to PUBLISHED
  const isPublishing =
    updateData.status === "PUBLISHED" && content.status !== "PUBLISHED";

  // Update the content in the database
  const updatedContent = await db.content.update({
    where: { id },
    data: {
      ...updateData,
      // Set publishedAt if we're publishing and it's not already set
      ...(isPublishing && !content.publishedAt
        ? { publishedAt: new Date() }
        : {}),
    },
  });

  // If the content is being published, send it to Telegram
  if (isPublishing) {
    try {
      const channel = content.channel;
      console.log(
        `Content status changed to PUBLISHED, sending to Telegram channel: ${channel.telegramId}`,
      );
      await sendToTelegram(channel, updatedContent);
      console.log(
        `Successfully sent content to Telegram channel: ${channel.telegramId}`,
      );
    } catch (error) {
      console.error(
        "Failed to send content to Telegram after status update:",
        error,
      );
      // We don't throw here to avoid disrupting the update operation
      // The content is still marked as published in our database
    }
  }

  return updatedContent;
}

export async function deleteContent(input: { id: string }) {
  const { userId } = await getAuth({ required: true });
  const content = await db.content.findUnique({
    where: { id: input.id },
    include: { channel: true },
  });

  if (!content || content.channel.userId !== userId) {
    throw new Error("Content not found");
  }

  return await db.content.delete({
    where: { id: input.id },
  });
}

// AI Content Generation
export async function generateContent(input: {
  channelId: string;
  topic?: string;
}) {
  try {
    const { userId } = await getAuth({ required: true });

    console.log(
      `Attempting to find channel with ID: ${input.channelId} for user: ${userId}`,
    );

    const channel = await db.channel.findUnique({
      where: {
        id: input.channelId,
        userId,
      },
    });

    if (!channel) {
      console.error(
        `Channel not found: ${input.channelId} for user: ${userId}`,
      );
      throw new Error(
        "Канал не найден. Пожалуйста, проверьте подключение канала.",
      );
    }

    console.log(`Channel found: ${channel.name} (${channel.id})`);

    // Store the channel ID to use in the task
    const channelIdForTask = input.channelId;
    const channelName = channel.name;

    const task = await queueTask(async (): Promise<void> => {
      try {
        console.log(`Starting content generation for channel: ${channelName}`);

        const topicPrompt = input.topic
          ? `about ${input.topic}`
          : "on a trending and engaging topic";

        const result = await requestMultimodalModel({
          system:
            "You are an expert content creator for Telegram channels. You create engaging, informative content that drives user engagement.",
          messages: [
            {
              role: "user",
              content: `Generate a Telegram post ${topicPrompt} for a channel named "${channelName}". Include a title, engaging text (with emojis where appropriate), and a prompt for an image that would complement the post.`,
            },
          ],
          returnType: z.object({
            title: z.string(),
            text: z.string(),
            imagePrompt: z.string(),
          }),
        });

        console.log(`Generated content title: ${result.title}`);

        // Generate image based on the prompt
        console.log(`Generating image with prompt: ${result.imagePrompt}`);
        const imageResult = await requestMultimodalModel({
          system:
            "You are an AI that generates high-quality images based on prompts.",
          messages: [
            {
              role: "user",
              content: `Generate an image for a Telegram post with the following description: ${result.imagePrompt}`,
            },
          ],
          returnType: z.object({
            imageUrl: z.string(),
          }),
        });

        console.log(`Image generated successfully`);

        // Create content with generated text and image
        console.log(
          `Saving content to database for channel: ${channelIdForTask}`,
        );
        const content = await db.content.create({
          data: {
            title: result.title,
            text: result.text,
            imageUrl: imageResult.imageUrl,
            status: "DRAFT",
            channelId: channelIdForTask,
          },
        });

        console.log(`Content saved with ID: ${content.id}`);
      } catch (error) {
        console.error("Error in content generation task:", error);
        throw error; // Re-throw to mark the task as failed
      }
    });

    console.log(`Task queued with ID: ${task.id}`);
    return { taskId: task.id };
  } catch (error) {
    console.error("Error in generateContent:", error);
    if (error instanceof Error) {
      throw new Error(`Ошибка при создании контента: ${error.message}`);
    } else {
      throw new Error(
        "Произошла непредвиденная ошибка при создании контента. Пожалуйста, попробуйте позже.",
      );
    }
  }
}

export async function getGeneratedContent(input: { taskId: string }) {
  try {
    const { userId } = await getAuth({ required: true });
    console.log(`Checking task status for taskId: ${input.taskId}`);
// ========== Server bootstrap ==========
const app = ();
app.use(express.json());

// health‐check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ваша реализация RPC‐маршрутов
// (пример)
app.post('/api/getChannel', async (req, res) => {
  try {
    const result = await getChannel(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
// … добавьте здесь остальные app.post для listChannels, addChannel, deleteChannel, updateChannelTheme и т.д.

// отдаём статические файлы клиентской сборки
app.use(
  express.static(path.join(__dirname, 'dist', 'client'))
);

// SPA‐fallback: для всех прочих маршрутов возвращаем index.html
app.get('*', (_req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist', 'client', 'index.html')
  );
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
// =======================================
    
    // First check the task status
    const taskStatus = await getTaskStatus(input.taskId);
    console.log(`Task status for ${input.taskId}: ${taskStatus.status}`);

    if (taskStatus.status === "RUNNING") {
      return { status: "PENDING" as const, content: null };
    }

    if (taskStatus.status === "FAILED") {
      const errorMessage = taskStatus.error?.message || "Неизвестная ошибка";
      console.error(`Task failed: ${errorMessage}`);
      throw new Error(`Генерация контента не удалась: ${errorMessage}`);
    }

    // If the task is completed or in an unknown state, try to find the content
    console.log(`Looking for most recent content for user: ${userId}`);
    const content = await db.content.findFirst({
      where: {
        channel: {
          userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        channel: true,
      },
    });

    if (!content) {
      console.log(`No content found for user: ${userId}`);
      return { status: "PENDING" as const, content: null };
    }

    console.log(`Found content with ID: ${content.id}`);
    return { status: "COMPLETED" as const, content };
  } catch (error) {
    console.error("Error in getGeneratedContent:", error);
    if (error instanceof Error) {
      throw new Error(
        `Ошибка при получении сгенерированного контента: ${error.message}`,
      );
    } else {
      throw new Error(
        "Произошла непредвиденная ошибка при получении контента. Пожалуйста, попробуйте позже.",
      );
    }
  }
}
// health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})
app.use(express.json());
app.get('/', (_req, res) => {
  res.status(200).send('OK');
});
// Привяжем ваши экспортированные хэндлеры к HTTP­-эндпоинтам.
// Здесь нужно подставить именно ваши имена функций и пути:

app.post('/api/getChannel', async (req, res) => {
  try {
    const result = await getChannel(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/listChannels', async (_req, res) => {
  try {
    const result = await listChannels();
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// И так далее для всех ваших RPC‐функций:
// addChannel, deleteChannel, updateChannelTheme, getChannelSettings, updateAnalysisSettings, analyzeCompetitiveChannels, getAnalysisStatus, publishImmediately и т.п.

// И наконец — запуск сервера:
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`🚀 Server is listening on http://localhost:${port}`);
});
// 1) Отдаём статику из dist/client:
app.use(express.static(path.join(__dirname, 'dist', 'client')));

// 2) Для SPA: на любой маршрут, не совпадающий с /api/*, возвращаем index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'client', 'index.html'));
});

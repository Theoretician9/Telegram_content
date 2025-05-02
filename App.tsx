import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, inferRPCOutputType } from "~/client/api";
import { useAuth, useToast } from "~/client/utils";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Skeleton,
} from "~/components/ui";
import {
  Calendar,
  Clock,
  Edit,
  Home,
  Image,
  Loader2,
  MessageSquare,
  Plus,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";

// Types
type Channel = inferRPCOutputType<"listChannels">[number];
type Content = inferRPCOutputType<"listContent">[number];

// Components
function Layout({ children }: { children: React.ReactNode }) {
  const auth = useAuth({ required: true });
  const { data: channels = [] } = useQuery(
    ["channels"],
    apiClient.listChannels,
    {
      enabled: auth.status === "authenticated",
    },
  );

  if (auth.status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-card p-4 md:flex">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">TelegramAI</h1>
          <p className="text-sm text-muted-foreground">AI-менеджер каналов</p>
        </div>

        <nav className="space-y-1">
          <Link
            to="/"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="mr-2 h-4 w-4" />
            Панель управления
          </Link>
          <Link
            to="/content"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Контент
          </Link>
        </nav>

        <div className="mt-auto">
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            ВАШИ КАНАЛЫ
          </div>
          {channels.length === 0 ? (
            <p className="text-xs text-muted-foreground">Каналов пока нет</p>
          ) : (
            <div className="space-y-1">
              {channels.map((channel) => (
                <Link
                  key={channel.id}
                  to={`/channel/${channel.id}`}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {channel.name}
                </Link>
              ))}
            </div>
          )}
          <AddChannelDialog />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

function AddChannelDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    telegramId: "",
    accessToken: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addChannelMutation = useMutation(apiClient.addChannel, {
    onSuccess: () => {
      queryClient.invalidateQueries(["channels"]);
      setOpen(false);
      setFormData({ name: "", telegramId: "", accessToken: "" });
      toast({
        title: "Канал добавлен",
        description: "Ваш Telegram канал успешно подключен.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description:
          error instanceof Error ? error.message : "Не удалось добавить канал",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addChannelMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id="add-channel-button"
          variant="default"
          className="mt-2 w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Подключить канал
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подключение Telegram канала</DialogTitle>
          <DialogDescription>
            Введите данные вашего Telegram канала для подключения к TelegramAI.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название канала</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Мой Канал"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telegramId">ID канала</Label>
              <Input
                id="telegramId"
                value={formData.telegramId}
                onChange={(e) =>
                  setFormData({ ...formData, telegramId: e.target.value })
                }
                placeholder="@mychannel или -1001234567890"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accessToken">Токен API бота</Label>
              <Input
                id="accessToken"
                value={formData.accessToken}
                onChange={(e) =>
                  setFormData({ ...formData, accessToken: e.target.value })
                }
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                required
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Вы можете получить его у @BotFather в Telegram
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={addChannelMutation.isLoading}>
              {addChannelMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Подключить канал
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ContentCard({
  content,
  onEdit,
  onDelete,
}: {
  content: Content;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusColors = {
    DRAFT: "bg-secondary text-secondary-foreground",
    SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    PUBLISHED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  const statusColor =
    statusColors[content.status as keyof typeof statusColors] ||
    statusColors.DRAFT;

  // Determine if this is a recently published content (published in the last hour)
  const isRecentlyPublished =
    content.status === "PUBLISHED" &&
    content.publishedAt &&
    new Date().getTime() - new Date(content.publishedAt).getTime() <
      60 * 60 * 1000;

  return (
    <Card className="overflow-hidden">
      {content.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={content.imageUrl}
            alt={content.title}
            className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{content.title}</CardTitle>
          <div className="flex items-center space-x-2">
            {isRecentlyPublished && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Отправлен в Telegram
              </Badge>
            )}
            <Badge className={statusColor}>{content.status}</Badge>
          </div>
        </div>
        <CardDescription className="flex items-center text-xs">
          <Calendar className="mr-1 h-3 w-3" />
          {new Date(content.createdAt).toLocaleDateString()}
          {content.scheduledAt && (
            <>
              <Clock className="ml-2 mr-1 h-3 w-3" />
              {new Date(content.scheduledAt).toLocaleString()}
            </>
          )}
          {content.publishedAt && (
            <>
              <Upload className="ml-2 mr-1 h-3 w-3" />
              {new Date(content.publishedAt).toLocaleString()}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-foreground">{content.text}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

function ContentList({ channelId }: { channelId: string }) {
  const { data: contents = [], isLoading } = useQuery(
    ["contents", channelId],
    () => apiClient.listContent({ channelId }),
    {
      enabled: !!channelId,
    },
  );
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteContentMutation = useMutation(apiClient.deleteContent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["contents", channelId]);
      setIsDeleteDialogOpen(false);
      setContentToDelete(null);
      toast({
        title: "Content deleted",
        description: "The content has been deleted successfully.",
      });
    },
  });

  const handleDelete = (contentId: string) => {
    setContentToDelete(contentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (contentToDelete) {
      deleteContentMutation.mutate({ id: contentToDelete });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 pt-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Пока нет контента</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Начните с создания нового контента для вашего канала
        </p>
        <GenerateContentDialog channelId={channelId} />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Контент канала</h2>
        <GenerateContentDialog channelId={channelId} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onEdit={() => setEditingContent(content)}
            onDelete={() => handleDelete(content.id)}
          />
        ))}
      </div>

      {editingContent && (
        <EditContentDialog
          content={editingContent}
          onClose={() => setEditingContent(null)}
          channelId={channelId}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteContentMutation.isLoading}
            >
              {deleteContentMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditContentDialog({
  content,
  onClose,
  channelId,
}: {
  content: Content;
  onClose: () => void;
  channelId: string;
}) {
  const [formData, setFormData] = useState({
    title: content.title,
    text: content.text,
    status: content.status,
    scheduledAt: content.scheduledAt ? new Date(content.scheduledAt) : null,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateContentMutation = useMutation(apiClient.updateContent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["contents", channelId]);
      onClose();
      toast({
        title: "Content updated",
        description: "Your content has been updated successfully.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContentMutation.mutate({
      id: content.id,
      ...formData,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Make changes to your content. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="text">Content</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                rows={8}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduledAt">Scheduled Date</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={
                    formData.scheduledAt
                      ? new Date(
                          formData.scheduledAt.getTime() -
                            formData.scheduledAt.getTimezoneOffset() * 60000,
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scheduledAt: e.target.value
                        ? new Date(e.target.value)
                        : null,
                    })
                  }
                  disabled={formData.status !== "SCHEDULED"}
                />
              </div>
            </div>
            {content.imageUrl && (
              <div className="grid gap-2">
                <Label>Current Image</Label>
                <div className="h-48 overflow-hidden rounded-md border">
                  <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateContentMutation.isLoading}>
              {updateContentMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateContentButton({ channelId }: { channelId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContentId, setGeneratedContentId] = useState<string | null>(
    null,
  );
  const queryClient = useQueryClient();
  const { toast } = useToast();

  console.log("CreateContentButton rendered with channelId:", channelId);

  // Create content mutation
  const generateContentMutation = useMutation(apiClient.generateContent, {
    onSuccess: (data) => {
      console.log("Content generation started with taskId:", data.taskId);
      setIsGenerating(true);

      // Store taskId in a local variable to ensure it's accessible in the interval
      const contentTaskId = data.taskId;
      console.log(
        `Starting content generation status polling for task ID: ${contentTaskId}`,
      );

      // Poll for the generated content
      const interval = setInterval(() => {
        console.log(
          `Checking content generation status for taskId: ${contentTaskId}`,
        );

        // Use a promise chain instead of an async function inside setInterval
        apiClient
          .getGeneratedContent({ taskId: contentTaskId })
          .then((result) => {
            console.log(
              `Content generation status for task ${contentTaskId}: ${result.status}`,
            );

            if (result.status === "COMPLETED" && result.content) {
              console.log(
                `Content generation completed for task ${contentTaskId}, updating UI`,
              );
              clearInterval(interval);
              setIsGenerating(false);
              setGeneratedContentId(result.content.id);
              queryClient.invalidateQueries(["contents", channelId]);
              toast({
                title: "Контент создан",
                description: "Новый контент был успешно создан.",
              });
            }
          })
          .catch((error) => {
            console.error(
              `Error checking content generation status for task ${contentTaskId}:`,
              error,
            );
            clearInterval(interval);
            setIsGenerating(false);
            toast({
              title: "Ошибка при проверке статуса",
              description:
                error instanceof Error
                  ? error.message
                  : "Не удалось проверить статус генерации контента",
              variant: "destructive",
            });
          });
      }, 2000);

      // Clean up interval after 2 minutes (timeout)
      setTimeout(() => {
        clearInterval(interval);
        if (isGenerating) {
          setIsGenerating(false);
          toast({
            title: "Генерация занимает больше времени, чем ожидалось",
            description:
              "Пожалуйста, проверьте позже свой сгенерированный контент.",
          });
          setDialogOpen(false);
        }
      }, 120000);
    },
    onError: (error) => {
      console.error("Content generation error:", error);
      setIsGenerating(false);
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось сгенерировать контент",
        variant: "destructive",
      });
    },
  });

  // Handle generate button click
  const handleGenerate = () => {
    console.log("Generate button clicked for channelId:", channelId);
    generateContentMutation.mutate({ channelId, topic: topic || undefined });
  };

  // Handle dialog open/close
  const handleOpenChange = (newOpen: boolean) => {
    console.log("Dialog open state changing to:", newOpen);

    // Don't close if generation is in progress
    if (!newOpen && isGenerating) {
      return;
    }

    setDialogOpen(newOpen);

    // Reset state when dialog is closed
    if (!newOpen) {
      setTopic("");
      setGeneratedContentId(null);
    }
  };

  // Open dialog handler
  const openDialog = () => {
    console.log("Opening content generation dialog for channelId:", channelId);
    setDialogOpen(true);
  };

  return (
    <>
      <Button id="generate-content-button" onClick={openDialog}>
        <Plus className="mr-2 h-4 w-4" /> Создать контент
      </Button>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создание AI контента</DialogTitle>
            <DialogDescription>
              Позвольте AI создать привлекательный контент для вашего Telegram
              канала.
            </DialogDescription>
          </DialogHeader>

          {!isGenerating && !generatedContentId ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="topic">Тема (Опционально)</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Оставьте пустым, чтобы AI выбрал тему"
                />
                <p className="text-xs text-muted-foreground">
                  Укажите тему или позвольте AI выбрать популярную тему для вас
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleGenerate}
                  disabled={generateContentMutation.isLoading}
                >
                  {generateContentMutation.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Создать
                </Button>
              </DialogFooter>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <h3 className="mb-2 text-lg font-semibold">
                Создание контента...
              </h3>
              <p className="text-center text-sm text-muted-foreground">
                Наш AI создает интересный контент для вашего канала. Это может
                занять некоторое время.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-300">
                <Image className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Контент создан!</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Ваш новый контент был создан и готов к просмотру.
              </p>
              <Button onClick={() => setDialogOpen(false)}>
                Просмотреть контент
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Use this function as a wrapper for compatibility with existing code
function GenerateContentDialog({ channelId }: { channelId: string }) {
  return <CreateContentButton channelId={channelId} />;
}

// Pages
function DashboardPage() {
  const { data: channels = [], isLoading } = useQuery(
    ["channels"],
    apiClient.listChannels,
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Settings className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Нет подключенных каналов</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Подключите ваш Telegram канал, чтобы начать работу
        </p>
        <Button
          onClick={() => document.getElementById("add-channel-button")?.click()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" /> Подключить канал
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Панель управления</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <CardTitle>{channel.name}</CardTitle>
              <CardDescription>
                Connected on {new Date(channel.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Channel ID: {channel.telegramId}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/channel/${channel.id}`}>Manage Content</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContentPage() {
  const { data: channels = [], isLoading } = useQuery(
    ["channels"],
    apiClient.listChannels,
  );
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  React.useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]?.id || null);
    }
  }, [channels, selectedChannel]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Settings className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Нет подключенных каналов</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Подключите ваш Telegram канал для управления контентом
        </p>
        <Button
          onClick={() => document.getElementById("add-channel-button")?.click()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" /> Подключить канал
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Управление контентом</h1>

      <div className="mb-6">
        <Label htmlFor="channel-select" className="mb-2 block">
          Выберите канал
        </Label>
        <Select
          value={selectedChannel || ""}
          onValueChange={setSelectedChannel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите канал" />
          </SelectTrigger>
          <SelectContent>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedChannel && <ContentList channelId={selectedChannel} />}
    </div>
  );
}

// Channel Theme Input Component
function ChannelThemeInput({
  channelId,
  initialTheme,
}: {
  channelId: string;
  initialTheme?: string | null;
}) {
  const [theme, setTheme] = useState(initialTheme || "");
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateThemeMutation = useMutation(apiClient.updateChannelTheme, {
    onSuccess: (updatedChannel) => {
      // Invalidate both channels and channelSettings queries
      queryClient.invalidateQueries(["channels"]);
      queryClient.invalidateQueries(["channelSettings", channelId]);
      setIsEditing(false);
      toast({
        title: "Тема обновлена",
        description: `Тема канала успешно обновлена на "${updatedChannel.theme}".`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось обновить тему канала",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (theme.trim()) {
      console.log(`Saving theme for channel ${channelId}: "${theme.trim()}"`);
      updateThemeMutation.mutate({ channelId, theme: theme.trim() });
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col space-y-2">
        <Input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Например: Технологии, Финансы, Психология"
        />
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateThemeMutation.isLoading || !theme.trim()}
          >
            {updateThemeMutation.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Сохранить
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTheme(initialTheme || "");
              setIsEditing(false);
            }}
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm">
        {theme ? (
          theme
        ) : (
          <span className="text-muted-foreground">Не установлена</span>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
        {theme ? "Изменить" : "Установить"}
      </Button>
    </div>
  );
}

// Channel Analysis Settings Component
function AnalysisSettingsForm({
  channelId,
  initialSettings,
}: {
  channelId: string;
  initialSettings?: {
    minSubscribers: number;
    minAverageViews: number;
    numChannelsToAnalyze: number;
    specificChannels?: string | null;
  } | null;
}) {
  const defaultSettings = {
    minSubscribers: 50000,
    minAverageViews: 4000,
    numChannelsToAnalyze: 3,
    specificChannels: "",
  };

  const [settings, setSettings] = useState(() => {
    if (!initialSettings) return defaultSettings;

    return {
      minSubscribers: initialSettings.minSubscribers,
      minAverageViews: initialSettings.minAverageViews,
      numChannelsToAnalyze: initialSettings.numChannelsToAnalyze,
      specificChannels: initialSettings.specificChannels
        ? (JSON.parse(initialSettings.specificChannels) as string[]).join(", ")
        : "",
    };
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateSettingsMutation = useMutation(apiClient.updateAnalysisSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries(["channelSettings", channelId]);
      toast({
        title: "Настройки обновлены",
        description: "Настройки анализа успешно обновлены.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось обновить настройки анализа",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse specific channels if provided
    const specificChannelsArray = settings.specificChannels
      ? settings.specificChannels
          .split(",")
          .map((ch) => ch.trim())
          .filter(Boolean)
      : undefined;

    updateSettingsMutation.mutate({
      channelId,
      minSubscribers: Number(settings.minSubscribers),
      minAverageViews: Number(settings.minAverageViews),
      numChannelsToAnalyze: Math.min(Number(settings.numChannelsToAnalyze), 10),
      specificChannels: specificChannelsArray,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="minSubscribers">Мин. количество подписчиков</Label>
          <Input
            id="minSubscribers"
            type="number"
            min="1000"
            value={settings.minSubscribers}
            onChange={(e) =>
              setSettings({
                ...settings,
                minSubscribers: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="minAverageViews">
            Мин. среднее количество просмотров
          </Label>
          <Input
            id="minAverageViews"
            type="number"
            min="100"
            value={settings.minAverageViews}
            onChange={(e) =>
              setSettings({
                ...settings,
                minAverageViews: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="numChannelsToAnalyze">
            Количество каналов для анализа
          </Label>
          <Input
            id="numChannelsToAnalyze"
            type="number"
            min="1"
            max="10"
            value={settings.numChannelsToAnalyze}
            onChange={(e) =>
              setSettings({
                ...settings,
                numChannelsToAnalyze: Number(e.target.value),
              })
            }
          />
          <p className="text-xs text-muted-foreground">Максимум 10 каналов</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="specificChannels">
            Конкретные каналы (опционально)
          </Label>
          <Input
            id="specificChannels"
            placeholder="@channel1, @channel2, ..."
            value={settings.specificChannels}
            onChange={(e) =>
              setSettings({ ...settings, specificChannels: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground">
            Разделите названия каналов запятыми
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={updateSettingsMutation.isLoading}>
          {updateSettingsMutation.isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Сохранить настройки
        </Button>
      </div>
    </form>
  );
}

// Channel Analysis Results Component
function AnalysisResults({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  // Parse data from analysis
  const postPrompts = JSON.parse(analysis.postPrompts) as string[];
  const postingTimes = JSON.parse(analysis.postingTimes) as number[];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold mb-2">Частота публикаций</h4>
          <div className="text-2xl font-bold">
            {analysis.postingFrequency} поста в день
          </div>
          <div className="text-sm text-muted-foreground">
            Оптимальное время:{" "}
            {postingTimes.map((hour) => `${hour}:00`).join(", ")}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Стиль контента</h4>
          <div className="text-sm border rounded-md p-3 bg-muted/50 max-h-[100px] overflow-auto">
            {analysis.stylePrompt}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">
          Универсальные промты для постов
        </h4>
        <div className="border rounded-md divide-y">
          {postPrompts.map((prompt, index) => (
            <div key={index} className="p-3 text-sm">
              {prompt}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          id="publish-now-button"
          onClick={() =>
            document.getElementById("publish-content-now")?.click()
          }
          variant="secondary"
        >
          <Upload className="mr-2 h-4 w-4" />
          Сделать публикацию сейчас
        </Button>
        <Button
          onClick={() =>
            document.getElementById("start-auto-generation")?.click()
          }
        >
          <Upload className="mr-2 h-4 w-4" />
          Запустить автопубликацию
        </Button>
      </div>
    </div>
  );
}

// Channel Analysis Card Component
function ChannelAnalysisCard({ channelId }: { channelId: string }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch channel settings
  const { data: channelSettings, isLoading: isLoadingSettings } = useQuery(
    ["channelSettings", channelId],
    () => apiClient.getChannelSettings({ channelId }),
    {
      enabled: !!channelId,
      // Add refetch interval to ensure we have the latest data
      refetchOnWindowFocus: true,
      staleTime: 5000, // Consider data stale after 5 seconds
    },
  );

  // Log the channel theme whenever channelSettings changes
  useEffect(() => {
    if (channelSettings) {
      console.log(`Current channel theme: "${channelSettings.channel.theme}"`);
    }
  }, [channelSettings]);

  // Analysis mutation
  const analysisMutation = useMutation(apiClient.analyzeCompetitiveChannels, {
    onSuccess: (data) => {
      setIsAnalyzing(true);
      setTaskId(data.taskId);
      toast({
        title: "Анализ запущен",
        description:
          "Анализ конкурентных каналов запущен. Это может занять некоторое время.",
      });

      // Store taskId in a local variable to ensure it's accessible in the interval
      const statusTaskId = data.taskId;
      console.log(`Starting status polling for task ID: ${statusTaskId}`);

      // Poll for analysis status
      const interval = setInterval(() => {
        console.log(`Checking status for task ID: ${statusTaskId}`);

        // Use a regular function for the interval
        apiClient
          .getAnalysisStatus({ taskId: statusTaskId })
          .then((result) => {
            console.log(
              `Analysis status for task ${statusTaskId}: ${result.status}`,
            );
            if (result.status === "COMPLETED") {
              console.log(
                `Analysis completed for task ${statusTaskId}, updating UI`,
              );
              clearInterval(interval);
              setIsAnalyzing(false);
              queryClient.invalidateQueries(["channelSettings", channelId]);
              toast({
                title: "Анализ завершен",
                description: "Анализ конкурентных каналов успешно завершен.",
              });
            }
          })
          .catch((error) => {
            console.error(
              `Error checking analysis status for task ${statusTaskId}:`,
              error,
            );
            clearInterval(interval);
            setIsAnalyzing(false);
            toast({
              title: "Ошибка при проверке статуса",
              description:
                error instanceof Error
                  ? error.message
                  : "Не удалось проверить статус анализа",
              variant: "destructive",
            });
          });
      }, 3000);

      // Timeout after 3 minutes
      setTimeout(() => {
        clearInterval(interval);
        if (isAnalyzing) {
          setIsAnalyzing(false);
          toast({
            title: "Анализ занимает больше времени, чем ожидалось",
            description: "Пожалуйста, проверьте позже результаты анализа.",
          });
        }
      }, 180000);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось запустить анализ",
        variant: "destructive",
      });
    },
  });

  // Auto content generation mutation
  const autoGenerationMutation = useMutation(
    apiClient.startAutomaticContentGeneration,
    {
      onSuccess: (data) => {
        toast({
          title: "Автогенерация запущена",
          description:
            "Автоматическая генерация контента запущена. Контент будет опубликован согласно расписанию.",
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description:
            error instanceof Error
              ? error.message
              : "Не удалось запустить автогенерацию",
          variant: "destructive",
        });
      },
    },
  );

  // Immediate content publication mutation
  const publishNowMutation = useMutation(apiClient.publishContentNow, {
    onSuccess: (data) => {
      toast({
        title: "Публикация запущена",
        description:
          "Генерация и публикация контента запущена. Контент будет опубликован в ближайшее время.",
      });

      // Poll for content creation status by checking for new content
      const checkInterval = setInterval(() => {
        // Instead of checking task status directly, check for new published content
        apiClient
          .listContent({ channelId })
          .then((contents) => {
            // Look for recently published content (in the last 5 minutes)
            const fiveMinutesAgo = new Date();
            fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

            const recentlyPublished = contents.find(
              (content) =>
                content.status === "PUBLISHED" &&
                content.publishedAt &&
                new Date(content.publishedAt) > fiveMinutesAgo,
            );

            if (recentlyPublished) {
              clearInterval(checkInterval);
              queryClient.invalidateQueries(["contents", channelId]);
              toast({
                title: "Контент опубликован",
                description: "Новый контент успешно опубликован.",
              });
            }
          })
          .catch(() => clearInterval(checkInterval));
      }, 3000);

      // Clear interval after 2 minutes if still running
      setTimeout(() => clearInterval(checkInterval), 120000);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось опубликовать контент",
        variant: "destructive",
      });
    },
  });

  const handleStartAnalysis = () => {
    console.log("Starting analysis with channel settings:", channelSettings);

    // Force a refetch of channel settings to ensure we have the latest data
    queryClient.invalidateQueries(["channelSettings", channelId]);

    if (!channelSettings?.channel.theme) {
      console.log("Theme not set, showing error toast");
      toast({
        title: "Необходимо установить тему",
        description:
          "Пожалуйста, установите тему канала перед запуском анализа.",
        variant: "destructive",
      });
      return;
    }

    console.log(
      `Starting analysis with theme: "${channelSettings.channel.theme}"`,
    );
    analysisMutation.mutate({ channelId });
  };

  const handleStartAutoGeneration = () => {
    autoGenerationMutation.mutate({ channelId });
  };

  const handlePublishNow = () => {
    publishNowMutation.mutate({ channelId });
  };

  if (isLoadingSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Анализ конкурентных каналов</CardTitle>
          <CardDescription>Загрузка настроек анализа...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const hasAnalysisResults = !!channelSettings?.channelAnalysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Анализ конкурентных каналов</CardTitle>
        <CardDescription>
          Настройте параметры анализа конкурентных каналов и запустите анализ
          для оптимизации вашего контента.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasAnalysisResults ? (
          <Tabs defaultValue="results">
            <TabsList className="mb-4">
              <TabsTrigger value="results">Результаты анализа</TabsTrigger>
              <TabsTrigger value="settings">Настройки анализа</TabsTrigger>
            </TabsList>
            <TabsContent value="results">
              <AnalysisResults analysis={channelSettings?.channelAnalysis} />
            </TabsContent>
            <TabsContent value="settings">
              <AnalysisSettingsForm
                channelId={channelId}
                initialSettings={channelSettings?.analysisSettings}
              />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || analysisMutation.isLoading}
                >
                  {(isAnalyzing || analysisMutation.isLoading) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Запустить анализ
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <AnalysisSettingsForm
              channelId={channelId}
              initialSettings={channelSettings?.analysisSettings}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing || analysisMutation.isLoading}
              >
                {(isAnalyzing || analysisMutation.isLoading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Запустить анализ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {hasAnalysisResults && (
        <CardFooter className="justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Последний анализ:{" "}
            {channelSettings?.channelAnalysis?.updatedAt
              ? new Date(
                  channelSettings.channelAnalysis.updatedAt,
                ).toLocaleString()
              : ""}
          </div>
          <div className="flex space-x-2">
            <Button
              id="publish-content-now"
              onClick={handlePublishNow}
              disabled={publishNowMutation.isLoading}
              variant="secondary"
            >
              {publishNowMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Сделать публикацию сейчас
            </Button>
            <Button
              id="start-auto-generation"
              onClick={handleStartAutoGeneration}
              disabled={autoGenerationMutation.isLoading}
            >
              {autoGenerationMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Запустить автопубликацию
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

function ChannelPage() {
  const { id } = useParams<{ id: string }>();
  const { data: channels = [], isLoading } = useQuery(
    ["channels"],
    apiClient.listChannels,
  );
  const channel = channels.find((c) => c.id === id);

  if (!channel) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">{channel.name}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Channel ID: {channel.telegramId}
      </p>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <ContentList channelId={channel.id} />
        </TabsContent>
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основные настройки канала</CardTitle>
                <CardDescription>
                  Управление настройками вашего Telegram канала и данными
                  подключения.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Название канала</Label>
                    <Input value={channel.name} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>Telegram ID</Label>
                    <Input value={channel.telegramId} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>API Token</Label>
                    <Input value="••••••••••••••••••••••••••••••" disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="channel-theme">Тема канала</Label>
                    <ChannelThemeInput
                      channelId={channel.id}
                      initialTheme={channel.theme}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <ChannelAnalysisCard channelId={channel.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

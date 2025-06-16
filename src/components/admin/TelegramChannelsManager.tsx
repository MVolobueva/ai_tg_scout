
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TelegramChannel = {
  id?: string;
  channel_title: string;
  channel_username: string;
  channel_description: string | null;
  members_count: number | null;
  languages: string[] | null;
  is_active: boolean | null;
  is_free: boolean | null;
  posting_price: number | null;
  posting_rules: string | null;
  admin_contact: string | null;
  tags: string[] | null;
  work_formats: string[] | null;
  relevance_score: number | null;
  activity_score: number | null;
  success_rate: number | null;
  discovered_date?: string;
  last_checked_date?: string;
  created_at?: string;
};

const fetchTelegramChannels = async () => {
  const { data, error } = await supabase
    .from("telegram_channels")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const TelegramChannelsManager = () => {
  const [editingItem, setEditingItem] = useState<TelegramChannel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: channels, isLoading, error } = useQuery({
    queryKey: ["telegram_channels"],
    queryFn: fetchTelegramChannels,
  });

  const form = useForm<TelegramChannel>({
    defaultValues: {
      channel_title: "",
      channel_username: "",
      channel_description: "",
      members_count: null,
      languages: [],
      is_active: true,
      is_free: true,
      posting_price: null,
      posting_rules: "",
      admin_contact: "",
      tags: [],
      work_formats: [],
      relevance_score: null,
      activity_score: null,
      success_rate: null,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TelegramChannel) => {
      const { error } = await supabase.from("telegram_channels").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telegram_channels"] });
      setIsDialogOpen(false);
      form.reset();
      toast.success("Telegram канал добавлен");
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TelegramChannel) => {
      const { error } = await supabase
        .from("telegram_channels")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telegram_channels"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast.success("Telegram канал обновлен");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("telegram_channels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telegram_channels"] });
      toast.success("Telegram канал удален");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении: " + error.message);
    },
  });

  const onSubmit = (data: TelegramChannel) => {
    const languagesArray = typeof data.languages === 'string' 
      ? (data.languages as string).split(',').map(s => s.trim()).filter(s => s)
      : data.languages;
    
    const tagsArray = typeof data.tags === 'string' 
      ? (data.tags as string).split(',').map(s => s.trim()).filter(s => s)
      : data.tags;
    
    const workFormatsArray = typeof data.work_formats === 'string' 
      ? (data.work_formats as string).split(',').map(s => s.trim()).filter(s => s)
      : data.work_formats;
    
    const formattedData = {
      ...data,
      languages: languagesArray,
      tags: tagsArray,
      work_formats: workFormatsArray,
      members_count: data.members_count ? Number(data.members_count) : null,
      posting_price: data.posting_price ? Number(data.posting_price) : null,
      relevance_score: data.relevance_score ? Number(data.relevance_score) : null,
      activity_score: data.activity_score ? Number(data.activity_score) : null,
      success_rate: data.success_rate ? Number(data.success_rate) : null,
    };

    if (editingItem?.id) {
      updateMutation.mutate({ ...formattedData, id: editingItem.id });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEdit = (item: TelegramChannel) => {
    setEditingItem(item);
    form.reset({
      ...item,
      languages: item.languages?.join(', ') as any,
      tags: item.tags?.join(', ') as any,
      work_formats: item.work_formats?.join(', ') as any,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="text-center p-4">Загрузка Telegram каналов...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Ошибка при загрузке данных</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Telegram каналы</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Редактировать Telegram канал" : "Добавить Telegram канал"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="channel_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Заголовок *</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="channel_username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Участники</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="posting_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Цена размещения</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="admin_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Контакт админа</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="relevance_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Релевантность</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="activity_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Активность</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="success_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Успешность</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Активен</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_free"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Бесплатный</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="channel_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="posting_rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Правила размещения</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Языки (через запятую)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value as string || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Теги (через запятую)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value as string || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="work_formats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Форматы работы (через запятую)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value as string || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingItem ? "Обновить" : "Создать"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заголовок</TableHead>
              <TableHead>Участники</TableHead>
              <TableHead>Языки</TableHead>
              <TableHead>Активен</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels && channels.length > 0 ? (
              channels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell>
                    {channel.channel_username ? (
                      <a 
                        href={`https://t.me/${channel.channel_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {channel.channel_title}
                      </a>
                    ) : (
                      channel.channel_title
                    )}
                  </TableCell>
                  <TableCell>{channel.members_count?.toLocaleString() || "—"}</TableCell>
                  <TableCell>{channel.languages?.join(", ") || "—"}</TableCell>
                  <TableCell>
                    {channel.is_active ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(channel)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить Telegram канал</AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить этот Telegram канал? Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(channel.id)}
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Каналы не найдены.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TelegramChannelsManager;

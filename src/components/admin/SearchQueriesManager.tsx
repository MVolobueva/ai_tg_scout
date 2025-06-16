
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SearchQuery = {
  id?: string;
  session_id: string;
  message: any;
  location: string | null;
  salary: number | null;
  work_format: string | null;
  generated_keywords: string[] | null;
  hr_expert_id: string | null;
  user_id: string | null;
  created_at?: string;
};

const fetchSearchQueries = async () => {
  const { data, error } = await supabase
    .from("search_queries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const SearchQueriesManager = () => {
  const [editingItem, setEditingItem] = useState<SearchQuery | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: queries, isLoading, error } = useQuery({
    queryKey: ["search_queries"],
    queryFn: fetchSearchQueries,
  });

  const form = useForm<SearchQuery>({
    defaultValues: {
      session_id: "",
      message: {},
      location: "",
      salary: null,
      work_format: "",
      generated_keywords: [],
      hr_expert_id: "",
      user_id: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SearchQuery) => {
      const { error } = await supabase.from("search_queries").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search_queries"] });
      setIsDialogOpen(false);
      form.reset();
      toast.success("Запрос добавлен");
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SearchQuery) => {
      const { error } = await supabase
        .from("search_queries")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search_queries"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast.success("Запрос обновлен");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("search_queries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search_queries"] });
      toast.success("Запрос удален");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении: " + error.message);
    },
  });

  const onSubmit = (data: SearchQuery) => {
    const keywordsArray = typeof data.generated_keywords === 'string' 
      ? (data.generated_keywords as string).split(',').map(s => s.trim()).filter(s => s)
      : data.generated_keywords;
    
    let messageObj;
    try {
      messageObj = typeof data.message === 'string' ? JSON.parse(data.message as string) : data.message;
    } catch {
      messageObj = { type: 'user', content: data.message };
    }
    
    const formattedData = {
      ...data,
      generated_keywords: keywordsArray,
      message: messageObj,
      salary: data.salary ? Number(data.salary) : null,
    };

    if (editingItem?.id) {
      updateMutation.mutate({ ...formattedData, id: editingItem.id });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEdit = (item: SearchQuery) => {
    setEditingItem(item);
    form.reset({
      ...item,
      message: JSON.stringify(item.message, null, 2) as any,
      generated_keywords: item.generated_keywords?.join(', ') as any,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="text-center p-4">Загрузка истории запросов...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Ошибка при загрузке данных</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>История запросов</CardTitle>
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
                {editingItem ? "Редактировать запрос" : "Добавить запрос"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="session_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session ID *</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Местоположение</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Зарплата</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="work_format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Формат работы</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hr_expert_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HR Expert ID</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User ID</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сообщение (JSON) *</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value as string || ""} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generated_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ключевые слова (через запятую)</FormLabel>
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
              <TableHead>Время</TableHead>
              <TableHead>Тип сообщения</TableHead>
              <TableHead>Сообщение</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries && queries.length > 0 ? (
              queries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>{new Date(query.created_at).toLocaleString()}</TableCell>
                  <TableCell>{(query.message as any)?.type === 'ai' ? 'Ответ' : 'Запрос'}</TableCell>
                  <TableCell>{(query.message as any)?.content}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(query)}
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
                            <AlertDialogTitle>Удалить запрос</AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить этот запрос? Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(query.id)}
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
                <TableCell colSpan={4} className="text-center">История запросов пуста.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SearchQueriesManager;

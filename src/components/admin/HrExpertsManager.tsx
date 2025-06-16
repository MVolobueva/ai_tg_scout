
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

type HrExpert = {
  id?: string;
  telegram_username: string;
  email: string | null;
  subscribed: boolean | null;
  message: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  user_id: number;
  chat_id: string;
  user_type: number;
  created_at?: string;
};

const fetchHrExperts = async () => {
  const { data, error } = await supabase
    .from("hr_experts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const HrExpertsManager = () => {
  const [editingItem, setEditingItem] = useState<HrExpert | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: hrExperts, isLoading, error } = useQuery({
    queryKey: ["hr_experts"],
    queryFn: fetchHrExperts,
  });

  const form = useForm<HrExpert>({
    defaultValues: {
      telegram_username: "",
      email: "",
      subscribed: false,
      message: "",
      full_name: "",
      company_name: "",
      phone: "",
      user_id: 0,
      chat_id: "",
      user_type: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: HrExpert) => {
      const { error } = await supabase.from("hr_experts").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr_experts"] });
      setIsDialogOpen(false);
      form.reset();
      toast.success("HR эксперт добавлен");
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: HrExpert) => {
      const { error } = await supabase
        .from("hr_experts")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr_experts"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast.success("HR эксперт обновлен");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hr_experts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr_experts"] });
      toast.success("HR эксперт удален");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении: " + error.message);
    },
  });

  const onSubmit = (data: HrExpert) => {
    const formattedData = {
      ...data,
      user_id: Number(data.user_id),
      user_type: Number(data.user_type),
    };

    if (editingItem?.id) {
      updateMutation.mutate({ ...formattedData, id: editingItem.id });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEdit = (item: HrExpert) => {
    setEditingItem(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="text-center p-4">Загрузка HR экспертов...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Ошибка при загрузке данных</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>HR эксперты</CardTitle>
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
                {editingItem ? "Редактировать HR эксперта" : "Добавить HR эксперта"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telegram_username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телеграм *</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ФИО</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Компания</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
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
                        <FormLabel>User ID *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chat_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chat ID *</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип пользователя</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subscribed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Подписан</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сообщение *</FormLabel>
                      <FormControl>
                        <Textarea {...field} required />
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
              <TableHead>Телеграм</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Подписан</TableHead>
              <TableHead>Сообщение</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hrExperts && hrExperts.length > 0 ? (
              hrExperts.map((expert) => (
                <TableRow key={expert.id}>
                  <TableCell>{expert.telegram_username || "—"}</TableCell>
                  <TableCell>{expert.email || "—"}</TableCell>
                  <TableCell>
                    {expert.subscribed ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{expert.message}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expert)}
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
                            <AlertDialogTitle>Удалить HR эксперта</AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить этого HR эксперта? Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(expert.id)}
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
                <TableCell colSpan={5} className="text-center">HR эксперты не найдены.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HrExpertsManager;

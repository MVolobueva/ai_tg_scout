
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

type JobSeeker = {
  id?: string;
  telegram_username: string | null;
  email: string;
  full_name: string;
  phone: string | null;
  desired_salary: number | null;
  experience_years: number | null;
  skills: string[] | null;
  desired_position: string | null;
  work_format: string | null;
  location: string | null;
  resume_file_url: string | null;
  github_url: string | null;
  created_at?: string;
};

const fetchJobSeekers = async () => {
  const { data, error } = await supabase
    .from("job_seekers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const JobSeekersManager = () => {
  const [editingItem, setEditingItem] = useState<JobSeeker | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobSeekers, isLoading, error } = useQuery({
    queryKey: ["job_seekers"],
    queryFn: fetchJobSeekers,
  });

  const form = useForm<JobSeeker>({
    defaultValues: {
      telegram_username: "",
      email: "",
      full_name: "",
      phone: "",
      desired_salary: null,
      experience_years: null,
      skills: [],
      desired_position: "",
      work_format: "",
      location: "",
      resume_file_url: "",
      github_url: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: JobSeeker) => {
      const { error } = await supabase.from("job_seekers").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job_seekers"] });
      setIsDialogOpen(false);
      form.reset();
      toast.success("Соискатель добавлен");
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: JobSeeker) => {
      const { error } = await supabase
        .from("job_seekers")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job_seekers"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast.success("Соискатель обновлен");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_seekers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job_seekers"] });
      toast.success("Соискатель удален");
    },
    onError: (error) => {
      toast.error("Ошибка при удалении: " + error.message);
    },
  });

  const onSubmit = (data: JobSeeker) => {
    const skillsArray = typeof data.skills === 'string' 
      ? (data.skills as string).split(',').map(s => s.trim()).filter(s => s)
      : data.skills;
    
    const formattedData = {
      ...data,
      skills: skillsArray,
      desired_salary: data.desired_salary ? Number(data.desired_salary) : null,
      experience_years: data.experience_years ? Number(data.experience_years) : null,
    };

    if (editingItem?.id) {
      updateMutation.mutate({ ...formattedData, id: editingItem.id });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEdit = (item: JobSeeker) => {
    setEditingItem(item);
    form.reset({
      ...item,
      skills: item.skills?.join(', ') as any,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="text-center p-4">Загрузка соискателей...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Ошибка при загрузке данных</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Соискатели</CardTitle>
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
                {editingItem ? "Редактировать соискателя" : "Добавить соискателя"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ФИО *</FormLabel>
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telegram_username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телеграм</FormLabel>
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
                    name="desired_salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Желаемая зарплата</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Опыт (лет)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desired_position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Желаемая должность</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
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
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
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
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Навыки (через запятую)</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value as string || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resume_file_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL резюме</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
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
              <TableHead>З/П</TableHead>
              <TableHead>Опыт</TableHead>
              <TableHead>Навыки</TableHead>
              <TableHead>Время</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobSeekers && jobSeekers.length > 0 ? (
              jobSeekers.map((seeker) => (
                <TableRow key={seeker.id}>
                  <TableCell>{seeker.telegram_username || "—"}</TableCell>
                  <TableCell>{seeker.email}</TableCell>
                  <TableCell>{seeker.desired_salary ? seeker.desired_salary.toLocaleString() : "—"}</TableCell>
                  <TableCell>{seeker.experience_years ?? "—"}</TableCell>
                  <TableCell className="max-w-xs">{seeker.skills?.join(", ") || "—"}</TableCell>
                  <TableCell>{new Date(seeker.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(seeker)}
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
                            <AlertDialogTitle>Удалить соискателя</AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить этого соискателя? Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(seeker.id)}
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
                <TableCell colSpan={7} className="text-center">Соискатели не найдены.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JobSeekersManager;

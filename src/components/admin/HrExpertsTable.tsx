
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

type HrExpert = {
  telegram_username: string | null;
  email: string | null;
  subscribed: boolean | null;
  message: string;
};

const fetchHrExperts = async () => {
  const { data, error } = await supabase
    .from("hr_experts")
    .select("telegram_username, email, subscribed, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching HR experts:", error);
    throw new Error(error.message);
  }
  return data;
};

const HrExpertsTable = () => {
  const { data: hrExperts, isLoading, error } = useQuery({
    queryKey: ["hr_experts"],
    queryFn: fetchHrExperts,
  });

  if (isLoading) return <div className="text-center p-4">Загрузка HR экспертов...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Ошибка при загрузке данных: {(error as Error).message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>HR эксперты</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Телеграм</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Подписан</TableHead>
              <TableHead>Сообщение</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hrExperts && hrExperts.length > 0 ? (
              hrExperts.map((expert, index) => (
                <TableRow key={index}>
                  <TableCell>{expert.telegram_username || "—"}</TableCell>
                  <TableCell>{expert.email || "—"}</TableCell>
                  <TableCell>
                    {expert.subscribed ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{expert.message}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">HR эксперты не найдены.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HrExpertsTable;

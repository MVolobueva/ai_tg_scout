
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type JobSeeker = {
  telegram_username: string | null;
  email: string;
  desired_salary: number | null;
  experience_years: number | null;
  skills: string[] | null;
  created_at: string;
};

const fetchJobSeekers = async () => {
  const { data, error } = await supabase
    .from("job_seekers")
    .select("telegram_username, email, desired_salary, experience_years, skills, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching job seekers:", error);
    throw new Error(error.message);
  }
  return data;
};

const JobSeekersTable = () => {
  const { data: jobSeekers, isLoading, error } = useQuery({
    queryKey: ["job_seekers"],
    queryFn: fetchJobSeekers,
  });

  if (isLoading) return <div className="text-center p-4">Загрузка соискателей...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Ошибка при загрузке данных: {(error as Error).message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Соискатели</CardTitle>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobSeekers && jobSeekers.length > 0 ? (
              jobSeekers.map((seeker, index) => (
                <TableRow key={index}>
                  <TableCell>{seeker.telegram_username || "—"}</TableCell>
                  <TableCell>{seeker.email}</TableCell>
                  <TableCell>{seeker.desired_salary ? seeker.desired_salary.toLocaleString() : "—"}</TableCell>
                  <TableCell>{seeker.experience_years ?? "—"}</TableCell>
                  <TableCell className="max-w-xs">{seeker.skills?.join(", ") || "—"}</TableCell>
                  <TableCell>{new Date(seeker.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Соискатели не найдены.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JobSeekersTable;

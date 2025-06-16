
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type SearchQuery = {
  created_at: string;
  message: any;
};

const fetchSearchQueries = async () => {
  const { data, error } = await supabase
    .from("search_queries")
    .select("created_at, message")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching search queries:", error);
    throw new Error(error.message);
  }
  return data;
};

const SearchQueriesTable = () => {
  const { data: queries, isLoading, error } = useQuery({
    queryKey: ["search_queries"],
    queryFn: fetchSearchQueries,
  });

  if (isLoading) return <div className="text-center p-4">Загрузка истории запросов...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Ошибка при загрузке данных: {(error as Error).message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>История запросов</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Время</TableHead>
              <TableHead>Тип сообщения</TableHead>
              <TableHead>Сообщение</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries && queries.length > 0 ? (
              queries.map((query, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(query.created_at).toLocaleString()}</TableCell>
                  <TableCell>{(query.message as any)?.type === 'ai' ? 'Ответ' : 'Запрос'}</TableCell>
                  <TableCell>{(query.message as any)?.content}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">История запросов пуста.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SearchQueriesTable;


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

type TelegramChannel = {
  channel_title: string;
  members_count: number | null;
  languages: string[] | null;
  is_active: boolean | null;
  channel_username: string | null;
};

const fetchTelegramChannels = async () => {
  const { data, error } = await supabase
    .from("telegram_channels")
    .select("channel_title, members_count, languages, is_active, channel_username, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching Telegram channels:", error);
    throw new Error(error.message);
  }
  return data;
};

const TelegramChannelsTable = () => {
  const { data: channels, isLoading, error } = useQuery({
    queryKey: ["telegram_channels"],
    queryFn: fetchTelegramChannels,
  });

  if (isLoading) return <div className="text-center p-4">Загрузка Telegram каналов...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Ошибка при загрузке данных: {(error as Error).message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telegram каналы</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заголовок</TableHead>
              <TableHead>Участники</TableHead>
              <TableHead>Языки</TableHead>
              <TableHead>Активен</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels && channels.length > 0 ? (
              channels.map((channel, index) => (
                <TableRow key={index}>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Каналы не найдены.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TelegramChannelsTable;

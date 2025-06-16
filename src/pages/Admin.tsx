
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobSeekersManager from "@/components/admin/JobSeekersManager";
import HrExpertsManager from "@/components/admin/HrExpertsManager";
import TelegramChannelsManager from "@/components/admin/TelegramChannelsManager";
import SearchQueriesManager from "@/components/admin/SearchQueriesManager";

const Admin = () => {
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      <Tabs defaultValue="job_seekers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="job_seekers">Соискатели</TabsTrigger>
          <TabsTrigger value="hr_experts">HR эксперты</TabsTrigger>
          <TabsTrigger value="telegram_channels">Telegram каналы</TabsTrigger>
          <TabsTrigger value="search_queries">История запросов</TabsTrigger>
        </TabsList>
        <TabsContent value="job_seekers" className="mt-4">
          <JobSeekersManager />
        </TabsContent>
        <TabsContent value="hr_experts" className="mt-4">
          <HrExpertsManager />
        </TabsContent>
        <TabsContent value="telegram_channels" className="mt-4">
          <TelegramChannelsManager />
        </TabsContent>
        <TabsContent value="search_queries" className="mt-4">
          <SearchQueriesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

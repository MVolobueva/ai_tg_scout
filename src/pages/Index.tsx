
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Index = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Интеллектуальный Скаут Telegram-Каналов</CardTitle>
          <CardDescription>
            Введите описание вакансии, и AI-ассистент подберёт релевантные Telegram-каналы для публикации.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="vacancy-description">Описание вакансии</Label>
            <Textarea placeholder="Например: Frontend, React, удалёнка..." id="vacancy-description" rows={6} />
            <p className="text-sm text-muted-foreground">
              Укажите ключевые технологии, позицию, уровень и другие важные детали.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Найти каналы</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;

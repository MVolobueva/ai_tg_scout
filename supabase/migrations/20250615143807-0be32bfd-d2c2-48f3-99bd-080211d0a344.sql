
-- Включаем Row Level Security для таблиц админ-панели
ALTER TABLE public.hr_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;

-- Создаем политики для публичного доступа на чтение
CREATE POLICY "Allow public read access to hr_experts" ON public.hr_experts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to job_seekers" ON public.job_seekers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to telegram_channels" ON public.telegram_channels FOR SELECT USING (true);
CREATE POLICY "Allow public read access to search_queries" ON public.search_queries FOR SELECT USING (true);

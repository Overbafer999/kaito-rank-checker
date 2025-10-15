// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { KaitoScraper } from '../../../lib/kaito-scraper';

export async function POST(req: Request) {
  try {
    const { username, projects } = await req.json();

    if (!username || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Bad input' }, { status: 400 });
    }

    const cleanUsername = String(username).trim().replace(/^@/, '');

    console.log(`🔍 API: Поиск @${cleanUsername} в ${projects.length} проектах`);

    // Создаем scraper
    const scraper = new KaitoScraper();

    // Парсим данные
    const result = await scraper.search({
      username: cleanUsername,
      projects,
      timeframe: '30D', // можно сделать динамическим
    });

    if (result.rankings.length === 0) {
      return NextResponse.json({
        data: {
          user: { username: cleanUsername, found: false },
          rankings: [],
          stats: {
            total_projects: 0,
            best_rank: null,
            avg_mindshare: 0,
          },
          message: 'Юзер не найден в топ-100 выбранных проектов',
        },
      });
    }

    console.log(`✅ Найдено: ${result.rankings.length} проектов`);

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal error' },
      { status: 500 }
    );
  }
}

// lib/kaito-api.ts
import type { Project, RankingEntry, GroupedRanking } from '../types';

interface ScraperOptions {
  username: string;
  projects: string[];
  timeframe?: '7D' | '30D' | '3M';
}

interface ScraperResult {
  user: { username: string; found: boolean };
  rankings: GroupedRanking[];
  stats: {
    total_projects: number;
    best_rank: number | null;
    avg_mindshare: number;
  };
}

export class KaitoScraper {
  private baseUrl = 'https://yaps.kaito.ai';
  private cache = new Map<string, any>();

  /**
   * ВАЖНО: Это серверный парсер, работает только в Next.js API routes
   * Нельзя вызывать напрямую из клиента
   */

  private getCached(key: string): any {
    const entry = this.cache.get(key);
    if (!entry || Date.now() - entry.ts > 30 * 60 * 1000) return null;
    return entry.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, ts: Date.now() });
  }

  /**
   * Парсит конкретный leaderboard проекта
   */
  private async scrapeProjectLeaderboard(
    projectSlug: string,
    timeframe: string = '30D'
  ): Promise<any[]> {
    const cacheKey = `leaderboard:${projectSlug}:${timeframe}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // URL leaderboard'а проекта
      const url = `${this.baseUrl}/yapper-leaderboards/${projectSlug}`;
      
      console.log(`📡 Fetching: ${url}`);

      // Пытаемся получить данные через fetch
      // Kaito использует Server-Side Rendering, поэтому HTML содержит данные
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        console.log(`❌ ${projectSlug}: ${response.status}`);
        return [];
      }

      const html = await response.text();

      // Пытаемся найти JSON данные в HTML
      // Kaito обычно инжектит данные в <script id="__NEXT_DATA__">
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
      
      if (nextDataMatch) {
        try {
          const jsonData = JSON.parse(nextDataMatch[1]);
          
          // Извлекаем leaderboard данные из Next.js pageProps
          const leaderboardData = jsonData?.props?.pageProps?.leaderboard || [];
          
          this.setCache(cacheKey, leaderboardData);
          return leaderboardData;
        } catch (e) {
          console.log(`❌ Не удалось распарсить JSON для ${projectSlug}`);
        }
      }

      return [];
    } catch (error) {
      console.error(`❌ Ошибка при скрейпинге ${projectSlug}:`, error);
      return [];
    }
  }

  /**
   * Ищет юзера в leaderboard данных
   */
  private findUserInLeaderboard(
    leaderboardData: any[],
    username: string
  ): { rank: number; mindshare: number } | null {
    const normalizedUsername = username.toLowerCase().replace(/^@/, '');

    for (let i = 0; i < leaderboardData.length; i++) {
      const entry = leaderboardData[i];
      const entryUsername = (entry.username || entry.handle || '').toLowerCase().replace(/^@/, '');

      if (entryUsername === normalizedUsername) {
        return {
          rank: entry.rank || i + 1,
          mindshare: entry.mindshare || entry.score || 0,
        };
      }
    }

    return null;
  }

  /**
   * ГЛАВНЫЙ МЕТОД: Ищет юзера по всем проектам
   */
  public async search(options: ScraperOptions): Promise<ScraperResult> {
    const { username, projects, timeframe = '30D' } = options;

    console.log(`🔍 Ищем @${username} в ${projects.length} проектах...`);

    const rankings: GroupedRanking[] = [];

    // Список популярных проектов и их slug'ов на Kaito
    const projectSlugs: Record<string, string> = {
      // Pre-TGE
      'BABYLON': 'babylon',
      'BERACHAIN': 'berachain',
      'BERA': 'berachain',
      'SCROLL': 'scroll',
      'LINEA': 'linea',
      'MONAD': 'monad',
      'INITIA': 'initia',
      'STORY': 'story-protocol',
      'FUEL': 'fuel',
      
      // Post-TGE
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'ARB': 'arbitrum',
      'OP': 'optimism',
      'POL': 'polygon',
      'MATIC': 'polygon',
      'AVAX': 'avalanche',
      'SUI': 'sui',
      'APT': 'aptos',
      'BASE': 'base',
    };

    // Ищем по каждому проекту
    for (const ticker of projects) {
      const slug = projectSlugs[ticker.toUpperCase()];

      if (!slug) {
        console.log(`⚠️  Нет slug для ${ticker}, пропускаем`);
        continue;
      }

      try {
        // Парсим leaderboard
        const leaderboardData = await this.scrapeProjectLeaderboard(slug, timeframe);

        if (leaderboardData.length === 0) {
          console.log(`⚠️  ${ticker}: leaderboard пустой`);
          continue;
        }

        // Ищем юзера
        const userEntry = this.findUserInLeaderboard(leaderboardData, username);

        if (userEntry) {
          console.log(`✅ ${ticker}: Rank #${userEntry.rank}, Mindshare ${userEntry.mindshare}%`);

          rankings.push({
            project: ticker,
            ticker: ticker,
            imgUrl: '',
            timeframes: [
              {
                duration: timeframe,
                rank: userEntry.rank,
                mindshare: userEntry.mindshare,
              },
            ],
          });
        } else {
          console.log(`❌ ${ticker}: юзер не найден в топ-100`);
        }

        // Rate limiting: ждем 300ms между запросами
        await new Promise(r => setTimeout(r, 300));
      } catch (error) {
        console.error(`❌ Ошибка при поиске в ${ticker}:`, error);
      }
    }

    // Сортируем по рангу
    rankings.sort((a, b) => {
      const rankA = Math.min(...a.timeframes.map(t => t.rank));
      const rankB = Math.min(...b.timeframes.map(t => t.rank));
      return rankA - rankB;
    });

    // Статистика
    const allRanks = rankings.flatMap(r => r.timeframes.map(t => t.rank));
    const allMS = rankings.flatMap(r => r.timeframes.map(t => t.mindshare));

    return {
      user: {
        username,
        found: rankings.length > 0,
      },
      rankings,
      stats: {
        total_projects: rankings.length,
        best_rank: allRanks.length ? Math.min(...allRanks) : null,
        avg_mindshare: allMS.length ? allMS.reduce((a, b) => a + b, 0) / allMS.length : 0,
      },
    };
  }
}

/**
 * АЛЬТЕРНАТИВНЫЙ МЕТОД: Используем Puppeteer для более надежного скрейпинга
 * Раскомментируй если нужен headless browser
 */

/*
import puppeteer from 'puppeteer';

export class KaitoScraperWithPuppeteer {
  private browser: any = null;

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }

  async scrapeProjectLeaderboard(projectSlug: string) {
    await this.init();
    
    const page = await this.browser.newPage();
    
    // Блокируем debugger
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(window, 'debugger', {
        get: function() {},
        set: function() {}
      });
    });

    const url = `https://yaps.kaito.ai/yapper-leaderboards/${projectSlug}`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Ждем загрузки leaderboard
    await page.waitForSelector('.leaderboard-table', { timeout: 10000 });

    // Парсим таблицу
    const leaderboardData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.leaderboard-row'));
      return rows.map((row, index) => ({
        rank: index + 1,
        username: row.querySelector('.username')?.textContent || '',
        mindshare: parseFloat(row.querySelector('.mindshare')?.textContent || '0'),
      }));
    });

    await page.close();
    return leaderboardData;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
*/

// lib/kaito-api.ts

interface Project {
  id: number;
  name: string;
  ticker: string;
  category: string;
  imgUrl: string;
}

interface RankingEntry {
  duration: string;
  rank: number;
  mindshare: number;
}

interface GroupedRanking {
  project: string;
  ticker: string;
  imgUrl: string;
  timeframes: RankingEntry[];
}

interface SearchResult {
  user: { username: string; found: boolean };
  rankings: GroupedRanking[];
  stats: {
    total_projects: number;
    best_rank: number | null;
    avg_mindshare: number;
  };
}

export class SmartKaitoAPI {
  private cache = new Map<string, any>();
  private rateLimiter = { requests: [] as number[], maxRequests: 20, windowMs: 60000 };

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    this.rateLimiter.requests = this.rateLimiter.requests.filter(t => now - t < this.rateLimiter.windowMs);
    if (this.rateLimiter.requests.length >= this.rateLimiter.maxRequests) {
      await new Promise(r => setTimeout(r, 1000));
      return this.checkRateLimit();
    }
    this.rateLimiter.requests.push(now);
  }

  private getCached(key: string): any {
    const entry = this.cache.get(key);
    if (!entry || Date.now() - entry.ts > entry.ttl) return null;
    return entry.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, { data, ts: Date.now(), ttl });
  }

  // ---------- SAFE FETCH HELPERS ----------
  private async safeJson(res: Response): Promise<any> {
    if (!res.ok) return null;
    try {
      const txt = await res.text();
      return txt ? JSON.parse(txt) : null;
    } catch {
      return null;
    }
  }

  // ---------- EXTERNAL CALLS (safe) ----------
  private async fetchProjects(): Promise<Project[]> {
    const cached = this.getCached('projects');
    if (cached) return cached;

    try {
      const res = await fetch('https://gomtu.xyz/api/kaito/leaderboard', {
        headers: { accept: 'application/json' },
        cache: 'no-store',
      });

      const json = await this.safeJson(res);
      const data: Project[] = Array.isArray(json?.data) ? json.data : [];
      this.setCache('projects', data, 86_400_000); // 24h
      return data;
    } catch {
      return [];
    }
  }

  private async fetchUserData(username: string): Promise<any[]> {
    const key = `user:${username}`;
    const cached = this.getCached(key);
    if (cached) return cached;

    await this.checkRateLimit();
    try {
      const res = await fetch('https://gomtu.xyz/api/kaito/leaderboard-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ username }),
        cache: 'no-store',
      });

      const json = await this.safeJson(res);
      const data: any[] = Array.isArray(json?.data) ? json.data : [];
      this.setCache(key, data, 1_800_000); // 30 мин
      return data;
    } catch {
      this.setCache(key, [], 60_000);
      return [];
    }
  }

  // ---------- PUBLIC API ----------
  public async searchUser(username: string, selectedProjects: string[]): Promise<SearchResult & { debug: any }> {
  const [projects, userData] = await Promise.all([
    this.fetchProjects(),
    this.fetchUserData(username)
  ]);

  // карта проектов по тикеру (в верхнем регистре)
  const projectMap = new Map(projects.map(p => [String(p.ticker || '').toUpperCase(), p]));

  // нормализуем выбранные тикеры (в верхний регистр)
  const sel = new Set((selectedProjects || []).map(s => String(s).toUpperCase()));

  // поможем себе разными ключами: topic_id / ticker / symbol / id
  const pickKey = (d: any): string | null => {
    const keys = [
      d?.topic_id,
      d?.ticker,
      d?.symbol,
      d?.id,        // иногда id = тикер
      d?.project,   // вдруг приходит имя
    ];
    for (const k of keys) {
      if (!k) continue;
      const v = String(k).toUpperCase().trim();
      if (v) return v;
    }
    return null;
  };

  // НЕ режем по tier — оставим все
  const grouped = new Map<string, RankingEntry[]>();
  const debug_raw_keys: string[] = [];

  for (const entry of (userData || [])) {
    const key = pickKey(entry);
    if (!key) continue;
    debug_raw_keys.push(key);

    // матчим по выбранным проектам
    if (!sel.has(key)) continue;

    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push({
      duration: entry.duration || entry.timeframe || entry.window || 'NA',
      rank: Number(entry.rank ?? entry.position ?? entry.place ?? 999999),
      mindshare: Number(entry.mindshare ?? entry.ms ?? entry.score ?? 0),
    });
  }

  // собираем итог
  const order: Record<string, number> = { '7D': 1, '30D': 2, '3M': 3, '6M': 4, '12M': 5 };
  const rankings: GroupedRanking[] = [];

  grouped.forEach((timeframes, key) => {
    // аккуратно отсортируем таймфреймы
    timeframes.sort((a, b) => (order[a.duration] || 99) - (order[b.duration] || 99));

    const proj = projectMap.get(key);
    rankings.push({
      project: proj?.name || key,
      ticker: key,
      imgUrl: proj?.imgUrl || '',
      timeframes,
    });
  });

  rankings.sort(
    (a, b) => Math.min(...a.timeframes.map(t => t.rank)) - Math.min(...b.timeframes.map(t => t.rank))
  );

  const allRanks = rankings.flatMap(r => r.timeframes.map(t => t.rank)).filter(Number.isFinite);
  const allMS = rankings.flatMap(r => r.timeframes.map(t => t.mindshare)).filter(Number.isFinite);

  return {
    user: { username, found: rankings.length > 0 },
    rankings,
    stats: {
      total_projects: rankings.length,
      best_rank: allRanks.length ? Math.min(...allRanks) : null,
      avg_mindshare: allMS.length ? allMS.reduce((a, b) => a + b, 0) / allMS.length : 0,
    },
    debug: {
      userData_count: (userData || []).length,
      matched_topics: Array.from(grouped.keys()),
      raw_keys_seen: debug_raw_keys,
    }
  };
}


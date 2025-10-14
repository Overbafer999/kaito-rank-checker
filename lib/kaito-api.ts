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
  public async searchUser(username: string, selectedProjects: string[]): Promise<SearchResult> {
    const [projects, userData] = await Promise.all([
      this.fetchProjects(),
      this.fetchUserData(username),
    ]);

    const projectMap = new Map(projects.map(p => [p.ticker, p]));
    const grouped = new Map<string, RankingEntry[]>();

    userData
      .filter((d: any) => d.tier === 'tier1' && selectedProjects.includes(d.topic_id))
      .forEach((entry: any) => {
        if (!grouped.has(entry.topic_id)) grouped.set(entry.topic_id, []);
        grouped.get(entry.topic_id)!.push({
          duration: entry.duration,
          rank: entry.rank,
          mindshare: entry.mindshare || 0,
        });
      });

    const rankings: GroupedRanking[] = [];
    const order: Record<string, number> = { '7D': 1, '30D': 2, '3M': 3, '6M': 4, '12M': 5 };

    grouped.forEach((timeframes, ticker) => {
      const project = projectMap.get(ticker);
      timeframes.sort((a, b) => (order[a.duration] || 99) - (order[b.duration] || 99));
      rankings.push({
        project: project?.name || ticker,
        ticker,
        imgUrl: project?.imgUrl || '',
        timeframes,
      });
    });

    rankings.sort(
      (a, b) => Math.min(...a.timeframes.map(t => t.rank)) - Math.min(...b.timeframes.map(t => t.rank))
    );

    const allRanks = rankings.flatMap(r => r.timeframes.map(t => t.rank));
    const allMS = rankings.flatMap(r => r.timeframes.map(t => t.mindshare));

    return {
      user: { username, found: rankings.length > 0 },
      rankings,
      stats: {
        total_projects: rankings.length,
        best_rank: allRanks.length ? Math.min(...allRanks) : null,
        avg_mindshare: allMS.length ? allMS.reduce((a, b) => a + b, 0) / allMS.length : 0,
      },
    };
  }

  public async getAvailableProjects(): Promise<Project[]> {
    return this.fetchProjects();
  }

  public cleanupCache(): void {
    const now = Date.now();
    for (const [k, v] of this.cache.entries()) {
      if (now - v.ts > v.ttl) this.cache.delete(k);
    }
  }
}

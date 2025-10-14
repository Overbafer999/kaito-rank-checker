// lib/kaito-api.ts - UPGRADED VERSION
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

  private async checkRateLimit() {
    const now = Date.now();
    this.rateLimiter.requests = this.rateLimiter.requests.filter(t => now - t < 60000);
    if (this.rateLimiter.requests.length >= 20) {
      await new Promise(r => setTimeout(r, 1000));
      return this.checkRateLimit();
    }
    this.rateLimiter.requests.push(now);
  }

  private getCached(key: string) {
    const entry = this.cache.get(key);
    if (!entry || Date.now() - entry.ts > entry.ttl) return null;
    return entry.data;
  }

  private setCache(key: string, data: any, ttl: number) {
    this.cache.set(key, { data, ts: Date.now(), ttl });
  }

  private async fetchProjects(): Promise<Project[]> {
    const cached = this.getCached('projects');
    if (cached) return cached;
    
    try {
      const res = await fetch('https://gomtu.xyz/api/kaito/leaderboard');
      const json = await res.json();
      this.setCache('projects', json.data || [], 86400000);
      return json.data || [];
    } catch {
      return [];
    }
  }

  private async fetchUserData(username: string) {
    const cached = this.getCached(`user:${username}`);
    if (cached) return cached;

    await this.checkRateLimit();
    const res = await fetch('https://gomtu.xyz/api/kaito/leaderboard-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const json = await res.json();
    this.setCache(`user:${username}`, json.data || [], 1800000);
    return json.data || [];
  }

  public async searchUser(username: string, selectedProjects: string[]): Promise<SearchResult> {
    const [projects, userData] = await Promise.all([
      this.fetchProjects(),
      this.fetchUserData(username)
    ]);

    const projectMap = new Map(projects.map(p => [p.ticker, p]));
    const grouped = new Map<string, RankingEntry[]>();

    userData.filter((d: any) => d.tier === 'tier1' && selectedProjects.includes(d.topic_id))
      .forEach((entry: any) => {
        if (!grouped.has(entry.topic_id)) grouped.set(entry.topic_id, []);
        grouped.get(entry.topic_id)!.push({
          duration: entry.duration,
          rank: entry.rank,
          mindshare: entry.mindshare || 0
        });
      });

    const rankings: GroupedRanking[] = [];
    grouped.forEach((timeframes, ticker) => {
      const project = projectMap.get(ticker);
      const order: any = { '7D': 1, '30D': 2, '3M': 3, '6M': 4, '12M': 5 };
      timeframes.sort((a, b) => (order[a.duration] || 99) - (order[b.duration] || 99));
      rankings.push({
        project: project?.name || ticker,
        ticker,
        imgUrl: project?.imgUrl || '',
        timeframes
      });
    });

    rankings.sort((a, b) => Math.min(...a.timeframes.map(t => t.rank)) - Math.min(...b.timeframes.map(t => t.rank)));

    const allRanks = rankings.flatMap(r => r.timeframes.map(t => t.rank));
    const allMS = rankings.flatMap(r => r.timeframes.map(t => t.mindshare));

    return {
      user: { username, found: rankings.length > 0 },
      rankings,
      stats: {
        total_projects: rankings.length,
        best_rank: allRanks.length ? Math.min(...allRanks) : null,
        avg_mindshare: allMS.length ? allMS.reduce((a, b) => a + b, 0) / allMS.length : 0
      }
    };
  }

  public async getAvailableProjects() {
    return await this.fetchProjects();
  }

  public cleanupCache() {
    const now = Date.now();
    for (const [k, v] of this.cache.entries()) {
      if (now - v.ts > v.ttl) this.cache.delete(k);
    }
  }
}

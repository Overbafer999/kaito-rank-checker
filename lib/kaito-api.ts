// lib/kaito-api.ts

interface Project {
  id: string;
  name: string;
  tier: string;
}

interface RankingResult {
  project: string;
  rank: number;
  tier: string;
  mindshare: number;
  timeframe: string;
}

interface SearchResult {
  user: {
    username: string;
    found: boolean;
  };
  rankings: RankingResult[];
  stats: {
    total_searched: number;
    found_in: number;
    best_rank: number | null;
    avg_mindshare: number;
  };
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export class SmartKaitoAPI {
  private cache: Map<string, CacheEntry>;
  private rateLimiter: {
    requests: number[];
    maxRequests: number;
    windowMs: number;
  };
  private userAgents: string[];

  constructor() {
    this.cache = new Map();
    this.rateLimiter = {
      requests: [],
      maxRequests: 20,
      windowMs: 60000,
    };
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
    ];
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    this.rateLimiter.requests = this.rateLimiter.requests.filter(
      (time) => now - time < this.rateLimiter.windowMs
    );

    if (this.rateLimiter.requests.length >= this.rateLimiter.maxRequests) {
      const oldestRequest = this.rateLimiter.requests[0];
      const waitTime = this.rateLimiter.windowMs - (now - oldestRequest);
      console.log(`[RateLimit] Waiting ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.checkRateLimit();
    }

    this.rateLimiter.requests.push(now);
  }

  private async randomDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * 600) + 200;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private getCachedData(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    console.log(`[Cache] Hit: ${key}`);
    return entry.data;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  public cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private getProjects(): Project[] {
    return [
      { id: 'PUMP', name: 'PUMP', tier: 'top' },
      { id: 'NEWTON', name: 'Newton', tier: 'top' },
      { id: 'MITOSIS', name: 'Mitosis', tier: 'top' },
      { id: 'STORYPROTOCOL', name: 'Story Protocol', tier: 'top' },
      { id: 'CAMP', name: 'Camp Network', tier: 'top' },
      { id: 'ANOMA', name: 'ANOMA', tier: 'top' },
      { id: 'HYPERLIQUID', name: 'Hyperliquid', tier: 'top' },
      { id: 'VIRTUALS', name: 'Virtuals Protocol', tier: 'top' },
      { id: 'CALDERA', name: 'Caldera', tier: 'high' },
      { id: 'UNION', name: 'Union', tier: 'high' },
      { id: 'INFINEX', name: 'Infinex', tier: 'high' },
      { id: 'MEGAETH', name: 'MegaETH', tier: 'high' },
      { id: 'BOUNDLESS', name: 'Boundless', tier: 'high' },
      { id: 'BLS', name: 'Bless', tier: 'high' },
      { id: 'MIRA', name: 'Mira Network', tier: 'high' },
      { id: 'BERACHAIN', name: 'Berachain', tier: 'high' },
      { id: 'PARALLEL', name: 'Parallel', tier: 'high' },
      { id: 'AETHIR', name: 'Aethir', tier: 'high' },
      { id: 'GRASS', name: 'Grass', tier: 'high' },
      { id: 'PUDGYPENGUINS', name: 'Pudgy Penguins', tier: 'high' },
      { id: 'LUMITERRA', name: 'Lumiterra', tier: 'mid' },
      { id: 'NOYA', name: 'Noya.ai', tier: 'mid' },
      { id: 'SUCCINCT', name: 'Succinct', tier: 'mid' },
      { id: 'SATLAYER', name: 'SatLayer', tier: 'mid' },
      { id: 'IRYS', name: 'Irys', tier: 'mid' },
      { id: 'SOMNIA', name: 'Somnia', tier: 'mid' },
      { id: 'INFINIT', name: 'INFINIT', tier: 'mid' },
      { id: 'LOMBARD', name: 'Lombard', tier: 'mid' },
      { id: 'THEORIQ', name: 'Theoriq', tier: 'mid' },
      { id: 'ZIRCUIT', name: 'Zircuit', tier: 'mid' },
      { id: 'MORPHO', name: 'Morpho', tier: 'mid' },
      { id: 'ORDERLY', name: 'Orderly Network', tier: 'mid' },
      { id: 'LIDO', name: 'Lido Finance', tier: 'mid' },
      { id: 'SHARDEUM', name: 'Shardeum', tier: 'mid' },
      { id: 'FHENIX', name: 'Fhenix', tier: 'mid' },
      { id: 'MONAD', name: 'Monad', tier: 'emerging' },
      { id: 'ECLIPSE', name: 'Eclipse', tier: 'emerging' },
      { id: 'KAITO', name: 'Kaito', tier: 'emerging' },
      { id: 'PENGU', name: 'PENGU', tier: 'emerging' },
      { id: 'FUEL', name: 'FUEL', tier: 'emerging' },
      { id: 'MOVEMENT', name: 'Movement', tier: 'emerging' },
      { id: 'SONIC', name: 'Sonic', tier: 'emerging' },
      { id: 'ALLORA', name: 'Allora', tier: 'emerging' },
      { id: 'POLYHEDRA', name: 'Polyhedra Network', tier: 'emerging' },
      { id: 'AVAIL', name: 'Avail', tier: 'emerging' },
      { id: 'SCROLL', name: 'Scroll', tier: 'emerging' },
      { id: 'LINEA', name: 'Linea', tier: 'emerging' },
      { id: 'BASE', name: 'Base', tier: 'emerging' },
      { id: 'BLAST', name: 'Blast', tier: 'emerging' },
      { id: 'MANTLE', name: 'Mantle', tier: 'emerging' },
    ];
  }

  private async fetchFromGomtu(
    username: string,
    timeframe: string
  ): Promise<any> {
    const cacheKey = `gomtu:${username}:${timeframe}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    await this.checkRateLimit();
    await this.randomDelay();

    console.log(`[Gomtu] Fetching data for ${username} (${timeframe})`);

    try {
      const response = await fetch(
        'https://gomtu.xyz/api/kaito/leaderboard-search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': this.getRandomUserAgent(),
          },
          body: JSON.stringify({
            username,
            timeframe,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gomtu API failed: ${response.status}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data, 1800000); // 30 min
      console.log(`[API] ✅ Data from gomtu`);
      return data;
    } catch (error) {
      console.error('[Gomtu] Error:', error);
      throw error;
    }
  }

  private getTierEmoji(tier: string): string {
    const tierMap: { [key: string]: string } = {
      top: '🔥 Elite',
      high: '⚡ Rising',
      mid: '🚀 Growing',
      emerging: '💎 Emerging',
    };
    return tierMap[tier] || '📊 Ranked';
  }

  public async searchUser(
    username: string,
    timeframe: '7D' | '30D' | '3M',
    projectIds: string[]
  ): Promise<SearchResult> {
    const projects = this.getProjects();
    const selectedProjects = projects.filter((p) =>
      projectIds.includes(p.id)
    );

    if (selectedProjects.length === 0) {
      throw new Error('No valid projects selected');
    }

    console.log(
      `[API] Searching ${username} in ${selectedProjects.length} projects (${timeframe})`
    );

    const rankings: RankingResult[] = [];

    for (const project of selectedProjects) {
      try {
        const data = await this.fetchFromGomtu(username, timeframe);

        if (data && data.leaderboard && Array.isArray(data.leaderboard)) {
          const userEntry = data.leaderboard.find(
            (entry: any) =>
              entry.username &&
              entry.username.toLowerCase() === username.toLowerCase() &&
              entry.project &&
              entry.project.toUpperCase() === project.id
          );

          if (userEntry && userEntry.rank) {
            rankings.push({
              project: project.name,
              rank: userEntry.rank,
              tier: this.getTierEmoji(project.tier),
              mindshare: userEntry.mindshare || 0,
              timeframe,
            });
            console.log(
              `[API] Found in ${project.name}: Rank #${userEntry.rank}`
            );
          }
        }
      } catch (error) {
        console.error(`[API] Error searching ${project.name}:`, error);
      }

      await this.randomDelay();
    }

    rankings.sort((a, b) => a.rank - b.rank);

    const stats = {
      total_searched: selectedProjects.length,
      found_in: rankings.length,
      best_rank: rankings.length > 0 ? rankings[0].rank : null,
      avg_mindshare:
        rankings.length > 0
          ? rankings.reduce((sum, r) => sum + r.mindshare, 0) /
            rankings.length
          : 0,
    };

    return {
      user: {
        username,
        found: rankings.length > 0,
      },
      rankings,
      stats,
    };
  }
}

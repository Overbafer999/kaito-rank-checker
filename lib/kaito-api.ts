// lib/kaito-api.ts  

private async fetchProjects(): Promise<Project[]> {
  const cached = this.getCached('projects');
  if (cached) return cached;

  try {
    const res = await fetch('https://gomtu.xyz/api/kaito/leaderboard', {
      headers: { 'accept': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      // внешка отвалилась — вернём пустой список
      return [];
    }

    // безопасный парсинг
    const txt = await res.text();
    const json = txt ? JSON.parse(txt) : { data: [] };

    const data = Array.isArray(json?.data) ? json.data : [];
    this.setCache('projects', data, 86400000);
    return data;
  } catch {
    return [];
  }
}

private async fetchUserData(username: string): Promise<any[]> {
  const cached = this.getCached(`user:${username}`);
  if (cached) return cached;

  await this.checkRateLimit();
  try {
    const res = await fetch('https://gomtu.xyz/api/kaito/leaderboard-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({ username }),
      cache: 'no-store',
    });

    if (!res.ok) {
      // если 4xx/5xx — не роняем сервер
      this.setCache(`user:${username}`, [], 60_000);
      return [];
    }

    const txt = await res.text();
    const json = txt ? JSON.parse(txt) : { data: [] };

    const data = Array.isArray(json?.data) ? json.data : [];
    this.setCache(`user:${username}`, data, 1_800_000); // 30 мин
    return data;
  } catch {
    // сеть/таймаут — молча отдаём пусто
    this.setCache(`user:${username}`, [], 60_000);
    return [];
  }
}

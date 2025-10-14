'use client';
import { useState, useEffect, useMemo } from 'react';

type Project = {
  id: number;
  name: string;
  ticker: string;
  category: string;
  imgUrl: string;
};

type RankingEntry = { duration: string; rank: number; mindshare: number };
type GroupedRanking = { project: string; ticker: string; imgUrl: string; timeframes: RankingEntry[] };

export default function Home() {
  const [username, setUsername] = useState('');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M'>('30D');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | {
    user: { username: string; found: boolean };
    rankings: GroupedRanking[];
    stats: { total_projects: number; best_rank: number | null; avg_mindshare: number };
  }>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'preTGE' | 'postTGE'>('all');

  // --- fetch projects ---
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('https://gomtu.xyz/api/kaito/leaderboard');
        const j = await r.json();
        setProjects(j?.data || []);
      } finally {
        setLoadingProjects(false);
      }
    })();
  }, []);

  // --- derived ---
  const filteredProjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return projects.filter(p => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.ticker.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchQ && matchCat;
    });
  }, [projects, searchTerm, categoryFilter]);

  const toggle = (ticker: string) => {
    setSelected(prev => {
      if (prev.includes(ticker)) return prev.filter(x => x !== ticker);
      if (prev.length >= 10) return prev;
      return [...prev, ticker];
    });
  };

  const search = async () => {
    if (!username || selected.length === 0) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, projects: selected })
      });
      const data = await res.json();
      setResults(data.data);
      // опционально: scroll к результатам
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch {
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const tfOptions: Array<'7D' | '30D' | '3M'> = ['7D', '30D', '3M'];

  const getRankColor = (rank: number) => {
    if (rank <= 10) return 'text-yellow-300 font-semibold';
    if (rank <= 50) return 'text-emerald-300';
    if (rank <= 100) return 'text-cyan-300';
    return 'text-slate-300';
    // за пределами 100 оставляем обычный цвет
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-150px,rgba(34,211,238,0.12),transparent),linear-gradient(to_bottom,#0a0e1a,#0b1220)] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">

        {/* HEADER */}
        <header className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 shadow-[0_0_40px_-20px_rgba(33,212,253,0.6)]">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs tracking-wide text-cyan-300/90">Leaderboard • Mindshare</span>
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
            Find your rankings across <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">top crypto projects</span>
          </h1>
          <p className="mt-3 text-slate-400">Search up to 10 projects • Multi-timeframe support • Real-time data</p>
        </header>

        {/* SEARCH CARD */}
        <section className="bg-[#0f141b]/80 backdrop-blur-xs rounded-2xl p-5 md:p-7 ring-1 ring-white/5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]">
          {/* username */}
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Twitter Username</label>
            <input
              type="text"
              placeholder="@Zun2025"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-white/10 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* timeframes */}
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Timeframe</label>
            <div className="flex gap-2">
              {tfOptions.map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={[
                    'px-4 py-2 rounded-xl text-sm font-semibold ring-1 transition-all',
                    timeframe === tf
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 ring-transparent shadow-[0_0_30px_-10px_rgba(34,211,238,0.6)]'
                      : 'bg-white/5 hover:bg-white/10 ring-white/10'
                  ].join(' ')}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* filters */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
            <input
              type="text"
              placeholder="Search projects…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-950/70 rounded-xl border border-white/10 text-sm outline-none"
            />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-950/70 rounded-xl border border-white/10 text-sm outline-none"
            >
              <option value="all">All</option>
              <option value="preTGE">Pre-TGE</option>
              <option value="postTGE">Post-TGE</option>
            </select>
            <span className="text-xs text-slate-400 ml-auto">{selected.length}/10 selected</span>
          </div>

          {/* projects grid */}
          {loadingProjects ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredProjects.slice(0, 60).map(p => {
                const active = selected.includes(p.ticker);
                return (
                  <button
                    key={p.ticker}
                    onClick={() => toggle(p.ticker)}
                    className={[
                      'group flex items-center gap-2 px-3 py-2 rounded-lg border text-left',
                      active
                        ? 'border-transparent bg-gradient-to-r from-cyan-600/80 to-blue-600/70 shadow-[0_0_28px_-12px_rgba(34,211,238,0.7)]'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    ].join(' ')}
                  >
                    {p.imgUrl ? (
                      <img src={p.imgUrl} alt={p.name} className="h-6 w-6 rounded-full object-cover" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-white/10" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.ticker}</div>
                    </div>
                    <span className={[
                      'ml-auto text-[11px] px-2 py-0.5 rounded-md',
                      active ? 'bg-black/30 text-white' : 'bg-black/30 text-slate-300'
                    ].join(' ')}>
                      {active ? 'Selected' : 'Select'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-5">
            <button
              onClick={search}
              disabled={loading || !username || selected.length === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 rounded-xl font-semibold hover:opacity-95 active:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Searching…' : '⚡ Search Rankings'}
            </button>
          </div>
        </section>

        {/* RESULTS */}
        {results && (
          <section id="results" className="mt-8 md:mt-10 space-y-5">
            {/* summary */}
            <div className="bg-[#0f141b]/80 rounded-2xl p-5 ring-1 ring-white/5">
              <h2 className="text-xl font-bold mb-4">Results for @{results.user.username}</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-slate-400 text-xs uppercase">Projects</p>
                  <p className="text-2xl font-bold">{results.stats.total_projects}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase">Best Rank</p>
                  <p className="text-2xl font-bold text-cyan-300">#{results.stats.best_rank ?? '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase">Avg MS</p>
                  <p className="text-2xl font-bold">{results.stats.avg_mindshare.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            {/* board */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* table */}
              <div className="bg-[#0f141b]/80 rounded-2xl p-5 ring-1 ring-white/5">
                <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5">
                      <th className="text-left py-2">Project</th>
                      <th className="text-left py-2">Time</th>
                      <th className="text-left py-2">Rank</th>
                      <th className="text-left py-2">Mindshare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.rankings.flatMap(r => 
                      r.timeframes.map(tf => (
                        <tr key={r.ticker + tf.duration} className="border-b border-white/5">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              {r.imgUrl ? <img src={r.imgUrl} className="h-6 w-6 rounded-full" /> : <div className="h-6 w-6 rounded-full bg-white/10" />}
                              <span className="font-medium">{r.project}</span>
                              <span className="text-[11px] text-slate-400">({r.ticker})</span>
                            </div>
                          </td>
                          <td className="py-2">{tf.duration}</td>
                          <td className={`py-2 ${getRankColor(tf.rank)}`}>#{tf.rank}</td>
                          <td className="py-2">{tf.mindshare.toFixed(2)}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.rankings.map((r) => {
                  const topBadges = r.timeframes.filter(t => t.rank <= 100).map(t => t.duration);
                  const best = r.timeframes.reduce((m, t) => t.rank < m.rank ? t : m, r.timeframes[0]);
                  return (
                    <div key={r.ticker} className="rounded-2xl p-4 ring-1 ring-white/5 bg-[linear-gradient(120deg,rgba(50,255,220,0.06),transparent_40%),#0f141b] hover:shadow-[0_0_40px_-20px_rgba(33,212,253,0.6)] transition">
                      <div className="flex items-center gap-3 mb-3">
                        {r.imgUrl ? <img src={r.imgUrl} className="h-9 w-9 rounded-full" /> : <div className="h-9 w-9 rounded-full bg-white/10" />}
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{r.project}</div>
                          <div className="text-[12px] text-slate-400">{r.ticker}</div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className={`text-sm ${getRankColor(best.rank)}`}>#{best.rank}</div>
                          <div className="text-[11px] text-slate-400">{best.duration}</div>
                        </div>
                      </div>

                      {topBadges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {topBadges.map(b => (
                            <span key={b} className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-300/20">
                              🏆 Top 100 {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* mini progress bar as placeholder for sparkline */}
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
                          style={{ width: `${Math.min(100, (best.mindshare || 0))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="text-center text-slate-500 text-sm py-10">By <span className="text-cyan-300">@OveR_XBT</span></footer>
      </div>
    </div>
  );
}

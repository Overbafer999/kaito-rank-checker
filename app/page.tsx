'use client';
import { useState, useEffect, useMemo } from 'react';
import Card from './components/Card';
import Button from './components/Button';
import Chip from './components/Chip';
import Table from './components/Table';
import StatsCard from './components/StatsCard';
import ProjectTile from './components/ProjectTile';
import { local } from '../lib/utils/local';

type Project = { id: number; name: string; ticker: string; category: string; imgUrl: string };
type RankingEntry = { duration: string; rank: number; mindshare: number };
type GroupedRanking = { project: string; ticker: string; imgUrl: string; timeframes: RankingEntry[] };

export default function Home() {
  const [username, setUsername] = useState(local.get('username', ''));
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M'>(
    (typeof window !== 'undefined' && (new URLSearchParams(location.search).get('tf') as any)) || '30D'
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<string[]>(local.get('selected', []));
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | {
    user: { username: string; found: boolean };
    rankings: GroupedRanking[];
    stats: { total_projects: number; best_rank: number | null; avg_mindshare: number };
  }>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'preTGE' | 'postTGE'>('all');

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

  // persist state
  useEffect(() => {
    local.set('username', username);
    local.set('selected', selected);
  }, [username, selected]);

  // update URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      p.set('tf', timeframe);
      window.history.replaceState({}, '', `?${p.toString()}`);
    }
  }, [timeframe]);

  const filteredProjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return projects.filter(p => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.ticker.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchQ && matchCat;
    });
  }, [projects, searchTerm, categoryFilter]);

  const toggle = (ticker: string) => {
    setSelected(prev =>
      prev.includes(ticker)
        ? prev.filter(x => x !== ticker)
        : prev.length >= 10
        ? prev
        : [...prev, ticker]
    );
  };

  const search = async () => {
    if (!username || selected.length === 0) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, projects: selected }),
      });
      const data = await res.json();
      setResults(data.data);
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100);
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
  };

  return (
    <div className="min-h-screen bg-app text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">

        {/* HEADER */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="chip ring-glow mx-auto mb-4 animate-float">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs tracking-wide text-cyan-300/90">Leaderboard • Mindshare</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Find your rankings across{' '}
            <span className="text-gradient">top crypto projects</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Search up to 10 projects • Multi-timeframe support • Real-time data
          </p>
        </header>

        {/* SEARCH CARD */}
        <Card glass glow>
          <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Twitter Username</label>
          <input
            type="text"
            placeholder="@Zun2025"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-white/10 focus:border-cyan-500 outline-none mb-5"
          />

          <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Timeframe</label>
          <div className="flex gap-2 mb-5">
            {tfOptions.map(tf => (
              <Chip key={tf} active={timeframe === tf} onClick={() => setTimeframe(tf)}>
                {tf}
              </Chip>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
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

          {loadingProjects ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-10 skeleton" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredProjects.slice(0, 60).map(p => {
                const active = selected.includes(p.ticker);
                return (
                  <Chip key={p.ticker} active={active} onClick={() => toggle(p.ticker)} className="w-full justify-start">
                    {p.imgUrl
                      ? <img src={p.imgUrl} alt={p.name} className="h-6 w-6 rounded-full object-cover" />
                      : <div className="h-6 w-6 rounded-full bg-white/10" />}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.ticker}</div>
                    </div>
                  </Chip>
                );
              })}
            </div>
          )}

          <div className="mt-6">
            <Button onClick={search} disabled={loading || !username || selected.length === 0}>
              {loading ? 'Searching…' : '⚡ Search Rankings'}
            </Button>
          </div>
        </Card>

        {/* RESULTS */}
        {results && (
          <section id="results" className="mt-10 space-y-5 animate-fade-in">
            <StatsCard
              username={results.user.username}
              total={results.stats.total_projects}
              best={results.stats.best_rank}
              avg={results.stats.avg_mindshare}
            />

            <div className="grid md:grid-cols-2 gap-5">
              <Card glass>
                <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
                <Table
                  columns={['Project', 'Time', 'Rank', 'Mindshare']}
                  rows={results.rankings.flatMap(r =>
                    r.timeframes.map(tf => [
                      <div className="flex items-center gap-2" key={r.ticker}>
                        {r.imgUrl
                          ? <img src={r.imgUrl} className="h-6 w-6 rounded-full" />
                          : <div className="h-6 w-6 rounded-full bg-white/10" />}
                        <span className="font-medium">{r.project}</span>
                        <span className="text-[11px] text-slate-400">({r.ticker})</span>
                      </div>,
                      tf.duration,
                      <span className={getRankColor(tf.rank)}>#{tf.rank}</span>,
                      `${tf.mindshare.toFixed(2)}%`
                    ])
                  )}
                />
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.rankings.map(r => {
                  const topBadges = r.timeframes.filter(t => t.rank <= 100).map(t => t.duration);
                  const best = r.timeframes.reduce((m, t) => (t.rank < m.rank ? t : m), r.timeframes[0]);
                  return (
                    <ProjectTile
                      key={r.ticker}
                      project={r.project}
                      ticker={r.ticker}
                      imgUrl={r.imgUrl}
                      rank={best.rank}
                      duration={best.duration}
                      mindshare={best.mindshare}
                      badges={topBadges}
                      getRankColor={getRankColor}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <footer className="text-center text-slate-500 text-sm py-10">
          By <span className="text-cyan-300">@OveR_XBT</span>
        </footer>
      </div>
    </div>
  );
}

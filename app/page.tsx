'use client';
import { useState, useEffect } from 'react';

interface Project {
  id: number;
  name: string;
  ticker: string;
  category: string;
  imgUrl: string;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');

  useEffect(() => {
    fetch('https://gomtu.xyz/api/kaito/leaderboard')
      .then(r => r.json())
      .then(d => {
        setProjects(d.data || []);
        setLoadingProjects(false);
      })
      .catch(() => setLoadingProjects(false));
  }, []);

  const toggle = (ticker: string) => {
    setSelected(prev => 
      prev.includes(ticker) ? prev.filter(p => p !== ticker) : 
      prev.length < 10 ? [...prev, ticker] : prev
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
        body: JSON.stringify({ username, projects: selected })
      });
      const data = await res.json();
      setResults(data.data);
    } catch (err) {
      alert('Error searching');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank <= 10) return 'text-yellow-400 font-bold';
    if (rank <= 50) return 'text-green-400';
    if (rank <= 100) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getTop100Badge = (timeframes: any[]) => {
    const top100 = timeframes.filter(tf => tf.rank <= 100);
    if (top100.length === 0) return null;
    return (
      <div className="flex gap-1 flex-wrap mb-2">
        {top100.map(tf => (
          <span key={tf.duration} className="text-xs bg-yellow-600 px-2 py-0.5 rounded">
            🏆 Top 100 {tf.duration}
          </span>
        ))}
      </div>
    );
  };

  const filteredProjects = projects
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.ticker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || 
                              (categoryFilter === 'preTGE' && p.category === 'preTGE') ||
                              (categoryFilter === 'postTGE' && p.category === 'postTGE');
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (a.category || '').localeCompare(b.category || '');
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Kaito Rank Tracker V2
          </h1>
          <p className="text-gray-400">Search across 130+ crypto projects • All timeframes</p>
        </div>

        {/* Search Form */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30 shadow-2xl">
          
          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-purple-300">Twitter Username</label>
            <input
              type="text"
              placeholder="@username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/80 rounded-xl border border-purple-500/30 focus:border-purple-500 outline-none transition"
            />
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-purple-300">
              Select Projects ({selected.length}/10)
            </label>

            {/* Search & Filters Bar */}
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="🔍 Search projects..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900/80 rounded-lg border border-purple-500/30 focus:border-purple-500 outline-none text-sm transition"
              />
              
              <div className="flex gap-2 flex-wrap items-center">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900/80 rounded-lg border border-purple-500/30 text-sm outline-none cursor-pointer hover:border-purple-500 transition"
                >
                  <option value="all">All Categories</option>
                  <option value="preTGE">🔵 Pre-TGE</option>
                  <option value="postTGE">🟢 Post-TGE</option>
                </select>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'name' | 'category')}
                  className="px-3 py-2 bg-slate-900/80 rounded-lg border border-purple-500/30 text-sm outline-none cursor-pointer hover:border-purple-500 transition"
                >
                  <option value="name">Sort: A-Z</option>
                  <option value="category">Sort: Category</option>
                </select>

                {selected.length > 0 && (
                  <button
                    onClick={() => setSelected([])}
                    className="px-3 py-2 bg-red-600/80 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    Clear All
                  </button>
                )}

                <span className="text-xs text-gray-500 ml-auto">
                  {filteredProjects.length} projects
                </span>
              </div>
            </div>

            {/* Projects Grid */}
            {loadingProjects ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-gray-400 mt-2">Loading projects...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-80 overflow-y-auto p-2 bg-slate-900/30 rounded-xl">
                {filteredProjects.slice(0, 80).map(p => (
                  <button
                    key={p.ticker}
                    onClick={() => toggle(p.ticker)}
                    className={`px-3 py-2.5 rounded-lg text-sm transition-all flex flex-col items-start gap-1 ${
                      selected.includes(p.ticker)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    <span className="font-semibold text-left">{p.name}</span>
                    <span className="text-xs opacity-70">
                      {p.category === 'preTGE' ? '🔵 Pre' : p.category === 'postTGE' ? '🟢 Post' : '⚪'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={search}
            disabled={loading || !username || selected.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                Searching...
              </span>
            ) : (
              'Search Rankings ⚡'
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Stats Card */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Results for @{results.user.username}
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Projects Found</p>
                  <p className="text-4xl font-bold text-purple-400">{results.stats.total_projects}</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Best Rank</p>
                  <p className="text-4xl font-bold text-green-400">#{results.stats.best_rank}</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Avg Mindshare</p>
                  <p className="text-4xl font-bold text-blue-400">{results.stats.avg_mindshare.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            {/* Project Cards */}
            <div className="space-y-4">
              {results.rankings.map((r: any) => (
                <div key={r.ticker} className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 shadow-xl hover:border-purple-400 transition">
                  
                  {/* Project Header */}
                  <div className="flex items-center gap-3 mb-4">
                    {r.imgUrl && (
                      <img src={r.imgUrl} alt={r.project} className="w-12 h-12 rounded-full border-2 border-purple-500" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{r.project}</h3>
                      <span className="text-xs bg-purple-600/80 px-2 py-1 rounded-full">{r.ticker}</span>
                    </div>
                  </div>

                  {/* Top 100 Badges */}
                  {getTop100Badge(r.timeframes)}

                  {/* Timeframes Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-slate-700">
                          <th className="pb-3 font-semibold">Timeframe</th>
                          <th className="pb-3 font-semibold">Rank</th>
                          <th className="pb-3 font-semibold">Mindshare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.timeframes.map((tf: any, idx: number) => (
                          <tr key={tf.duration} className={`border-b border-slate-700/50 ${idx === r.timeframes.length - 1 ? 'border-0' : ''}`}>
                            <td className="py-3 font-bold text-purple-300">{tf.duration}</td>
                            <td className={`py-3 text-xl ${getRankColor(tf.rank)} flex items-center gap-2`}>
                              #{tf.rank}
                              {tf.rank <= 100 && <span className="text-base">🏆</span>}
                            </td>
                            <td className="py-3 text-purple-400 font-semibold">{tf.mindshare.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-16 pb-8">
        <p>Thanks to <a href="https://gomtu.xyz" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">gomtu.xyz</a> & <a href="https://kaito.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Kaito AI</a></p>
        <p className="mt-1">Made with 💜 by @Over9725</p>
      </footer>
    </div>
  );
}

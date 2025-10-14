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
  const [timeframe, setTimeframe] = useState('30D');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const filteredProjects = projects
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Find your rankings across top crypto projects</h1>
          <p className="text-gray-400">Search up to 10 projects • Multi-timeframe support • Real-time data</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
          
          <div className="mb-6">
            <label className="block text-sm mb-2">Twitter Username</label>
            <input
              type="text"
              placeholder="@Zun2025"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 rounded border border-slate-700 focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">Timeframe</label>
            <div className="grid grid-cols-3 gap-3">
              {['7D', '30D', '3M'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`py-3 rounded font-semibold transition ${
                    timeframe === tf
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm">Select Projects (max 10)</label>
              <span className="text-sm text-gray-400">{selected.length}/10 selected</span>
            </div>

            <div className="mb-3 flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 rounded border border-slate-700 text-sm outline-none"
              />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 rounded border border-slate-700 text-sm outline-none"
              >
                <option value="all">All</option>
                <option value="preTGE">Pre-TGE</option>
                <option value="postTGE">Post-TGE</option>
              </select>
            </div>

            {loadingProjects ? (
              <p className="text-center py-4 text-gray-400">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {filteredProjects.slice(0, 40).map(p => (
                  <button
                    key={p.ticker}
                    onClick={() => toggle(p.ticker)}
                    className={`px-4 py-2 rounded text-sm font-medium transition ${
                      selected.includes(p.ticker)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={search}
            disabled={loading || !username || selected.length === 0}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : '⚡ Search Rankings'}
          </button>
        </div>

        {results && (
          <div className="mt-8 space-y-4">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Results for @{results.user.username}</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">Projects</p>
                  <p className="text-2xl font-bold">{results.stats.total_projects}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Best Rank</p>
                  <p className="text-2xl font-bold text-cyan-400">#{results.stats.best_rank}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg MS</p>
                  <p className="text-2xl font-bold">{results.stats.avg_mindshare.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            {results.rankings.map((r: any) => (
              <div key={r.ticker} className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  {r.imgUrl && <img src={r.imgUrl} alt={r.project} className="w-10 h-10 rounded-full" />}
                  <h3 className="text-lg font-bold">{r.project}</h3>
                </div>
                
                {r.timeframes.filter((tf: any) => tf.rank <= 100).length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {r.timeframes.filter((tf: any) => tf.rank <= 100).map((tf: any) => (
                      <span key={tf.duration} className="text-xs bg-yellow-600 px-2 py-1 rounded">
                        🏆 Top 100 {tf.duration}
                      </span>
                    ))}
                  </div>
                )}

                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-400 border-b border-slate-700">
                      <th className="text-left pb-2">Time</th>
                      <th className="text-left pb-2">Rank</th>
                      <th className="text-left pb-2">Mindshare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.timeframes.map((tf: any) => (
                      <tr key={tf.duration} className="border-b border-slate-700/50">
                        <td className="py-2 font-semibold">{tf.duration}</td>
                        <td className={`py-2 ${getRankColor(tf.rank)}`}>#{tf.rank}</td>
                        <td className="py-2">{tf.mindshare.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-center text-gray-500 text-sm py-8">
        <p>Thanks to <a href="https://gomtu.xyz" className="text-cyan-400 hover:underline">gomtu.xyz</a> & <a href="https://kaito.ai" className="text-cyan-400 hover:underline">Kaito AI</a></p>
        <p>Made by @Over9725</p>
      </footer>
    </div>
  );
}

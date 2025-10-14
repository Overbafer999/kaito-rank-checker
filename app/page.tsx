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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Kaito Rank Tracker V2
          </h1>
          <p className="text-gray-400">Search across 130+ crypto projects</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Twitter Username</label>
            <input
              type="text"
              placeholder="@username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-purple-500/30 focus:border-purple-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Select Projects ({selected.length}/10)
            </label>
            {loadingProjects ? (
              <p className="text-gray-400">Loading projects...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {projects.slice(0, 50).map(p => (
                  <button
                    key={p.ticker}
                    onClick={() => toggle(p.ticker)}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      selected.includes(p.ticker)
                        ? 'bg-purple-600 text-white'
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Rankings'}
          </button>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold mb-4">
                Results for @{results.user.username}
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">Projects Found</p>
                  <p className="text-3xl font-bold text-purple-400">{results.stats.total_projects}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Best Rank</p>
                  <p className="text-3xl font-bold text-green-400">#{results.stats.best_rank}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg Mindshare</p>
                  <p className="text-3xl font-bold text-blue-400">{results.stats.avg_mindshare.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {results.rankings.map((r: any) => (
                <div key={r.ticker} className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    {r.imgUrl && (
                      <img src={r.imgUrl} alt={r.project} className="w-10 h-10 rounded-full" />
                    )}
                    <h3 className="text-xl font-bold">{r.project}</h3>
                    <span className="text-xs bg-purple-600 px-2 py-1 rounded">{r.ticker}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-slate-700">
                          <th className="pb-2">Time</th>
                          <th className="pb-2">Rank</th>
                          <th className="pb-2">Mindshare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.timeframes.map((tf: any) => (
                          <tr key={tf.duration} className="border-b border-slate-700/50">
                            <td className="py-3 font-semibold">{tf.duration}</td>
                            <td className={`py-3 text-lg ${getRankColor(tf.rank)}`}>#{tf.rank}</td>
                            <td className="py-3 text-purple-400">{tf.mindshare.toFixed(2)}%</td>
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

      <footer className="text-center text-gray-500 text-sm mt-12">
        <p>Thanks to <a href="https://gomtu.xyz" className="text-purple-400 hover:underline">gomtu.xyz</a> & <a href="https://kaito.ai" className="text-purple-400 hover:underline">Kaito AI</a></p>
        <p>Made by @Over9725</p>
      </footer>
    </div>
  );
}

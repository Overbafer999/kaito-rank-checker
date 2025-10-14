'use client';

import { useState } from 'react';
import { Search, TrendingUp, Zap } from 'lucide-react';

interface SearchResult {
  user: { username: string; found: boolean };
  rankings: Array<{
    project: string;
    rank: number;
    tier: string;
    mindshare: number;
    timeframe: string;
  }>;
  stats: {
    total_searched: number;
    found_in: number;
    best_rank: number | null;
    avg_mindshare: number;
  };
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M'>('30D');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Top 20 most popular projects for quick selection
  const topProjects = [
    'PUMP', 'NEWTON', 'MITOSIS', 'STORYPROTOCOL', 'CAMP', 'ANOMA',
    'HYPERLIQUID', 'VIRTUALS', 'CALDERA', 'UNION', 'INFINEX', 'MEGAETH',
    'BOUNDLESS', 'BLS', 'MIRA', 'BERACHAIN', 'PARALLEL', 'AETHIR',
    'GRASS', 'PUDGYPENGUINS'
  ];

  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (selectedProjects.length === 0) {
      setError('Please select at least one project');
      return;
    }

    if (selectedProjects.length > 10) {
      setError('Maximum 10 projects allowed');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.replace('@', ''),
          timeframe,
          projects: selectedProjects
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleProject = (project: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(project)) {
        return prev.filter(p => p !== project);
      }
      if (prev.length >= 10) {
        setError('Maximum 10 projects allowed');
        return prev;
      }
      setError('');
      return [...prev, project];
    });
  };

  const getRankColor = (rank: number) => {
    if (rank <= 10) return 'text-yellow-400';
    if (rank <= 25) return 'text-cyan-400';
    if (rank <= 50) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Kaito Rank Tracker
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Find your rankings across top crypto projects
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Search up to 10 projects • Multi-timeframe support • Real-time data
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 shadow-2xl mb-8">
          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-slate-300 mb-2 font-medium">
              Twitter Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="mb-6">
            <label className="block text-slate-300 mb-3 font-medium">
              Timeframe
            </label>
            <div className="flex gap-3">
              {(['7D', '30D', '3M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    timeframe === tf
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Project Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-slate-300 font-medium">
                Select Projects (max 10)
              </label>
              <span className="text-sm text-slate-500">
                {selectedProjects.length}/10 selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-slate-800/30 rounded-xl">
              {topProjects.map((project) => (
                <button
                  key={project}
                  onClick={() => toggleProject(project)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    selectedProjects.includes(project)
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  {project}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Search Rankings
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 shadow-2xl">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Found In</div>
                <div className="text-2xl font-bold text-white">
                  {result.stats.found_in}/{result.stats.total_searched}
                </div>
                <div className="text-cyan-400 text-xs mt-1">projects</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Best Rank</div>
                <div className={`text-2xl font-bold ${getRankColor(result.stats.best_rank || 999)}`}>
                  {result.stats.best_rank ? `#${result.stats.best_rank}` : 'N/A'}
                </div>
                <div className="text-cyan-400 text-xs mt-1">position</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Avg Mindshare</div>
                <div className="text-2xl font-bold text-white">
                  {result.stats.avg_mindshare.toFixed(3)}%
                </div>
                <div className="text-cyan-400 text-xs mt-1">mindshare</div>
              </div>
            </div>

            {/* Rankings Table */}
            {result.rankings.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Rankings Found
                </h3>
                <div className="space-y-3">
                  {result.rankings.map((ranking, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getRankBadge(index)}</div>
                        <div>
                          <div className="text-white font-semibold text-lg">
                            {ranking.project}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {ranking.tier}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getRankColor(ranking.rank)}`}>
                          #{ranking.rank}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {ranking.mindshare.toFixed(3)}% mindshare
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-xl text-slate-400 mb-2">No rankings found</div>
                <div className="text-slate-500 text-sm">
                  {result.user.username} was not found in the top 100 of selected projects
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-slate-500 text-sm">
          <p>Made by @Over9725 • Data updates hourly</p>
          <p className="mt-2">
            Powered by Kaito AI • Not affiliated with Kaito
          </p>
        </div>
      </div>
    </div>
  );
}

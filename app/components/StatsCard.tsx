import React from 'react';
import Card from './Card';

interface Props {
  username: string;
  total: number;
  best: number | null;
  avg: number;
}

export const StatsCard: React.FC<Props> = ({ username, total, best, avg }) => (
  <Card glass glow className="text-center">
    <h2 className="text-xl font-bold mb-4">Results for @{username}</h2>
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-slate-400 text-xs uppercase">Projects</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase">Best Rank</p>
        <p className="text-2xl font-bold text-cyan-300">
          {best ? `#${best}` : '—'}
        </p>
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase">Avg MS</p>
        <p className="text-2xl font-bold">{avg.toFixed(2)}%</p>
      </div>
    </div>
  </Card>
);

export default StatsCard;

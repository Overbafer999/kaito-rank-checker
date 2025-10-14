import React from 'react';
import Card from './Card';
import Badge from './Badge';

interface Props {
  project: string;
  ticker: string;
  imgUrl: string;
  rank: number;
  duration: string;
  mindshare: number;
  badges: string[];
  getRankColor: (rank: number) => string;
}

export const ProjectTile: React.FC<Props> = ({
  project,
  ticker,
  imgUrl,
  rank,
  duration,
  mindshare,
  badges,
  getRankColor,
}) => (
  <Card className="hover-lift transition-all">
    <div className="flex items-center gap-3 mb-3">
      {imgUrl ? (
        <img src={imgUrl} className="h-9 w-9 rounded-full" />
      ) : (
        <div className="h-9 w-9 rounded-full bg-white/10" />
      )}
      <div className="min-w-0">
        <div className="font-semibold truncate">{project}</div>
        <div className="text-[12px] text-slate-400">{ticker}</div>
      </div>
      <div className="ml-auto text-right">
        <div className={`text-sm ${getRankColor(rank)}`}>#{rank}</div>
        <div className="text-[11px] text-slate-400">{duration}</div>
      </div>
    </div>

    {badges.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-3">
        {badges.map((b) => (
          <Badge key={b} text={`Top 100 ${b}`} />
        ))}
      </div>
    )}

    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all"
        style={{ width: `${Math.min(100, mindshare)}%` }}
      />
    </div>
  </Card>
);

export default ProjectTile;

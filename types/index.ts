export interface Project {
  id: number;
  name: string;
  ticker: string;
  category: string;
  imgUrl: string;
}

export interface RankingEntry {
  duration: string;
  rank: number;
  mindshare: number;
}

export interface GroupedRanking {
  project: string;
  ticker: string;
  imgUrl: string;
  timeframes: RankingEntry[];
}

// app/api/projects/route.ts
import { NextResponse } from 'next/server';

let cache: { data: any; ts: number } | null = null;
const TTL = 1000 * 60 * 30; // 30 минут

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < TTL) {
      return NextResponse.json(cache.data, { headers: { 'x-cache': 'HIT' } });
    }
    const r = await fetch('https://gomtu.xyz/api/kaito/leaderboard', { cache: 'no-store' });
    const j = await r.json();
    cache = { data: j, ts: Date.now() };
    return NextResponse.json(j, { headers: { 'x-cache': 'MISS' } });
  } catch (e) {
    return NextResponse.json({ data: [] }, { status: 200, headers: { 'x-cache': 'ERROR' } });
  }
}

// app/api/search/route.ts - UPGRADED
import { NextRequest, NextResponse } from 'next/server';
import { SmartKaitoAPI } from '@/lib/kaito-api';

export const runtime = 'edge';
export const maxDuration = 25;

export async function POST(req: NextRequest) {
  try {
    const { username, projects } = await req.json();

    if (!username || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    if (projects.length > 10) {
      return NextResponse.json({ error: 'Max 10 projects' }, { status: 400 });
    }

    const api = new SmartKaitoAPI();
    const result = await api.searchUser(username.replace('@', ''), projects);
    api.cleanupCache();

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
EOF

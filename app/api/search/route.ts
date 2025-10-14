// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { SmartKaitoAPI } from '../../../lib/kaito-api'; // путь от app/api/search → к корню /lib

const api = new SmartKaitoAPI();

export async function POST(req: Request) {
  try {
    const { username, projects } = await req.json();

    if (!username || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Bad input' }, { status: 400 });
    }

    // убираем @ на всякий случай
    const clean = String(username).trim().replace(/^@/, '');

    const data = await api.searchUser(clean, projects);
    return NextResponse.json({ data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    );
  }
}

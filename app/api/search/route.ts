// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SmartKaitoAPI } from '@/lib/kaito-api';

export const runtime = 'edge';
export const maxDuration = 25;

interface SearchRequest {
  username: string;
  timeframe: '7D' | '30D' | '3M';
  projects: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: SearchRequest = await req.json();

    // Validation
    if (!body.username || typeof body.username !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (!['7D', '30D', '3M'].includes(body.timeframe)) {
      return NextResponse.json(
        { success: false, error: 'Invalid timeframe. Use 7D, 30D, or 3M' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.projects) || body.projects.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one project must be selected' },
        { status: 400 }
      );
    }

    if (body.projects.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Maximum 10 projects allowed' },
        { status: 400 }
      );
    }

    // Clean username
    const cleanUsername = body.username.replace('@', '').trim();

    if (cleanUsername.length === 0 || cleanUsername.length > 15) {
      return NextResponse.json(
        { success: false, error: 'Invalid username format' },
        { status: 400 }
      );
    }

    console.log(`[API] Searching ${cleanUsername} in ${body.projects.length} projects (${body.timeframe})`);

    // Initialize API and search
    const api = new SmartKaitoAPI();
    const startTime = Date.now();
    
    const result = await api.searchUser(
      cleanUsername,
      body.timeframe,
      body.projects
    );

    const processingTime = Math.round((Date.now() - startTime) / 1000);

    console.log(`[API] ✅ Search completed in ${processingTime}s - Found in ${result.stats.found_in} projects`);

    // Cleanup old cache
    api.cleanupCache();

    return NextResponse.json(
      {
        success: true,
        data: {
          ...result,
          processing_time: processingTime
        }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
        }
      }
    );

  } catch (error: any) {
    console.error('[API] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
  );
}

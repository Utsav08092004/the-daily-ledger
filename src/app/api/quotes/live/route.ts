import { NextResponse } from 'next/server';
import { fetchAllLiveQuotes } from '@/lib/live-quotes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { quotes, session } = await fetchAllLiveQuotes();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: quotes.length,
      session,
      quotes
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch live quotes'
    }, { status: 500 });
  }
}

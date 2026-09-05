import { NextResponse } from 'next/server';
import { fetchLiveFinancialNews } from '@/lib/live-news';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const news = await fetchLiveFinancialNews();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: news.length,
      news
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch live financial news'
    }, { status: 500 });
  }
}

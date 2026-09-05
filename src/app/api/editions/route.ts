import { NextRequest, NextResponse } from 'next/server';
import { getEditions, getEditionById, getLatestEdition } from '@/lib/db';
import { getLiveSyncedDailyEdition, generateDailyEdition, getIndianCurrentDateStr } from '@/lib/news-generator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const latest = searchParams.get('latest');
  const sync = searchParams.get('sync');
  const todayStr = getIndianCurrentDateStr();

  if (date) {
    let edition = getEditionById(date);
    if (!edition && date === todayStr) {
      edition = await getLiveSyncedDailyEdition(todayStr);
    }
    if (!edition) {
      return NextResponse.json({ error: 'Edition not found for date ' + date }, { status: 404 });
    }
    return NextResponse.json(edition, {
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }

  if (latest === 'true' || sync === 'true') {
    const latestEdition = await getLiveSyncedDailyEdition(todayStr);
    return NextResponse.json(latestEdition, {
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }

  const editions = getEditions();
  return NextResponse.json(editions, {
    headers: {
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

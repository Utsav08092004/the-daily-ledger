import { NextRequest, NextResponse } from 'next/server';
import { generateDailyEdition } from '@/lib/news-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetDate = body.targetDate;
    const edition = generateDailyEdition(targetDate);

    return NextResponse.json({
      success: true,
      message: `Generated fresh edition for ${edition.date}!`,
      edition
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed.' }, { status: 500 });
  }
}

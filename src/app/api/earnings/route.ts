import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CompanyEarningsReport } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const symbol = searchParams.get('symbol');

    const filePath = path.join(process.cwd(), 'data', 'earnings.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: true, count: 0, reports: [] });
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    let reports = JSON.parse(raw) as CompanyEarningsReport[];

    if (sector && sector !== 'All') {
      reports = reports.filter(r => r.sector.toLowerCase() === sector.toLowerCase());
    }

    if (symbol) {
      reports = reports.filter(r => r.symbol.toLowerCase() === symbol.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch earnings'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { CompanyEarningsReport } from '@/lib/types';
import earningsData from '../../../../data/earnings.json';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const symbol = searchParams.get('symbol');

    let reports = ((earningsData as unknown) || []) as CompanyEarningsReport[];

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

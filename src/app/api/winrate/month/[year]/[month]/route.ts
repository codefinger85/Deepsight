import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ year: string; month: string }> }
) {
  const { year: yearStr, month: monthStr } = await params;
  try {
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    
    const winrateData = await db.getWinrateByMonth(year, month);
    
    if (!winrateData) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(winrateData);
  } catch (error) {
    console.error('Error fetching monthly winrate:', error);
    return NextResponse.json({ error: 'Failed to fetch winrate data' }, { status: 500 });
  }
}
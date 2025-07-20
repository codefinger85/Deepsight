import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ year: string; week: string }> }
) {
  const { year: yearStr, week: weekStr } = await params;
  try {
    const year = parseInt(yearStr);
    const week = parseInt(weekStr);
    
    const winrateData = await db.getWinrateByWeek(year, week);
    
    if (!winrateData) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(winrateData);
  } catch (error) {
    console.error('Error fetching weekly winrate:', error);
    return NextResponse.json({ error: 'Failed to fetch winrate data' }, { status: 500 });
  }
}
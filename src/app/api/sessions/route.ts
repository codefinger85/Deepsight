import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function GET() {
  try {
    const data = await db.getAllSessionsWithTrades();
    const sessions = data.sessions;
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, date, winCount, lossCount, tradesCount, winRate, startingBalance, closingBalance } = body;
    
    await db.saveSession(id, date, winCount, lossCount, tradesCount, winRate, startingBalance, closingBalance);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}
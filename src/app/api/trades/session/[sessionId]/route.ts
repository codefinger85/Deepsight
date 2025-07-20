import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  try {
    const trades = await db.getSessionTrades(sessionId);
    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades for session:', sessionId, error);
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}
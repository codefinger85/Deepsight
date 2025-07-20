import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, date, confirmationsCount, confirmations, result } = body;
    
    await db.saveTrade(sessionId, date, confirmationsCount, confirmations, result);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving trade:', error);
    return NextResponse.json({ error: 'Failed to save trade' }, { status: 500 });
  }
}
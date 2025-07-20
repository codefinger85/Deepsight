import { NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function GET() {
  try {
    const data = await db.getAllSessionsWithTrades();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sessions with trades:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions with trades' }, { status: 500 });
  }
}
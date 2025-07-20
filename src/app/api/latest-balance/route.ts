import { NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function GET() {
  try {
    const latestBalance = await db.getLatestBalance();
    return NextResponse.json(latestBalance);
  } catch (error) {
    console.error('Error fetching latest balance:', error);
    return NextResponse.json({ error: 'Failed to fetch latest balance' }, { status: 500 });
  }
}
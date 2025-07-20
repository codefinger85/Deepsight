import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ tradeId: string }> }) {
  const { tradeId } = await params;
  try {
    const body = await request.json();
    const { lossReasons } = body;
    
    await db.updateLossReasons(parseInt(tradeId), lossReasons);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating loss reasons:', error);
    return NextResponse.json({ error: 'Failed to update loss reasons' }, { status: 500 });
  }
}
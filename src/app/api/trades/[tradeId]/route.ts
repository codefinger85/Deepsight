import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ tradeId: string }> }) {
  const { tradeId } = await params;
  try {
    await db.deleteTrade(parseInt(tradeId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trade:', error);
    return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 });
  }
}
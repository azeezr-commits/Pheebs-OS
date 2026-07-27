import { NextRequest, NextResponse } from 'next/server';
import { StorageEngine } from '@/packages/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trace = await StorageEngine.getTrace(id);

    if (!trace) {
      return NextResponse.json({ error: 'Trace not found' }, { status: 404 });
    }

    return NextResponse.json(trace);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch trace' }, { status: 500 });
  }
}

/**
 * Brief by Pheebs — API Route Handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateBrief } from '@/packages/generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'A valid Google Business Profile or Maps URL is required' },
        { status: 400 }
      );
    }

    const brief = await generateBrief(url);
    return NextResponse.json(brief, { status: 200 });
  } catch (error: any) {
    console.error('Error generating Brief by Pheebs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate Brief' },
      { status: 500 }
    );
  }
}

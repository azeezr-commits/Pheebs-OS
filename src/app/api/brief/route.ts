import { NextRequest, NextResponse } from 'next/server';
import { TheBrain } from '@/packages/brain';
import { StorageEngine } from '@/packages/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Execute 5-Stage Deterministic Judgment Pipeline
    // Stage 1: Observer (Facts) -> Stage 2: Signals -> Stage 3: Diagnosis -> Stage 4: Strategy -> Stage 5: Brief
    const reasoningContract = await TheBrain.executeJudgmentPipeline(url);
    await StorageEngine.saveContract(reasoningContract);

    // Project contract into disposable UI view
    const brief = StorageEngine.projectContractToBrief(reasoningContract);

    return NextResponse.json(brief);
  } catch (error: any) {
    console.error('Error executing Judgment Pipeline:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute judgment pipeline' },
      { status: 500 }
    );
  }
}

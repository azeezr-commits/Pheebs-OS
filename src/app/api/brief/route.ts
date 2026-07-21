/**
 * Pheebs Core - Genesis v0.2 Brief Interface API Orchestrator
 * Pipeline: Observer -> Business Record & Signals -> The Brain -> Playbook -> Thinking Trace (Persisted) -> Disposable Brief
 */

import { NextRequest, NextResponse } from 'next/server';
import { observeBusiness } from '@/packages/observer';
import { TheBrain } from '@/packages/brain';
import { StorageEngine } from '@/packages/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, playbookKey = 'zoca' } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'A valid Google Maps or Business Profile URL is required' },
        { status: 400 }
      );
    }

    // 1. Observer Service: Extracts Business Record & Signals (Stored Forever)
    const businessRecord = await observeBusiness(url);
    await StorageEngine.saveBusinessRecord(businessRecord);

    // 2. The Brain: Formulates Diagnosis & Strategy, Selects Playbook Recommendation, & Saves Versioned Thinking Trace
    const thinkingTrace = await TheBrain.generateThinkingTrace(businessRecord, playbookKey);
    await StorageEngine.saveThinkingTrace(thinkingTrace);

    // 3. Disposable Brief UI Projection
    const brief = StorageEngine.projectToBrief(thinkingTrace);

    return NextResponse.json({ brief, trace: thinkingTrace }, { status: 200 });
  } catch (error: any) {
    console.error('Error generating Pheebs Genesis Brief:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate Pheebs Brief' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const traces = await StorageEngine.listThinkingTraces();
    const briefs = traces.map(StorageEngine.projectToBrief);
    return NextResponse.json({ briefs, traces }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Pheebs Core - Genesis Brief Generator API Orchestrator
 * Pipeline: Observer -> Reasoner -> Strategist -> Adapter -> DB Save -> Return Brief
 */

import { NextRequest, NextResponse } from 'next/server';
import { observeBusiness } from '@/packages/observer';
import { diagnoseBusiness } from '@/packages/reasoner';
import { formulateStrategy } from '@/packages/strategist';
import { adaptStrategy } from '@/packages/adapters';
import { DbRepository } from '@/packages/shared/db';
import { PheebsBrief } from '@/packages/shared/types';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { url, adapterKey = 'zoca' } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'A valid Google Maps or Business Profile URL is required' },
        { status: 400 }
      );
    }

    // 1. Observer Package (Pure Factual Extraction, No AI)
    const business = await observeBusiness(url);
    await DbRepository.saveBusiness(business);

    // 2. Reasoner Package (Primary Constraint Reasoning)
    const diagnosis = await diagnoseBusiness(business);
    await DbRepository.saveDiagnosis(diagnosis);

    // 3. Strategist Package (Consultative Conversation Strategy)
    const strategy = await formulateStrategy(diagnosis);

    // 4. Adapter Package (Playbook & Recommendation Mapping)
    const recommendation = await adaptStrategy(strategy, business, adapterKey);

    const executionTimeMs = Date.now() - startTime;
    const briefId = `brief_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const brief: PheebsBrief = {
      id: briefId,
      business,
      diagnosis,
      strategy,
      recommendation,
      generatedAt: new Date().toISOString(),
      executionTimeMs
    };

    // Save generated brief to database repository
    await DbRepository.saveBrief(brief);

    return NextResponse.json(brief, { status: 200 });
  } catch (error: any) {
    console.error('Error generating Pheebs Core Brief:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate Pheebs Brief' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const briefs = await DbRepository.listBriefs();
    return NextResponse.json({ briefs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

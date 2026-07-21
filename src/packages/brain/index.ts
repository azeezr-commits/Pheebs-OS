/**
 * Pheebs Core - Genesis v0.2 The Brain Entrypoint
 * The central intelligence hub managing Signals, Memory, Diagnosis, and Strategy.
 */

import { BusinessRecord, Diagnosis, Strategy, ThinkingTrace } from '../shared/types';
import { diagnoseFromSignals, REASONER_VERSION } from './reasoner';
import { strategizeFromDiagnosis, STRATEGY_VERSION } from './strategist';
import { selectPlaybookRecommendation, PLAYBOOK_VERSION } from '../playbooks';
import { OBSERVER_VERSION } from '../observer';

export class TheBrain {
  static async diagnose(businessRecord: BusinessRecord): Promise<Diagnosis> {
    return await diagnoseFromSignals(businessRecord);
  }

  static async strategize(diagnosis: Diagnosis, businessRecord: BusinessRecord): Promise<Strategy> {
    return await strategizeFromDiagnosis(diagnosis, businessRecord);
  }

  /**
   * Generates a complete persisted ThinkingTrace through The Brain & Playbooks
   */
  static async generateThinkingTrace(
    businessRecord: BusinessRecord,
    playbookKey: string = 'zoca'
  ): Promise<ThinkingTrace> {
    const startTime = Date.now();

    // 1. Brain Diagnosis over Signals
    const diagnosis = await this.diagnose(businessRecord);

    // 2. Brain Strategy formulation
    const strategy = await this.strategize(diagnosis, businessRecord);

    // 3. Playbook Recommendation selection
    const recommendation = await selectPlaybookRecommendation(strategy, businessRecord, playbookKey);

    const executionTimeMs = Date.now() - startTime;
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      id: traceId,
      businessRecord,
      signals: businessRecord.signals,
      diagnosis,
      strategy,
      recommendation,
      engineVersions: {
        observer: OBSERVER_VERSION,
        reasoner: REASONER_VERSION,
        strategy: STRATEGY_VERSION,
        playbook: PLAYBOOK_VERSION
      },
      createdAt: new Date().toISOString(),
      executionTimeMs
    };
  }
}

export * from './reasoner';
export * from './strategist';

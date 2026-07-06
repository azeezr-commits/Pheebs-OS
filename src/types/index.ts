export * from '../domain/session/types';
export * from '../domain/prospect/types';
export * from '../domain/coach/types';
export * from '../domain/sales-dna/types';
export * from '../domain/business/types';

export interface UserMetrics {
  streak: number;
  lastActive: string;
  mockCallsCount: number;
  analyzerCount: number;
  avgDiscoveryScore: number;
  avgClosingScore: number;
  totalDealsWonSimulation: number;
}

/**
 * Pheebs Core - Genesis v0.2 Inference Engine Factory
 */

import { InferenceEngine } from './types';
import { GeminiInference } from './geminiInference';

let defaultEngine: InferenceEngine | null = null;

export function getInferenceEngine(): InferenceEngine {
  if (!defaultEngine) {
    defaultEngine = new GeminiInference();
  }
  return defaultEngine;
}

export * from './types';
export * from './geminiInference';

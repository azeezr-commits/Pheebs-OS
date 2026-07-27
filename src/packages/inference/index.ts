import { GeminiInference } from './geminiInference';
import { InferenceEngine } from './types';

export * from './types';
export * from './geminiInference';

export function getInferenceEngine(): InferenceEngine {
  return new GeminiInference();
}

/**
 * Pheebs Core - Genesis AI Provider Factory
 * Abstracts AI provider selection (Gemini, OpenAI, Anthropic, Custom)
 */

import { AIProvider } from './types';
import { GeminiProvider } from './geminiProvider';

let defaultProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!defaultProvider) {
    defaultProvider = new GeminiProvider();
  }
  return defaultProvider;
}

export * from './types';
export * from './geminiProvider';

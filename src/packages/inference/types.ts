/**
 * Pheebs Core - Genesis v0.2 Inference Engine Abstraction
 * Inference is a capability (Gemini, GPT, Claude, Local, Rule Engine); AI is an implementation.
 */

export interface InferenceEngine {
  name: string;
  inferJSON<T>(prompt: string, systemPrompt?: string): Promise<T>;
  inferText(prompt: string, systemPrompt?: string): Promise<string>;
}

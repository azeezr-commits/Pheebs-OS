/**
 * Inference Engine Interface
 * Capabilities layer replacing raw AI provider bindings.
 */

export interface InferenceEngine {
  name: string;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T>;
}

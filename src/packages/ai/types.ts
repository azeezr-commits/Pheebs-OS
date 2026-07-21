/**
 * Pheebs Core - Genesis AI Provider Abstraction
 * Provider -> Gemini -> GPT -> Claude -> Future (Never lock ourselves)
 */

export interface AIProvider {
  name: string;
  generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T>;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
}

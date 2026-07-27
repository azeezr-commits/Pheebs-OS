import { GoogleGenAI } from '@google/genai';
import { InferenceEngine } from './types';

export class GeminiInference implements InferenceEngine {
  public readonly name = 'Gemini 2.5 Flash';
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || 'mock-key';
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return `[Mock Response] Text output generated for prompt: ${prompt.substring(0, 40)}...`;
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: systemPrompt ? { systemInstruction: systemPrompt } : undefined,
    });

    return response.text || '';
  }

  async generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY missing for JSON inference execution');
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: systemPrompt,
      },
    });

    return JSON.parse(response.text || '{}') as T;
  }
}

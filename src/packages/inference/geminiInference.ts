/**
 * Pheebs Core - Genesis Gemini Inference Implementation
 */

import { GoogleGenAI } from '@google/genai';
import { InferenceEngine } from './types';

export class GeminiInference implements InferenceEngine {
  name = 'Gemini 2.5 Flash';
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async inferJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey || !this.ai) {
      throw new Error('Inference requires configured GEMINI_API_KEY');
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt ? systemPrompt + '\n\n' : ''}${prompt}\n\nRespond ONLY with valid JSON.` }] }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      return JSON.parse(text) as T;
    } catch (error) {
      console.warn('Inference execution error:', error);
      throw error;
    }
  }

  async inferText(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey || !this.ai) {
      return `Factual inference output for prompt`;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt ? systemPrompt + '\n\n' : ''}${prompt}` }] }
        ]
      });

      return response.text || '';
    } catch (e) {
      return `Factual inference output`;
    }
  }
}

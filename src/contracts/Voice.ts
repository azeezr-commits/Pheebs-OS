/**
 * Voice Contract
 * Reserved for Sprint 4 (Voice Integration)
 */
export interface VoiceEngine {
  isSupported(): boolean;
  startListening(): void;
  stopListening(): void;
  speak(text: string): Promise<void>;
  stopSpeaking(): void;
}

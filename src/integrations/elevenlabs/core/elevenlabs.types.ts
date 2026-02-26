/**
 * 🎙️ ElevenLabs Type Definitions for Isabella AI™
 */

export type EmotionalContext = 'empathy' | 'guidance' | 'celebration' | 'calm' | 'urgency';

export interface TextToSpeechRequest {
  text: string;
  emotionalContext?: EmotionalContext;
}

export interface SpeechStreamRequest {
  text: string;
  emotionalContext?: EmotionalContext;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface VoiceResponse {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  labels?: Record<string, string>;
  settings?: VoiceSettings;
}

export interface AudioResponse {
  audio: Blob;
  duration?: number;
  format: string;
}

export interface StreamChunk {
  audio: Uint8Array;
  isFinalChunk: boolean;
}

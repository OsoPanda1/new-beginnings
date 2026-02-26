/**
 * 🎙️ ElevenLabs Client for Isabella AI™
 * 
 * Hybrid architecture for text-to-speech with institutional voice consistency.
 */

import { ElevenLabsConfig } from './elevenlabs.config';
import { TextToSpeechRequest, SpeechStreamRequest, VoiceResponse } from './elevenlabs.types';

export class ElevenLabsClient {
  private static readonly baseUrl = ElevenLabsConfig.baseUrl;
  private static readonly apiKey = ElevenLabsConfig.apiKey;
  private static readonly voiceId = ElevenLabsConfig.isabellaVoiceId;

  /**
   * Validates API key availability
   */
  private static validateApiKey(): void {
    if (!this.apiKey) {
      throw new Error('ELEVENLABS_API_KEY not configured. Isabella AI requires ElevenLabs integration.');
    }
  }

  /**
   * Common headers for all requests
   */
  private static getHeaders(): HeadersInit {
    this.validateApiKey();
    return {
      'Accept': 'application/json',
      'xi-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Text-to-Speech: Convert text to audio using Isabella's universal voice
   */
  static async textToSpeech(request: TextToSpeechRequest): Promise<Blob> {
    const url = `${this.baseUrl}/text-to-speech/${this.voiceId}`;
    
    const emotionalProfile = request.emotionalContext 
      ? ElevenLabsConfig.emotionalProfiles[request.emotionalContext]
      : undefined;

    const body = {
      text: request.text,
      model_id: ElevenLabsConfig.modelId,
      voice_settings: emotionalProfile || ElevenLabsConfig.voiceSettings,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs TTS Error: ${error}`);
    }

    return await response.blob();
  }

  /**
   * Stream Speech: Real-time streaming for Isabella's voice
   */
  static async streamSpeech(request: SpeechStreamRequest): Promise<ReadableStream<Uint8Array>> {
    const url = `${this.baseUrl}/text-to-speech/${this.voiceId}/stream`;
    
    const emotionalProfile = request.emotionalContext 
      ? ElevenLabsConfig.emotionalProfiles[request.emotionalContext]
      : undefined;

    const body = {
      text: request.text,
      model_id: ElevenLabsConfig.modelId,
      voice_settings: emotionalProfile || ElevenLabsConfig.voiceSettings,
      optimize_streaming_latency: ElevenLabsConfig.streaming.optimizeStreamingLatency,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs Stream Error: ${error}`);
    }

    if (!response.body) {
      throw new Error('No response body for streaming');
    }

    return response.body;
  }

  /**
   * Get Voice Information (for verification only)
   */
  static async getVoiceInfo(): Promise<VoiceResponse> {
    const url = `${this.baseUrl}/voices/${this.voiceId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs Voice Info Error: ${error}`);
    }

    return await response.json();
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<boolean> {
    try {
      await this.getVoiceInfo();
      return true;
    } catch {
      return false;
    }
  }
}

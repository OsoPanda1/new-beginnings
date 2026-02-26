/**
 * 🎙️ Isabella Voice Integration - Complete Voice System
 * TAMV MD-X4™ Official Voice Module
 */

import { ElevenLabsClient } from '../core/elevenlabs.client';
import { EmotionalContext } from '../core/elevenlabs.types';
import { toast } from 'sonner';

/**
 * Reproduce texto con la voz de Isabella
 */
export async function speakWithIsabella(
  text: string,
  emotion?: EmotionalContext
): Promise<void> {
  try {
    const audioBlob = await ElevenLabsClient.textToSpeech({
      text,
      emotionalContext: emotion,
    });

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    await audio.play();
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error: any) {
    console.error('Isabella Voice Error:', error);
    toast.error('Error al reproducir voz de Isabella');
    throw error;
  }
}

/**
 * Reproduce streaming de voz en tiempo real
 */
export async function streamIsabellaVoice(
  text: string,
  emotion?: EmotionalContext,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  try {
    onStart?.();
    
    const stream = await ElevenLabsClient.streamSpeech({
      text,
      emotionalContext: emotion,
    });

    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    
    await audio.play();
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      onEnd?.();
    };
  } catch (error: any) {
    console.error('Isabella Stream Error:', error);
    toast.error('Error en streaming de voz');
    onEnd?.();
    throw error;
  }
}

/**
 * Verificar disponibilidad de voz
 */
export async function checkIsabellaVoice(): Promise<boolean> {
  try {
    return await ElevenLabsClient.healthCheck();
  } catch {
    return false;
  }
}

/**
 * Obtener información de la voz
 */
export async function getIsabellaVoiceInfo() {
  try {
    return await ElevenLabsClient.getVoiceInfo();
  } catch (error) {
    console.error('Error getting voice info:', error);
    return null;
  }
}

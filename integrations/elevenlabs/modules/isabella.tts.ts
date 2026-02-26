/**
 * 🗣️ Isabella TTS Module
 * 
 * Official voice synthesis for Isabella AI™
 * Una sola voz institucional - inmutable y universal
 */

import { ElevenLabsClient } from '../core/elevenlabs.client';
import { EmotionalContext } from '../core/elevenlabs.types';

/**
 * Speak as Isabella with contextual emotional adaptation
 */
export async function speakAsIsabella(
  text: string, 
  emotionalContext?: EmotionalContext
): Promise<Blob> {
  try {
    return await ElevenLabsClient.textToSpeech({
      text,
      emotionalContext,
    });
  } catch (error) {
    console.error('Isabella TTS Error:', error);
    throw new Error('Unable to synthesize Isabella\'s voice');
  }
}

/**
 * Convert Isabella's text to audio URL for playback
 */
export async function getIsabellaAudioUrl(
  text: string,
  emotionalContext?: EmotionalContext
): Promise<string> {
  const audioBlob = await speakAsIsabella(text, emotionalContext);
  return URL.createObjectURL(audioBlob);
}

/**
 * Play Isabella's voice directly
 */
export async function playIsabellaVoice(
  text: string,
  emotionalContext?: EmotionalContext
): Promise<void> {
  const audioUrl = await getIsabellaAudioUrl(text, emotionalContext);
  const audio = new Audio(audioUrl);
  
  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };
    audio.onerror = (error) => {
      URL.revokeObjectURL(audioUrl);
      reject(error);
    };
    audio.play().catch(reject);
  });
}

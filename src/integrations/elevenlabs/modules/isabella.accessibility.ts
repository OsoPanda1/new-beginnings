/**
 * ♿ Isabella Accessibility Module
 * 
 * Multisensory reading and accessibility features using Isabella's voice
 */

import { speakAsIsabella, playIsabellaVoice } from './isabella.tts';
import { EmotionalContext } from '../core/elevenlabs.types';

/**
 * Read content aloud for accessibility
 */
export async function readForAccessibility(
  text: string,
  emotionalContext: EmotionalContext = 'calm'
): Promise<Blob> {
  return await speakAsIsabella(text, emotionalContext);
}

/**
 * Read and play content immediately
 */
export async function readAloud(
  text: string,
  emotionalContext: EmotionalContext = 'calm'
): Promise<void> {
  await playIsabellaVoice(text, emotionalContext);
}

/**
 * Screen reader integration - read UI elements
 */
export async function readUIElement(
  elementText: string,
  elementType: 'button' | 'heading' | 'notification' | 'error' = 'button'
): Promise<void> {
  const contextMap: Record<typeof elementType, EmotionalContext> = {
    button: 'guidance',
    heading: 'guidance',
    notification: 'calm',
    error: 'urgency',
  };

  const prefix = {
    button: 'Botón: ',
    heading: '',
    notification: 'Notificación: ',
    error: 'Alerta: ',
  };

  const fullText = prefix[elementType] + elementText;
  await playIsabellaVoice(fullText, contextMap[elementType]);
}

/**
 * Read long-form content with pauses
 */
export async function readLongContent(
  content: string,
  pauseBetweenParagraphs: number = 500
): Promise<void> {
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  for (let i = 0; i < paragraphs.length; i++) {
    await playIsabellaVoice(paragraphs[i], 'calm');
    
    if (i < paragraphs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, pauseBetweenParagraphs));
    }
  }
}

/**
 * Describe images for visually impaired users
 */
export async function describeImage(description: string): Promise<void> {
  const narrativeText = `Descripción de imagen: ${description}`;
  await playIsabellaVoice(narrativeText, 'calm');
}

/**
 * Navigate through interactive elements
 */
export async function announceNavigation(location: string): Promise<void> {
  const navigationText = `Navegando a ${location}`;
  await playIsabellaVoice(navigationText, 'guidance');
}

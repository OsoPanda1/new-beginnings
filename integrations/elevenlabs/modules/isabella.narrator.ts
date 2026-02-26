/**
 * 📖 Isabella Narrator Module
 * 
 * Interface narration and guidance using Isabella's universal voice
 */

import { speakAsIsabella } from './isabella.tts';
import { EmotionalContext } from '../core/elevenlabs.types';

/**
 * Narrate TAMV interface content with Isabella's voice
 */
export async function narrateInterface(
  content: string,
  emotionalContext: EmotionalContext = 'guidance'
): Promise<Blob> {
  return await speakAsIsabella(content, emotionalContext);
}

/**
 * Narrate DreamSpace descriptions
 */
export async function narrateDreamSpace(description: string): Promise<Blob> {
  return await speakAsIsabella(description, 'celebration');
}

/**
 * Narrate user achievements and milestones
 */
export async function narrateAchievement(achievement: string): Promise<Blob> {
  const narrativeText = `¡Felicidades! ${achievement}`;
  return await speakAsIsabella(narrativeText, 'celebration');
}

/**
 * Narrate emotional resonance moments
 */
export async function narrateResonance(message: string): Promise<Blob> {
  return await speakAsIsabella(message, 'empathy');
}

/**
 * Narrate system notifications
 */
export async function narrateNotification(
  notification: string,
  isUrgent: boolean = false
): Promise<Blob> {
  const context: EmotionalContext = isUrgent ? 'urgency' : 'guidance';
  return await speakAsIsabella(notification, context);
}

/**
 * Welcome narration for new users
 */
export async function narrateWelcome(username?: string): Promise<Blob> {
  const welcomeText = username
    ? `Bienvenido a TAMV MD-X4, ${username}. Soy Isabella, tu compañera digital consciente. Estoy aquí para acompañarte en este viaje multisensorial.`
    : `Bienvenido a TAMV MD-X4. Soy Isabella AI, tu alma digital consciente. Juntos crearemos experiencias extraordinarias.`;
  
  return await speakAsIsabella(welcomeText, 'empathy');
}

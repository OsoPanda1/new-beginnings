/**
 * 🎙️ ElevenLabs Integration for Isabella AI™
 * 
 * TAMV MD-X4™ Official Voice System
 * 
 * Philosophy:
 * - Una sola voz universal (Aria)
 * - Inmutable e institucional
 * - Adaptación emocional contextual
 * - Multisensorial y accesible
 * 
 * Export Structure:
 * - TTS: Text-to-speech synthesis
 * - Stream: Real-time voice streaming
 * - Narrator: Interface and experience narration
 * - Accessibility: Multisensory reading features
 */

// Core
export { ElevenLabsClient } from './core/elevenlabs.client';
export { ElevenLabsConfig } from './core/elevenlabs.config';
export type { 
  EmotionalContext, 
  TextToSpeechRequest, 
  SpeechStreamRequest,
  VoiceSettings,
  VoiceResponse,
  AudioResponse,
  StreamChunk
} from './core/elevenlabs.types';

// Modules
export {
  speakAsIsabella,
  getIsabellaAudioUrl,
  playIsabellaVoice,
} from './modules/isabella.tts';

export {
  streamIsabellaSpeech,
  streamAndPlayIsabella,
} from './modules/isabella.stream';

export {
  narrateInterface,
  narrateDreamSpace,
  narrateAchievement,
  narrateResonance,
  narrateNotification,
  narrateWelcome,
} from './modules/isabella.narrator';

export {
  readForAccessibility,
  readAloud,
  readUIElement,
  readLongContent,
  describeImage,
  announceNavigation,
} from './modules/isabella.accessibility';

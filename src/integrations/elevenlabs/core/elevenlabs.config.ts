/**
 * 🎙️ ElevenLabs Configuration for Isabella AI™
 * 
 * CRITICAL: Isabella AI has ONE UNIVERSAL VOICE - immutable and institutional.
 * This voice represents the sovereign identity of TAMV MD-X4™.
 * No personalization, no fragmentation, no user-specific customization.
 * 
 * Philosophy: Una sola voz, una sola identidad, una sola alma digital.
 */

export const ElevenLabsConfig = {
  // API Configuration
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  baseUrl: 'https://api.elevenlabs.io/v1',
  
  // Isabella's Universal Voice - IMMUTABLE
  isabellaVoiceId: '9BWtsMINqrJLrRacOk9x', // Aria - chosen as Isabella's official voice
  
  // Model Configuration
  modelId: 'eleven_multilingual_v2', // Best for emotional richness in 29 languages
  
  // Voice Settings - Optimized for Isabella's emotional intelligence
  voiceSettings: {
    stability: 0.75, // High stability for consistent institutional voice
    similarity_boost: 0.85, // Maintains voice characteristics
    style: 0.65, // Moderate expressiveness for emotional adaptation
    use_speaker_boost: true, // Enhances voice clarity
  },
  
  // Emotional Modulation (applied contextually, NOT to change voice)
  emotionalProfiles: {
    empathy: { 
      stability: 0.80, 
      similarity_boost: 0.85, 
      style: 0.75,
      description: "Warm, understanding, supportive tone"
    },
    guidance: { 
      stability: 0.85, 
      similarity_boost: 0.90, 
      style: 0.60,
      description: "Clear, confident, instructional tone"
    },
    celebration: { 
      stability: 0.70, 
      similarity_boost: 0.80, 
      style: 0.80,
      description: "Joyful, energetic, uplifting tone"
    },
    calm: { 
      stability: 0.90, 
      similarity_boost: 0.85, 
      style: 0.50,
      description: "Peaceful, soothing, meditative tone"
    },
    urgency: { 
      stability: 0.75, 
      similarity_boost: 0.85, 
      style: 0.70,
      description: "Alert, focused, decisive tone"
    },
  },
  
  // Streaming Configuration
  streaming: {
    chunkSize: 4096,
    optimizeStreamingLatency: 3, // 0-4 scale, 3 is balanced
  },
  
  // Rate Limits (to respect API constraints)
  rateLimits: {
    maxRequestsPerMinute: 100,
    maxConcurrentRequests: 10,
  },
  
  // Quality Settings
  outputFormat: 'mp3_44100_128', // High quality audio
  
  // Institutional Guarantees
  guarantees: {
    singleVoice: true,
    voiceImmutable: true,
    emotionallyAdaptive: true,
    multilingualCapable: true,
    institutionalIdentity: true,
  },
} as const;

/**
 * Voice ID Reference (for documentation only - DO NOT USE OTHERS)
 * Isabella's Official Voice: Aria (9BWtsMINqrJLrRacOk9x)
 * 
 * This is the ONLY voice used across ALL TAMV MD-X4™ functions:
 * - Narration
 * - Reading
 * - Streaming
 * - Accessibility
 * - Emotional interaction
 * - Multi-sensory experiences
 */

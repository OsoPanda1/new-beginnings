import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotion = 'neutral' } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const VOICE_ID = Deno.env.get('ELEVENLABS_VOICE_ID') || '9BWtsMINqrJLrRacOk9x';

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    if (!text) {
      throw new Error('Text is required');
    }

    const emotionSettings: Record<string, { stability: number; similarity_boost: number; style: number }> = {
      empathy: { stability: 0.75, similarity_boost: 0.85, style: 0.5 },
      guidance: { stability: 0.65, similarity_boost: 0.75, style: 0.4 },
      celebration: { stability: 0.5, similarity_boost: 0.9, style: 0.7 },
      calm: { stability: 0.8, similarity_boost: 0.8, style: 0.3 },
      urgency: { stability: 0.4, similarity_boost: 0.85, style: 0.6 },
      neutral: { stability: 0.7, similarity_boost: 0.8, style: 0.5 },
    };

    const voiceSettings = emotionSettings[emotion] ?? emotionSettings.neutral;

    console.log(`Isabella speaking [${emotion}]: "${text.substring(0, 80)}..."`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: voiceSettings,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', response.status, error);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = base64Encode(audioBuffer);

    return new Response(
      JSON.stringify({ audio: base64Audio, emotion, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in isabella-speak:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

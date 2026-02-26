import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotion = 'neutral' } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    if (!text) {
      throw new Error('Text is required');
    }

    // Voice settings based on emotion
    const emotionSettings: Record<string, any> = {
      empathy: { stability: 0.75, similarity_boost: 0.85, style: 0.5 },
      guidance: { stability: 0.65, similarity_boost: 0.75, style: 0.4 },
      celebration: { stability: 0.5, similarity_boost: 0.9, style: 0.7 },
      neutral: { stability: 0.7, similarity_boost: 0.8, style: 0.5 },
    };

    const voiceSettings = emotionSettings[emotion] || emotionSettings.neutral;

    console.log(`Isabella speaking with ${emotion} emotion:`, text.substring(0, 50));

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
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
      console.error('ElevenLabs API error:', error);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    return new Response(
      JSON.stringify({ 
        audio: base64Audio,
        emotion,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in isabella-speak:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

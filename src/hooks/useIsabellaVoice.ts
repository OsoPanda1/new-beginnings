import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

export type EmotionalContext = 'empathy' | 'guidance' | 'celebration' | 'calm' | 'urgency' | 'neutral';

export function useIsabellaVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, emotion: EmotionalContext = 'neutral') => {
    try {
      setIsSpeaking(true);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-speak`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, emotion }),
        }
      );

      if (!response.ok) throw new Error(`TTS error: ${response.status}`);

      const data = await response.json();

      if (data?.audio) {
        // Use data URI — browser natively decodes base64 audio without corruption
        const audioUrl = `data:audio/mpeg;base64,${data.audio}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Isabella speak error:', error);
      toast.error('Error al reproducir voz de Isabella');
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Browser-native Web Speech API for STT (no external API needed)
  const listen = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast.error('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
        resolve(null);
        return;
      }

      setIsListening(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-MX';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          toast.error('Error en reconocimiento de voz');
        }
        setIsListening(false);
        resolve(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    });
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    speak,
    stopSpeaking,
    listen,
    stopListening,
    isSpeaking,
    isListening,
  };
}

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type EmotionalContext = 'empathy' | 'guidance' | 'celebration' | 'neutral';

export function useIsabellaVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const speak = async (text: string, emotion: EmotionalContext = 'neutral') => {
    try {
      setIsSpeaking(true);

      const { data, error } = await supabase.functions.invoke('isabella-speak', {
        body: { text, emotion },
      });

      if (error) throw error;

      if (data?.audio) {
        const audioData = atob(data.audio);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };

        await audio.play();
      }
    } catch (error) {
      console.error('Error speaking:', error);
      toast.error('Error al reproducir voz de Isabella');
      setIsSpeaking(false);
    }
  };

  const listen = async (): Promise<string | null> => {
    try {
      setIsListening(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      return new Promise((resolve, reject) => {
        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          setIsListening(false);

          const blob = new Blob(chunks, { type: 'audio/webm' });
          const reader = new FileReader();

          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];

            try {
              const { data, error } = await supabase.functions.invoke('isabella-listen', {
                body: { audio: base64Audio },
              });

              if (error) throw error;
              resolve(data?.text || null);
            } catch (error) {
              console.error('Error transcribing:', error);
              toast.error('Error al procesar audio');
              reject(error);
            }
          };

          reader.readAsDataURL(blob);
        };

        mediaRecorder.start();
        
        // Auto-stop after 10 seconds
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 10000);
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('No se pudo acceder al micrófono');
      setIsListening(false);
      return null;
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return {
    speak,
    listen,
    stopListening,
    isSpeaking,
    isListening,
  };
}
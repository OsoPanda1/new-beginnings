import { useState, useRef, useCallback, useEffect } from 'react';

// Audio tracks available in the project
export const audioTracks = {
  heathens: '/src/assets/audio-music/AudioCleaner_Download_twenty one pilots_ Heathens (from Suicide Squad_ The Album) [OFFICIAL VIDEO].mp3',
  anubis: '/src/assets/audio-music/Reeson - Anubis (original mix).mp3',
  locos: '/src/assets/audio-music/Kane Rodriguez - SE VOLVIERON LOCOS (Lyric Video).mp3',
  tiesto: '/src/assets/audio-music/Tiësto - 10_35 (feat. Tate McRae) (Official Music Video).mp3',
  bedroom: '/src/assets/audio-music/ytmp3free.cc_bedroom-in-my-head-subtitulado-espaol-lyrics-youtubemp3free.org.mp3',
  frecuencia: '/src/assets/audio-music/ytmp3free.cc_frecuencia-dareyes-de-la-sierra-video-oficial-youtubemp3free.org.mp3',
  blindingLights: '/src/assets/audio-music/ytmp3free.cc_the-weeknd-blinding-lights-extended-20-minute-loop-youtubemp3free.org.mp3',
} as const;

export type TrackName = keyof typeof audioTracks;

interface UseAmbientAudioReturn {
  isPlaying: boolean;
  currentTrack: TrackName | null;
  volume: number;
  play: (track: TrackName) => void;
  pause: () => void;
  toggle: (track?: TrackName) => void;
  setVolume: (volume: number) => void;
  fadeIn: (track: TrackName, duration?: number) => void;
  fadeOut: (duration?: number) => void;
}

export function useAmbientAudio(): UseAmbientAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackName | null>(null);
  const [volume, setVolumeState] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  const play = useCallback((track: TrackName) => {
    if (!audioRef.current) return;
    
    audioRef.current.src = audioTracks[track];
    audioRef.current.play().catch(console.error);
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback((track?: TrackName) => {
    if (isPlaying) {
      pause();
    } else if (track) {
      play(track);
    } else if (currentTrack) {
      audioRef.current?.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const fadeIn = useCallback((track: TrackName, duration = 2000) => {
    if (!audioRef.current) return;

    audioRef.current.src = audioTracks[track];
    audioRef.current.volume = 0;
    audioRef.current.play().catch(console.error);
    setCurrentTrack(track);
    setIsPlaying(true);

    const targetVolume = volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        audioRef.current.volume = Math.min(volumeStep * currentStep, targetVolume);
      }
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      }
    }, stepDuration);
  }, [volume]);

  const fadeOut = useCallback((duration = 2000) => {
    if (!audioRef.current) return;

    const startVolume = audioRef.current.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        audioRef.current.volume = Math.max(startVolume - volumeStep * currentStep, 0);
      }
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        pause();
      }
    }, stepDuration);
  }, [pause]);

  return {
    isPlaying,
    currentTrack,
    volume,
    play,
    pause,
    toggle,
    setVolume,
    fadeIn,
    fadeOut,
  };
}

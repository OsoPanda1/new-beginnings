import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Play, Pause, Volume2, VolumeX, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface AudioEffect {
  id: string;
  name: string;
  intensity: number;
}

export default function KaosAudioFX() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [effects, setEffects] = useState<AudioEffect[]>([
    { id: 'reverb', name: 'Reverb', intensity: 30 },
    { id: 'echo', name: 'Echo', intensity: 20 },
    { id: 'distortion', name: 'Distorsión', intensity: 10 },
  ]);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API context
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.success("Audio Kaos activado");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const updateEffect = (id: string, value: number) => {
    setEffects(effects.map(effect => 
      effect.id === id ? { ...effect, intensity: value } : effect
    ));
  };

  return (
    <Card className="p-6 glass-effect border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-quantum flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-gradient-quantum">Audio Kaos Engine</h3>
          <p className="text-sm text-muted-foreground">Motor sensorial omnidireccional</p>
        </div>
      </div>

      {/* Visualizer */}
      <div className="relative h-24 rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 mb-6 overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-end justify-center gap-1 px-4"
        >
          {[...Array(32)].map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                height: [10, Math.random() * 80 + 20, 10],
              } : { height: 10 }}
              transition={{
                duration: 0.5,
                repeat: isPlaying ? Infinity : 0,
                delay: i * 0.02,
              }}
              className="w-1 bg-gradient-quantum rounded-t-full"
            />
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          size="icon"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-gradient-quantum hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={toggleMute}
          className="hover:bg-primary/10"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>

        <div className="flex-1">
          <Slider
            value={[volume]}
            onValueChange={([v]) => setVolume(v)}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <span className="text-sm font-medium w-12 text-right">{volume}%</span>
      </div>

      {/* Effects */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sliders className="w-4 h-4" />
          <span>Efectos Quantum</span>
        </div>

        {effects.map((effect) => (
          <div key={effect.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{effect.name}</span>
              <span className="text-muted-foreground">{effect.intensity}%</span>
            </div>
            <Slider
              value={[effect.intensity]}
              onValueChange={([v]) => updateEffect(effect.id, v)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="mt-6 pt-6 border-t border-primary/20 text-center">
        <motion.div
          animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-2 text-sm"
        >
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span>{isPlaying ? 'Transmitiendo' : 'En espera'}</span>
        </motion.div>
      </div>
    </Card>
  );
}

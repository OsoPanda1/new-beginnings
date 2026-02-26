import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAmbientAudio, TrackName } from "@/hooks/useAmbientAudio";
import { cn } from "@/lib/utils";

const trackLabels: Record<TrackName, { name: string; artist: string; mood: string }> = {
  heathens: { name: "Heathens", artist: "Twenty One Pilots", mood: "Intenso" },
  anubis: { name: "Anubis", artist: "Reeson", mood: "Épico" },
  locos: { name: "Se Volvieron Locos", artist: "Kane Rodriguez", mood: "Energético" },
  tiesto: { name: "10:35", artist: "Tiësto ft. Tate McRae", mood: "Dance" },
  bedroom: { name: "Bedroom In My Head", artist: "Unknown", mood: "Chill" },
  frecuencia: { name: "Frecuencia", artist: "Dareyes de la Sierra", mood: "Regional" },
  blindingLights: { name: "Blinding Lights", artist: "The Weeknd", mood: "Retro" },
};

export default function AmbientAudioController() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPlaying, currentTrack, volume, toggle, setVolume, fadeIn, fadeOut } = useAmbientAudio();

  const handleTrackSelect = (track: TrackName) => {
    if (currentTrack === track && isPlaying) {
      fadeOut();
    } else {
      fadeIn(track);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed bottom-20 right-4 z-50",
        "bg-background/80 backdrop-blur-xl",
        "border border-accent/30 rounded-2xl",
        "shadow-[0_0_30px_rgba(0,188,212,0.2)]",
        "overflow-hidden"
      )}
    >
      {/* Collapsed state - just the toggle button */}
      <div className="p-3 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggle(currentTrack || 'anubis')}
          className="relative group"
        >
          {isPlaying ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Volume2 className="w-5 h-5 text-accent" />
            </motion.div>
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
          
          {/* Pulsing ring when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </Button>

        {currentTrack && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {trackLabels[currentTrack].name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {trackLabels[currentTrack].artist}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Expanded state */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-accent/20"
          >
            {/* Volume slider */}
            <div className="p-3 flex items-center gap-3">
              <VolumeX className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[volume * 100]}
                onValueChange={([val]) => setVolume(val / 100)}
                max={100}
                step={1}
                className="flex-1"
              />
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Track list */}
            <div className="p-2 max-h-60 overflow-y-auto space-y-1">
              {(Object.keys(trackLabels) as TrackName[]).map((track) => (
                <motion.button
                  key={track}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTrackSelect(track)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left",
                    "transition-all duration-200",
                    currentTrack === track && isPlaying
                      ? "bg-accent/20 text-accent"
                      : "hover:bg-accent/10 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    "bg-gradient-to-br from-accent/20 to-primary/20"
                  )}>
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{trackLabels[track].name}</p>
                    <p className="text-xs text-muted-foreground truncate">{trackLabels[track].artist}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                    {trackLabels[track].mood}
                  </span>
                  
                  {/* Playing indicator */}
                  {currentTrack === track && isPlaying && (
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-accent rounded-full"
                          animate={{ height: [4, 12, 4] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

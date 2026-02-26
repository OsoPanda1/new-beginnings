import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface HeroVideoProps {
  onSkip: () => void;
}

export default function HeroVideo({ onSkip }: HeroVideoProps) {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      >
        <video
          autoPlay
          loop
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={onSkip}
        >
          <source src="/hero-presentation.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

        {/* Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="glass-effect hover:bg-primary/20"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </Button>

          <Button
            onClick={onSkip}
            className="bg-gradient-quantum px-8 py-6 text-lg font-orbitron"
          >
            Entrar al Quantum
          </Button>
        </div>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="absolute top-10 right-10 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Saltar →
        </button>

        {/* Branding */}
        <div className="absolute top-10 left-10">
          <h1 className="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-quantum">
            TAMV MD-X4™
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Multisensory XR Universe</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

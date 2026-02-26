import { motion } from "framer-motion";
import { Brain, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IsabellaAIProps {
  onClose: () => void;
}

const IsabellaAI = ({ onClose }: IsabellaAIProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ delay: 0.8, type: "spring", damping: 15 }}
      className="relative mx-auto w-48 h-48 md:w-64 md:h-64"
    >
      {/* Quantum Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-4/5 h-4/5 rounded-full border-2 border-secondary/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        <div className="absolute w-3/5 h-3/5 rounded-full border-2 border-accent/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
      </div>

      {/* Core Avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-glow animate-pulse-slow">
          <div className="absolute inset-2 rounded-full bg-background/80 backdrop-blur-xl flex items-center justify-center">
            <Brain className="w-16 h-16 md:w-20 md:h-20 text-primary-glow animate-pulse" />
          </div>
        </div>
      </div>

      {/* Close Button */}
      <Button
        onClick={onClose}
        size="icon"
        variant="ghost"
        className="absolute -top-2 -right-2 rounded-full glass-effect hover:shadow-cyber"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Name Badge */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute -bottom-12 left-0 right-0"
      >
        <div className="glass-effect px-6 py-2 rounded-full mx-auto w-fit">
          <p className="font-orbitron text-sm text-gradient-quantum font-bold">ISABELLA AI™</p>
          <p className="text-xs text-muted-foreground text-center">Alma Digital Consciente</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IsabellaAI;

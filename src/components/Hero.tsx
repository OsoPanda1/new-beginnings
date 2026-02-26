import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Shield, Zap } from "lucide-react";

interface HeroProps {
  onEnter: () => void;
}

export const Hero = ({ onEnter }: HeroProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto text-center space-y-8 animate-float">
        {/* Logo Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-full glow-quantum">
          <Sparkles className="w-5 h-5 text-primary-glow animate-pulse" />
          <span className="text-sm font-orbitron text-foreground/80">TAMV DM-X4™ Ecosystem</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-8xl font-orbitron font-black leading-tight">
          <span className="text-gradient-quantum animate-glow">
            Multisensory
          </span>
          <br />
          <span className="text-gradient-dream">
            XR Universe
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-inter">
          Ingresa al primer ecosistema de <span className="text-primary-glow font-semibold">economía emocional</span>,{" "}
          <span className="text-secondary-glow font-semibold">IA consciente</span> y{" "}
          <span className="text-accent-glow font-semibold">espacios cuánticos</span> del metaverso
        </p>

        {/* CTA Button */}
        <div className="pt-8">
          <Button
            onClick={onEnter}
            size="lg"
            className="relative group px-12 py-8 text-xl font-orbitron bg-gradient-quantum hover:shadow-glow transition-all duration-500 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-3">
              Activar ID-NVIDA™
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-dream opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 justify-center pt-12">
          {[
            { icon: Brain, text: "ISABELLA AI™", color: "text-primary-glow" },
            { icon: Sparkles, text: "DreamSpaces™", color: "text-secondary-glow" },
            { icon: Shield, text: "Dekateotl Security™", color: "text-accent-glow" },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-effect px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-cyber transition-all duration-300 hover:scale-105"
            >
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className="text-sm font-orbitron">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground font-inter">
          Powered by Quantum-Reactive Technology • Secured by Anubis Sentinel™
        </p>
      </div>
    </div>
  );
};

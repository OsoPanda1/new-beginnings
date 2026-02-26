/**
 * ⚛️ Quantum Boost Cards — "Mortal Layer"
 * User-friendly boost selection for everyone
 */

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Lightbulb, ArrowDownUp, Shield, Loader2, Zap } from "lucide-react";
import type { QuantumJob } from "@/pages/QuantumDemo";

interface BoostPreset {
  id: QuantumJob["boost"];
  label: string;
  subtitle: string;
  cta: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultEngine: string;
  gradient: string;
}

const boostPresets: BoostPreset[] = [
  {
    id: "discover",
    label: "Descubre lo imposible",
    subtitle: "Encuentra contenido, personas y NFTs que encajan contigo.",
    cta: "Quiero descubrir",
    icon: Search,
    defaultEngine: "grover",
    gradient: "from-accent/20 to-primary/10",
  },
  {
    id: "create",
    label: "Crea mejor",
    subtitle: "Ideas y variaciones para tu siguiente mundo, avatar o contenido.",
    cta: "Quiero crear",
    icon: Lightbulb,
    defaultEngine: "qml",
    gradient: "from-primary/20 to-accent/10",
  },
  {
    id: "decide",
    label: "Decide con ventaja",
    subtitle: "Cuando tienes muchas opciones y no sabes cuál elegir.",
    cta: "Quiero decidir",
    icon: ArrowDownUp,
    defaultEngine: "vqe",
    gradient: "from-secondary/20 to-primary/10",
  },
  {
    id: "trust",
    label: "Confía sin miedo",
    subtitle: "Verifica si algo huele raro antes de confiar o invertir tu tiempo.",
    cta: "Quiero verificar",
    icon: Shield,
    defaultEngine: "grover",
    gradient: "from-destructive/10 to-accent/10",
  },
];

interface Props {
  selectedBoost: QuantumJob["boost"] | null;
  selectedType: string | null;
  isSubmitting: boolean;
  onBoostClick: (boostId: QuantumJob["boost"], defaultEngine: string) => void;
  onSubmit: () => void;
}

export default function QuantumBoostCards({
  selectedBoost,
  selectedType,
  isSubmitting,
  onBoostClick,
  onSubmit,
}: Props) {
  return (
    <Card className="glass-effect p-6 border-primary/20">
      <div className="mb-6">
        <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-2">
          Elige tu Quantum Boost
        </h2>
        <p className="text-sm text-muted-foreground">
          Escoge qué quieres lograr. TAMV se encarga del motor cuántico, la evidencia 
          en BookPI™ y la parte complicada.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {boostPresets.map((boost, i) => {
          const Icon = boost.icon;
          const isActive = selectedBoost === boost.id;

          return (
            <motion.div
              key={boost.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => onBoostClick(boost.id, boost.defaultEngine)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all relative overflow-hidden group ${
                  isActive
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-border hover:border-accent/50 hover:bg-card/80"
                }`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${boost.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? "bg-accent/20" : "bg-muted/50"
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <h3 className={`font-orbitron font-bold text-sm ${isActive ? "text-accent" : "text-foreground"}`}>
                      {boost.label}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {boost.subtitle}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isActive ? "text-accent" : "text-primary"}`}>
                      {boost.cta} →
                    </span>
                    {isActive && selectedType && (
                      <Badge variant="outline" className="text-[10px] border-accent/50 text-accent">
                        Motor: {selectedType.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Active glow */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{
                      boxShadow: [
                        "0 0 15px hsla(180, 100%, 45%, 0.2)",
                        "0 0 30px hsla(180, 100%, 45%, 0.3)",
                        "0 0 15px hsla(180, 100%, 45%, 0.2)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <Button
        onClick={onSubmit}
        disabled={isSubmitting || !selectedBoost}
        className="w-full bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 text-primary-foreground font-orbitron text-base h-12"
        size="lg"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : (
          <Zap className="w-5 h-5 mr-2" />
        )}
        {isSubmitting ? "Procesando..." : "Ejecutar Quantum Boost"}
      </Button>
    </Card>
  );
}

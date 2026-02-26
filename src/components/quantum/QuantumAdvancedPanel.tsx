/**
 * ⚛️ Quantum Advanced Panel — "Pro Layer"
 * Collapsible advanced engine selection for devs & power users
 */

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Atom, Database, Cpu, Zap, Sparkles } from "lucide-react";

const operationTypes = [
  {
    id: "grover",
    name: "Búsqueda exhaustiva turbo (Grover)",
    description: "Explora un espacio enorme de opciones de forma cuántico-inspirada.",
    icon: Database,
  },
  {
    id: "vqe",
    name: "Optimizador de configuraciones (VQE)",
    description: "Encuentra configuraciones casi óptimas en sistemas complejos.",
    icon: Atom,
  },
  {
    id: "qml",
    name: "Quantum Machine Learning",
    description: "Modelos que aprenden con menos datos y patrones más sutiles.",
    icon: Cpu,
  },
  {
    id: "custom",
    name: "Personalizado",
    description: "Circuito/motor cuántico-inspirado definido por el sistema TAMV.",
    icon: Zap,
  },
];

interface Props {
  showAdvanced: boolean;
  selectedType: string | null;
  onToggle: () => void;
  onSelectType: (type: string) => void;
}

export default function QuantumAdvancedPanel({
  showAdvanced,
  selectedType,
  onToggle,
  onSelectType,
}: Props) {
  return (
    <Card className="glass-effect border-border/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-card/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-muted-foreground" />
          <div className="text-left">
            <p className="text-sm font-orbitron font-semibold text-foreground">
              Modo avanzado
            </p>
            <p className="text-xs text-muted-foreground">
              Para creadores y devs hardcore
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs text-muted-foreground pb-2 border-b border-border/50">
                Elige el tipo de motor cuántico-inspirado que vamos a usar. 
                Si no sabes cuál, usa los Quantum Boosts de arriba.
              </p>

              {operationTypes.map((op) => {
                const Icon = op.icon;
                const isSelected = selectedType === op.id;

                return (
                  <motion.button
                    key={op.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectType(op.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10"
                        : "border-border/50 hover:border-accent/30 hover:bg-card/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-accent/20" : "bg-muted/30"
                    }`}>
                      <Icon className={`w-4 h-4 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isSelected ? "text-accent" : "text-foreground"}`}>
                        {op.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {op.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Badge className="bg-accent/20 text-accent border-accent/30 text-[10px]">
                        Activo
                      </Badge>
                    )}
                  </motion.button>
                );
              })}

              {/* Service Layer Info */}
              <div className="mt-4 p-3 rounded-lg bg-card/50 border border-border/30">
                <p className="text-xs font-orbitron text-muted-foreground mb-2">
                  Quantum Service Layer TAMV
                </p>
                <div className="space-y-1">
                  {[
                    "Circuit hash y parámetros adjuntos a cada job",
                    "Eventos pub/sub del ciclo de vida completo",
                    "Quota management por identidad y membresía",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

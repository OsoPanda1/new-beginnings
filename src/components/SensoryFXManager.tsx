import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Sun, Moon, Wind, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface SensoryEffect {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  intensity: number;
  color: string;
}

export default function SensoryFXManager() {
  const [effects, setEffects] = useState<SensoryEffect[]>([
    { id: 'quantum', name: 'Quantum Glow', icon: Sparkles, enabled: true, intensity: 70, color: 'hsl(var(--primary))' },
    { id: 'electric', name: 'Electric Pulse', icon: Zap, enabled: false, intensity: 50, color: 'hsl(var(--accent))' },
    { id: 'solar', name: 'Solar Flare', icon: Sun, enabled: false, intensity: 60, color: 'hsl(var(--energy))' },
    { id: 'lunar', name: 'Lunar Calm', icon: Moon, enabled: false, intensity: 40, color: 'hsl(var(--calm))' },
    { id: 'breeze', name: 'Quantum Breeze', icon: Wind, enabled: false, intensity: 30, color: 'hsl(var(--resonance))' },
    { id: 'flow', name: 'Data Flow', icon: Droplets, enabled: true, intensity: 50, color: 'hsl(var(--secondary))' },
  ]);

  const toggleEffect = (id: string) => {
    setEffects(effects.map(effect =>
      effect.id === id ? { ...effect, enabled: !effect.enabled } : effect
    ));
  };

  const updateIntensity = (id: string, intensity: number) => {
    setEffects(effects.map(effect =>
      effect.id === id ? { ...effect, intensity } : effect
    ));
  };

  const activeEffects = effects.filter(e => e.enabled);

  return (
    <Card className="p-6 glass-effect border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-orbitron font-bold text-gradient-quantum">Efectos Sensoriales</h3>
          <p className="text-sm text-muted-foreground">Control de experiencia quantum</p>
        </div>
        <div className="text-sm font-medium">
          {activeEffects.length} activos
        </div>
      </div>

      {/* Effects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {effects.map((effect) => {
          const Icon = effect.icon;
          return (
            <motion.div
              key={effect.id}
              whileHover={{ scale: 1.02 }}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${effect.enabled 
                  ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-accent/5' 
                  : 'border-border/30 bg-muted/20'
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: effect.enabled ? `${effect.color}20` : 'transparent',
                      border: `2px solid ${effect.enabled ? effect.color : 'hsl(var(--border))'}20`
                    }}
                  >
                    <Icon 
                      className="w-5 h-5"
                      style={{ color: effect.enabled ? effect.color : 'hsl(var(--muted-foreground))' }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{effect.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {effect.enabled ? 'Activo' : 'Desactivado'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={effect.enabled}
                  onCheckedChange={() => toggleEffect(effect.id)}
                />
              </div>

              {effect.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Intensidad</span>
                    <span className="font-medium">{effect.intensity}%</span>
                  </div>
                  <Slider
                    value={[effect.intensity]}
                    onValueChange={([v]) => updateIntensity(effect.id, v)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-background to-muted/20 border border-primary/10">
        <p className="text-xs text-muted-foreground mb-3 text-center">Vista previa de efectos activos</p>
        <div className="relative h-32 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
          {activeEffects.map((effect, i) => (
            <motion.div
              key={effect.id}
              className="absolute inset-0"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                background: `radial-gradient(circle, ${effect.color}${Math.round(effect.intensity * 2.55).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-2 border-primary/30"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

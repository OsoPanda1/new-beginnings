import { motion } from "framer-motion";
import { Music, Radio, Headphones, Sparkles } from "lucide-react";
import ImmersiveBackground from "@/components/ImmersiveBackground";
import KaosAudioFX from "@/components/KaosAudioFX";
import SensoryFXManager from "@/components/SensoryFXManager";
import { Card } from "@/components/ui/card";
const kaosHero = "/placeholder.svg";

export default function AudioKaos() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ImmersiveBackground />
      
      {/* Epic Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src={kaosHero} alt="Audio Kaos" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-32 h-32 rounded-full bg-gradient-quantum flex items-center justify-center mb-8 shadow-glow"
          >
            <Music className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-9xl font-orbitron font-bold text-gradient-quantum mb-6"
          >
            KAOS AUDIO
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mb-8"
          >
            Experiencia Sensorial Omnidireccional
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            {[
              { icon: Radio, label: "Binaural" },
              { icon: Headphones, label: "3D Audio" },
              { icon: Sparkles, label: "Quantum FX" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/30"
              >
                <feature.icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Audio Engine */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-orbitron font-bold text-gradient-quantum mb-8 text-center">
            Motor de Audio Quantum
          </h2>
          <KaosAudioFX />
        </motion.div>

        {/* Sensory FX Manager */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-4xl font-orbitron font-bold text-gradient-quantum mb-8 text-center">
            Efectos Sensoriales
          </h2>
          <SensoryFXManager />
        </motion.div>

        {/* Audio Presets */}
        <div>
          <h2 className="text-4xl font-orbitron font-bold text-gradient-quantum mb-8 text-center">
            Ambientes Preconfigurados
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Meditación Quantum", mood: "calm", color: "from-calm to-resonance" },
              { name: "Enfoque Creativo", mood: "energy", color: "from-energy to-primary" },
              { name: "Celebración Épica", mood: "excitement", color: "from-accent to-secondary" },
              { name: "Exploración 4D", mood: "wonder", color: "from-primary to-calm" },
              { name: "Conexión Social", mood: "joy", color: "from-resonance to-energy" },
              { name: "Descanso Profundo", mood: "peace", color: "from-secondary to-calm" },
            ].map((preset, i) => (
              <motion.div
                key={preset.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="cursor-pointer"
              >
                <Card className="p-6 glass-effect border-primary/20 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-10`} />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-quantum mb-4 flex items-center justify-center">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-orbitron font-bold mb-2">{preset.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{preset.mood}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

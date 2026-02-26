import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Box, Zap, Globe, Eye } from "lucide-react";
import DreamSpaceViewer from "@/components/DreamSpaceViewer";
import ImmersiveBackground from "@/components/ImmersiveBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dreamspaceHero from "@/assets/dreamspace-hero.webp";

export default function DreamSpaces() {
  const [spaces] = useState([
    { id: 1, name: "Galaxia Quantum", visitors: 1234, type: "Social", color: "from-primary to-accent" },
    { id: 2, name: "Bosque Místico", visitors: 890, type: "Meditación", color: "from-calm to-resonance" },
    { id: 3, name: "Neon City", visitors: 2100, type: "Eventos", color: "from-energy to-secondary" },
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ImmersiveBackground />
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={dreamspaceHero} alt="DreamSpaces" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div animate={{ rotateY: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} className="w-32 h-32 rounded-2xl bg-gradient-quantum flex items-center justify-center mb-8 shadow-glow">
            <Box className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-7xl md:text-9xl font-orbitron font-bold text-gradient-quantum mb-6">
            DREAMSPACES
          </motion.h1>
          
          <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mb-8">
            Experiencias Inmersivas en 3D y 4D
          </motion.p>

          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-4">
            {[{ icon: Globe, label: "Realidad Virtual" }, { icon: Eye, label: "XR Ready" }, { icon: Zap, label: "Quantum Render" }].map((feature) => (
              <motion.div key={feature.label} whileHover={{ scale: 1.1 }} className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/30">
                <feature.icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div>
          <h2 className="text-4xl font-orbitron font-bold text-gradient-quantum mb-8 text-center">Espacios Populares</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {spaces.map((space, i) => (
              <motion.div key={space.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1, type: "spring" }} whileHover={{ scale: 1.05, y: -10 }}>
                <Card className="p-6 glass-effect border-primary/30 cursor-pointer relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${space.color} opacity-20`} />
                  <div className="relative z-10">
                    <Sparkles className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-xl font-orbitron font-bold mb-2">{space.name}</h3>
                    <Badge className="mb-3">{space.type}</Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{space.visitors.toLocaleString()} visitantes</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <h2 className="text-4xl font-orbitron font-bold text-gradient-quantum mb-8 text-center">Vista Inmersiva 3D</h2>
          <DreamSpaceViewer onClose={() => {}} />
          <div className="mt-6 text-center">
            <Button size="lg" className="bg-gradient-quantum hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 mr-2" />
              Crear Mi DreamSpace
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

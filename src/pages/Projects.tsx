import { useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Plus, Image, Video, Music, Sparkles } from "lucide-react";
import ImmersiveBackground from "@/components/ImmersiveBackground";
import { MediaGallery } from "@/components/MediaGallery";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const projectsHero = "/placeholder.svg";

export default function Projects() {
  const [projects] = useState([
    {
      id: 1,
      name: "DreamSpace Galaxia",
      type: "3D Experience",
      progress: 75,
      media: { images: 12, videos: 3, audio: 5 },
      color: "from-primary to-accent"
    },
    {
      id: 2,
      name: "Marketplace NFT",
      type: "E-commerce",
      progress: 60,
      media: { images: 8, videos: 1, audio: 2 },
      color: "from-energy to-resonance"
    },
    {
      id: 3,
      name: "Live Concert Series",
      type: "Streaming",
      progress: 90,
      media: { images: 20, videos: 10, audio: 15 },
      color: "from-accent to-secondary"
    },
    {
      id: 4,
      name: "Universidad TAMV",
      type: "Education",
      progress: 45,
      media: { images: 15, videos: 8, audio: 4 },
      color: "from-calm to-primary"
    },
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ImmersiveBackground />
      
      {/* Epic Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src={projectsHero} alt="Projects" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 rounded-2xl bg-gradient-quantum flex items-center justify-center mb-6 shadow-glow"
          >
            <FolderKanban className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-orbitron font-bold text-gradient-quantum mb-4"
          >
            Tus Proyectos
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8"
          >
            Creatividad sin límites. Visualización inmersiva.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" className="bg-gradient-quantum hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 mr-2" />
              Crear Proyecto Quantum
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="glass-effect border-primary/30 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10`} />
                
                <div className="relative z-10 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-1">
                        {project.name}
                      </h3>
                      <Badge className="bg-gradient-quantum">{project.type}</Badge>
                    </div>
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso</span>
                      <span className="font-bold">{project.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${project.color}`}
                      />
                    </div>
                  </div>

                  {/* Media Stats */}
                  <div className="flex gap-4 pt-4 border-t border-primary/20">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-primary" />
                      <span className="text-sm">{project.media.images}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-accent" />
                      <span className="text-sm">{project.media.videos}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-energy" />
                      <span className="text-sm">{project.media.audio}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-quantum hover:shadow-glow">
                    Abrir Proyecto
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Media Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-4xl font-orbitron font-bold text-gradient-quantum mb-8 text-center">
            Galería Multimedia
          </h2>
          <MediaGallery />
        </motion.div>
      </div>
    </div>
  );
}

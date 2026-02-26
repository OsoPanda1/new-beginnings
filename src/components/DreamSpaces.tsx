import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Eye, Users } from "lucide-react";
import DreamSpaceViewer from "./DreamSpaceViewer";

const baseTemplates = [
  { id: "cyberpunk", name: "Cyberpunk City", desc: "Neones y hologramas" },
  { id: "zen_garden", name: "Zen Garden", desc: "Entorno natural y sereno" },
  { id: "space_station", name: "Estación Espacial", desc: "Ambiente futurista" },
];

const dreamSpacesData = [
  {
    id: 1,
    title: "Quantum Gallery",
    description: "Galería 3D con resonancia emocional",
    gradient: "from-primary via-accent to-secondary",
    views: "1.2K",
    resonance: 94,
  },
  {
    id: 2,
    title: "Neon Dreams",
    description: "Espacio cyberpunk para eventos virtuales",
    gradient: "from-accent via-cyan-400 to-blue-500",
    views: "3.5K",
    resonance: 87,
  },
];

export default function DreamSpacesHybrid() {
  const [selectedTemplate, setSelectedTemplate] = useState(baseTemplates[0].id);
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewingSpace, setViewingSpace] = useState<{ type: string; data: Record<string, unknown> } | null>(null);

  const createNewSpace = useCallback(() => {
    alert(`Creando nuevo DreamSpace con plantilla: ${selectedTemplate}`);
    setShowNewModal(false);
  }, [selectedTemplate]);

  return (
    <>
      {viewingSpace && (
        <DreamSpaceViewer
          spaceType={viewingSpace.type}
          sceneData={viewingSpace.data}
          onClose={() => setViewingSpace(null)}
        />
      )}
      
      <main className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-tr from-background via-primary-dark to-background">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-foreground">
          <h1 className="text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-quantum">
            DreamSpaces - Arquitectura Híbrida Cuántica-Clásica
          </h1>
          <p className="mt-2 text-lg max-w-lg text-muted-foreground">
            Crea y explora entornos multisensoriales 3D/4D con trazabilidad emocional.
          </p>
        </div>
        <Button onClick={() => setShowNewModal(true)} className="px-6 py-4 bg-gradient-quantum flex items-center gap-3">
          <Plus className="w-6 h-6" /> Nuevo DreamSpace
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {dreamSpacesData.map((space) => (
          <motion.div 
            key={space.id}
            className="glass-effect rounded-3xl shadow-quantum cursor-pointer overflow-hidden border border-primary/20"
            whileHover={{ scale: 1.05 }}
            onClick={() => setViewingSpace({ type: space.title, data: {} })}
          >
            <div className={`h-56 bg-gradient-to-br ${space.gradient} relative flex items-center justify-center`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-60 text-white text-2xl font-orbitron select-none">
                {space.title}
              </div>
              <div className="absolute top-3 right-3 glass-effect px-3 py-1 rounded-full flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-white text-sm font-orbitron">{space.views}</span>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-orbitron font-bold text-foreground">{space.title}</h3>
              <p className="text-muted-foreground text-sm">{space.description}</p>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-orbitron">Resonancia</span>
                  <span className="text-accent-glow">{space.resonance}%</span>
                </div>
                <div className="h-2 bg-border rounded-full">
                  <div className={`h-full rounded-full bg-gradient-to-r ${space.gradient}`} style={{ width: `${space.resonance}%` }} />
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <Button variant="outline" className="flex-1 border-border hover:border-primary">
                  <Eye className="w-4 h-4 mr-2" /> Explorar
                </Button>
                <Button variant="outline" className="border-border hover:border-secondary">
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <AnimatePresence>
        {showNewModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewModal(false)}
          >
            <motion.div
              className="bg-background rounded-3xl p-10 max-w-xl w-full shadow-quantum"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-orbitron text-3xl mb-6 text-accent-glow">Crear Nuevo DreamSpace</h2>
              <p className="mb-4 text-muted-foreground">Selecciona una plantilla base para iniciar.</p>
              {baseTemplates.map((tpl) => (
                <label key={tpl.id} className="block mb-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="template"
                    value={tpl.id}
                    checked={selectedTemplate === tpl.id}
                    onChange={() => setSelectedTemplate(tpl.id)}
                    className="hidden"
                  />
                  <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-4 flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-accent-glow" />
                    <div>
                      <div className="font-orbitron font-bold text-foreground">{tpl.name}</div>
                      <p className="text-muted-foreground text-sm">{tpl.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
              <div className="mt-8 flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-quantum" onClick={createNewSpace}>
                  Crear
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>
    </>
  );
}

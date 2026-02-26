import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Box, Zap, Globe, Eye, Plus, X, Loader2 } from "lucide-react";
import DreamSpaceViewer from "@/components/DreamSpaceViewer";
import ImmersiveBackground from "@/components/ImmersiveBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDreamSpaces, CreateDreamSpaceData } from "@/hooks/useDreamSpaces";
const dreamspaceHero = "/placeholder.svg";

const spaceTypes = [
  { value: "social", label: "Social", color: "from-primary to-accent" },
  { value: "meditation", label: "Meditación", color: "from-calm to-resonance" },
  { value: "events", label: "Eventos", color: "from-energy to-secondary" },
  { value: "gaming", label: "Gaming", color: "from-secondary to-primary" },
  { value: "education", label: "Educación", color: "from-accent to-calm" },
  { value: "custom", label: "Personalizado", color: "from-primary to-secondary" },
];

const demoSpaces = [
  { id: "demo-1", title: "Galaxia Quantum", views_count: 1234, space_type: "social", color: "from-primary to-accent" },
  { id: "demo-2", title: "Bosque Místico", views_count: 890, space_type: "meditation", color: "from-calm to-resonance" },
  { id: "demo-3", title: "Neon City", views_count: 2100, space_type: "events", color: "from-energy to-secondary" },
];

export default function DreamSpaces() {
  const { spaces, mySpaces, loading, creating, createSpace, incrementViews } = useDreamSpaces();
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSpace, setNewSpace] = useState<CreateDreamSpaceData>({
    title: "",
    description: "",
    space_type: "custom",
    is_public: true,
  });

  const handleCreateSpace = async () => {
    if (!newSpace.title.trim()) return;
    
    const result = await createSpace(newSpace);
    if (result.data) {
      setCreateDialogOpen(false);
      setNewSpace({ title: "", description: "", space_type: "custom", is_public: true });
    }
  };

  const handleViewSpace = (spaceId: string) => {
    setSelectedSpace(spaceId);
    setShowViewer(true);
    incrementViews(spaceId);
  };

  const displaySpaces = spaces.length > 0 ? spaces : demoSpaces;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ImmersiveBackground />
      
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={dreamspaceHero} alt="DreamSpaces" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div 
            animate={{ rotateY: [0, 360], scale: [1, 1.1, 1] }} 
            transition={{ duration: 4, repeat: Infinity }} 
            className="w-32 h-32 rounded-2xl bg-gradient-quantum flex items-center justify-center mb-8 shadow-glow"
          >
            <Box className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="text-7xl md:text-9xl font-orbitron font-bold text-gradient-quantum mb-6"
          >
            DREAMSPACES
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }} 
            className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mb-8"
          >
            Experiencias Inmersivas en 3D y 4D
          </motion.p>

          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.4 }} 
            className="flex gap-4 flex-wrap justify-center"
          >
            {[{ icon: Globe, label: "Realidad Virtual" }, { icon: Eye, label: "XR Ready" }, { icon: Zap, label: "Quantum Render" }].map((feature) => (
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

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Popular Spaces */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-orbitron font-bold text-gradient-quantum">
              {spaces.length > 0 ? "Espacios Populares" : "Espacios Demo"}
            </h2>
            
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-quantum hover:opacity-90">
                  <Plus className="w-5 h-5 mr-2" />
                  Crear DreamSpace
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect border-primary/30 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-orbitron text-gradient-quantum">
                    Nuevo DreamSpace
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Nombre del Espacio *</Label>
                    <Input
                      id="title"
                      value={newSpace.title}
                      onChange={(e) => setNewSpace({ ...newSpace, title: e.target.value })}
                      placeholder="Mi espacio quantum"
                      className="bg-card/50 border-primary/30 mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newSpace.description}
                      onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                      placeholder="Describe tu espacio..."
                      className="bg-card/50 border-primary/30 mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Tipo de Espacio</Label>
                    <Select 
                      value={newSpace.space_type} 
                      onValueChange={(value) => setNewSpace({ ...newSpace, space_type: value })}
                    >
                      <SelectTrigger className="bg-card/50 border-primary/30 mt-1">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {spaceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleCreateSpace} 
                    disabled={creating || !newSpace.title.trim()}
                    className="w-full bg-gradient-quantum"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Crear Espacio
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {displaySpaces.map((space, i) => {
                const typeInfo = spaceTypes.find(t => t.value === space.space_type) || spaceTypes[5];
                return (
                  <motion.div 
                    key={space.id} 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.5 + i * 0.1, type: "spring" }} 
                    whileHover={{ scale: 1.05, y: -10 }}
                    onClick={() => handleViewSpace(space.id)}
                  >
                    <Card className="p-6 glass-effect border-primary/30 cursor-pointer relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-br ${typeInfo.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      <div className="relative z-10">
                        <Sparkles className="w-8 h-8 text-accent mb-3" />
                        <h3 className="text-xl font-orbitron font-bold mb-2">{space.title}</h3>
                        <Badge className="mb-3">{typeInfo.label}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span>{(space.views_count || 0).toLocaleString()} visitantes</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Spaces */}
        {mySpaces.length > 0 && (
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-gradient-quantum mb-8">
              Mis Espacios
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {mySpaces.map((space, i) => {
                const typeInfo = spaceTypes.find(t => t.value === space.space_type) || spaceTypes[5];
                return (
                  <motion.div 
                    key={space.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleViewSpace(space.id)}
                  >
                    <Card className="p-6 glass-effect border-accent/30 cursor-pointer hover:border-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <Box className="w-8 h-8 text-accent" />
                        <Badge variant="outline" className="border-accent/50">
                          {space.is_public ? "Público" : "Privado"}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-orbitron font-bold mb-1">{space.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {space.description || "Sin descripción"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {space.views_count || 0}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {typeInfo.label}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3D Viewer Section */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <h2 className="text-4xl font-orbitron font-bold text-gradient-quantum mb-8 text-center">
            Vista Inmersiva 3D
          </h2>
          <DreamSpaceViewer onClose={() => setShowViewer(false)} />
          <div className="mt-6 text-center">
            <Button 
              size="lg" 
              className="bg-gradient-quantum hover:scale-110 transition-transform"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Crear Mi DreamSpace
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Full Screen Viewer Modal */}
      <AnimatePresence>
        {showViewer && selectedSpace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50"
              onClick={() => setShowViewer(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            <DreamSpaceViewer 
              onClose={() => setShowViewer(false)} 
              spaceType="immersive"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

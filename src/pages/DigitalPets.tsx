/**
 * 🐾 Digital Pets - TAMV MD-X4™
 * Interactive digital companions with evolution and attributes
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Heart, Zap, Star, Sparkles, Plus, Loader2,
  Shield, Activity, Trophy, Flame
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DigitalPet {
  id: string;
  name: string;
  species: string;
  level: number;
  experience: number;
  attributes: {
    health: number;
    happiness: number;
    energy: number;
  };
  created_at: string;
}

const speciesData: Record<string, { emoji: string; color: string; gradient: string }> = {
  quantum_fox: { emoji: "🦊", color: "text-orange-400", gradient: "from-orange-500/20 to-red-500/10" },
  crystal_wolf: { emoji: "🐺", color: "text-blue-400", gradient: "from-blue-500/20 to-cyan-500/10" },
  neon_phoenix: { emoji: "🦅", color: "text-pink-400", gradient: "from-pink-500/20 to-purple-500/10" },
  cyber_dragon: { emoji: "🐉", color: "text-green-400", gradient: "from-green-500/20 to-emerald-500/10" },
  astral_cat: { emoji: "🐱", color: "text-purple-400", gradient: "from-purple-500/20 to-indigo-500/10" },
  void_serpent: { emoji: "🐍", color: "text-teal-400", gradient: "from-teal-500/20 to-cyan-500/10" },
};

const speciesOptions = [
  { value: "quantum_fox", label: "Quantum Fox 🦊" },
  { value: "crystal_wolf", label: "Crystal Wolf 🐺" },
  { value: "neon_phoenix", label: "Neon Phoenix 🦅" },
  { value: "cyber_dragon", label: "Cyber Dragon 🐉" },
  { value: "astral_cat", label: "Astral Cat 🐱" },
  { value: "void_serpent", label: "Void Serpent 🐍" },
];

export default function DigitalPets() {
  const [pets, setPets] = useState<DigitalPet[]>([]);
  const [allPets, setAllPets] = useState<DigitalPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetSpecies, setNewPetSpecies] = useState("quantum_fox");
  const [interacting, setInteracting] = useState<string | null>(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    
    // Fetch user's pets
    const { data: session } = await supabase.auth.getSession();
    if (session?.session) {
      const { data: myPets } = await supabase
        .from("digital_pets")
        .select("*")
        .eq("owner_id", session.session.user.id)
        .order("created_at", { ascending: false });

      if (myPets) setPets(myPets as unknown as DigitalPet[]);
    }

    // Fetch all public pets
    const { data: publicPets } = await supabase
      .from("digital_pets")
      .select("*")
      .order("level", { ascending: false })
      .limit(12);

    if (publicPets) setAllPets(publicPets as unknown as DigitalPet[]);
    setLoading(false);
  };

  const createPet = async () => {
    if (!newPetName.trim()) return;
    setCreating(true);

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      toast.error("Inicia sesión para crear una mascota");
      setCreating(false);
      return;
    }

    const { error } = await supabase.from("digital_pets").insert({
      owner_id: session.session.user.id,
      name: newPetName.trim(),
      species: newPetSpecies,
    });

    if (error) {
      toast.error("Error al crear mascota", { description: error.message });
    } else {
      toast.success(`¡${newPetName} ha nacido! 🎉`);
      setDialogOpen(false);
      setNewPetName("");
      fetchPets();
    }
    setCreating(false);
  };

  const interactWithPet = async (pet: DigitalPet, action: "feed" | "play" | "train") => {
    setInteracting(pet.id);

    const attrs = { ...pet.attributes };
    const xpGain = action === "train" ? 25 : action === "play" ? 15 : 10;

    if (action === "feed") {
      attrs.health = Math.min(100, attrs.health + 15);
      attrs.energy = Math.min(100, attrs.energy + 20);
    } else if (action === "play") {
      attrs.happiness = Math.min(100, attrs.happiness + 20);
      attrs.energy = Math.max(0, attrs.energy - 10);
    } else {
      attrs.energy = Math.max(0, attrs.energy - 15);
      attrs.happiness = Math.max(0, attrs.happiness - 5);
    }

    const newExp = pet.experience + xpGain;
    const newLevel = Math.floor(newExp / 100) + 1;

    const { error } = await supabase
      .from("digital_pets")
      .update({
        attributes: attrs as any,
        experience: newExp,
        level: newLevel,
      })
      .eq("id", pet.id);

    if (!error) {
      toast.success(
        action === "feed" ? `${pet.name} ha comido 🍖` :
        action === "play" ? `${pet.name} está jugando 🎾` :
        `${pet.name} ha entrenado 💪`,
        { description: `+${xpGain} XP` }
      );
      fetchPets();
    }
    setInteracting(null);
  };

  const getSpecies = (species: string) => speciesData[species] || speciesData.quantum_fox;

  const renderPetCard = (pet: DigitalPet, isOwner: boolean) => {
    const species = getSpecies(pet.species);
    const attrs = pet.attributes || { health: 100, happiness: 100, energy: 100 };

    return (
      <motion.div
        key={pet.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
      >
        <Card className={`glass-effect border-primary/20 overflow-hidden relative group`}>
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${species.gradient} opacity-50`} />
          
          <div className="relative z-10 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl"
                >
                  {species.emoji}
                </motion.div>
                <div>
                  <h3 className="font-orbitron font-bold text-foreground">{pet.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {pet.species.replace("_", " ")}
                  </p>
                </div>
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/30 font-orbitron">
                <Star className="w-3 h-3 mr-1" />
                Lv.{pet.level}
              </Badge>
            </div>

            {/* XP Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>EXP</span>
                <span>{pet.experience % 100}/100</span>
              </div>
              <Progress value={pet.experience % 100} className="h-1.5" />
            </div>

            {/* Attributes */}
            <div className="space-y-2">
              {[
                { label: "Salud", value: attrs.health, icon: Heart, color: "text-red-400" },
                { label: "Felicidad", value: attrs.happiness, icon: Sparkles, color: "text-yellow-400" },
                { label: "Energía", value: attrs.energy, icon: Zap, color: "text-accent" },
              ].map((attr) => (
                <div key={attr.label} className="flex items-center gap-2">
                  <attr.icon className={`w-3 h-3 ${attr.color}`} />
                  <span className="text-xs text-muted-foreground w-16">{attr.label}</span>
                  <Progress value={attr.value} className="flex-1 h-1.5" />
                  <span className="text-xs text-muted-foreground w-8 text-right">{attr.value}</span>
                </div>
              ))}
            </div>

            {/* Actions (only for owner) */}
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-border/50"
                  disabled={interacting === pet.id}
                  onClick={() => interactWithPet(pet, "feed")}
                >
                  🍖 Alimentar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-border/50"
                  disabled={interacting === pet.id}
                  onClick={() => interactWithPet(pet, "play")}
                >
                  🎾 Jugar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-border/50"
                  disabled={interacting === pet.id}
                  onClick={() => interactWithPet(pet, "train")}
                >
                  💪 Entrenar
                </Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-7xl mb-6 inline-block"
        >
          🐾
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-gradient-quantum mb-4 relative z-10">
          Mascotas Digitales
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto relative z-10">
          Crea, cuida y evoluciona a tu compañero digital en el ecosistema TAMV
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          {[
            { icon: Shield, label: "6 Especies" },
            { icon: Activity, label: "Evolución" },
            { icon: Trophy, label: "Rankings" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/30"
            >
              <f.icon className="w-4 h-4 text-accent" />
              <span className="text-sm">{f.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* My Pets */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-orbitron font-bold text-gradient-quantum">
              Mis Mascotas
            </h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adoptar Mascota
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect border-primary/30 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-orbitron text-gradient-quantum">
                    Nueva Mascota
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Nombre *</Label>
                    <Input
                      value={newPetName}
                      onChange={(e) => setNewPetName(e.target.value)}
                      placeholder="Dale un nombre épico..."
                      className="bg-card/50 border-primary/30 mt-1"
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <Label>Especie</Label>
                    <Select value={newPetSpecies} onValueChange={setNewPetSpecies}>
                      <SelectTrigger className="bg-card/50 border-primary/30 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {speciesOptions.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Species preview */}
                  <div className="text-center py-4">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl inline-block"
                    >
                      {speciesData[newPetSpecies]?.emoji || "🦊"}
                    </motion.div>
                  </div>

                  <Button
                    onClick={createPet}
                    disabled={creating || !newPetName.trim()}
                    className="w-full bg-gradient-to-r from-primary to-accent"
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {creating ? "Creando..." : "Adoptar"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => renderPetCard(pet, true))}
            </div>
          ) : (
            <Card className="glass-effect p-12 text-center border-primary/20">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4 inline-block"
              >
                🥚
              </motion.div>
              <h3 className="text-xl font-orbitron font-bold mb-2">Aún no tienes mascotas</h3>
              <p className="text-muted-foreground mb-4">¡Adopta tu primer compañero digital!</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-primary to-accent">
                <Plus className="w-4 h-4 mr-2" />
                Adoptar ahora
              </Button>
            </Card>
          )}
        </div>

        {/* Community Pets */}
        {allPets.length > 0 && (
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-gradient-quantum mb-6">
              Mascotas de la Comunidad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allPets.map((pet) => renderPetCard(pet, false))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

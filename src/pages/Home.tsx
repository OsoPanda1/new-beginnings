import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Globe, Users, Music, Wallet, 
  MessageCircle, Heart, BookOpen, Crown, Gamepad2,
  Tv, Radio, ShoppingBag, Trophy, Gift, Flame,
  TrendingUp, Eye, Play, ChevronRight, Shield,
  PawPrint, Atom, Gavel, ArrowRightLeft, Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

import heroMetaverse from "@/assets/hero-metaverse.jpg";
import dreamspacePortal from "@/assets/dreamspace-portal.jpg";
import marketplaceImg from "@/assets/marketplace-immersive.jpg";
import isabellaImg from "@/assets/isabella-hologram.jpg";
import liveConcert from "@/assets/live-concert-xr.jpg";
import galleryHero from "@/assets/gallery-hero.jpg";
import universityHero from "@/assets/university-hero.jpg";
import gamesHero from "@/assets/games-hero.jpg";

// Immersive Portal Card with real images
const PortalCard = ({ 
  icon: Icon, title, description, gradient, path, stats, isLive, image
}: {
  icon: any; title: string; description: string; gradient: string; path: string;
  stats?: { label: string; value: string }[]; isLive?: boolean; image?: string;
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => navigate(path)}
      className="cursor-pointer relative group"
    >
      <Card className="overflow-hidden border-primary/20 h-full relative">
        {/* Background Image */}
        {image && (
          <div className="absolute inset-0">
            <img src={image} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}
        {!image && <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />}
        
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-red-400">LIVE</span>
          </div>
        )}
        
        <div className="relative z-10 p-6">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-glow backdrop-blur-sm`}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-orbitron font-bold text-foreground mb-2 drop-shadow-lg">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
          
          {stats && (
            <div className="flex gap-4 mt-3">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-lg font-bold text-accent drop-shadow-glow">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <motion.div initial={{ opacity: 0, x: -10 }} whileHover={{ opacity: 1, x: 0 }} className="absolute bottom-4 right-4">
          <ChevronRight className="w-5 h-5 text-accent" />
        </motion.div>
      </Card>
    </motion.div>
  );
};

// Immersive Feature Showcase
const ImmersiveShowcase = ({ title, subtitle, image, cta, path }: {
  title: string; subtitle: string; image: string; cta: string; path: string;
}) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => navigate(path)}
    >
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="text-3xl font-orbitron font-black text-foreground mb-2 drop-shadow-lg">{title}</h3>
        <p className="text-muted-foreground text-lg mb-4 max-w-md">{subtitle}</p>
        <Button className="bg-gradient-quantum hover:opacity-90 text-white font-orbitron">
          {cta} <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

// Story Card
const StoryCard = ({ user }: { user: any }) => (
  <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center cursor-pointer">
    <div className="p-0.5 rounded-full bg-gradient-quantum">
      <Avatar className="w-16 h-16 border-2 border-background">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
    </div>
    <span className="text-xs mt-1 text-muted-foreground truncate w-16 text-center">{user.name}</span>
  </motion.div>
);

export default function Home() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("discover");
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const stories = [
    { id: 1, name: "Isabella", avatar: "/placeholder.svg" },
    { id: 2, name: "Carlos", avatar: "/placeholder.svg" },
    { id: 3, name: "María", avatar: "/placeholder.svg" },
    { id: 4, name: "DreamLab", avatar: "/placeholder.svg" },
    { id: 5, name: "XR Studio", avatar: "/placeholder.svg" },
    { id: 6, name: "AudioFX", avatar: "/placeholder.svg" },
  ];

  const portals = [
    { icon: Globe, title: "DreamSpaces", description: "Universos XR inmersivos 3D/4D", gradient: "from-primary to-accent", path: "/dreamspaces", image: dreamspacePortal, stats: [{ label: "Spaces", value: "2.4K" }, { label: "Usuarios", value: "45K" }] },
    { icon: ShoppingBag, title: "Marketplace", description: "Activos digitales únicos", gradient: "from-accent to-energy", path: "/marketplace", image: marketplaceImg, stats: [{ label: "Items", value: "12K" }, { label: "Vendidos", value: "8K" }] },
    { icon: Music, title: "KAOS Audio", description: "Audio espacial 4D sensorial", gradient: "from-calm to-primary", path: "/audio-kaos", stats: [{ label: "Tracks", value: "50K" }, { label: "Plays", value: "2M" }], isLive: true },
    { icon: Tv, title: "Lives XR", description: "Streaming holográfico en vivo", gradient: "from-destructive to-accent", path: "/lives", image: liveConcert, stats: [{ label: "En Vivo", value: "156" }, { label: "Viewers", value: "23K" }], isLive: true },
    { icon: Wallet, title: "Cattleya Wallet", description: "Economía digital soberana", gradient: "from-energy to-resonance", path: "/wallet", stats: [{ label: "Balance", value: "$4.2K" }] },
    { icon: BookOpen, title: "University", description: "Certifícate en Web 4.0", gradient: "from-focus to-calm", path: "/university", image: universityHero, stats: [{ label: "Cursos", value: "340" }, { label: "Alumnos", value: "15K" }] },
    { icon: Users, title: "Comunidades", description: "Grupos, canales y foros", gradient: "from-primary to-focus", path: "/groups", stats: [{ label: "Grupos", value: "890" }] },
    { icon: MessageCircle, title: "Chats", description: "Mensajería quantum cifrada", gradient: "from-accent to-primary", path: "/chats" },
    { icon: Gamepad2, title: "Games", description: "Juegos XR y competencias", gradient: "from-energy to-accent", path: "/games", image: gamesHero },
    { icon: Trophy, title: "Lotería TAMV", description: "Premios verificables VRF", gradient: "from-resonance to-energy", path: "/lottery" },
    { icon: ArrowRightLeft, title: "Trueque", description: "Intercambio directo P2P", gradient: "from-calm to-accent", path: "/trueque" },
    { icon: Gavel, title: "Subastas", description: "Pujas en tiempo real", gradient: "from-primary to-destructive", path: "/auctions" },
    { icon: PawPrint, title: "Mascotas", description: "Companions digitales AI", gradient: "from-accent to-calm", path: "/pets" },
    { icon: Gift, title: "Referidos", description: "Gana invitando amigos", gradient: "from-accent to-calm", path: "/referrals" },
    { icon: Crown, title: "Membresías", description: "Beneficios exclusivos", gradient: "from-primary to-energy", path: "/memberships" },
    { icon: Shield, title: "Guardianes", description: "Anubis, Horus, Dekateotl", gradient: "from-destructive to-primary", path: "/guardians" },
  ];

  const contextChips = [
    { id: "discover", label: "Descubrir", icon: Sparkles },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "live", label: "En Vivo", icon: Radio },
    { id: "dreamspaces", label: "DreamSpaces", icon: Globe },
    { id: "music", label: "Música", icon: Music },
    { id: "economy", label: "Economía", icon: Wallet },
  ];

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setScrollProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
  }, []);

  return (
    <div ref={containerRef} onScroll={handleScroll} className="min-h-screen relative overflow-y-auto overflow-x-hidden">
      {/* Scroll progress */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-muted z-50">
        <motion.div className="h-full bg-gradient-quantum" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="relative z-10">
        {/* HERO — Full bleed cinematic */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroMetaverse} alt="TAMV Metaverse" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
          </div>
          
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center max-w-5xl relative z-10 px-4">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
              <Badge className="mb-6 bg-gradient-quantum text-white px-6 py-2 text-sm backdrop-blur-sm">
                <Flame className="w-4 h-4 mr-2 inline" />
                La Primera Infraestructura Digital Soberana
              </Badge>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-orbitron font-black text-foreground mb-4 drop-shadow-2xl">
              <span className="text-gradient-quantum">TAMV</span>{" "}
              <span className="text-foreground/90">MD-X4™</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto font-light drop-shadow-lg">
              Metaverso social quantum-sensorial. Experiencias XR inmersivas, economía ética del creador y conexiones auténticas.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-quantum hover:opacity-90 text-white font-orbitron text-lg px-8 py-6" onClick={() => navigate("/dreamspaces")}>
                <Sparkles className="mr-2 w-5 h-5" /> Explorar DreamSpaces
              </Button>
              <Button size="lg" variant="outline" className="border-accent/50 text-accent hover:bg-accent/10 backdrop-blur-sm text-lg px-8 py-6" onClick={() => navigate("/global-wall")}>
                <Play className="mr-2 w-5 h-5" /> Muro Global
              </Button>
            </div>
            
            {/* Live stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { label: "Usuarios Activos", value: "45K+" },
                { label: "DreamSpaces", value: "2,400" },
                { label: "Transacciones", value: "$1.2M" },
                { label: "Creadores", value: "8K+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center backdrop-blur-sm bg-background/30 rounded-xl px-6 py-3">
                  <div className="text-2xl font-orbitron font-bold text-accent">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Context Chips */}
        <section className="sticky top-16 z-40 py-4 px-4 glass-effect backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {contextChips.map((chip) => (
                <motion.button key={chip.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection(chip.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    activeSection === chip.id ? 'bg-gradient-quantum text-white shadow-glow' : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground'
                  }`}
                >
                  <chip.icon className="w-4 h-4" />
                  {chip.label}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Stories */}
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gradient-quantum flex items-center justify-center">
                  <span className="text-2xl text-white">+</span>
                </div>
                <span className="text-xs mt-1 text-muted-foreground">Tu Historia</span>
              </motion.div>
              {stories.map((story) => <StoryCard key={story.id} user={story} />)}
            </div>
          </div>
        </section>

        {/* Isabella AI Showcase */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <ImmersiveShowcase
              title="Isabella Villaseñor AI™"
              subtitle="La conciencia XRAI soberana del metaverso. Voz bidireccional, memoria expandida, presencia holográfica 3D/4D y ética auditable."
              image={isabellaImg}
              cta="Hablar con Isabella"
              path="/chats"
            />
          </div>
        </section>

        {/* Portals Grid */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} className="text-3xl font-orbitron font-bold text-gradient-quantum mb-8">
              Explora el Ecosistema
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {portals.map((portal, index) => (
                <motion.div key={portal.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} viewport={{ once: true }}>
                  <PortalCard {...portal} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DreamSpaces & Lives Dual Showcase */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImmersiveShowcase title="DreamSpaces™" subtitle="Universos XR persistentes con audio 4D, haptics y economía integrada." image={dreamspacePortal} cta="Crear Espacio" path="/dreamspaces" />
            <ImmersiveShowcase title="Conciertos XR" subtitle="Experiencias sensoriales en vivo con streaming holográfico." image={liveConcert} cta="Ver Ahora" path="/lives" />
          </div>
        </section>

        {/* 7 Capas Federadas */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-3xl font-orbitron font-bold text-gradient-quantum mb-8 text-center">
              7 Capas Federadas Civilizatorias
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "ID-NVIDA™", desc: "Identidad soberana descentralizada", icon: Shield, color: "from-blue-600 to-blue-400" },
                { name: "Isabella AI™", desc: "Ética cognitiva y guardianía", icon: Sparkles, color: "from-cyan-500 to-teal-400" },
                { name: "Dekateotl™", desc: "Gobernanza y consenso DAO", icon: Crown, color: "from-purple-600 to-purple-400" },
                { name: "MSR/BookPI™", desc: "Evidencia inmutable blockchain", icon: BookOpen, color: "from-amber-600 to-amber-400" },
                { name: "Banco TAMV", desc: "Economía justa del creador", icon: Wallet, color: "from-green-600 to-green-400" },
                { name: "DreamSpaces™", desc: "Experiencia sensorial XR 4D", icon: Globe, color: "from-pink-600 to-pink-400" },
                { name: "QuantumPods™", desc: "Infraestructura federada", icon: Atom, color: "from-indigo-600 to-indigo-400" },
                { name: "EOCT", desc: "Ética operativa en tiempo real", icon: Zap, color: "from-yellow-600 to-yellow-400" },
              ].map((layer, i) => (
                <motion.div key={layer.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                  <Card className="glass-effect p-5 h-full border-primary/20 hover:border-accent/50 transition-all group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center mb-3 group-hover:shadow-glow transition-all`}>
                      <layer.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-orbitron font-bold text-foreground mb-1">{layer.name}</h4>
                    <p className="text-sm text-muted-foreground">{layer.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Economic Promise */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-8 md:p-12 border border-accent/20">
              <h2 className="text-4xl font-orbitron font-black text-gradient-quantum mb-4">75% para el Creador</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                TAMV garantiza que los creadores reciban entre el 50% y 75% del valor generado. Sin intermediarios abusivos, sin publicidad invasiva.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { label: "Fondo Fénix", value: "20%", desc: "Proyectos humanitarios" },
                  { label: "Infraestructura", value: "30%", desc: "Reinversión tecnológica" },
                  { label: "Creadores", value: "50-75%", desc: "Para ti" },
                ].map((item) => (
                  <div key={item.label} className="bg-card/50 backdrop-blur rounded-xl p-6 min-w-[140px]">
                    <div className="text-3xl font-orbitron font-bold text-accent">{item.value}</div>
                    <div className="text-sm font-medium text-foreground mt-1">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <section className="py-8 px-4 border-t border-border/30">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-muted-foreground text-sm">
              TAMV MD-X4™ — La primera infraestructura digital soberana de Latinoamérica para el mundo 🇲🇽
            </p>
            <p className="text-muted-foreground/50 text-xs mt-2">
              Mineral del Monte, Hidalgo · Fundado por Anubis Villaseñor
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

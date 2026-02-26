import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Sparkles, Globe,
  Bot, Layers, Cpu, Network, ShoppingCart, Music, Users, GraduationCap,
  Store, Radio
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import { MediaGallery } from "@/components/MediaGallery";
import IsabellaVoice from "@/components/IsabellaVoice";
import type { User } from "@supabase/supabase-js";

interface Post {
  id: string;
  content: string;
  media_urls: string[] | null;
  media_types: string[] | null;
  created_at: string;
  resonance_count: number;
  comments_count: number;
  shares_count: number;
  profiles?: {
    username: string;
    avatar_url: string;
    verified: boolean;
  };
}

export default function GlobalWall() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [isabellaActive, setIsabellaActive] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
    });
    fetchPosts();
    const matrixCleanup = initMatrixEffect();

    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
      if (matrixCleanup) matrixCleanup();
    };
  }, []);

  const initMatrixEffect = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = '01TAMVX4QUANTUM';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.random() * canvas.height;
    const draw = () => {
      ctx.fillStyle = 'rgba(16, 16, 20, 0.045)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'hsl(270, 82%, 62%)';
      ctx.font = `${fontSize}px Fira Code, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 38);
    return () => clearInterval(interval);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`*, profiles:user_id (username, avatar_url, verified)`)
      .order('created_at', { ascending: false })
      .limit(70);
    if (!error && data) setPosts(data as unknown as Post[]);
  };

  const createPost = async () => {
    if (!isAuthenticated || !user) { toast.error("Debes iniciar sesión para publicar"); navigate("/auth"); return; }
    if (!content.trim() && mediaUrls.length === 0) return;
    
    const { error } = await supabase
      .from('posts')
      .insert({ 
        user_id: user.id, 
        content, 
        post_type: 'post',
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        media_types: mediaTypes.length > 0 ? mediaTypes : null
      });
    
    if (error) {
      toast.error("Error al publicar");
    } else {
      setContent("");
      setMediaUrls([]);
      setMediaTypes([]);
      toast.success("✨ Publicado en el Quantum!");
    }
  };

  const handleResonance = async (postId: string) => {
    if (!isAuthenticated || !user) { toast.error("Debes iniciar sesión"); navigate("/auth"); return; }
    const { error } = await supabase
      .from('resonances')
      .insert({ user_id: user.id, post_id: postId, emotion: 'resonance' });
    if (error && error.code !== '23505') {
      toast.error("Error al resonar");
    } else {
      toast.success("✨ Resonancia enviada");
    }
  };

  const TopBar = () => (
    <div className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-black/70 via-primary/10 to-black/70 backdrop-blur-xl shadow-2xl border-b border-white/10 flex justify-between items-center px-8 h-20 glassmorph-glow">
      <div className="font-orbitron text-2xl tracking-wider text-resonance-glow drop-shadow font-bold">TAMV MD-X4™</div>
      <div className="flex gap-4 items-center">
        <Button variant="ghost" onClick={() => navigate('/university')}><GraduationCap className="w-5 h-5" /> Tamv University</Button>
        <Button variant="ghost" onClick={() => navigate('/marketplace')}><ShoppingCart className="w-5 h-5" /> Marketplace</Button>
        <Button variant="ghost" onClick={() => navigate('/music')}><Music className="w-5 h-5" /> Música</Button>
        <Button variant="ghost" onClick={() => navigate('/dreamspaces')}><Radio className="w-5 h-5" /> DreamSpaces</Button>
        <Button variant="ghost" onClick={() => navigate('/store')}><Store className="w-5 h-5" /> Store</Button>
      </div>
      <Avatar className="border-2 border-accent-glow">
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback>{user?.user_metadata?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
      </Avatar>
    </div>
  );

  const SideBar = () => {
    const [open, setOpen] = useState(false);
    return (
      <motion.div
        className={`fixed left-0 top-20 z-30 h-[80vh] flex flex-col bg-gradient-to-br from-black/40 to-primary/20
        backdrop-blur-lg p-1 rounded-r-3xl overflow-hidden shadow-2xl`}
        initial={{ x: -80 }} animate={{ x: open ? 0 : -80 }} transition={{ type: "spring", stiffness: 160 }}
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      >
        <Button variant="ghost" size="icon" className="mb-4 mt-2" onClick={() => setOpen(!open)}>
          <Layers className="transition-transform" />
        </Button>
        {open && (
          <div className="flex flex-col gap-4 transition-all">
            <Button variant="ghost" onClick={() => navigate('/wall')}><Globe /> Global Wall</Button>
            <Button variant="ghost" onClick={() => navigate('/groups')}><Users /> Canales/Grupos</Button>
            <Button variant="ghost" onClick={() => navigate('/chats')}><Bot /> Chats IA</Button>
            <Button variant="ghost" onClick={() => navigate('/calls')}><Cpu /> VideoLlamadas</Button>
            <Button variant="ghost" onClick={() => navigate('/dreamspaces')}><Radio /> DreamSpaces</Button>
          </div>
        )}
      </motion.div>
    );
  };

  const CentralBar = () => (
    <div className="w-full glassmorph-glow rounded-xl py-3 px-4 mt-4 mx-auto flex flex-wrap gap-3 items-center justify-center border-b border-t border-cyan-900/60">
      <Button variant="ghost" onClick={() => navigate('/groups')}><Users /> Grupos</Button>
      <Button variant="ghost" onClick={() => navigate('/channels')}><Network /> Canales</Button>
      <Button variant="ghost" onClick={() => navigate('/chats')}><Bot /> Chats</Button>
      <Button variant="ghost" onClick={() => navigate('/calls')}><Cpu /> Videollamadas</Button>
      <Button variant="ghost" onClick={() => navigate('/music')}><Music /> Música</Button>
      <Button variant="ghost" onClick={() => navigate('/concerts')}><Radio /> Conciertos</Button>
      <Button variant="ghost" onClick={() => navigate('/dreamspaces')}><Radio /> DreamSpaces</Button>
    </div>
  );

  const VideoGrid = () => (
    <div className="w-full flex flex-col items-center mt-36 gap-10">
      <div className="w-full rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-accent-glow/30 to-black/80 border-4 border-primary max-w-5xl mx-auto animate-glow">
        <video src="/main-hero.mp4" autoPlay loop muted controls className="w-full aspect-video object-cover" />
      </div>
      {[0, 1].map(row =>
        <div key={row} className="grid grid-cols-5 gap-6 w-full max-w-5xl mx-auto">
          {[...Array(5)].map((_, col) =>
            <video key={col} src={`/wall-videos/${row * 5 + col}.mp4`} loop muted controls
              className="rounded-xl glassmorph-glow object-cover w-full h-[180px] hover:scale-105 transition" />
          )}
        </div>
      )}
    </div>
  );

  const MusicSection = () => (
    <div className="max-w-6xl mx-auto mt-14 mb-10 p-6 glass-effect shadow-lg rounded-3xl">
      <div className="text-2xl font-orbitron font-bold mb-3 text-secondary-glow">Música Sensitiva</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-5 flex flex-col gap-2 items-center">
            <Music className="w-9 h-9 text-cyan-400" />
            <div className="font-semibold text-white">Track #{i + 1}</div>
            <audio src={`/music/track${i + 1}.mp3`} controls className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  const MarketplaceSection = () => (
    <div className="max-w-6xl mx-auto mt-16 space-y-10">
      <div className="flex flex-wrap gap-6 justify-center">
        <Card className="w-80 bg-gradient-to-br from-cyan-950/80 to-black/80 hover:shadow-glow">
          <div className="font-orbitron text-xl mb-3 text-center text-accent">Membresías</div>
          <ul className="flex flex-col gap-2">
            {['Free', 'Premium', 'VIP', 'Elite', 'Celestial'].map((level, idx) => (
              <li key={level} className={`flex justify-between font-bold ${idx % 2 ? 'text-yellow-400' : 'text-slate-200'} py-1 px-2`}>
                {level} <span>Desde ${idx * 199 + 0} MXN</span>
              </li>
            ))}
          </ul>
          <Button className="mt-6 w-full" onClick={() => navigate('/shop')}>Ver Tienda</Button>
        </Card>
        <Card className="w-96 bg-gradient-to-br from-purple-950/90 to-black hover:shadow-glow px-7 py-10">
          <div className="font-orbitron text-lg mb-2 text-resonance">Marketplace Digital</div>
          <p className="text-xs text-muted-foreground">Adquiere assets XR, skins, cursos, conciertos, regalos, NFTs, upgrades.</p>
          <Button variant="outline" className="mt-7 w-full border-purple-400" onClick={() => navigate('/marketplace')}>Entrar Marketplace</Button>
        </Card>
      </div>
    </div>
  );

  const DreamSpaces = () => (
    <div className="max-w-6xl mx-auto mt-14 p-7 rounded-2xl glass-effect border border-cyan-600/40 shadow-sm">
      <div className="font-orbitron text-xl font-bold text-primary-glow mb-2">DreamSpaces XR</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-cyan-900 to-black p-5 rounded-xl flex flex-col gap-2">
            <Radio className="w-7 h-7 text-accent" />
            <div className="font-semibold text-white">DreamSpace #{i + 1}</div>
            <Button size="sm" className="w-full mt-2" onClick={() => navigate(`/dreamspaces/${i + 1}`)}>Explorar</Button>
          </div>
        ))}
      </div>
    </div>
  );

  const UniversitySection = () => (
    <div className="max-w-6xl mx-auto mt-14 mb-20 p-7 glass-effect rounded-3xl">
      <div className="font-orbitron text-xl text-primary font-bold mb-2">TAMV University</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-purple-700/50 to-black p-6 rounded-xl">
            <GraduationCap className="w-8 h-8 text-accent mb-2" />
            <div className="font-semibold text-white">Curso #{i + 1}</div>
            <Button size="sm" className="w-full mt-2">Ir al Curso</Button>
          </div>
        ))}
      </div>
    </div>
  );

  const FeedSection = () => (
    <div className="max-w-5xl mx-auto mt-8 space-y-8">
      {isAuthenticated && user && (
        <Card className="glass-effect p-6 glow-quantum mb-8">
          <Textarea
            placeholder="Comparte tu experiencia quantum..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-card border-primary/30 min-h-[120px] resize-none"
          />
          <div className="mt-4">
            <MediaUploader 
              userId={user.id} 
              onUploadComplete={(urls, types) => {
                setMediaUrls(urls);
                setMediaTypes(types);
              }} 
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={createPost} className="bg-gradient-quantum" disabled={!content.trim() && mediaUrls.length === 0}>
              <Sparkles className="w-4 h-4 mr-2" /> Publicar
            </Button>
          </div>
        </Card>
      )}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <Card className="glass-effect p-6 hover:glow-quantum transition-all">
              <div className="flex items-start gap-4">
                <Avatar className="border-2 border-primary/30">
                  <AvatarImage src={post.profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary/20">{post.profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron font-bold">{post.profiles?.username}</span>
                    {post.profiles?.verified && (
                      <Badge className="bg-gradient-quantum text-white">✓</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{new Date(post.created_at).toLocaleDateString()}</p>
                  <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

                  <MediaGallery 
                    mediaUrls={post.media_urls || []} 
                    mediaTypes={post.media_types || []}
                  />

                  <div className="flex gap-6 mt-4 pt-4 border-t border-primary/20">
                    <Button variant="ghost" size="sm"
                      onClick={() => handleResonance(post.id)}
                      className="text-resonance hover:text-resonance/80">
                      <Heart className="w-4 h-4 mr-1" /> {post.resonance_count || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-secondary">
                      <MessageCircle className="w-4 h-4 mr-1" /> {post.comments_count || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-accent">
                      <Share2 className="w-4 h-4 mr-1" /> {post.shares_count || 0}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black/95 relative">
      <TopBar />
      <SideBar />
      
      {isabellaActive && (
        <IsabellaVoice 
          isActive={isabellaActive} 
          onClose={() => setIsabellaActive(false)}
          userName={user?.user_metadata?.username}
        />
      )}

      <div className="pt-28 pb-10 px-2">
        <VideoGrid />
        <CentralBar />
        <MusicSection />
        <DreamSpaces />
        <UniversitySection />
        <MarketplaceSection />
        <FeedSection />
      </div>
    </div>
  );
}

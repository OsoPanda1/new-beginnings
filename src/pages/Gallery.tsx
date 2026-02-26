import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Heart, Eye, Coins, Sparkles } from "lucide-react";
import galleryHero from "@/assets/gallery-hero.jpg";

interface Artwork {
  id: string;
  title: string;
  description: string;
  media_url: string;
  is_auction: boolean;
  is_for_sale: boolean;
  price_credits: number | null;
  profiles?: {
    username: string;
    avatar_url: string;
    verified: boolean;
  };
}

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      () => {
        fetchArtworks();
      }
    );

    supabase.auth.getSession().then(() => {
      fetchArtworks();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchArtworks = async () => {
    const { data } = await supabase
      .from('artworks')
      .select(`
        *,
        profiles:user_id (username, avatar_url, verified)
      `)
      .order('created_at', { ascending: false });

    if (data) setArtworks(data as unknown as Artwork[]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-80 overflow-hidden"
      >
        <img
          src={galleryHero}
          alt="Gallery Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-orbitron text-gradient-dream mb-4 drop-shadow-lg">
              Galería Quantum
            </h1>
            <p className="text-xl text-foreground/80">Explora arte sensorial del metaverso</p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art, index) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect overflow-hidden border-primary/20 hover:border-primary/40 transition-all group">
                <div className="relative aspect-square bg-card-glass overflow-hidden">
                  {art.media_url && (
                    <img
                      src={art.media_url}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {art.is_auction && (
                      <Badge className="bg-accent/90 text-accent-foreground">
                        Subasta
                      </Badge>
                    )}
                    {art.is_for_sale && (
                      <Badge className="bg-primary/90 text-primary-foreground">
                        En venta
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-8 h-8 border-2 border-primary/30">
                      <AvatarImage src={art.profiles?.avatar_url} />
                      <AvatarFallback className="bg-primary/20 text-xs">
                        {art.profiles?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-orbitron text-foreground">
                      {art.profiles?.username}
                    </span>
                    {art.profiles?.verified && (
                      <Sparkles className="w-4 h-4 text-accent" />
                    )}
                  </div>

                  <h3 className="font-orbitron text-lg text-foreground mb-2">
                    {art.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {art.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {Math.floor(Math.random() * 100)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {Math.floor(Math.random() * 500)}
                      </span>
                    </div>
                    
                    {art.price_credits && (
                      <Badge variant="outline" className="border-accent/50 text-accent">
                        <Coins className="w-3 h-3 mr-1" />
                        {art.price_credits}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
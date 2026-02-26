import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Radio, Eye, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import livesHero from "@/assets/lives-hero.jpg";

export default function Lives() {
  const [streams, setStreams] = useState<any[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
    
    supabase.auth.getSession().then(() => {});

    fetchStreams();
    
    const channel = supabase
      .channel('streams-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_streams' }, () => {
        fetchStreams();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStreams = async () => {
    const { data } = await supabase
      .from('live_streams')
      .select(`
        *,
        profiles:user_id (username, avatar_url, verified)
      `)
      .eq('is_live', true)
      .order('viewers_count', { ascending: false });

    if (data) setStreams(data);
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
          src={livesHero}
          alt="Lives Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-orbitron text-gradient-quantum mb-4 drop-shadow-lg">
              Live Streams
            </h1>
            <p className="text-xl text-foreground/80 mb-6">Experiencias en vivo del quantum</p>
            <Button className="bg-gradient-quantum font-orbitron">
              <Video className="w-5 h-5 mr-2" />
              Iniciar Transmisión
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream, index) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect overflow-hidden border-primary/20 hover:border-primary/40 transition-all group cursor-pointer">
                <div className="relative aspect-video bg-card-glass overflow-hidden">
                  {stream.thumbnail_url && (
                    <img
                      src={stream.thumbnail_url}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-destructive animate-pulse flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      EN VIVO
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="outline" className="bg-black/70 border-primary/30 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {stream.viewers_count || 0}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 border-2 border-primary/30">
                      <AvatarImage src={stream.profiles?.avatar_url} />
                      <AvatarFallback className="bg-primary/20">
                        {stream.profiles?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-orbitron text-foreground mb-1 truncate">
                        {stream.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {stream.profiles?.username}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {stream.description}
                      </p>
                      {stream.stream_type && (
                        <Badge variant="outline" className="mt-2 text-xs border-secondary/50">
                          {stream.stream_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {streams.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-orbitron text-muted-foreground">
              No hay transmisiones en vivo
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Sé el primero en iniciar una transmisión
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Users, MessageCircle, Heart, Share2, Star, Trophy, TrendingUp } from "lucide-react";
import communityHero from "@/assets/community-hero.jpg";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  verified: boolean;
  resonance_score: number;
}

export default function Community() {
  const [topUsers, setTopUsers] = useState<Profile[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchTopUsers();
    fetchRecentActivity();
  }, []);

  const fetchTopUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('resonance_score', { ascending: false })
      .limit(10);
    
    if (data) setTopUsers(data);
  };

  const fetchRecentActivity = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url, verified)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (data) setRecentActivity(data);
  };

  const communityStats = [
    { label: "Miembros Activos", value: "24.5K", icon: Users, color: "text-primary" },
    { label: "Posts Hoy", value: "1,247", icon: MessageCircle, color: "text-accent" },
    { label: "Resonancias", value: "89K", icon: Heart, color: "text-red-500" },
    { label: "DreamSpaces", value: "3,456", icon: Star, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-80 overflow-hidden"
      >
        <img
          src={communityHero}
          alt="Community Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-orbitron text-gradient-quantum mb-4 drop-shadow-lg">
              Comunidad TAMV
            </h1>
            <p className="text-xl text-foreground/80">El corazón del metaverso quantum</p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {communityStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-effect p-6 text-center border-primary/20 hover:border-primary/40 transition-all">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-orbitron font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="glass-effect p-6 border-primary/20">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-orbitron font-bold text-foreground">Top Resonadores</h2>
              </div>

              <div className="space-y-4">
                {topUsers.length > 0 ? topUsers.map((user, idx) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-500 text-black' :
                      idx === 1 ? 'bg-gray-400 text-black' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'bg-primary/20 text-foreground'
                    }`}>
                      {idx + 1}
                    </div>
                    <Avatar className="w-10 h-10 border-2 border-primary/30">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/20">
                        {user.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground truncate">{user.username}</span>
                        {user.verified && <Star className="w-4 h-4 text-accent fill-accent" />}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.resonance_score?.toLocaleString() || 0} resonancia
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Cargando usuarios...</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="glass-effect p-6 border-primary/20">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-orbitron font-bold text-foreground">Actividad Reciente</h2>
              </div>

              <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((post) => (
                  <div key={post.id} className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 border-2 border-primary/30">
                        <AvatarImage src={post.profiles?.avatar_url} />
                        <AvatarFallback className="bg-primary/20">
                          {post.profiles?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{post.profiles?.username}</span>
                          {post.profiles?.verified && <Star className="w-4 h-4 text-accent fill-accent" />}
                          <Badge variant="outline" className="text-xs">{post.post_type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content || "Publicó contenido multimedia"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.resonance_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {post.shares_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay actividad reciente</p>
                    <Button className="mt-4 bg-gradient-quantum">
                      Crear Primera Publicación
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center glass-effect p-12 rounded-3xl border-2 border-primary/20"
        >
          <h2 className="text-3xl font-orbitron font-bold text-gradient-quantum mb-4">
            Únete a la Comunidad
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Conecta con miles de creadores, artistas y desarrolladores del metaverso quantum
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-gradient-quantum font-orbitron">
              <Users className="w-5 h-5 mr-2" />
              Explorar Grupos
            </Button>
            <Button variant="outline" className="border-primary/50 font-orbitron">
              <MessageCircle className="w-5 h-5 mr-2" />
              Ver Chats
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
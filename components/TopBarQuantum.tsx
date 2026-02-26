import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Zap, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'quantum';
}

export default function TopBarQuantum() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mockNotifications: Notification[] = [
    { id: '1', message: 'Nueva resonancia cuántica detectada', type: 'quantum' },
    { id: '2', message: 'Tu DreamSpace alcanzó 1000 visitas', type: 'success' },
    { id: '3', message: 'Isabella AI tiene un mensaje para ti', type: 'info' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-0 lg:left-[280px] h-16 glass-effect border-b border-primary/20 z-30 px-6"
    >
      <div className="h-full flex items-center justify-between">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-6">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-quantum flex items-center justify-center shadow-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-orbitron font-bold text-gradient-quantum">TAMV MD-X4™</h1>
              <p className="text-xs text-muted-foreground">Quantum Social Network</p>
            </div>
          </motion.div>

          {/* KPIs */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-resonance/10 border border-resonance/20">
              <Activity className="w-4 h-4 text-resonance" />
              <span className="text-sm font-medium">98% Uptime</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-energy/10 border border-energy/20">
              <TrendingUp className="w-4 h-4 text-energy" />
              <span className="text-sm font-medium">2.4k Users</span>
            </div>
          </div>
        </div>

        {/* Right: User & Notifications */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="relative hover:bg-primary/10"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {mockNotifications.length > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="bg-accent h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {mockNotifications.length}
                  </Badge>
                </motion.div>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 glass-effect border border-primary/20 rounded-xl shadow-quantum p-4 space-y-3"
                >
                  <h3 className="font-orbitron font-bold text-sm">Notificaciones Quantum</h3>
                  {mockNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      whileHover={{ x: 4 }}
                      className={`p-3 rounded-lg border ${
                        notif.type === 'quantum' ? 'bg-gradient-quantum/10 border-primary/20' :
                        notif.type === 'success' ? 'bg-resonance/10 border-resonance/20' :
                        'bg-muted/50 border-border'
                      }`}
                    >
                      <p className="text-sm">{notif.message}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-primary/10"
            onClick={() => navigate('/profile')}
          >
            <Avatar className="w-8 h-8 border-2 border-primary/30">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-quantum text-white">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-medium">
              {user?.user_metadata?.username || 'Usuario'}
            </span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

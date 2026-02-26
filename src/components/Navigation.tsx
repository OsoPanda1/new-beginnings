import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Coins, Shield, Globe,
  User, MessageSquare, Image, Radio, Orbit, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type NavView =
  | "dashboard" | "isabella" | "dreamspaces" | "credits"
  | "sentinel" | "wall" | "profile" | "chats" | "gallery" | "lives"
  | "marketplace" | "admin" | "knowledge";

interface NavigationProps {
  currentView: NavView | "hero";
  onNavigate: (view: NavView) => void;
}

export const Navigation = ({ currentView, onNavigate }: NavigationProps) => {
  const navigate = useNavigate();
  const navItems = [
    { id: "wall", icon: Globe, label: "Muro", gradient: "from-primary to-primary-glow", isRoute: true, path: "/" },
    { id: "profile", icon: User, label: "Perfil", gradient: "from-accent to-yellow-400", isRoute: true, path: "/profile" },
    { id: "chats", icon: MessageSquare, label: "Chats", gradient: "from-resonance to-pink-400", isRoute: true, path: "/chats" },
    { id: "gallery", icon: Image, label: "Galería", gradient: "from-secondary to-cyan-400", isRoute: true, path: "/gallery" },
    { id: "lives", icon: Radio, label: "Lives", gradient: "from-destructive to-red-400", isRoute: true, path: "/lives" },
    { id: "marketplace", icon: Coins, label: "Market", gradient: "from-accent to-yellow-400", isRoute: true, path: "/marketplace" },
    { id: "knowledge", icon: Layers, label: "Knowledge", gradient: "from-primary to-purple-400", isRoute: true, path: "/knowledge" },
    { id: "dreamspaces", icon: Orbit, label: "Metaverso", gradient: "from-secondary to-cyan-400" },
    { id: "credits", icon: Coins, label: "Créditos", gradient: "from-accent to-yellow-400" },
    { id: "sentinel", icon: Shield, label: "Anubis™", gradient: "from-resonance to-pink-400" },
  ];
  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isRoute) navigate(item.path || `/${item.id}`);
    else onNavigate(item.id as NavView);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-lg bg-gradient-quantum flex items-center justify-center shadow-glow"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Orbit className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-gradient-quantum">TAMV</h1>
              <p className="text-xs text-muted-foreground">MD-X4™ Ecosystem</p>
            </div>
          </motion.div>
          {/* Navigation Items */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || window.location.pathname === (item.path || `/${item.id}`);
              return (
                <Button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`
                    relative group overflow-hidden transition-all
                    ${isActive ?
                      "bg-gradient-to-r " + item.gradient + " text-white shadow-glow"
                      : "hover:bg-card-glass"}
                  `}
                >
                  <Icon className={`w-4 h-4 mr-1 ${isActive ? "animate-pulse" : ""}`} />
                  <span className="font-orbitron text-xs hidden lg:inline">{item.label}</span>
                  {!isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity`} />
                  )}
                </Button>
              );
            })}
          </div>
          {/* User Avatar */}
          <div
            className="w-10 h-10 rounded-full bg-gradient-dream border-2 border-primary/50 flex items-center justify-center shadow-glow animate-pulse-slow cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <span className="text-xs font-orbitron font-bold">ID</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

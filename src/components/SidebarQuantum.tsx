import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  Users,
  ShoppingBag,
  Radio,
  Sparkles,
  Music,
  FolderKanban,
  GraduationCap,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  icon: any;
  path: string;
  badge?: number;
  description?: string;
}

const navItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", description: "Centro de control" },
  { title: "Muro Global", icon: MessageSquare, path: "/", description: "Feed comunitario" },
  { title: "Grupos", icon: Users, path: "/groups", description: "Comunidad" },
  { title: "Chats", icon: MessageSquare, path: "/chats", badge: 3, description: "Mensajes" },
  { title: "DreamSpaces", icon: Sparkles, path: "/dreamspaces", description: "Espacios 3D/4D" },
  { title: "Lives", icon: Radio, path: "/lives", description: "Transmisiones en vivo" },
  { title: "Marketplace", icon: ShoppingBag, path: "/marketplace", description: "Tienda quantum" },
  { title: "Proyectos", icon: FolderKanban, path: "/projects", description: "Mis proyectos" },
  { title: "Universidad", icon: GraduationCap, path: "/university", description: "Conocimiento" },
  { title: "Audio Kaos", icon: Music, path: "/audio-kaos", description: "Experiencia sonora" },
  { title: "Wallet", icon: Wallet, path: "/wallet", description: "Economía" },
];

export default function SidebarQuantum() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <TooltipProvider>
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-screen glass-effect border-r border-primary/20 z-40 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-quantum flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-orbitron font-bold text-gradient-quantum">TAMV</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleSidebar}
            className="hover:bg-primary/10 ml-auto"
          >
            {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative flex items-center gap-3 p-3 rounded-xl transition-all
                        ${isActive 
                          ? 'bg-gradient-quantum text-white shadow-glow' 
                          : 'hover:bg-primary/10 text-foreground/80 hover:text-foreground'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      
                      <AnimatePresence mode="wait">
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between flex-1 overflow-hidden"
                          >
                            <span className="font-medium truncate">{item.title}</span>
                            {item.badge && (
                              <Badge className="bg-accent text-accent-foreground ml-2">
                                {item.badge}
                              </Badge>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </NavLink>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="glass-effect border-primary/20">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer notification indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-accent shadow-glow"
          />
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

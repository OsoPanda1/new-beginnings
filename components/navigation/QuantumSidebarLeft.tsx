import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Users, Radio, ShoppingBag, GraduationCap, 
  Wallet, Settings, HelpCircle, ChevronLeft, ChevronRight,
  Sparkles, Gamepad2, Music, Gift, TrendingUp, Award,
  BookOpen, Compass, Zap, Heart, Star, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
  color?: string;
  premium?: boolean;
}

const mainItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, path: "/", color: "from-blue-500 to-cyan-500" },
  { id: "dreamspaces", label: "DreamSpaces", icon: Sparkles, path: "/dreamspaces", color: "from-purple-500 to-pink-500", badge: 3 },
  { id: "lives", label: "Lives", icon: Radio, path: "/lives", color: "from-red-500 to-orange-500" },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag, path: "/marketplace", color: "from-green-500 to-emerald-500" },
  { id: "university", label: "University", icon: GraduationCap, path: "/university", color: "from-indigo-500 to-purple-500" },
  { id: "kaos", label: "Audio Kaos", icon: Music, path: "/audio-kaos", color: "from-pink-500 to-rose-500", premium: true },
];

const socialItems: NavItem[] = [
  { id: "chats", label: "Chats", icon: Users, path: "/chats", badge: 5, color: "from-cyan-500 to-blue-500" },
  { id: "gallery", label: "Gallery", icon: Compass, path: "/gallery", color: "from-yellow-500 to-orange-500" },
  { id: "projects", label: "Projects", icon: BookOpen, path: "/projects", color: "from-teal-500 to-cyan-500" },
];

const economyItems: NavItem[] = [
  { id: "wallet", label: "Wallet", icon: Wallet, path: "/wallet", color: "from-amber-500 to-yellow-500" },
  { id: "lottery", label: "Lottery", icon: Gift, path: "/lottery", badge: 1, color: "from-purple-500 to-pink-500" },
  { id: "referrals", label: "Referrals", icon: TrendingUp, path: "/referrals", color: "from-green-500 to-teal-500" },
  { id: "games", label: "Games", icon: Gamepad2, path: "/games", color: "from-red-500 to-pink-500" },
];

const systemItems: NavItem[] = [
  { id: "achievements", label: "Achievements", icon: Award, path: "/achievements", badge: 2, color: "from-yellow-500 to-amber-500" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings", color: "from-slate-500 to-gray-500" },
  { id: "help", label: "Help", icon: HelpCircle, path: "/help", color: "from-blue-500 to-indigo-500" },
];

export default function QuantumSidebarLeft() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("main");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant={isActive ? "default" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 group relative overflow-hidden",
            isActive && "bg-gradient-to-r shadow-lg",
            isActive && item.color,
            !isActive && "hover:bg-accent/50"
          )}
          onClick={() => navigate(item.path)}
        >
          {/* Glow effect */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r opacity-30 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: `linear-gradient(to right, ${item.color?.split(" ")[1]}, ${item.color?.split(" ")[3]})`,
              }}
            />
          )}

          <Icon className={cn(
            "h-5 w-5 relative z-10",
            isActive && "text-white",
            !isActive && "text-foreground/70 group-hover:text-foreground"
          )} />
          
          {!isCollapsed && (
            <>
              <span className={cn(
                "flex-1 text-left relative z-10 font-medium",
                isActive && "text-white"
              )}>
                {item.label}
              </span>
              
              {item.badge && item.badge > 0 && (
                <Badge variant={isActive ? "secondary" : "default"} className="relative z-10">
                  {item.badge}
                </Badge>
              )}
              
              {item.premium && (
                <Crown className="h-4 w-4 text-yellow-400 relative z-10" />
              )}
            </>
          )}

          {/* Hover particles */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-10, 10],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        </Button>
      </motion.div>
    );
  };

  const renderSection = (title: string, items: NavItem[], section: string) => {
    const isExpanded = expandedSection === section;

    return (
      <div className="space-y-2">
        {!isCollapsed && (
          <Button
            variant="ghost"
            className="w-full justify-between hover:bg-accent/50 group"
            onClick={() => toggleSection(section)}
          >
            <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">
              {title}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        )}

        <AnimatePresence>
          {(isExpanded || isCollapsed) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1 overflow-hidden"
            >
              {items.map(renderNavItem)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "fixed left-0 top-0 h-screen z-40",
        "bg-gradient-to-b from-background/95 via-background/98 to-background",
        "backdrop-blur-xl border-r border-border/50",
        "shadow-2xl"
      )}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 50%, rgba(236,72,153,0.1) 100%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative h-full flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-gradient-quantum">TAMV</h2>
                <p className="text-xs text-muted-foreground">MD-X4™</p>
              </div>
            </motion.div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-accent/50 relative group"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </motion.div>

            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 -z-10"
              transition={{ duration: 0.3 }}
            />
          </Button>
        </div>

        <Separator className="mb-4" />

        {/* Navigation Sections */}
        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-6">
            {renderSection("Main", mainItems, "main")}
            {renderSection("Social", socialItems, "social")}
            {renderSection("Economy", economyItems, "economy")}
            {renderSection("System", systemItems, "system")}
          </div>
        </ScrollArea>

        {/* Footer with stats */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-border/50 space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Credits</span>
              <span className="font-semibold text-gradient-quantum">1,234</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Resonance</span>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-pink-500 fill-pink-500" />
                <span className="font-semibold">89%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Level</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">42</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
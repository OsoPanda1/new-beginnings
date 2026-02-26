import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Users, Radio, ShoppingBag, GraduationCap, 
  Wallet, Settings, HelpCircle,
  Sparkles, Gamepad2, Music, Gift, TrendingUp,
  BookOpen, Zap, Heart, Star, Crown, Shield,
  MessageSquare, Image, FileText, ChevronDown, Menu, X,
  PawPrint, Atom
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  premium?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    id: "main",
    label: "Principal",
    icon: Zap,
    items: [
      { id: "home", label: "Home", icon: Home, path: "/" },
      { id: "dreamspaces", label: "DreamSpaces", icon: Sparkles, path: "/dreamspaces", badge: 3 },
      { id: "lives", label: "Lives", icon: Radio, path: "/lives" },
      { id: "marketplace", label: "Marketplace", icon: ShoppingBag, path: "/marketplace" },
      { id: "pets", label: "Mascotas", icon: PawPrint, path: "/pets" },
      { id: "quantum", label: "Quantum Boost", icon: Atom, path: "/quantum-demo" },
    ],
  },
  {
    id: "social",
    label: "Social",
    icon: Users,
    items: [
      { id: "global-wall", label: "Muro Global", icon: MessageSquare, path: "/global-wall" },
      { id: "chats", label: "Chats", icon: Users, path: "/chats", badge: 5 },
      { id: "gallery", label: "Gallery", icon: Image, path: "/gallery" },
      { id: "groups", label: "Groups", icon: Users, path: "/groups" },
    ],
  },
  {
    id: "content",
    label: "Contenido",
    icon: BookOpen,
    items: [
      { id: "projects", label: "Projects", icon: BookOpen, path: "/projects" },
      { id: "university", label: "University", icon: GraduationCap, path: "/university" },
      { id: "kaos", label: "Audio Kaos", icon: Music, path: "/audio-kaos", premium: true },
      { id: "manifest", label: "Manifiesto", icon: FileText, path: "/manifest" },
      { id: "bookpi", label: "BookPI™", icon: FileText, path: "/bookpi", premium: true },
    ],
  },
  {
    id: "economy",
    label: "Economía",
    icon: Wallet,
    items: [
      { id: "wallet", label: "Wallet", icon: Wallet, path: "/wallet" },
      { id: "nubiwallet", label: "Nubiwallet", icon: Wallet, path: "/nubiwallet", premium: true },
      { id: "lottery", label: "Lottery", icon: Gift, path: "/lottery", badge: 1 },
      { id: "lottery-vrf", label: "Lotería VRF", icon: Gift, path: "/lottery-vrf" },
      { id: "referrals", label: "Referrals", icon: TrendingUp, path: "/referrals" },
      { id: "games", label: "Games", icon: Gamepad2, path: "/games" },
    ],
  },
  {
    id: "system",
    label: "Sistema",
    icon: Settings,
    items: [
      { id: "profile", label: "Profile", icon: Users, path: "/profile" },
      { id: "security", label: "Security", icon: Shield, path: "/security" },
      { id: "msr", label: "MSR Blockchain", icon: Shield, path: "/msr-blockchain" },
      { id: "truth", label: "Dashboard Verdad", icon: Shield, path: "/truth-dashboard" },
      { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
      { id: "help", label: "Help", icon: HelpCircle, path: "/help" },
    ],
  },
];

interface CrystalSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function CrystalSidebar({ isOpen, onToggle }: CrystalSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["main"]);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isSectionExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  return (
    <TooltipProvider delayDuration={0}>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed left-0 top-0 h-screen z-50 w-[280px]",
              "bg-background/80 backdrop-blur-2xl",
              "border-r border-accent/20",
              "shadow-[0_0_50px_rgba(0,188,212,0.15)]"
            )}
          >
            {/* Crystal glow effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-40"
              animate={{
                background: [
                  "radial-gradient(ellipse at 0% 50%, hsla(180, 100%, 50%, 0.15) 0%, transparent 50%)",
                  "radial-gradient(ellipse at 0% 30%, hsla(270, 100%, 60%, 0.15) 0%, transparent 50%)",
                  "radial-gradient(ellipse at 0% 70%, hsla(180, 100%, 50%, 0.15) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Animated border glow */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-px"
              animate={{
                background: [
                  "linear-gradient(180deg, transparent, hsla(180, 100%, 50%, 0.5), transparent)",
                  "linear-gradient(180deg, hsla(180, 100%, 50%, 0.5), transparent, hsla(270, 100%, 60%, 0.5))",
                  "linear-gradient(180deg, transparent, hsla(180, 100%, 50%, 0.5), transparent)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="h-[72px] flex items-center justify-between px-4 border-b border-border/30">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(0,188,212,0.5)",
                        "0 0 40px rgba(156,39,176,0.5)",
                        "0 0 20px rgba(0,188,212,0.5)",
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Zap className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="font-orbitron font-bold text-gradient-quantum text-lg">TAMV</h2>
                    <p className="text-[10px] text-muted-foreground">MD-X4™ Online</p>
                  </div>
                </motion.div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="hover:bg-accent/20 relative group shrink-0"
                >
                  <X className="h-5 w-5" />
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-accent/20 blur-lg opacity-0 group-hover:opacity-100 -z-10"
                  />
                </Button>
              </div>

              {/* Navigation Sections */}
              <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-2">
                  {sections.map((section) => {
                    const SectionIcon = section.icon;
                    const isExpanded = isSectionExpanded(section.id);
                    const hasActiveItem = section.items.some(item => isActive(item.path));

                    return (
                      <div key={section.id} className="space-y-1">
                        {/* Section Header */}
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-between px-3 py-2 h-auto group",
                            "hover:bg-accent/10 transition-all",
                            hasActiveItem && "bg-accent/5"
                          )}
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center gap-3">
                            <SectionIcon className={cn(
                              "w-4 h-4 transition-colors",
                              hasActiveItem ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                              {section.label}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </Button>

                        {/* Section Items */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-2 space-y-1">
                                {section.items.map((item) => {
                                  const Icon = item.icon;
                                  const active = isActive(item.path);

                                  return (
                                    <motion.button
                                      key={item.id}
                                      whileHover={{ x: 4 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => navigate(item.path)}
                                      className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all relative group",
                                        active 
                                          ? "bg-accent/15 text-accent" 
                                          : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                                      )}
                                    >
                                      {active && (
                                        <motion.div
                                          layoutId="activeIndicator"
                                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full shadow-[0_0_10px_rgba(0,188,212,0.8)]"
                                        />
                                      )}
                                      <Icon className={cn(
                                        "w-4 h-4 shrink-0",
                                        active && "text-accent"
                                      )} />
                                      <span className="flex-1 text-left text-sm font-medium truncate">
                                        {item.label}
                                      </span>
                                      {item.badge && (
                                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px] animate-pulse">
                                          {item.badge}
                                        </Badge>
                                      )}
                                      {item.premium && (
                                        <Crown className="w-3.5 h-3.5 text-yellow-400" />
                                      )}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Footer Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-border/30 space-y-3 bg-gradient-to-t from-accent/5 to-transparent"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-semibold text-gradient-quantum flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    1,234
                  </span>
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
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating toggle button when sidebar is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className={cn(
              "fixed left-4 top-20 z-50",
              "w-12 h-12 rounded-xl",
              "bg-background/80 backdrop-blur-xl",
              "border border-accent/30",
              "flex items-center justify-center",
              "shadow-[0_0_30px_rgba(0,188,212,0.2)]",
              "hover:shadow-[0_0_40px_rgba(0,188,212,0.4)]",
              "transition-all duration-300"
            )}
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 10px rgba(0,188,212,0.3)",
                  "0 0 20px rgba(0,188,212,0.5)",
                  "0 0 10px rgba(0,188,212,0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-xl"
            />
            <Menu className="w-5 h-5 text-accent" />
          </motion.button>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}

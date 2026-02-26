import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Brain, Globe, User, MessageSquare, Image, Radio, ShoppingCart,
  Orbit, Shield, GraduationCap, Users,
  LayoutDashboard, Layers, Sparkles, Activity, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Notifications from "./Notifications";

interface QuantumSidebarProps {
  children: React.ReactNode;
}

interface SidebarItem {
  id: string;
  icon: typeof Brain;
  label: string;
  path?: string;
  gradient: string;
  badge?: number;
  isNew?: boolean;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    label: "Principal",
    items: [
      { id: "wall", icon: Globe, label: "Muro Global", path: "/", gradient: "from-primary to-primary-glow" },
      { id: "profile", icon: User, label: "Perfil", path: "/profile", gradient: "from-accent to-yellow-400" },
      { id: "chats", icon: MessageSquare, label: "Chats", path: "/chats", gradient: "from-resonance to-pink-400", badge: 3 },
    ]
  },
  {
    label: "Contenido",
    items: [
      { id: "gallery", icon: Image, label: "Galería", path: "/gallery", gradient: "from-secondary to-cyan-400" },
      { id: "lives", icon: Radio, label: "Transmisiones", path: "/lives", gradient: "from-destructive to-red-400" },
      { id: "groups", icon: Users, label: "Grupos", path: "/groups", gradient: "from-purple-400 to-pink-400" },
    ]
  },
  {
    label: "Plataforma",
    items: [
      { id: "marketplace", icon: ShoppingCart, label: "Marketplace", path: "/marketplace", gradient: "from-accent to-yellow-400" },
      { id: "university", icon: GraduationCap, label: "Universidad", path: "/university", gradient: "from-blue-400 to-purple-400" },
      { id: "knowledge", icon: Layers, label: "Knowledge System", path: "/knowledge", gradient: "from-primary to-purple-400" },
    ]
  },
  {
    label: "Sistema",
    items: [
      { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", gradient: "from-primary to-purple-400" },
      { id: "dreamspaces", icon: Orbit, label: "DreamSpaces", gradient: "from-secondary to-cyan-400", isNew: true },
      { id: "isabella", icon: Brain, label: "ISABELLA AI™", gradient: "from-primary to-purple-400", isNew: true },
      { id: "sentinel", icon: Shield, label: "Anubis Sentinel", gradient: "from-resonance to-pink-400" },
    ]
  }
];

function SidebarInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={`border-r border-border/50 backdrop-blur-xl bg-background/95 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header con logo y trigger */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-quantum flex items-center justify-center shadow-glow">
              <Orbit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-orbitron font-bold text-gradient-quantum">TAMV</h2>
              <p className="text-xs text-muted-foreground">MD-X4™</p>
            </div>
          </div>
        )}
        <SidebarTrigger className={collapsed ? "mx-auto" : ""} />
      </div>

      <SidebarContent className="px-2">
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-orbitron text-muted-foreground px-3 py-2">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.path ? isActive(item.path) : false;
                  
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => item.path && navigate(item.path)}
                        className={`
                          relative group transition-all
                          ${active 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-glow` 
                            : 'hover:bg-card-glass'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
                        {!collapsed && (
                          <>
                            <span className="font-orbitron text-xs">{item.label}</span>
                            {item.badge && (
                              <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 bg-destructive text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            {item.isNew && (
                              <Badge className="ml-auto bg-accent-glow text-xs">NEW</Badge>
                            )}
                          </>
                        )}
                        {!active && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity rounded-md`} />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer con sistema de estado */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <Activity className="w-4 h-4 text-accent-glow animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-glow rounded-full animate-ping" />
          </div>
          {!collapsed && (
            <div className="text-xs">
              <p className="font-orbitron font-bold text-accent-glow">Sistema Activo</p>
              <p className="text-muted-foreground">99.87% Uptime</p>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

export function QuantumSidebar({ children }: QuantumSidebarProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <SidebarInner />
        <main className="flex-1 overflow-auto">
          {/* Header global con notificaciones */}
          <div className="sticky top-0 z-40 w-full border-b border-border/50 backdrop-blur-xl bg-background/80">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-glow animate-pulse" />
                  <span className="font-orbitron font-bold text-sm">Quantum Ecosystem</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Indicador de conexión quantum */}
                <div className="flex items-center gap-2 px-3 py-1 glass-effect rounded-full">
                  <Zap className="w-3 h-3 text-accent-glow animate-pulse" />
                  <span className="text-xs font-orbitron text-accent-glow">Quantum</span>
                </div>
                
                <Notifications />
                
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-dream border-2 border-primary/50 flex items-center justify-center shadow-glow animate-pulse-slow cursor-pointer">
                  <span className="text-xs font-orbitron font-bold">ID</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

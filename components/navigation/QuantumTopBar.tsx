import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bell, Search, User, Settings, LogOut, Moon, Sun,
  Zap, Crown, TrendingUp, Heart, Star, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KPI {
  label: string;
  value: string;
  icon: any;
  color: string;
  trend?: number;
}

export default function QuantumTopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount] = useState(7);
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const kpis: KPI[] = [
    { label: "Credits", value: "1,234", icon: Zap, color: "text-yellow-500", trend: 12 },
    { label: "Resonance", value: "89%", icon: Heart, color: "text-pink-500", trend: 5 },
    { label: "Level", value: "42", icon: Star, color: "text-purple-500" },
    { label: "Rank", value: "#156", icon: TrendingUp, color: "text-green-500", trend: -3 },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 left-0 right-0 h-20 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 50%, rgba(236,72,153,0.1) 100%)",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative h-full px-6 flex items-center justify-between gap-6 max-w-screen-2xl mx-auto">
        {/* Left: Branding + KPIs */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <Zap className="w-6 h-6 text-white relative z-10" />
            </div>
            <div className="hidden lg:block">
              <h1 className="font-orbitron font-bold text-xl text-gradient-quantum">TAMV</h1>
              <p className="text-xs text-muted-foreground">MD-X4™ Online</p>
            </div>
          </motion.div>

          {/* KPIs */}
          <div className="hidden xl:flex items-center gap-4">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{kpi.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">{kpi.value}</span>
                      {kpi.trend && (
                        <span className={`text-xs ${kpi.trend > 0 ? "text-green-500" : "text-red-500"}`}>
                          {kpi.trend > 0 ? "+" : ""}{kpi.trend}%
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search DreamSpaces, Users, Marketplace..."
              className="pl-10 pr-4 h-12 bg-accent/30 border-border/50 focus:border-primary/50 focus:bg-accent/50 transition-all rounded-xl"
            />
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative hover:bg-accent/50"
          >
            <motion.div
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.div>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-accent/50">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {notificationCount}
                    </Badge>
                  </motion.div>
                )}
                
                {/* Pulse animation */}
                {notificationCount > 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-red-500/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New resonance on your post</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative hover:bg-accent/50 gap-2 pl-2 pr-3">
                <Avatar className="h-8 w-8 border-2 border-primary/50">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                    {user?.email?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">Anubis Villaseñor</span>
                  <div className="flex items-center gap-1">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">Celestial</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>My Account</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email || "guest@tamv.online"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/achievements")} className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Achievements</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
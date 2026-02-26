import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Search, User, Settings, LogOut, Moon, Sun,
  Zap, Crown, Heart, Star, Shield, X
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
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "resonance" | "message" | "achievement" | "system";
  title: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", type: "resonance", title: "New resonance on your post", time: "2 min ago", read: false },
  { id: "2", type: "message", title: "Isabella AI sent you a message", time: "5 min ago", read: false },
  { id: "3", type: "achievement", title: "Achievement unlocked: Pioneer", time: "1 hour ago", read: true },
  { id: "4", type: "system", title: "System update completed", time: "2 hours ago", read: true },
];

export default function CrystalTopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const unreadCount = mockNotifications.filter(n => !n.read).length;

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

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "resonance": return Heart;
      case "message": return User;
      case "achievement": return Star;
      case "system": return Shield;
      default: return Bell;
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className={cn(
        "fixed top-0 left-0 right-0 h-[72px] z-50",
        "crystal-glass",
        "transition-all duration-300"
      )}
    >
      {/* Crystal glow animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(90deg, hsla(180, 100%, 50%, 0.05) 0%, transparent 30%, transparent 70%, hsla(270, 100%, 60%, 0.05) 100%)",
            "linear-gradient(90deg, hsla(270, 100%, 60%, 0.05) 0%, transparent 30%, transparent 70%, hsla(180, 100%, 50%, 0.05) 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Logo + KPIs */}
        <div className="flex items-center gap-4 md:gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center shadow-glow animate-crystal-pulse">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-orbitron font-bold text-lg text-gradient-quantum">TAMV</h1>
              <p className="text-[10px] text-muted-foreground">MD-X4™ Online</p>
            </div>
          </motion.div>

          {/* KPIs - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3">
            {[
              { icon: Zap, value: "1,234", label: "Credits", color: "text-yellow-400" },
              { icon: Heart, value: "89%", label: "Resonance", color: "text-pink-500" },
              { icon: Star, value: "42", label: "Level", color: "text-purple-400" },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer group"
              >
                <kpi.icon className={cn("w-4 h-4", kpi.color)} />
                <span className="text-sm font-semibold">{kpi.value}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <motion.div 
            className="relative"
            animate={{ 
              boxShadow: searchFocused 
                ? "0 0 20px hsla(180, 100%, 50%, 0.2)" 
                : "none" 
            }}
          >
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
              searchFocused ? "text-accent" : "text-muted-foreground"
            )} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search DreamSpaces, Users, Marketplace..."
              className={cn(
                "pl-10 pr-10 h-10 rounded-xl",
                "bg-accent/5 border-border/50",
                "focus:border-accent/50 focus:bg-accent/10",
                "placeholder:text-muted-foreground/60",
                "transition-all"
              )}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-accent/20 transition-colors"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-accent/10 relative group"
          >
            <motion.div animate={{ rotate: theme === "dark" ? 0 : 180 }}>
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-lg bg-accent/20 blur-lg opacity-0 group-hover:opacity-100 -z-10"
            />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-accent/10">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {unreadCount}
                    </Badge>
                  </motion.div>
                )}
                {unreadCount > 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 hsla(0, 84%, 60%, 0.4)",
                        "0 0 0 8px hsla(0, 84%, 60%, 0)",
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 crystal-glass">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary">{unreadCount} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {mockNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "p-3 cursor-pointer",
                        !notification.read && "bg-accent/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          notification.type === "resonance" && "bg-pink-500/20 text-pink-500",
                          notification.type === "message" && "bg-blue-500/20 text-blue-500",
                          notification.type === "achievement" && "bg-yellow-500/20 text-yellow-500",
                          notification.type === "system" && "bg-green-500/20 text-green-500"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative hover:bg-accent/10 gap-2 px-2">
                <Avatar className="h-8 w-8 border border-accent/30">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white font-semibold text-sm">
                    {user?.email?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">Anubis Villaseñor</span>
                  <div className="flex items-center gap-1">
                    <Crown className="h-3 w-3 text-yellow-400" />
                    <span className="text-[10px] text-muted-foreground">Celestial</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 crystal-glass">
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
              <DropdownMenuItem onClick={() => navigate("/security")} className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Security</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
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

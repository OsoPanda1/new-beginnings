import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Activity, Shield, ChevronLeft,
  Heart, Brain, Eye, Headphones, Mic, Radio,
  CheckCircle, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SensorControl {
  id: string;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
  intensity: number;
}

type TabType = "sensors" | "activity" | "security";

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "sensors", label: "Sensors", icon: Sparkles },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "security", label: "Security", icon: Shield },
];

export default function CrystalRightPanel() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("sensors");
  
  const [sensors, setSensors] = useState<SensorControl[]>([
    { id: "visual", label: "Visual FX", icon: Eye, enabled: true, intensity: 75 },
    { id: "audio", label: "Spatial Audio", icon: Headphones, enabled: true, intensity: 60 },
    { id: "haptic", label: "Haptic", icon: Radio, enabled: false, intensity: 40 },
    { id: "voice", label: "Voice Input", icon: Mic, enabled: true, intensity: 80 },
    { id: "emotion", label: "Emotion AI", icon: Heart, enabled: true, intensity: 90 },
    { id: "ambient", label: "Ambient", icon: Brain, enabled: true, intensity: 50 },
  ]);

  const activityData = [
    { time: "10:45 AM", action: "Created DreamSpace", user: "You", type: "create" },
    { time: "10:32 AM", action: "New Resonance +12", user: "Community", type: "social" },
    { time: "10:15 AM", action: "Live Stream Started", user: "@creator_pro", type: "live" },
    { time: "09:58 AM", action: "TAMV Credits +50", user: "System", type: "reward" },
    { time: "09:30 AM", action: "Achievement Unlocked", user: "You", type: "achievement" },
  ];

  const securityStatus = {
    sentinel: { active: true, threats: 0, lastScan: "2 min ago" },
    encryption: { level: "Quantum", strength: 98 },
    privacy: { score: 95, audited: true },
  };

  const toggleSensor = (id: string) => {
    setSensors(sensors.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const updateIntensity = (id: string, value: number) => {
    setSensors(sensors.map(s => 
      s.id === id ? { ...s, intensity: value } : s
    ));
  };

  const effectiveCollapsed = isCollapsed && !isHovered;

  return (
    <TooltipProvider delayDuration={0}>
      {/* Hover trigger zone */}
      {isCollapsed && (
        <div 
          className="sidebar-hover-trigger right-0 top-0"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      {/* Toggle Button - Always visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed right-0 top-24 z-50"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "crystal-glass hover:bg-accent/20 transition-all",
            effectiveCollapsed ? "rounded-l-xl rounded-r-none" : "rounded-xl"
          )}
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
            <ChevronLeft className="h-5 w-5" />
          </motion.div>
        </Button>
      </motion.div>

      <motion.aside
        initial={{ x: 300 }}
        animate={{ 
          x: effectiveCollapsed ? 280 : 0,
          width: 320
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed right-0 top-0 h-screen z-40",
          "crystal-glass",
          "transition-all duration-300"
        )}
      >
        {/* Crystal glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-50"
          animate={{
            background: [
              "radial-gradient(ellipse at 100% 50%, hsla(270, 100%, 60%, 0.1) 0%, transparent 50%)",
              "radial-gradient(ellipse at 100% 30%, hsla(180, 100%, 50%, 0.1) 0%, transparent 50%)",
              "radial-gradient(ellipse at 100% 70%, hsla(270, 100%, 60%, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative h-full flex flex-col pt-[72px]">
          {/* Tabs */}
          <div className="flex items-center justify-around p-3 border-b border-border/30">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "relative px-3 py-2 transition-all",
                        activeTab === tab.id 
                          ? "text-accent" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeRightTab"
                          className="absolute inset-0 bg-accent/10 rounded-lg -z-10"
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="crystal-glass">
                    {tab.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "sensors" && (
                <motion.div
                  key="sensors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4 space-y-4"
                >
                  {/* Sensory Matrix Header */}
                  <div className="text-center space-y-2">
                    <motion.div
                      className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center animate-crystal-pulse"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="font-orbitron font-bold text-gradient-quantum">Sensory Matrix</h3>
                    <p className="text-xs text-muted-foreground">Real-time multisensory control</p>
                  </div>

                  {/* Sensor Controls */}
                  <div className="space-y-3">
                    {sensors.map((sensor) => {
                      const Icon = sensor.icon;
                      return (
                        <Card 
                          key={sensor.id}
                          className={cn(
                            "p-3 transition-all crystal-border",
                            sensor.enabled ? "bg-accent/5" : "bg-muted/20 opacity-60"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                sensor.enabled ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{sensor.label}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {sensor.enabled ? `${sensor.intensity}%` : "Off"}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={sensor.enabled}
                              onCheckedChange={() => toggleSensor(sensor.id)}
                            />
                          </div>
                          {sensor.enabled && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="pt-2"
                            >
                              <Slider
                                value={[sensor.intensity]}
                                onValueChange={([v]) => updateIntensity(sensor.id, v)}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </motion.div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4 space-y-4"
                >
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-orbitron font-bold">Live Activity</h3>
                    <p className="text-xs text-muted-foreground">Real-time ecosystem events</p>
                  </div>

                  <div className="space-y-2">
                    {activityData.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-3 hover:bg-accent/5 transition-colors cursor-pointer crystal-border">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full mt-2 shrink-0",
                              activity.type === "create" && "bg-purple-500",
                              activity.type === "social" && "bg-pink-500",
                              activity.type === "live" && "bg-red-500",
                              activity.type === "reward" && "bg-yellow-500",
                              activity.type === "achievement" && "bg-green-500"
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{activity.action}</p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>{activity.user}</span>
                                <span>•</span>
                                <span>{activity.time}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4 space-y-4"
                >
                  <div className="text-center space-y-2">
                    <motion.div
                      className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 flex items-center justify-center animate-crystal-pulse"
                    >
                      <Shield className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="font-orbitron font-bold text-gradient-quantum">Anubis Sentinel</h3>
                    <p className="text-xs text-muted-foreground">11-layer quantum security</p>
                  </div>

                  {/* Status Cards */}
                  <Card className="p-3 crystal-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold">System Status</h4>
                      <Badge variant={securityStatus.sentinel.active ? "default" : "destructive"} className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Threats</span>
                        <span className="text-green-400 font-medium">{securityStatus.sentinel.threats}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Scan</span>
                        <span className="font-medium">{securityStatus.sentinel.lastScan}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 crystal-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-accent" />
                      <h4 className="text-sm font-semibold">Encryption</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Level</span>
                        <Badge variant="secondary">{securityStatus.encryption.level}</Badge>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Strength</span>
                          <span className="font-medium">{securityStatus.encryption.strength}%</span>
                        </div>
                        <Progress value={securityStatus.encryption.strength} className="h-1.5" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 crystal-border">
                    <h4 className="text-sm font-semibold mb-2">Privacy Score</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gradient-quantum">
                        {securityStatus.privacy.score}
                      </span>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">out of 100</p>
                        {securityStatus.privacy.audited && (
                          <Badge variant="secondary" className="mt-1 text-[10px]">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            Audited
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={securityStatus.privacy.score} className="h-1.5 mt-2" />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

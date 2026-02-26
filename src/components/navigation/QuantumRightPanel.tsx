import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Activity, Shield, Zap, ChevronRight,
  Heart, Brain, Eye, Headphones, Mic, Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SensorControl {
  id: string;
  label: string;
  icon: any;
  enabled: boolean;
  intensity: number;
  color: string;
}

export default function QuantumRightPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"sensors" | "activity" | "security">("sensors");
  
  const [sensors, setSensors] = useState<SensorControl[]>([
    { id: "visual", label: "Visual FX", icon: Eye, enabled: true, intensity: 75, color: "from-blue-500 to-cyan-500" },
    { id: "audio", label: "Spatial Audio", icon: Headphones, enabled: true, intensity: 60, color: "from-purple-500 to-pink-500" },
    { id: "haptic", label: "Haptic", icon: Radio, enabled: false, intensity: 40, color: "from-green-500 to-emerald-500" },
    { id: "voice", label: "Voice Input", icon: Mic, enabled: true, intensity: 80, color: "from-orange-500 to-red-500" },
    { id: "emotion", label: "Emotion AI", icon: Heart, enabled: true, intensity: 90, color: "from-pink-500 to-rose-500" },
    { id: "ambient", label: "Ambient", icon: Brain, enabled: true, intensity: 50, color: "from-indigo-500 to-purple-500" },
  ]);

  const [activityData] = useState([
    { time: "10:45 AM", action: "Created DreamSpace", user: "You", color: "from-purple-500 to-pink-500" },
    { time: "10:32 AM", action: "New Resonance +12", user: "Community", color: "from-blue-500 to-cyan-500" },
    { time: "10:15 AM", action: "Live Stream Started", user: "@creator_pro", color: "from-red-500 to-orange-500" },
    { time: "09:58 AM", action: "TAMV Credits +50", user: "System", color: "from-yellow-500 to-amber-500" },
    { time: "09:30 AM", action: "Achievement Unlocked", user: "You", color: "from-green-500 to-emerald-500" },
  ]);

  const [securityStatus] = useState({
    sentinel: { active: true, threats: 0, lastScan: "2 min ago" },
    encryption: { level: "Quantum", strength: 98 },
    privacy: { score: 95, audited: true },
  });

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

  const renderSensorsTab = () => (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="text-center space-y-2">
          <motion.div
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(99,102,241,0.3)",
                "0 0 40px rgba(168,85,247,0.5)",
                "0 0 20px rgba(99,102,241,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="font-orbitron font-bold text-gradient-quantum">Sensory Matrix</h3>
          <p className="text-xs text-muted-foreground">Real-time multisensory control</p>
        </div>

        <Separator />

        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <Card className={cn(
                "p-4 transition-all",
                sensor.enabled ? "bg-accent/30 border-primary/30" : "bg-accent/10 opacity-60"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                      sensor.color
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{sensor.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {sensor.enabled ? "Active" : "Inactive"}
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
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Intensity</span>
                      <span className="font-semibold">{sensor.intensity}%</span>
                    </div>
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
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );

  const renderActivityTab = () => (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-orbitron font-bold">Live Activity</h3>
          <p className="text-xs text-muted-foreground">Real-time ecosystem events</p>
        </div>

        <Separator />

        <div className="space-y-3">
          {activityData.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br flex items-center justify-center",
                    activity.color
                  )}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
      </div>
    </ScrollArea>
  );

  const renderSecurityTab = () => (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="text-center space-y-2">
          <motion.div
            className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(239,68,68,0.3)",
                "0 0 40px rgba(249,115,22,0.5)",
                "0 0 20px rgba(239,68,68,0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="font-orbitron font-bold text-gradient-quantum">Anubis Sentinel</h3>
          <p className="text-xs text-muted-foreground">11-layer quantum security</p>
        </div>

        <Separator />

        {/* Sentinel Status */}
        <Card className="p-4 bg-accent/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">System Status</h4>
            <Badge variant={securityStatus.sentinel.active ? "default" : "destructive"}>
              {securityStatus.sentinel.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Threats Detected</span>
              <span className="font-semibold text-green-500">{securityStatus.sentinel.threats}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Scan</span>
              <span className="font-semibold">{securityStatus.sentinel.lastScan}</span>
            </div>
          </div>
        </Card>

        {/* Encryption */}
        <Card className="p-4 bg-accent/30">
          <h4 className="font-semibold mb-3">Encryption</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Level</span>
                <Badge variant="secondary">{securityStatus.encryption.level}</Badge>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Strength</span>
                <span className="font-semibold">{securityStatus.encryption.strength}%</span>
              </div>
              <Progress value={securityStatus.encryption.strength} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Privacy Score */}
        <Card className="p-4 bg-accent/30">
          <h4 className="font-semibold mb-3">Privacy Score</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-gradient-quantum">
              {securityStatus.privacy.score}
            </span>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">out of 100</p>
              {securityStatus.privacy.audited && (
                <Badge variant="secondary" className="mt-1">
                  Audited ✓
                </Badge>
              )}
            </div>
          </div>
          <Progress value={securityStatus.privacy.score} className="h-2" />
        </Card>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Run Security Scan
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Zap className="mr-2 h-4 w-4" />
            Update Protocols
          </Button>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <motion.aside
      initial={{ x: 300 }}
      animate={{ x: 0, width: isCollapsed ? 0 : 320 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "fixed right-0 top-0 h-screen z-40",
        "bg-gradient-to-b from-background/95 via-background/98 to-background",
        "backdrop-blur-xl border-l border-border/50",
        "shadow-2xl overflow-hidden"
      )}
    >
      {/* Collapse/Expand Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-12 top-24 hover:bg-accent/50 bg-background border border-border/50 z-50"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            {/* Tabs */}
            <div className="flex items-center justify-around p-4 border-b border-border/50">
              {[
                { id: "sensors", icon: Sparkles, label: "Sensors" },
                { id: "activity", icon: Activity, label: "Activity" },
                { id: "security", icon: Shield, label: "Security" },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id as any)}
                    className="relative"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary/20 rounded-lg -z-10"
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                      />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === "sensors" && (
                  <motion.div
                    key="sensors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    {renderSensorsTab()}
                  </motion.div>
                )}
                {activeTab === "activity" && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    {renderActivityTab()}
                  </motion.div>
                )}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    {renderSecurityTab()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
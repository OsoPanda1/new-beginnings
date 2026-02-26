/**
 * 🛡️ Security Dashboard - TAMV Security Command Center
 * Anubis, ORUS, MSR Blockchain, and Aztek Gods Integration
 */

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Eye, Link, Crown, Activity, 
  Lock, AlertTriangle, CheckCircle2
} from "lucide-react";
import ImmersiveBackground from "@/components/ImmersiveBackground";
import { AnubisSentinelSystem } from "@/components/security/AnubisSentinelSystem";
import { ORUSMonitor } from "@/components/security/ORUSMonitor";
import { MSRLedger } from "@/components/blockchain/MSRLedger";

const aztekGods = [
  { name: "Quetzalcóatl", domain: "Conocimiento", status: "active", level: 11 },
  { name: "Tláloc", domain: "Recursos", status: "active", level: 10 },
  { name: "Huitzilopochtli", domain: "Defensa", status: "active", level: 11 },
  { name: "Tezcatlipoca", domain: "Vigilancia", status: "active", level: 10 },
  { name: "Xipe Tótec", domain: "Renovación", status: "standby", level: 9 },
  { name: "Chalchiuhtlicue", domain: "Flujo", status: "active", level: 10 },
];

export default function SecurityDashboard() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <ImmersiveBackground />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-16 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-20 h-20 rounded-full bg-gradient-quantum flex items-center justify-center mx-auto mb-6 shadow-glow"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-orbitron font-bold text-gradient-quantum mb-4"
          >
            Centro de Seguridad TAMV
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Monitoreo en tiempo real de Anubis Sentinel, ORUS, MSR Blockchain y los Aztek Gods
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Badge className="bg-resonance/20 text-resonance px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" /> All Systems Operational
            </Badge>
            <Badge className="bg-accent/20 text-accent px-4 py-2">
              <Activity className="w-4 h-4 mr-2" /> Real-time Monitoring
            </Badge>
            <Badge className="bg-secondary/20 text-secondary px-4 py-2">
              <Lock className="w-4 h-4 mr-2" /> Zero-Trust Active
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 pb-20">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-card/50 backdrop-blur">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="anubis" className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Anubis
            </TabsTrigger>
            <TabsTrigger value="orus" className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> ORUS
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="flex items-center gap-2">
              <Link className="w-4 h-4" /> MSR Chain
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Threat Level", value: "Low", icon: AlertTriangle, color: "text-resonance" },
                { label: "Active Sessions", value: "1,247", icon: Activity, color: "text-accent" },
                { label: "Blocked Attacks", value: "23", icon: Shield, color: "text-energy" },
                { label: "Chain Blocks", value: "15.8K", icon: Link, color: "text-secondary" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-effect border-primary/20 p-4">
                    <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Aztek Gods Grid */}
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-4 flex items-center gap-2">
                <Crown className="w-6 h-6" /> Aztek Gods Orchestration
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {aztekGods.map((god, index) => (
                  <motion.div
                    key={god.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="glass-effect border-accent/30 p-4 hover:shadow-glow transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-foreground">{god.name}</h3>
                        <Badge className={god.status === 'active' ? 'bg-resonance/20 text-resonance' : 'bg-muted text-muted-foreground'}>
                          {god.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{god.domain}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(god.level / 11) * 100}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-quantum"
                          />
                        </div>
                        <span className="text-xs font-bold text-accent">Lv.{god.level}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Systems Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <AnubisSentinelSystem />
              <ORUSMonitor />
            </div>
          </TabsContent>

          <TabsContent value="anubis">
            <div className="max-w-2xl mx-auto">
              <AnubisSentinelSystem />
            </div>
          </TabsContent>

          <TabsContent value="orus">
            <div className="max-w-2xl mx-auto">
              <ORUSMonitor />
            </div>
          </TabsContent>

          <TabsContent value="blockchain">
            <div className="max-w-2xl mx-auto">
              <MSRLedger />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

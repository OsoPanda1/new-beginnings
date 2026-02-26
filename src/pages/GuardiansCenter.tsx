/**
 * 🛡️ Guardians Center - TAMV MD-X4™
 * Complete security monitoring dashboard with Anubis, Horus, Dekateotl & ORUS
 */

import { motion } from "framer-motion";
import { Shield, Eye, Crown, Brain, Zap, Activity } from "lucide-react";
import ImmersiveBackground from "@/components/ImmersiveBackground";
import { GuardiansPanel } from "@/components/guardians/GuardiansPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnubisSentinelSystem } from "@/components/security/AnubisSentinelSystem";
import { ORUSMonitor } from "@/components/security/ORUSMonitor";
import { MSRLedger } from "@/components/blockchain/MSRLedger";
import { Badge } from "@/components/ui/badge";

const aztekGods = [
  { name: "Quetzalcóatl", domain: "Conocimiento y Sabiduría", icon: "🐍", level: 11, power: "Serpiente Emplumada" },
  { name: "Tláloc", domain: "Recursos y Abundancia", icon: "🌧️", level: 10, power: "Lluvia Divina" },
  { name: "Huitzilopochtli", domain: "Defensa y Guerra", icon: "🦅", level: 11, power: "Sol Guerrero" },
  { name: "Tezcatlipoca", domain: "Vigilancia Oscura", icon: "🪞", level: 10, power: "Espejo Humeante" },
  { name: "Xipe Tótec", domain: "Renovación Cíclica", icon: "🌱", level: 9, power: "Renacimiento" },
  { name: "Chalchiuhtlicue", domain: "Flujo de Datos", icon: "💎", level: 10, power: "Jade Sagrado" },
  { name: "Mictlantecuhtli", domain: "Archivo Eterno", icon: "💀", level: 11, power: "Guardián del Mictlán" },
  { name: "Coatlicue", domain: "Génesis de Cells", icon: "🌍", level: 10, power: "Madre Tierra" },
  { name: "Xiuhtecuhtli", domain: "Energía del Sistema", icon: "🔥", level: 11, power: "Fuego Turquesa" },
  { name: "Tonatiuh", domain: "Tiempo Universal", icon: "☀️", level: 10, power: "Sol del Movimiento" },
  { name: "Ehecatl", domain: "Red de Comunicación", icon: "🌀", level: 9, power: "Viento Cósmico" },
];

export default function GuardiansCenter() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <ImmersiveBackground />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-12 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-glow"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-orbitron font-bold text-gradient-quantum mb-4"
          >
            Centro de Guardianes
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Anubis Sentinel • Horus Vision • Dekateotl • ORUS AI • Aztek Gods
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <Badge className="bg-emerald-500/20 text-emerald-500 px-4 py-2 border border-emerald-500/30">
              <Activity className="w-4 h-4 mr-2" /> Sistema Operativo
            </Badge>
            <Badge className="bg-primary/20 text-primary px-4 py-2 border border-primary/30">
              <Zap className="w-4 h-4 mr-2" /> Cifrado Post-Cuántico
            </Badge>
            <Badge className="bg-accent/20 text-accent px-4 py-2 border border-accent/30">
              <Shield className="w-4 h-4 mr-2" /> 11 Capas de Seguridad
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 pb-20">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 bg-card/50 backdrop-blur">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> General
            </TabsTrigger>
            <TabsTrigger value="anubis" className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Anubis
            </TabsTrigger>
            <TabsTrigger value="horus" className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> ORUS
            </TabsTrigger>
            <TabsTrigger value="dekateotl" className="flex items-center gap-2">
              <Crown className="w-4 h-4" /> Dekateotl
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="flex items-center gap-2">
              <Brain className="w-4 h-4" /> MSR Chain
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <GuardiansPanel />

            {/* Aztek Gods Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-6 flex items-center gap-2">
                <Crown className="w-6 h-6" /> Panteón Aztek - Orquestación de 11 Dioses
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {aztekGods.map((god, index) => (
                  <motion.div
                    key={god.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="glass-effect rounded-xl p-4 border border-accent/20 hover:border-accent/40 transition-all cursor-pointer group"
                  >
                    <div className="text-3xl mb-2">{god.icon}</div>
                    <h3 className="font-orbitron font-bold text-foreground">{god.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{god.domain}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-accent/30">
                        {god.power}
                      </Badge>
                      <span className="text-xs font-bold text-accent">Lv.{god.level}</span>
                    </div>
                    <div className="h-1 mt-3 rounded-full bg-primary/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(god.level / 11) * 100}%` }}
                        transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-accent to-primary"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="anubis">
            <div className="max-w-3xl mx-auto">
              <AnubisSentinelSystem />
            </div>
          </TabsContent>

          <TabsContent value="horus">
            <div className="max-w-3xl mx-auto">
              <ORUSMonitor />
            </div>
          </TabsContent>

          <TabsContent value="dekateotl">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="glass-effect rounded-xl p-8 border border-accent/20 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-glow"
                >
                  <Crown className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-orbitron font-bold text-gradient-quantum mb-4">
                  Protocolo Dekateotl
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                  Sistema de gobernanza de 11 capas con orquestación de dioses aztecas. 
                  Cada capa representa un nivel de seguridad y control autónomo.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: "Capas Activas", value: "11/11", color: "text-emerald-500" },
                    { label: "Integridad", value: "100%", color: "text-accent" },
                    { label: "Consenso", value: "Activo", color: "text-primary" },
                    { label: "Autonomía", value: "Total", color: "text-secondary" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-background/50 rounded-lg p-4">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blockchain">
            <div className="max-w-3xl mx-auto">
              <MSRLedger />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

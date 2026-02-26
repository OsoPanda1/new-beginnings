/**
 * 🛡️ Guardians Panel - TAMV MD-X4™
 * Anubis, Horus, Dekateotl & Aztek Gods Monitoring System
 */

import { motion } from "framer-motion";
import { 
  Shield, Eye, Crown, Activity, AlertTriangle, 
  CheckCircle2, Zap, Lock, Brain, Radar,
  Server, Cpu, WifiOff, Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useGuardianEvents, GuardianStats } from "@/hooks/useGuardianEvents";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GuardianCardProps {
  name: string;
  title: string;
  icon: React.ReactNode;
  status: 'active' | 'warning' | 'critical' | 'scanning' | 'standby' | 'learning' | 'alert';
  stats: { label: string; value: string | number }[];
  level?: number;
  gradient: string;
}

function GuardianCard({ name, title, icon, status, stats, level, gradient }: GuardianCardProps) {
  const statusColors = {
    active: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    critical: 'bg-destructive/20 text-destructive border-destructive/30',
    scanning: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    standby: 'bg-muted text-muted-foreground border-muted',
    learning: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    alert: 'bg-orange-500/20 text-orange-500 border-orange-500/30'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`glass-effect overflow-hidden border-primary/20 hover:border-primary/40 transition-all`}>
        <div className={`h-1 ${gradient}`} />
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-glow`}
                animate={{ rotate: status === 'scanning' ? [0, 360] : 0 }}
                transition={{ duration: 2, repeat: status === 'scanning' ? Infinity : 0, ease: "linear" }}
              >
                {icon}
              </motion.div>
              <div>
                <h3 className="font-orbitron font-bold text-foreground">{name}</h3>
                <p className="text-xs text-muted-foreground">{title}</p>
              </div>
            </div>
            <Badge className={`${statusColors[status]} border`}>
              {status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {status === 'scanning' && <Radar className="w-3 h-3 mr-1 animate-pulse" />}
              {status}
            </Badge>
          </div>

          {level && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Nivel de Protección</span>
                <span className="font-bold text-accent">{level}/11</span>
              </div>
              <Progress value={(level / 11) * 100} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat, i) => (
              <div key={i} className="bg-background/50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function GuardiansPanel() {
  const { events, stats, loading, unresolvedCount, criticalCount, resolveEvent } = useGuardianEvents();

  const guardians = [
    {
      name: "Anubis",
      title: "Sentinel Principal",
      icon: <Shield className="w-6 h-6 text-white" />,
      status: stats.anubis.status,
      stats: [
        { label: "Eventos", value: stats.anubis.events },
        { label: "Bloqueados", value: stats.anubis.blocked }
      ],
      level: 11,
      gradient: "bg-gradient-to-r from-amber-500 to-orange-600"
    },
    {
      name: "Horus",
      title: "Vision Omni-Espectral",
      icon: <Eye className="w-6 h-6 text-white" />,
      status: stats.horus.status as 'active' | 'scanning',
      stats: [
        { label: "Escaneos", value: stats.horus.scans },
        { label: "Amenazas", value: stats.horus.threats }
      ],
      level: 10,
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      name: "Dekateotl",
      title: "Gobernanza de 11 Capas",
      icon: <Crown className="w-6 h-6 text-white" />,
      status: stats.dekateotl.status as 'active' | 'standby',
      stats: [
        { label: "Nivel", value: stats.dekateotl.level },
        { label: "Integridad", value: `${stats.dekateotl.integrity}%` }
      ],
      level: stats.dekateotl.level,
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      name: "ORUS",
      title: "Inteligencia Predictiva",
      icon: <Brain className="w-6 h-6 text-white" />,
      status: stats.orus.status as 'active' | 'learning',
      stats: [
        { label: "Patrones", value: stats.orus.patterns },
        { label: "Precisión", value: `${stats.orus.accuracy}%` }
      ],
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500"
    }
  ];

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Server className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4/4</p>
              <p className="text-xs text-muted-foreground">Guardianes Activos</p>
            </div>
          </div>
        </Card>
        <Card className="glass-effect border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{events.length}</p>
              <p className="text-xs text-muted-foreground">Eventos Totales</p>
            </div>
          </div>
        </Card>
        <Card className={`glass-effect border-primary/20 p-4 ${criticalCount > 0 ? 'border-destructive/50' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              criticalCount > 0 ? 'bg-destructive/20' : 'bg-amber-500/20'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${criticalCount > 0 ? 'text-destructive' : 'text-amber-500'}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{unresolvedCount}</p>
              <p className="text-xs text-muted-foreground">Sin Resolver</p>
            </div>
          </div>
        </Card>
        <Card className="glass-effect border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">PQC</p>
              <p className="text-xs text-muted-foreground">Cifrado Quantum</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Guardian Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {guardians.map((guardian, index) => (
          <motion.div
            key={guardian.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GuardianCard {...guardian} />
          </motion.div>
        ))}
      </div>

      {/* Recent Events */}
      <Card className="glass-effect border-primary/20">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Eventos Recientes
            </h3>
            <Badge variant="outline" className="border-primary/30">
              {loading ? '...' : events.length} total
            </Badge>
          </div>
        </div>
        <ScrollArea className="h-64">
          <div className="p-4 space-y-2">
            {recentEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Sistema operando sin incidentes</p>
              </div>
            ) : (
              recentEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    event.resolved 
                      ? 'bg-background/50 border-border/50' 
                      : event.severity === 'critical'
                        ? 'bg-destructive/10 border-destructive/30'
                        : event.severity === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-primary/5 border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.severity === 'critical' ? 'bg-destructive animate-pulse' :
                      event.severity === 'warning' ? 'bg-amber-500' : 'bg-primary'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.event_type}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="capitalize">{event.guardian_name}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        {new Date(event.created_at).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {!event.resolved && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => resolveEvent(event.id)}
                    >
                      Resolver
                    </Button>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

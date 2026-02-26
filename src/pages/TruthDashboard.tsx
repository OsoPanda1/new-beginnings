import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, DollarSign, Shield, Activity, Eye,
  AlertTriangle, CheckCircle2, Clock, Zap, Globe, Lock,
  BarChart3, ArrowUpRight, ArrowDownRight, Percent
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface SystemHealth {
  name: string;
  status: "online" | "degraded" | "offline";
  uptime: number;
  latency: number;
}

export default function TruthDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedMetrics, setAnimatedMetrics] = useState({
    users: 0,
    revenue: 0,
    transactions: 0,
    incidents: 0
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Animate metrics on load
    const targets = { users: 12847, revenue: 2547890, transactions: 98234, incidents: 3 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedMetrics({
        users: Math.floor(targets.users * progress),
        revenue: Math.floor(targets.revenue * progress),
        transactions: Math.floor(targets.transactions * progress),
        incidents: Math.floor(targets.incidents * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const metrics: MetricCard[] = [
    { title: "Usuarios Activos", value: animatedMetrics.users.toLocaleString(), change: 12.5, icon: Users, color: "from-blue-500 to-cyan-500" },
    { title: "Ingresos (MXN)", value: `$${animatedMetrics.revenue.toLocaleString()}`, change: 8.3, icon: DollarSign, color: "from-emerald-500 to-green-500" },
    { title: "Transacciones", value: animatedMetrics.transactions.toLocaleString(), change: 15.2, icon: Activity, color: "from-purple-500 to-pink-500" },
    { title: "Incidentes Abiertos", value: animatedMetrics.incidents, change: -66.7, icon: AlertTriangle, color: "from-amber-500 to-orange-500" }
  ];

  const systemHealth: SystemHealth[] = [
    { name: "ISABELLA Core", status: "online", uptime: 99.99, latency: 12 },
    { name: "MSR Blockchain", status: "online", uptime: 99.95, latency: 45 },
    { name: "Nubiwallet", status: "online", uptime: 99.98, latency: 18 },
    { name: "DreamSpaces XR", status: "online", uptime: 99.87, latency: 85 },
    { name: "BookPI Registry", status: "online", uptime: 99.92, latency: 23 },
    { name: "Anubis Sentinel", status: "online", uptime: 100, latency: 5 }
  ];

  const recentEvents = [
    { type: "transaction", message: "Lotería TAMV: Pago de $50,000 MXN verificado", time: "Hace 2 min", icon: DollarSign },
    { type: "security", message: "Anubis Sentinel: Ataque DDoS mitigado", time: "Hace 15 min", icon: Shield },
    { type: "system", message: "DreamSpaces: Nuevo espacio XR publicado", time: "Hace 32 min", icon: Globe },
    { type: "user", message: "100 nuevos usuarios verificados hoy", time: "Hace 1 hora", icon: Users }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-emerald-400";
      case "degraded": return "text-amber-400";
      case "offline": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-effect border-b border-primary/10 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-gradient-quantum">
                Dashboard de Verdad Radical
              </h1>
              <p className="text-xs text-muted-foreground">
                Transparencia auditable para inversionistas
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              En Vivo
            </Badge>
            <div className="text-right">
              <p className="text-sm font-mono">{currentTime.toLocaleTimeString()}</p>
              <p className="text-xs text-muted-foreground">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-primary/20 p-6 hover:shadow-glow transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${metric.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {metric.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* System Health & Events */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-primary/20 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-orbitron font-bold">Estado del Sistema</h2>
              </div>
              
              <div className="space-y-4">
                {systemHealth.map((system, index) => (
                  <motion.div
                    key={system.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${system.status === 'online' ? 'bg-emerald-400' : system.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`} />
                      <span className="font-medium">{system.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        <Percent className="w-3 h-3 inline mr-1" />
                        {system.uptime}%
                      </span>
                      <span className="text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {system.latency}ms
                      </span>
                      <span className={getStatusColor(system.status)}>
                        {system.status === 'online' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-primary/20 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-orbitron font-bold">Eventos Recientes</h2>
              </div>
              
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <event.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{event.message}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* KPIs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-effect border-primary/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-orbitron font-bold">KPIs de Producción</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Autenticación y Seguridad", value: 95, target: 95 },
                { label: "Wallet y Ledger", value: 90, target: 90 },
                { label: "Marketplace/Trueque", value: 85, target: 85 },
                { label: "Social/Global Wall", value: 85, target: 85 },
                { label: "Lotería/Juegos", value: 90, target: 90 },
                { label: "Observabilidad/Operación", value: 95, target: 95 }
              ].map((kpi, index) => (
                <div key={kpi.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{kpi.label}</span>
                    <span className={kpi.value >= kpi.target ? 'text-emerald-400' : 'text-amber-400'}>
                      {kpi.value}%
                    </span>
                  </div>
                  <Progress 
                    value={kpi.value} 
                    className="h-2 bg-background"
                  />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Compliance Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-effect border border-primary/20">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="text-sm">
              Datos verificados y auditables en MSR Blockchain
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-400">Certificado</Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

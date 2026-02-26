import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  Activity,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Usuarios", value: "10,423", icon: Users, color: "text-primary", trend: "+12%" },
    { label: "Sesiones Activas", value: "1,284", icon: Activity, color: "text-secondary", trend: "+8%" },
    { label: "TAMV Credits Circulando", value: "2.4M", icon: TrendingUp, color: "text-accent", trend: "+15%" },
    { label: "Alertas Activas", value: "3", icon: AlertTriangle, color: "text-energy", trend: "-2" },
  ];

  const recentEvents = [
    { type: "success", event: "Nuevo DreamSpace publicado", user: "@quantum_soul", time: "Hace 5 min" },
    { type: "warning", event: "Intento de acceso no autorizado bloqueado", user: "Sistema", time: "Hace 15 min" },
    { type: "success", event: "Usuario premium registrado", user: "@neon_dreams", time: "Hace 1h" },
    { type: "info", event: "Actualización del sistema completada", user: "Sistema", time: "Hace 2h" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full glow-quantum mb-4">
            <Shield className="w-6 h-6 text-resonance animate-pulse" />
            <span className="font-orbitron font-bold text-lg">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-quantum">
            Centro de Control TAMV
          </h1>
          <p className="text-muted-foreground text-lg">
            Auditoría total, gestión de usuarios y monitoreo del ecosistema
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="glass-effect p-6 hover:shadow-cyber transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color.replace('text-', '')}/20 to-${stat.color.replace('text-', '')}/10`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge className={stat.trend.startsWith('+') ? 'bg-resonance' : 'bg-energy'}>
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-3xl font-orbitron font-bold ${stat.color}`}>{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Events */}
          <Card className="lg:col-span-2 glass-effect p-6">
            <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-6">
              Eventos Recientes
            </h2>
            <div className="space-y-3">
              {recentEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-card-glass transition-colors"
                >
                  <div className="mt-1">
                    {event.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-resonance" />
                    ) : event.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-energy" />
                    ) : (
                      <Activity className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.event}</p>
                    <p className="text-sm text-muted-foreground">{event.user} • {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-effect p-6">
            <h2 className="text-2xl font-orbitron font-bold text-gradient-dream mb-6">
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-gradient-quantum hover:shadow-glow">
                <Users className="w-4 h-4 mr-2" />
                Gestionar Usuarios
              </Button>
              <Button className="w-full justify-start bg-gradient-gold hover:shadow-glow">
                <Database className="w-4 h-4 mr-2" />
                Base de Datos
              </Button>
              <Button className="w-full justify-start bg-gradient-dream hover:shadow-glow">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Button className="w-full justify-start border-border hover:border-primary" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Ver Logs
              </Button>
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card className="glass-effect p-6">
          <h2 className="text-2xl font-orbitron font-bold text-gradient-gold mb-6">
            Estado del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "API Gateway", status: "Operativo", uptime: "99.98%" },
              { name: "Base de Datos", status: "Operativo", uptime: "99.99%" },
              { name: "Anubis Sentinel™", status: "Activo", uptime: "100%" },
            ].map((service, i) => (
              <div key={i} className="p-4 bg-card-glass rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-orbitron font-semibold">{service.name}</p>
                  <CheckCircle className="w-5 h-5 text-resonance" />
                </div>
                <p className="text-sm text-muted-foreground">{service.status}</p>
                <p className="text-xs text-primary-glow mt-1">Uptime: {service.uptime}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

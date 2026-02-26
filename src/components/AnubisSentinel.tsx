import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Activity, CheckCircle, AlertTriangle } from "lucide-react";

export const AnubisSentinel = () => {
  const securityLayers = [
    { name: "Capa Cuántica", status: "active", strength: 100 },
    { name: "Encriptación Emocional", status: "active", strength: 98 },
    { name: "Trazabilidad ID-NVIDA™", status: "active", strength: 100 },
    { name: "Protección Multisensorial", status: "active", strength: 95 },
    { name: "Blindaje de Contratos", status: "active", strength: 100 },
    { name: "Verificación Biométrica", status: "active", strength: 97 },
    { name: "Firewall RA Radar™", status: "active", strength: 99 },
    { name: "Guardián Quetzalcóatl™", status: "active", strength: 100 },
    { name: "Escudo de Resonancia", status: "active", strength: 96 },
    { name: "Auditoría Continua", status: "active", strength: 100 },
    { name: "Respaldo Cuántico", status: "active", strength: 100 },
  ];

  const recentEvents = [
    { type: "success", event: "Acceso seguro verificado", time: "Hace 1 min" },
    { type: "success", event: "Transacción validada", time: "Hace 5 min" },
    { type: "info", event: "Actualización de seguridad aplicada", time: "Hace 15 min" },
    { type: "success", event: "Backup cuántico completado", time: "Hace 1h" },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full glow-quantum mb-4">
            <Shield className="w-6 h-6 text-resonance animate-pulse" />
            <span className="font-orbitron font-bold text-lg">Anubis Sentinel™</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-dream">
            Sistema de Seguridad Cuántica
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            11 capas de cifrado cuántico protegiendo tu identidad multisensorial
          </p>
        </div>

        {/* Security Status */}
        <Card className="glass-effect p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-foreground mb-1">
                Estado de Seguridad
              </h2>
              <p className="text-sm text-muted-foreground">
                Sistema Dekateotl™ totalmente operativo
              </p>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-resonance to-pink-500 flex items-center justify-center shadow-glow animate-pulse-slow">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 glass-effect rounded-lg">
              <Lock className="w-8 h-8 mx-auto mb-2 text-primary-glow" />
              <p className="text-2xl font-orbitron font-bold text-gradient-quantum">100%</p>
              <p className="text-xs text-muted-foreground">Cifrado</p>
            </div>
            <div className="text-center p-4 glass-effect rounded-lg">
              <Eye className="w-8 h-8 mx-auto mb-2 text-secondary-glow" />
              <p className="text-2xl font-orbitron font-bold text-gradient-quantum">0</p>
              <p className="text-xs text-muted-foreground">Amenazas</p>
            </div>
            <div className="text-center p-4 glass-effect rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-accent-glow" />
              <p className="text-2xl font-orbitron font-bold text-gradient-quantum">24/7</p>
              <p className="text-xs text-muted-foreground">Monitoreo</p>
            </div>
          </div>
        </Card>

        {/* Security Layers */}
        <div>
          <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-6">
            Capas de Protección Dekateotl™
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityLayers.map((layer, i) => (
              <Card
                key={i}
                className="glass-effect p-4 hover:shadow-cyber transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-resonance animate-pulse" />
                    <h3 className="font-orbitron font-semibold text-sm">
                      {layer.name}
                    </h3>
                  </div>
                  <CheckCircle className="w-4 h-4 text-resonance" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Fortaleza</span>
                    <span className="text-resonance font-bold">{layer.strength}%</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-resonance to-pink-500 transition-all duration-1000"
                      style={{ width: `${layer.strength}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-effect p-6">
            <h2 className="text-2xl font-orbitron font-bold text-gradient-dream mb-6">
              Actividad Reciente
            </h2>
            
            <div className="space-y-3">
              {recentEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-card-glass transition-colors"
                >
                  <div className="mt-1">
                    {event.type === "success" ? (
                      <CheckCircle className="w-5 h-5 text-resonance" />
                    ) : event.type === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-energy" />
                    ) : (
                      <Activity className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.event}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-effect p-6">
            <h2 className="text-2xl font-orbitron font-bold text-gradient-gold mb-6">
              MOS Radars™
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-card-glass rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-orbitron font-semibold">RA Radar™</h3>
                  <Activity className="w-5 h-5 text-secondary-glow animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Rastrea resonancia emocional en tiempo real
                </p>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-secondary to-cyan-500 animate-pulse" />
                </div>
              </div>
              
              <div className="p-4 bg-card-glass rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-orbitron font-semibold">Quetzalcóatl™</h3>
                  <Eye className="w-5 h-5 text-primary-glow animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Proyecta trayectorias de interacción
                </p>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-primary to-purple-500 animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ID-NVIDA Status */}
        <Card className="glass-effect p-6 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-resonance animate-glow" />
          <h2 className="text-2xl font-orbitron font-bold text-gradient-dream mb-2">
            ID-NVIDA™ Protegido
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tu huella digital emocional, visual y documental está completamente protegida 
            por cifrado cuántico inclonable
          </p>
        </Card>
      </div>
    </div>
  );
};

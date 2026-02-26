import { TrendingUp, Users, Zap, DollarSign, Activity, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Dashboard = () => {
  const stats = [
    { 
      label: "Resonancia Emocional", 
      value: "94.5%", 
      icon: Activity, 
      color: "text-resonance",
      gradient: "from-resonance to-pink-500"
    },
    { 
      label: "TAMV Credits", 
      value: "12,450", 
      icon: DollarSign, 
      color: "text-accent",
      gradient: "from-accent to-yellow-500"
    },
    { 
      label: "Conexiones Activas", 
      value: "1,284", 
      icon: Users, 
      color: "text-secondary",
      gradient: "from-secondary to-cyan-500"
    },
    { 
      label: "Nivel de Energía", 
      value: "87.2%", 
      icon: Zap, 
      color: "text-energy",
      gradient: "from-energy to-orange-500"
    },
  ];

  const recentActivities = [
    { action: "Nuevo DreamSpace creado", time: "Hace 2 min", type: "creation" },
    { action: "500 TAMV Credits recibidos", time: "Hace 15 min", type: "credits" },
    { action: "Interacción con ISABELLA AI™", time: "Hace 1 hora", type: "ai" },
    { action: "Resonancia con @user_quantum", time: "Hace 2 horas", type: "social" },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-quantum">
            Bienvenido al Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Tu centro de comando multisensorial
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={i} 
                className="glass-effect p-6 hover:shadow-cyber transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-3xl font-orbitron font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 h-1 bg-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.gradient} animate-pulse`}
                    style={{ width: typeof stat.value === 'string' && stat.value.includes('%') ? stat.value : '75%' }}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pulso Emocional */}
          <Card className="lg:col-span-2 glass-effect p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum">
                Pulso Emocional™
              </h2>
              <TrendingUp className="w-6 h-6 text-primary-glow animate-pulse" />
            </div>
            
            <div className="space-y-4">
              {/* Emotion Bars */}
              {[
                { emotion: "Creatividad", value: 92, color: "from-primary to-purple-500" },
                { emotion: "Conexión Social", value: 78, color: "from-secondary to-cyan-500" },
                { emotion: "Enfoque", value: 85, color: "from-focus to-blue-500" },
                { emotion: "Energía", value: 88, color: "from-energy to-orange-500" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-orbitron">{item.emotion}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-effect p-6">
            <h2 className="text-2xl font-orbitron font-bold text-gradient-dream mb-6">
              Actividad Reciente
            </h2>
            
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-card-glass transition-colors"
                >
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary-glow animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Crear DreamSpace", desc: "Nuevo entorno XR", gradient: "from-secondary to-cyan-500" },
            { title: "Chat con ISABELLA", desc: "IA empática activa", gradient: "from-primary to-purple-500" },
            { title: "Comprar Credits", desc: "Potencia tu economía", gradient: "from-accent to-yellow-500" },
          ].map((action, i) => (
            <Card 
              key={i}
              className="glass-effect p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${action.gradient} mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Star className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="font-orbitron font-bold text-lg mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

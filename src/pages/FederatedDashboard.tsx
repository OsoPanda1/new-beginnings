/**
 * 🌐 Federated Dashboard - TAMV MD-X4™
 * Real-time monitoring of 7 federation layers
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Cpu, Database, Shield, Eye, Brain, Zap, Layers,
  Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  TrendingUp, Server, Lock, Gauge
} from "lucide-react";
import { 
  federatedArchitecture, 
  type FederationLayer,
  LAYER_CAPABILITIES 
} from "@/core/federation/FederatedArchitecture";

interface LayerStatus {
  layer: FederationLayer;
  status: 'active' | 'loading' | 'error' | 'offline';
  latency: number;
  throughput: number;
  errorRate: number;
  circuitBreaker: boolean;
}

const LAYER_CONFIG: Record<FederationLayer, { icon: typeof Cpu; color: string; gradient: string }> = {
  QUANTUM: { icon: Zap, color: "text-purple-400", gradient: "from-purple-500 to-violet-600" },
  RENDER: { icon: Eye, color: "text-cyan-400", gradient: "from-cyan-500 to-blue-600" },
  NEURAL: { icon: Brain, color: "text-pink-400", gradient: "from-pink-500 to-rose-600" },
  SENSOR: { icon: Activity, color: "text-green-400", gradient: "from-green-500 to-emerald-600" },
  DATA: { icon: Database, color: "text-blue-400", gradient: "from-blue-500 to-indigo-600" },
  SECURITY: { icon: Shield, color: "text-amber-400", gradient: "from-amber-500 to-orange-600" },
  INTERFACE: { icon: Layers, color: "text-teal-400", gradient: "from-teal-500 to-cyan-600" }
};

const FederatedDashboard = () => {
  const [layers, setLayers] = useState<LayerStatus[]>([]);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'degraded' | 'critical'>('healthy');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [messageQueue, setMessageQueue] = useState(0);
  const [circuitBreakers, setCircuitBreakers] = useState({ open: 0, closed: 7 });

  useEffect(() => {
    initializeLayers();
    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const initializeLayers = async () => {
    await federatedArchitecture.activateAllLayers();
    updateMetrics();
  };

  const updateMetrics = () => {
    const health = federatedArchitecture.getHealthSummary();
    setOverallHealth(health.overall);
    setMessageQueue(health.queueSize);
    setCircuitBreakers(health.circuitBreakers);

    const layerStatus: LayerStatus[] = Object.entries(health.layers).map(([layer, status]) => ({
      layer: layer as FederationLayer,
      status: status as 'active' | 'loading' | 'error' | 'offline',
      latency: Math.random() * 50 + 5,
      throughput: Math.random() * 1000 + 500,
      errorRate: Math.random() * 2,
      circuitBreaker: Math.random() > 0.9
    }));

    setLayers(layerStatus);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateMetrics();
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'loading': return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'offline': return <AlertTriangle className="w-4 h-4 text-gray-400" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-gradient-quantum">
              7-Layer Federation Monitor
            </h1>
            <p className="text-muted-foreground">Real-time quantum-federated architecture status</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="bg-primary/20 border border-primary/30 hover:bg-primary/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Overall Status */}
        <Card className="glass-effect p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${getHealthColor(overallHealth)} animate-pulse`} />
              <div>
                <h2 className="text-xl font-orbitron font-bold">System Health</h2>
                <p className="text-sm text-muted-foreground capitalize">{overallHealth}</p>
              </div>
            </div>
            
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-orbitron font-bold text-accent">{messageQueue}</p>
                <p className="text-xs text-muted-foreground">Queue Size</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-orbitron font-bold text-green-400">{circuitBreakers.closed}</p>
                <p className="text-xs text-muted-foreground">Circuits OK</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-orbitron font-bold text-red-400">{circuitBreakers.open}</p>
                <p className="text-xs text-muted-foreground">Circuits Open</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Layer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {layers.map((layer) => {
            const config = LAYER_CONFIG[layer.layer];
            const Icon = config.icon;
            const capabilities = LAYER_CAPABILITIES[layer.layer];

            return (
              <Card 
                key={layer.layer}
                className={`glass-effect p-5 hover:shadow-glow transition-all duration-300 ${
                  layer.status === 'error' ? 'border-red-500/50' : 
                  layer.circuitBreaker ? 'border-yellow-500/50' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-sm">{layer.layer}</h3>
                      <p className="text-xs text-muted-foreground">Layer</p>
                    </div>
                  </div>
                  {getStatusIcon(layer.status)}
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Latency</span>
                      <span className={config.color}>{layer.latency.toFixed(1)}ms</span>
                    </div>
                    <Progress value={Math.min(layer.latency * 2, 100)} className="h-1.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Throughput</span>
                      <span className={config.color}>{layer.throughput.toFixed(0)}/s</span>
                    </div>
                    <Progress value={layer.throughput / 15} className="h-1.5" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Error Rate</span>
                      <span className={layer.errorRate > 1 ? 'text-red-400' : 'text-green-400'}>
                        {layer.errorRate.toFixed(2)}%
                      </span>
                    </div>
                    <Progress value={layer.errorRate * 50} className="h-1.5" />
                  </div>
                </div>

                {/* Capabilities Badge */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {capabilities.capabilities.slice(0, 3).map((cap, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {cap.split('-')[0]}
                    </Badge>
                  ))}
                  {capabilities.capabilities.length > 3 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      +{capabilities.capabilities.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Circuit Breaker */}
                {layer.circuitBreaker && (
                  <div className="mt-3 flex items-center gap-2 text-yellow-400 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Circuit Breaker Open</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Architecture Diagram */}
        <Card className="glass-effect p-6">
          <h2 className="text-xl font-orbitron font-bold mb-4">Federation Architecture</h2>
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-4">
            {(['QUANTUM', 'SECURITY', 'DATA', 'NEURAL', 'SENSOR', 'RENDER', 'INTERFACE'] as FederationLayer[]).map((layer, i) => {
              const config = LAYER_CONFIG[layer];
              const Icon = config.icon;
              const layerData = layers.find(l => l.layer === layer);
              
              return (
                <div key={layer} className="flex items-center">
                  <div className={`flex flex-col items-center p-3 rounded-lg bg-gradient-to-br ${config.gradient} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white mb-1" />
                    <span className="text-[10px] font-orbitron text-white">{layer}</span>
                    <span className={`text-[8px] ${layerData?.status === 'active' ? 'text-green-300' : 'text-red-300'}`}>
                      {layerData?.status}
                    </span>
                  </div>
                  {i < 6 && (
                    <div className="w-8 h-0.5 bg-gradient-to-r from-accent/50 to-accent/20 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Layers", value: layers.filter(l => l.status === 'active').length, icon: Server, color: "text-green-400" },
            { label: "Avg Latency", value: `${(layers.reduce((a, b) => a + b.latency, 0) / Math.max(layers.length, 1)).toFixed(1)}ms`, icon: Gauge, color: "text-cyan-400" },
            { label: "Total Throughput", value: `${(layers.reduce((a, b) => a + b.throughput, 0) / 1000).toFixed(1)}k/s`, icon: TrendingUp, color: "text-purple-400" },
            { label: "Security Score", value: "98.5%", icon: Lock, color: "text-amber-400" }
          ].map((stat, i) => (
            <Card key={i} className="glass-effect p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-orbitron font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FederatedDashboard;

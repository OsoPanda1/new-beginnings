/**
 * 🔒 Anubis Sentinel System - Zero-Trust Identity Guardian
 * TAMV MD-X4™ First-Line Defense
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, Lock, Eye, AlertTriangle, CheckCircle2, 
  Activity, Zap, Fingerprint, Globe, Server
} from 'lucide-react';

interface ThreatLevel {
  level: 'safe' | 'warning' | 'critical';
  score: number;
  message: string;
}

interface SecurityMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ElementType;
}

export function AnubisSentinelSystem() {
  const [threatLevel] = useState<ThreatLevel>({
    level: 'safe',
    score: 98,
    message: 'Sistema operando en parámetros óptimos'
  });

  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    { name: 'Identity Verification', value: 100, status: 'healthy', icon: Fingerprint },
    { name: 'Session Security', value: 97, status: 'healthy', icon: Lock },
    { name: 'Network Shield', value: 95, status: 'healthy', icon: Globe },
    { name: 'API Gateway', value: 99, status: 'healthy', icon: Server },
  ]);

  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Simulate continuous monitoring
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(85, Math.min(100, metric.value + (Math.random() - 0.5) * 2))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runSecurityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const getThreatColor = () => {
    switch (threatLevel.level) {
      case 'safe': return 'text-resonance';
      case 'warning': return 'text-energy';
      case 'critical': return 'text-destructive';
    }
  };

  return (
    <Card className="glass-effect border-primary/30 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-quantum flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-accent/50"
            />
          </motion.div>
          <div>
            <h3 className="text-xl font-orbitron font-bold text-foreground">
              Anubis Sentinel
            </h3>
            <p className="text-sm text-muted-foreground">Zero-Trust Guardian</p>
          </div>
        </div>
        
        <Badge className={`${getThreatColor()} bg-background/50`}>
          <Activity className="w-3 h-3 mr-1" />
          Score: {threatLevel.score}%
        </Badge>
      </div>

      {/* Threat Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className={`flex items-center gap-3 p-4 rounded-lg bg-${threatLevel.level === 'safe' ? 'resonance' : threatLevel.level === 'warning' ? 'energy' : 'destructive'}/10 border border-${threatLevel.level === 'safe' ? 'resonance' : threatLevel.level === 'warning' ? 'energy' : 'destructive'}/20`}>
          {threatLevel.level === 'safe' ? (
            <CheckCircle2 className="w-6 h-6 text-resonance" />
          ) : threatLevel.level === 'warning' ? (
            <AlertTriangle className="w-6 h-6 text-energy" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-destructive" />
          )}
          <div>
            <p className="font-medium text-foreground">{threatLevel.message}</p>
            <p className="text-sm text-muted-foreground">
              Última verificación: hace 2 segundos
            </p>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-primary/5 border border-primary/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">{metric.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={metric.value} className="flex-1 h-2" />
              <span className={`text-sm font-bold ${metric.value > 90 ? 'text-resonance' : metric.value > 70 ? 'text-energy' : 'text-destructive'}`}>
                {metric.value.toFixed(0)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Scan */}
      <div className="space-y-3">
        <button
          onClick={runSecurityScan}
          disabled={isScanning}
          className="w-full py-3 rounded-lg bg-gradient-quantum text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isScanning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5" />
              </motion.div>
              Escaneando... {scanProgress}%
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              Ejecutar Scan Completo
            </>
          )}
        </button>

        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <Progress value={scanProgress} className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default AnubisSentinelSystem;

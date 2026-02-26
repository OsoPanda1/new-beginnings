/**
 * 👁️ ORUS Sentinel Monitor - Pattern Detection & MSR Coordination
 * TAMV MD-X4™ Advanced Threat Analysis
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, Activity, Shield, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, Cpu
} from 'lucide-react';

interface ThreatEvent {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'resolved';
  message: string;
  timestamp: Date;
  source: string;
}

interface PatternMatch {
  pattern: string;
  confidence: number;
  action: string;
}

export function ORUSMonitor() {
  const [events] = useState<ThreatEvent[]>([
    { id: '1', type: 'info', message: 'Sistema inicializado correctamente', timestamp: new Date(), source: 'ORUS-Core' },
    { id: '2', type: 'resolved', message: 'Verificación de identidad completada', timestamp: new Date(Date.now() - 60000), source: 'Anubis' },
    { id: '3', type: 'info', message: 'MSR Blockchain sincronizada', timestamp: new Date(Date.now() - 120000), source: 'MSR-Node' },
  ]);

  const [patterns] = useState<PatternMatch[]>([
    { pattern: 'Normal User Behavior', confidence: 98.5, action: 'Allow' },
    { pattern: 'API Request Pattern', confidence: 95.2, action: 'Monitor' },
    { pattern: 'Session Integrity', confidence: 99.1, action: 'Verified' },
  ]);

  const [systemStats, setSystemStats] = useState({
    eventsProcessed: 15847,
    threatsBlocked: 23,
    uptime: 99.97,
    latency: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        eventsProcessed: prev.eventsProcessed + Math.floor(Math.random() * 10),
        latency: Math.max(5, Math.min(50, prev.latency + (Math.random() - 0.5) * 5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: ThreatEvent['type']) => {
    switch (type) {
      case 'info': return <Activity className="w-4 h-4 text-accent" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-energy" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-resonance" />;
    }
  };

  return (
    <Card className="glass-effect border-accent/30 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              boxShadow: ['0 0 0 0 rgba(15, 241, 230, 0.4)', '0 0 0 20px rgba(15, 241, 230, 0)', '0 0 0 0 rgba(15, 241, 230, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center"
          >
            <Eye className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-orbitron font-bold text-foreground">
              ORUS Monitor
            </h3>
            <p className="text-sm text-muted-foreground">Pattern Detection Active</p>
          </div>
        </div>
        
        <Badge className="bg-resonance/20 text-resonance">
          <Activity className="w-3 h-3 mr-1" />
          Online
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: 'Eventos', value: systemStats.eventsProcessed.toLocaleString(), icon: Activity },
          { label: 'Bloqueados', value: systemStats.threatsBlocked, icon: Shield },
          { label: 'Uptime', value: `${systemStats.uptime}%`, icon: TrendingUp },
          { label: 'Latencia', value: `${systemStats.latency.toFixed(0)}ms`, icon: Cpu },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-2 rounded-lg bg-primary/5 border border-primary/10 text-center"
          >
            <stat.icon className="w-4 h-4 mx-auto mb-1 text-accent" />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pattern Matches */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Pattern Analysis
        </h4>
        <div className="space-y-2">
          {patterns.map((pattern, index) => (
            <motion.div
              key={pattern.pattern}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg bg-primary/5"
            >
              <span className="text-sm text-foreground">{pattern.pattern}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {pattern.confidence}%
                </Badge>
                <Badge className={`text-xs ${pattern.action === 'Allow' ? 'bg-resonance/20 text-resonance' : pattern.action === 'Monitor' ? 'bg-energy/20 text-energy' : 'bg-accent/20 text-accent'}`}>
                  {pattern.action}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Log */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Event Log
        </h4>
        <ScrollArea className="h-32">
          <div className="space-y-2">
            <AnimatePresence>
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 p-2 rounded-lg bg-background/50 text-sm"
                >
                  {getEventIcon(event.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate">{event.message}</p>
                    <p className="text-xs text-muted-foreground">{event.source}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

export default ORUSMonitor;

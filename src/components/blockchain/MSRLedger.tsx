/**
 * ⛓️ MSR Blockchain Ledger Display
 * TAMV MD-X4™ Immutable Transaction Ledger
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Link, Hash, Clock, CheckCircle2, 
  Shield, Database, Zap, ExternalLink
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  hash: string;
  prevHash: string;
  type: 'transaction' | 'decision' | 'audit' | 'system';
  payload: string;
  timestamp: Date;
  verified: boolean;
}

export function MSRLedger() {
  const [entries] = useState<LedgerEntry[]>([
    {
      id: 'entry-001',
      hash: '0x7f3a9b2c4d5e6f...',
      prevHash: '0x1a2b3c4d5e6f7g...',
      type: 'transaction',
      payload: 'Creator reward distribution',
      timestamp: new Date(),
      verified: true
    },
    {
      id: 'entry-002',
      hash: '0x8g4h5i6j7k8l9m...',
      prevHash: '0x7f3a9b2c4d5e6f...',
      type: 'decision',
      payload: 'EOCT policy evaluation',
      timestamp: new Date(Date.now() - 300000),
      verified: true
    },
    {
      id: 'entry-003',
      hash: '0x9n0o1p2q3r4s5t...',
      prevHash: '0x8g4h5i6j7k8l9m...',
      type: 'audit',
      payload: 'BookPI bundle created',
      timestamp: new Date(Date.now() - 600000),
      verified: true
    },
    {
      id: 'entry-004',
      hash: '0xa1b2c3d4e5f6g7...',
      prevHash: '0x9n0o1p2q3r4s5t...',
      type: 'system',
      payload: 'Checkpoint sync completed',
      timestamp: new Date(Date.now() - 900000),
      verified: true
    },
  ]);

  const [stats] = useState({
    totalBlocks: 15847,
    verifiedRate: 100,
    lastSync: new Date(),
    chainHealth: 'optimal'
  });

  const getTypeColor = (type: LedgerEntry['type']) => {
    switch (type) {
      case 'transaction': return 'bg-accent/20 text-accent';
      case 'decision': return 'bg-secondary/20 text-secondary';
      case 'audit': return 'bg-energy/20 text-energy';
      case 'system': return 'bg-primary/20 text-primary';
    }
  };

  const getTypeIcon = (type: LedgerEntry['type']) => {
    switch (type) {
      case 'transaction': return <Zap className="w-3 h-3" />;
      case 'decision': return <Shield className="w-3 h-3" />;
      case 'audit': return <Database className="w-3 h-3" />;
      case 'system': return <Link className="w-3 h-3" />;
    }
  };

  return (
    <Card className="glass-effect border-primary/30 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              rotateY: [0, 360]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-lg bg-gradient-quantum flex items-center justify-center"
          >
            <Link className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-orbitron font-bold text-foreground">
              MSR Blockchain
            </h3>
            <p className="text-sm text-muted-foreground">Immutable Ledger</p>
          </div>
        </div>
        
        <Badge className="bg-resonance/20 text-resonance">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {stats.chainHealth}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-center">
          <Hash className="w-5 h-5 mx-auto mb-1 text-accent" />
          <p className="text-lg font-bold text-foreground">{stats.totalBlocks.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Blocks</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-center">
          <Shield className="w-5 h-5 mx-auto mb-1 text-resonance" />
          <p className="text-lg font-bold text-foreground">{stats.verifiedRate}%</p>
          <p className="text-xs text-muted-foreground">Verified</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-secondary" />
          <p className="text-lg font-bold text-foreground">2s</p>
          <p className="text-xs text-muted-foreground">Block Time</p>
        </div>
      </div>

      {/* Chain Visualization */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Chain Status</h4>
        <div className="flex items-center gap-1 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-4 h-8 rounded bg-gradient-to-b from-accent to-primary opacity-80"
            />
          ))}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex-shrink-0 w-4 h-8 rounded bg-gradient-to-b from-energy to-accent"
          />
        </div>
      </div>

      {/* Recent Entries */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Entries</h4>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-accent/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(entry.type)}>
                      {getTypeIcon(entry.type)}
                      <span className="ml-1">{entry.type}</span>
                    </Badge>
                    {entry.verified && (
                      <CheckCircle2 className="w-4 h-4 text-resonance" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-foreground mb-1">{entry.payload}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Hash className="w-3 h-3" />
                  <span>{entry.hash}</span>
                  <ExternalLink className="w-3 h-3 ml-auto cursor-pointer hover:text-accent" />
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

export default MSRLedger;

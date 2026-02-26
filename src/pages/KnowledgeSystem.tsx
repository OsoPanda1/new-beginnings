/**
 * 🧬 Página de visualización del Knowledge System
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKnowledgeRepository } from '@/hooks/useKnowledgeCell';
import { 
  Brain, Box, Sparkles, Shield, Volume2, Database, 
  Activity, TrendingUp, CheckCircle, AlertCircle 
} from 'lucide-react';
import { CellType } from '@/core/knowledge/KnowledgeCell.types';

const cellTypeIcons: Record<CellType, any> = {
  'Render3D': Box,
  'Render4D': Sparkles,
  'IA-ImmersiveFX': Brain,
  'QuantumChannel': Activity,
  'SensorMultiFX': TrendingUp,
  'APIIntegration': Database,
  'Analytics': TrendingUp,
  'UIControl': Activity,
  'SpatialLogic': Box,
  'AudioXR': Volume2,
  'EmotionalEngine': Brain,
  'SecurityLayer': Shield,
  'DataPersistence': Database
};

export default function KnowledgeSystem() {
  const { repo, getAllCells } = useKnowledgeRepository();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const cells = getAllCells();

  const selectedCellData = selectedCell ? repo.cells[selectedCell] : null;

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full glow-quantum mb-4">
            <Brain className="w-6 h-6 text-primary-glow animate-pulse" />
            <span className="font-orbitron font-bold text-lg">Knowledge System™</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-quantum">
            TAMV MD-X4™ Knowledge Cells
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Arquitectura modular de microservicios especializados y células de conocimiento IA
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cells</p>
                <p className="text-3xl font-orbitron font-bold text-primary-glow">
                  {repo.metadata.totalCells}
                </p>
              </div>
              <Database className="w-8 h-8 text-primary-glow" />
            </div>
          </Card>
          
          <Card className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-orbitron font-bold text-accent-glow">
                  {repo.metadata.activeCells}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-accent-glow" />
            </div>
          </Card>
          
          <Card className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Relations</p>
                <p className="text-3xl font-orbitron font-bold text-secondary-glow">
                  {repo.relations.length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-secondary-glow" />
            </div>
          </Card>
          
          <Card className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="text-3xl font-orbitron font-bold text-resonance">
                  {repo.metadata.version}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-resonance" />
            </div>
          </Card>
        </div>

        {/* Cells Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-orbitron font-bold text-gradient-dream mb-6">
              Knowledge Cells Registry
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cells.map((cell) => {
                const Icon = cellTypeIcons[cell.type] || Brain;
                const isSelected = selectedCell === cell.id;
                
                return (
                  <Card
                    key={cell.id}
                    onClick={() => setSelectedCell(cell.id)}
                    className={`
                      glass-effect p-6 cursor-pointer transition-all hover:scale-105
                      ${isSelected ? 'border-2 border-primary shadow-glow' : 'hover:shadow-cyber'}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-quantum">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-orbitron font-bold text-sm leading-tight">
                            {cell.name}
                          </h3>
                          <Badge 
                            className={
                              cell.status === 'active' 
                                ? 'bg-accent/20 text-accent-glow' 
                                : 'bg-muted/20 text-muted-foreground'
                            }
                          >
                            {cell.status}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {cell.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {cell.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            v{cell.version}
                          </Badge>
                        </div>
                        
                        {cell.performance && (
                          <div className="flex items-center gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Latency: </span>
                              <span className="text-secondary-glow font-bold">
                                {cell.performance.avgLatency}ms
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Success: </span>
                              <span className="text-accent-glow font-bold">
                                {cell.performance.successRate}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Cell Details */}
          <div>
            <h2 className="text-2xl font-orbitron font-bold text-gradient-gold mb-6">
              Cell Details
            </h2>
            
            {selectedCellData ? (
              <Card className="glass-effect p-6 space-y-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = cellTypeIcons[selectedCellData.type] || Brain;
                    return <Icon className="w-8 h-8 text-primary-glow" />;
                  })()}
                  <div>
                    <h3 className="font-orbitron font-bold">{selectedCellData.name}</h3>
                    <p className="text-xs text-muted-foreground">ID: {selectedCellData.id}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{selectedCellData.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Input Format</p>
                    <code className="text-xs bg-card-glass px-2 py-1 rounded">
                      {selectedCellData.inputFormat}
                    </code>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Output Format</p>
                    <code className="text-xs bg-card-glass px-2 py-1 rounded">
                      {selectedCellData.outputFormat}
                    </code>
                  </div>
                  
                  {selectedCellData.apiEndpoint && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">API Endpoint</p>
                      <code className="text-xs bg-card-glass px-2 py-1 rounded">
                        {selectedCellData.apiEndpoint}
                      </code>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">IA Specialization</p>
                    <p className="text-xs bg-card-glass p-2 rounded">
                      {selectedCellData.iaSpecializationPrompt}
                    </p>
                  </div>
                  
                  {selectedCellData.dependencies && selectedCellData.dependencies.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Dependencies</p>
                      <div className="space-y-1">
                        {selectedCellData.dependencies.map((depId) => (
                          <Badge key={depId} variant="outline" className="text-xs">
                            {depId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Test Cases</p>
                    <ul className="space-y-1">
                      {selectedCellData.testCases.map((test, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-accent-glow mt-0.5 flex-shrink-0" />
                          <span>{test}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-quantum">
                  Execute Cell
                </Button>
              </Card>
            ) : (
              <Card className="glass-effect p-6">
                <div className="text-center space-y-3">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Selecciona una Knowledge Cell para ver detalles
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

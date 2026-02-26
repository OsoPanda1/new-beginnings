/**
 * 🧬 TAMV MD-X4™ Knowledge Cell System
 * Arquitectura modular ultra-especializada para IA y microservicios
 */

export type CellType = 
  | 'Render3D' 
  | 'Render4D' 
  | 'IA-ImmersiveFX' 
  | 'QuantumChannel' 
  | 'SensorMultiFX' 
  | 'APIIntegration' 
  | 'Analytics' 
  | 'UIControl' 
  | 'SpatialLogic'
  | 'AudioXR'
  | 'EmotionalEngine'
  | 'SecurityLayer'
  | 'DataPersistence';

export interface KnowledgeCell {
  id: string;
  type: CellType;
  name: string;
  description: string;
  version: string;
  dependencies?: string[];
  inputFormat: string;
  outputFormat: string;
  iaSpecializationPrompt: string;
  apiEndpoint?: string;
  microserviceUrl?: string;
  testCases: string[];
  visualizationSample?: string;
  author: string;
  created: Date;
  updated: Date;
  status: 'active' | 'development' | 'deprecated';
  performance?: {
    avgLatency: number;
    successRate: number;
    lastOptimized: Date;
  };
}

export interface KnowledgeRepo {
  cells: Record<string, KnowledgeCell>;
  relations: Array<{
    from: string;
    to: string;
    relation: 'requires' | 'extends' | 'composes';
  }>;
  aiExpertiseProfile: string;
  metadata: {
    totalCells: number;
    activeCells: number;
    lastUpdate: Date;
    version: string;
  };
}

export interface CellExecutionContext {
  cellId: string;
  input: any;
  userId?: string;
  sessionId?: string;
  emotionalState?: Record<string, number>;
  sensorData?: Record<string, any>;
}

export interface CellExecutionResult {
  success: boolean;
  output: any;
  performance: {
    executionTime: number;
    resourceUsage: number;
  };
  logs?: string[];
  errors?: string[];
}

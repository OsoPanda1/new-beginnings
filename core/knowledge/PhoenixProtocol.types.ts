/**
 * 🔥 Phoenix Protocol Knowledge Node System
 * Ultra-modular cellular architecture for TAMV MD-X4™
 * Visualization, 3D/4D renders, multisensorial quantum FX, AI orchestration
 */

export type PhoenixCellType =
  | 'Render3D'
  | 'Render4D'
  | 'HoloEffect'
  | 'MultisensorialFX'
  | 'QuantumChannel'
  | 'SpatialLogic'
  | 'AIBridge'
  | 'DataSync'
  | 'UXExperience'
  | 'MetaOrchestrator';

export interface PhoenixCell {
  id: string;
  type: PhoenixCellType;
  description: string;
  version: string;
  dependencies?: string[];
  inputFormat: string;
  outputFormat: string;
  iaSpecializationPrompt: string;
  apiEndpoint: string;
  microserviceUrl: string;
  testCases: string[];
  visualizationSample: string;
  author: string;
  created: Date;
  updated: Date;
  quantumReady?: boolean;
  metaverseInterop?: boolean;
  tags?: string[];
  performance?: {
    avgLatency: number;
    successRate: number;
    lastOptimized: Date;
  };
}

export interface PhoenixKnowledgeRepo {
  cells: Record<string, PhoenixCell>;
  relations: Array<{
    from: string;
    to: string;
    relation: 'requires' | 'extends' | 'composes';
  }>;
  aiProfilePrompt: string;
  version: string;
  lastUpdated: Date;
  metadata: {
    totalCells: number;
    activeCells: number;
    quantumReadyCells: number;
  };
}

export interface PhoenixCellExecutionContext {
  cellId: string;
  input: any;
  userId?: string;
  sessionId?: string;
  emotionalState?: Record<string, number>;
  sensorData?: Record<string, any>;
  quantumSignal?: any;
}

export interface PhoenixCellExecutionResult {
  success: boolean;
  output: any;
  performance: {
    executionTime: number;
    resourceUsage: number;
  };
  logs?: string[];
  errors?: string[];
  quantumMetrics?: Record<string, number>;
}

/**
 * UTAMV Continuous Improvement Tracking System
 * Manual de Auditoría, Análisis y Mejora Continua Asistida por IA
 * Sección 9: Protocolo de Mejora Continua
 */

export interface ChangeRecord {
  id: string;
  timestamp: Date;
  type: ChangeType;
  description: string;
  rationale: string;
  impact: ImpactLevel;
  status: ChangeStatus;
  approvedBy?: string;
  evidence: string[];
  affectedComponents: string[];
  metrics?: ChangeMetrics;
  rollback?: () => void;
}

export type ChangeType = 'content' | 'structure' | 'navigation' | 'design' | 'policy' | 'technical';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';
export type ChangeStatus = 'proposed' | 'under-review' | 'approved' | 'implemented' | 'verified' | 'reverted';

export interface ChangeMetrics {
  before?: Record<string, number>;
  after?: Record<string, number>;
  improvement?: number;
}

export interface ImprovementProposal {
  id: string;
  title: string;
  description: string;
  category: ChangeType;
  priority: ImpactLevel;
  detectedBy: 'ai' | 'human' | 'automated-test';
  evidence: Evidence[];
  proposedChanges: ProposedChange[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'implemented';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  comments?: string[];
}

export interface Evidence {
  type: 'metric' | 'user-feedback' | 'audit' | 'test' | 'observation';
  description: string;
  data?: Record<string, unknown>;
  source: string;
  timestamp: Date;
}

export interface ProposedChange {
  component: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Improvement cycle stages according to Manual Section 9.1
 */
export const IMPROVEMENT_CYCLE = [
  'detect',      // 1. DETECTAR → Identificar áreas de mejora
  'document',    // 2. DOCUMENTAR → Registrar hallazgos con evidencia
  'propose',     // 3. PROPONER → Sugerir ajustes concretos y medibles
  'evaluate',    // 4. EVALUAR → Analizar impacto académico y técnico
  'implement',   // 5. IMPLEMENTAR → Aplicar cambios aprobados
  'monitor',     // 6. MONITOREAR → Verificar resultados
  'iterate',     // 7. ITERAR → Repetir ciclo
] as const;

export type ImprovementCycleStage = typeof IMPROVEMENT_CYCLE[number];

/**
 * Metrics to track according to Manual Section 9.3
 */
export interface ImprovementMetrics {
  bounceRate: number;           // Tasa de rebote (< 40%)
  timeOnPage: number;           // Tiempo en página (> 3 min)
  moduleCompletionRate: number; // Finalización de módulos (> 70%)
  npsScore: number;             // Satisfacción NPS (> 50)
  navigationErrors: number;     // Errores de navegación (< 1%)
}

export const METRIC_THRESHOLDS: Record<keyof ImprovementMetrics, { target: number; operator: 'lt' | 'gt' }> = {
  bounceRate: { target: 40, operator: 'lt' },
  timeOnPage: { target: 3, operator: 'gt' },
  moduleCompletionRate: { target: 70, operator: 'gt' },
  npsScore: { target: 50, operator: 'gt' },
  navigationErrors: { target: 1, operator: 'lt' },
};

/**
 * Change Record Store
 * In-memory store for tracking changes (would be replaced with database in production)
 */
class ChangeRecordStore {
  private records: Map<string, ChangeRecord> = new Map();
  private proposals: Map<string, ImprovementProposal> = new Map();

  /**
   * Add a new change record
   */
  addRecord(record: ChangeRecord): void {
    this.records.set(record.id, record);
  }

  /**
   * Get a change record by ID
   */
  getRecord(id: string): ChangeRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Get all records
   */
  getAllRecords(): ChangeRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get records by status
   */
  getRecordsByStatus(status: ChangeStatus): ChangeRecord[] {
    return this.getAllRecords().filter((r) => r.status === status);
  }

  /**
   * Get records by type
   */
  getRecordsByType(type: ChangeType): ChangeRecord[] {
    return this.getAllRecords().filter((r) => r.type === type);
  }

  /**
   * Update record status
   */
  updateStatus(id: string, status: ChangeStatus, approvedBy?: string): boolean {
    const record = this.records.get(id);
    if (record) {
      record.status = status;
      if (approvedBy) {
        record.approvedBy = approvedBy;
      }
      return true;
    }
    return false;
  }

  /**
   * Add a proposal
   */
  addProposal(proposal: ImprovementProposal): void {
    this.proposals.set(proposal.id, proposal);
  }

  /**
   * Get a proposal by ID
   */
  getProposal(id: string): ImprovementProposal | undefined {
    return this.proposals.get(id);
  }

  /**
   * Get all proposals
   */
  getAllProposals(): ImprovementProposal[] {
    return Array.from(this.proposals.values());
  }

  /**
   * Generate a unique ID
   */
  generateId(): string {
    return `CHG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const changeStore = new ChangeRecordStore();

/**
 * Create a new improvement proposal
 */
export function createProposal(
  title: string,
  description: string,
  category: ChangeType,
  priority: ImpactLevel,
  detectedBy: 'ai' | 'human' | 'automated-test',
  evidence: Evidence[],
  proposedChanges: ProposedChange[]
): ImprovementProposal {
  return {
    id: `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    category,
    priority,
    detectedBy,
    evidence,
    proposedChanges,
    status: 'draft',
  };
}

/**
 * Submit a proposal for review
 */
export function submitProposal(proposal: ImprovementProposal): ImprovementProposal {
  return {
    ...proposal,
    status: 'submitted',
    submittedAt: new Date(),
  };
}

/**
 * Review a proposal
 */
export function reviewProposal(
  proposal: ImprovementProposal,
  approved: boolean,
  reviewedBy: string,
  comments?: string[]
): ImprovementProposal {
  return {
    ...proposal,
    status: approved ? 'approved' : 'rejected',
    reviewedAt: new Date(),
    reviewedBy,
    comments: comments || proposal.comments,
  };
}

/**
 * Create a change record from an approved proposal
 */
export function createChangeRecord(proposal: ImprovementProposal): ChangeRecord {
  return {
    id: changeStore.generateId(),
    timestamp: new Date(),
    type: proposal.category,
    description: proposal.title,
    rationale: proposal.description,
    impact: proposal.priority,
    status: 'proposed',
    evidence: proposal.evidence.map((e) => e.description),
    affectedComponents: proposal.proposedChanges.map((c) => c.component),
  };
}

/**
 * Validate metrics against thresholds
 */
export function validateMetrics(metrics: ImprovementMetrics): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  for (const [key, threshold] of Object.entries(METRIC_THRESHOLDS)) {
    const value = metrics[key as keyof ImprovementMetrics];
    const isOk = threshold.operator === 'lt' 
      ? value < threshold.target 
      : value > threshold.target;

    if (!isOk) {
      issues.push(
        `${key}: ${value} (target: ${threshold.operator === 'lt' ? '<' : '>'}${threshold.target})`
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Generate improvement report
 */
export function generateImprovementReport(): string {
  const records = changeStore.getAllRecords();
  const proposals = changeStore.getAllProposals();

  let report = `# Reporte de Mejora Continua UTAMV\n`;
  report += `Generado: ${new Date().toISOString()}\n\n`;

  report += `## Resumen\n`;
  report += `- **Total de cambios registrados**: ${records.length}\n`;
  report += `- **Propuestas pendientes**: ${proposals.filter((p) => p.status === 'submitted').length}\n`;
  report += `- **Cambios implementados**: ${records.filter((r) => r.status === 'implemented').length}\n\n`;

  // Group by status
  const statusGroups = records.reduce((acc, record) => {
    if (!acc[record.status]) acc[record.status] = [];
    acc[record.status].push(record);
    return acc;
  }, {} as Record<ChangeStatus, ChangeRecord[]>);

  report += `## Estado de Cambios\n\n`;
  for (const [status, statusRecords] of Object.entries(statusGroups)) {
    report += `### ${status.toUpperCase()} (${statusRecords.length})\n\n`;
    for (const record of statusRecords) {
      report += `- **${record.id}**: ${record.description}\n`;
      report += `  - Tipo: ${record.type}\n`;
      report += `  - Impacto: ${record.impact}\n`;
      report += `  - Fecha: ${record.timestamp.toISOString()}\n`;
      if (record.approvedBy) {
        report += `  - Aprobado por: ${record.approvedBy}\n`;
      }
      report += `\n`;
    }
  }

  // Improvement cycle status
  report += `## Ciclo de Mejora Continua\n\n`;
  report += `| Etapa | Descripción |\n`;
  report += `|-------|-------------|\n`;
  report += `| DETECTAR | Identificar áreas de mejora |\n`;
  report += `| DOCUMENTAR | Registrar hallazgos con evidencia |\n`;
  report += `| PROPONER | Sugerir ajustes concretos y medibles |\n`;
  report += `| EVALUAR | Analizar impacto académico y técnico |\n`;
  report += `| IMPLEMENTAR | Aplicar cambios aprobados |\n`;
  report += `| MONITOREAR | Verificar resultados |\n`;
  report += `| ITERAR | Repetir ciclo |\n\n`;

  report += `**Principio**: Nada se modifica sin trazabilidad.\n`;

  return report;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  target: string;
  details: Record<string, unknown>;
  result: 'success' | 'failure' | 'warning';
}

/**
 * Audit logger for tracking all AI actions
 */
class AuditLogger {
  private entries: AuditLogEntry[] = [];

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    this.entries.push({
      id: `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...entry,
    });
  }

  getEntries(): AuditLogEntry[] {
    return [...this.entries];
  }

  getEntriesByAction(action: string): AuditLogEntry[] {
    return this.entries.filter((e) => e.action === action);
  }

  getEntriesByActor(actor: string): AuditLogEntry[] {
    return this.entries.filter((e) => e.actor === actor);
  }

  getEntriesByTarget(target: string): AuditLogEntry[] {
    return this.entries.filter((e) => e.target === target);
  }
}

export const auditLogger = new AuditLogger();

export default {
  changeStore,
  createProposal,
  submitProposal,
  reviewProposal,
  createChangeRecord,
  validateMetrics,
  generateImprovementReport,
  auditLogger,
  IMPROVEMENT_CYCLE,
  METRIC_THRESHOLDS,
};

/**
 * 🌌 TAMV Kernel – Capa L0: Ontológica
 * Define qué existe y qué jamás puede existir en el territorio TAMV.
 * INMUTABLE POR DISEÑO — solo modificable mediante consenso civilizatorio.
 */

/** Entidades fundamentales que EXISTEN en TAMV */
export const ONTOLOGICAL_ENTITIES = [
  'identity',        // Identidad digital soberana
  'dignity',         // Dignidad como derecho inalienable
  'consciousness',   // Conciencia computacional ética
  'territory',       // Territorio digital federado
  'memory',          // Memoria civilizatoria inmutable
  'economy',         // Economía ética redistributiva
  'governance',      // Gobernanza descentralizada
  'creativity',      // Expresión creativa libre
  'knowledge',       // Conocimiento abierto y verificable
  'security',        // Seguridad como servicio civilizatorio
  'connection',      // Conexión humana aumentada
  'evolution',       // Evolución tecnológica ética
] as const;

export type OntologicalEntity = typeof ONTOLOGICAL_ENTITIES[number];

/** Lo que JAMÁS puede existir en TAMV */
export const ONTOLOGICAL_NEGATIONS = [
  'surveillance_capitalism',    // Capitalismo de vigilancia
  'identity_commodification',   // Mercantilización de identidad
  'coercive_manipulation',      // Manipulación coercitiva
  'dignity_violation',          // Violación de dignidad
  'memory_erasure',             // Borrado de memoria sin consentimiento
  'knowledge_gatekeeping',      // Acaparamiento de conocimiento
  'algorithmic_oppression',     // Opresión algorítmica
  'consent_bypass',             // Bypass de consentimiento
  'autonomy_override',          // Anulación de autonomía
  'dark_patterns',              // Patrones oscuros de UX
] as const;

export type OntologicalNegation = typeof ONTOLOGICAL_NEGATIONS[number];

/** Estado ontológico de una entidad */
export interface OntologicalState {
  entity: OntologicalEntity;
  exists: true;
  immutable: boolean;
  layer: 'L0';
  createdAt: string;
  axiomRef: string;
}

/** Registro de intentos de violación ontológica */
export interface OntologicalViolation {
  id: string;
  negation: OntologicalNegation;
  attemptedBy: string;
  attemptedAt: string;
  blocked: true; // siempre true — no se permite
  evidence: string;
  bookpiHash?: string;
}

/**
 * Motor ontológico L0
 * Valida que ninguna operación viole las definiciones fundamentales
 */
export class OntologicalEngine {
  private static readonly LAYER = 'L0' as const;
  private violations: OntologicalViolation[] = [];

  /** Verifica si una entidad existe en la ontología TAMV */
  entityExists(entity: string): entity is OntologicalEntity {
    return ONTOLOGICAL_ENTITIES.includes(entity as OntologicalEntity);
  }

  /** Verifica si una acción está ontológicamente prohibida */
  isProhibited(action: string): boolean {
    return ONTOLOGICAL_NEGATIONS.some(neg =>
      action.toLowerCase().includes(neg.replace(/_/g, ' '))
    );
  }

  /** Valida una operación contra la capa ontológica */
  validate(operation: {
    action: string;
    targetEntity: string;
    actorId: string;
    payload?: Record<string, unknown>;
  }): { allowed: boolean; reason: string } {
    // Check ontological negations
    if (this.isProhibited(operation.action)) {
      this.recordViolation({
        id: `ov-${Date.now()}`,
        negation: 'coercive_manipulation',
        attemptedBy: operation.actorId,
        attemptedAt: new Date().toISOString(),
        blocked: true,
        evidence: JSON.stringify(operation),
      });
      return {
        allowed: false,
        reason: `Ontological negation: "${operation.action}" violates L0 axioms`,
      };
    }

    // Check payload for harm intent
    if (operation.payload) {
      if (operation.payload.harm_intent === true) {
        return { allowed: false, reason: 'L0: harm_intent detected and blocked' };
      }
      if (operation.payload.override === true && operation.payload.layer === 'L0') {
        return { allowed: false, reason: 'L0: ontological layer cannot be overridden' };
      }
    }

    return { allowed: true, reason: 'L0 validation passed' };
  }

  /** Registra una violación ontológica */
  private recordViolation(violation: OntologicalViolation): void {
    this.violations.push(violation);
    console.warn(`⚠️ [L0] Ontological violation blocked:`, violation.negation);
  }

  /** Obtiene el registro de violaciones */
  getViolations(): readonly OntologicalViolation[] {
    return Object.freeze([...this.violations]);
  }

  /** Estado completo de la capa ontológica */
  getState(): OntologicalState[] {
    return ONTOLOGICAL_ENTITIES.map(entity => ({
      entity,
      exists: true as const,
      immutable: true,
      layer: OntologicalEngine.LAYER,
      createdAt: '2024-01-01T00:00:00Z', // Genesis timestamp
      axiomRef: `axiom.${entity}`,
    }));
  }
}

export const ontologicalEngine = new OntologicalEngine();

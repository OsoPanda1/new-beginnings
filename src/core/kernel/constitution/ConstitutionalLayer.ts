/**
 * 📜 TAMV Kernel – Capa L1: Constitucional
 * Derechos, deberes, soberanía y mecanismos de enmienda.
 * Solo modificable mediante proceso constitucional con consenso civilizatorio.
 */

import { OntologicalEntity } from '../ontology/OntologicalLayer';

/** Derecho digital fundamental */
export interface DigitalRight {
  id: string;
  name: string;
  description: string;
  category: RightCategory;
  scope: 'universal' | 'territorial' | 'contextual';
  enforceable: boolean;
  linkedEntity: OntologicalEntity;
  amendmentProcess: AmendmentRequirement;
}

export type RightCategory =
  | 'identity'
  | 'privacy'
  | 'expression'
  | 'economy'
  | 'governance'
  | 'security'
  | 'knowledge'
  | 'creativity';

/** Deber civilizatorio */
export interface CivilizatoryDuty {
  id: string;
  name: string;
  description: string;
  appliesTo: ('user' | 'guardian' | 'admin' | 'system' | 'ai')[];
  enforcementLevel: 'advisory' | 'mandatory' | 'constitutional';
}

/** Requisito para enmienda constitucional */
export interface AmendmentRequirement {
  type: 'simple_majority' | 'supermajority' | 'unanimous' | 'unamendable';
  quorumPercentage: number;
  cooldownDays: number;
  requiresBookPI: boolean;
}

/** Carta de Derechos Digitales TAMV */
export const DIGITAL_RIGHTS_CHARTER: DigitalRight[] = [
  {
    id: 'right.sovereignty',
    name: 'Soberanía Digital',
    description: 'Todo usuario es dueño absoluto de su identidad, datos y creaciones.',
    category: 'identity',
    scope: 'universal',
    enforceable: true,
    linkedEntity: 'identity',
    amendmentProcess: { type: 'unamendable', quorumPercentage: 100, cooldownDays: 0, requiresBookPI: true },
  },
  {
    id: 'right.dignity',
    name: 'Dignidad Inalienable',
    description: 'Ningún sistema, algoritmo o actor puede degradar la dignidad de un usuario.',
    category: 'identity',
    scope: 'universal',
    enforceable: true,
    linkedEntity: 'dignity',
    amendmentProcess: { type: 'unamendable', quorumPercentage: 100, cooldownDays: 0, requiresBookPI: true },
  },
  {
    id: 'right.privacy',
    name: 'Privacidad por Diseño',
    description: 'La privacidad es el estado por defecto, no una opción a activar.',
    category: 'privacy',
    scope: 'universal',
    enforceable: true,
    linkedEntity: 'security',
    amendmentProcess: { type: 'supermajority', quorumPercentage: 75, cooldownDays: 90, requiresBookPI: true },
  },
  {
    id: 'right.expression',
    name: 'Expresión Libre',
    description: 'Libertad de expresión dentro de los límites éticos de la constitución.',
    category: 'expression',
    scope: 'universal',
    enforceable: true,
    linkedEntity: 'creativity',
    amendmentProcess: { type: 'supermajority', quorumPercentage: 67, cooldownDays: 60, requiresBookPI: true },
  },
  {
    id: 'right.economic.participation',
    name: 'Participación Económica Justa',
    description: 'Acceso equitativo al sistema económico sin discriminación.',
    category: 'economy',
    scope: 'universal',
    enforceable: true,
    linkedEntity: 'economy',
    amendmentProcess: { type: 'supermajority', quorumPercentage: 67, cooldownDays: 60, requiresBookPI: true },
  },
  {
    id: 'right.governance',
    name: 'Voz y Voto',
    description: 'Todo usuario verificado tiene derecho a participar en la gobernanza.',
    category: 'governance',
    scope: 'territorial',
    enforceable: true,
    linkedEntity: 'governance',
    amendmentProcess: { type: 'supermajority', quorumPercentage: 75, cooldownDays: 90, requiresBookPI: true },
  },
  {
    id: 'right.knowledge',
    name: 'Acceso al Conocimiento',
    description: 'El conocimiento generado en TAMV es abierto y verificable.',
    category: 'knowledge',
    scope: 'universal',
    enforceable: true,
    linkedEntity: 'knowledge',
    amendmentProcess: { type: 'supermajority', quorumPercentage: 67, cooldownDays: 60, requiresBookPI: true },
  },
  {
    id: 'right.portability',
    name: 'Portabilidad de Datos',
    description: 'El usuario puede exportar toda su información en cualquier momento.',
    category: 'privacy',
    scope: 'universal',
    enforceable: true,
    linkedEntity: 'memory',
    amendmentProcess: { type: 'unamendable', quorumPercentage: 100, cooldownDays: 0, requiresBookPI: true },
  },
];

/** Deberes Civilizatorios */
export const CIVILIZATORY_DUTIES: CivilizatoryDuty[] = [
  {
    id: 'duty.respect',
    name: 'Respeto a la Dignidad',
    description: 'Todo actor debe respetar la dignidad de los demás.',
    appliesTo: ['user', 'guardian', 'admin', 'system', 'ai'],
    enforcementLevel: 'constitutional',
  },
  {
    id: 'duty.transparency',
    name: 'Transparencia',
    description: 'Las decisiones algorítmicas deben ser explicables.',
    appliesTo: ['system', 'ai', 'admin'],
    enforcementLevel: 'mandatory',
  },
  {
    id: 'duty.stewardship',
    name: 'Custodia Responsable',
    description: 'Guardianes y admins actúan como custodios, no propietarios.',
    appliesTo: ['guardian', 'admin'],
    enforcementLevel: 'constitutional',
  },
  {
    id: 'duty.contribution',
    name: 'Contribución Positiva',
    description: 'Participar constructivamente en la comunidad.',
    appliesTo: ['user', 'guardian', 'admin'],
    enforcementLevel: 'advisory',
  },
  {
    id: 'duty.auditability',
    name: 'Auditabilidad',
    description: 'Toda acción crítica debe ser auditable via BookPI.',
    appliesTo: ['system', 'ai', 'admin', 'guardian'],
    enforcementLevel: 'mandatory',
  },
];

/**
 * Motor Constitucional L1
 */
export class ConstitutionalEngine {
  private static readonly LAYER = 'L1' as const;

  /** Verifica si un derecho puede ser enmendado */
  canAmend(rightId: string): { amendable: boolean; requirement?: AmendmentRequirement } {
    const right = DIGITAL_RIGHTS_CHARTER.find(r => r.id === rightId);
    if (!right) return { amendable: false };
    if (right.amendmentProcess.type === 'unamendable') {
      return { amendable: false };
    }
    return { amendable: true, requirement: right.amendmentProcess };
  }

  /** Valida una acción contra los deberes civilizatorios */
  validateDuty(actorRole: CivilizatoryDuty['appliesTo'][number], action: string): {
    compliant: boolean;
    violations: string[];
  } {
    const applicableDuties = CIVILIZATORY_DUTIES.filter(d => d.appliesTo.includes(actorRole));
    const violations: string[] = [];

    for (const duty of applicableDuties) {
      if (duty.enforcementLevel === 'constitutional' && action.includes('override')) {
        violations.push(`Constitutional duty "${duty.name}" violated`);
      }
    }

    return { compliant: violations.length === 0, violations };
  }

  /** Obtiene todos los derechos por categoría */
  getRightsByCategory(category: RightCategory): DigitalRight[] {
    return DIGITAL_RIGHTS_CHARTER.filter(r => r.category === category);
  }

  /** Obtiene derechos inalienables (unamendable) */
  getInalienableRights(): DigitalRight[] {
    return DIGITAL_RIGHTS_CHARTER.filter(r => r.amendmentProcess.type === 'unamendable');
  }

  /** Estado completo de la capa constitucional */
  getState() {
    return {
      layer: ConstitutionalEngine.LAYER,
      rights: DIGITAL_RIGHTS_CHARTER.length,
      duties: CIVILIZATORY_DUTIES.length,
      inalienableRights: this.getInalienableRights().length,
      timestamp: new Date().toISOString(),
    };
  }
}

export const constitutionalEngine = new ConstitutionalEngine();

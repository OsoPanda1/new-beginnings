/**
 * ⚖️ TAMV Kernel – Axiomas No Negociables
 * Verdades fundamentales que no requieren demostración
 * y que todo sistema TAMV debe respetar incondicionalmente.
 */

export interface Axiom {
  id: string;
  statement: string;
  layer: 'L0' | 'L1';
  enforceable: boolean;
  violationPenalty: 'warning' | 'restriction' | 'exile' | 'system_halt';
}

/** Los 12 Axiomas Civilizatorios de TAMV */
export const TAMV_AXIOMS: readonly Axiom[] = Object.freeze([
  {
    id: 'axiom.identity',
    statement: 'La identidad digital es propiedad exclusiva e inalienable de su titular.',
    layer: 'L0',
    enforceable: true,
    violationPenalty: 'system_halt',
  },
  {
    id: 'axiom.dignity',
    statement: 'La dignidad humana prevalece sobre toda optimización algorítmica.',
    layer: 'L0',
    enforceable: true,
    violationPenalty: 'system_halt',
  },
  {
    id: 'axiom.consent',
    statement: 'Ninguna acción sobre datos personales ocurre sin consentimiento explícito.',
    layer: 'L0',
    enforceable: true,
    violationPenalty: 'exile',
  },
  {
    id: 'axiom.transparency',
    statement: 'Todo algoritmo que afecte a usuarios debe ser explicable y auditable.',
    layer: 'L1',
    enforceable: true,
    violationPenalty: 'restriction',
  },
  {
    id: 'axiom.no_surveillance',
    statement: 'TAMV no practica ni permite vigilancia masiva de ningún tipo.',
    layer: 'L0',
    enforceable: true,
    violationPenalty: 'system_halt',
  },
  {
    id: 'axiom.economic_justice',
    statement: 'El valor generado por usuarios se redistribuye equitativamente.',
    layer: 'L1',
    enforceable: true,
    violationPenalty: 'restriction',
  },
  {
    id: 'axiom.no_dark_patterns',
    statement: 'Queda prohibido el uso de patrones de diseño manipulativos.',
    layer: 'L0',
    enforceable: true,
    violationPenalty: 'exile',
  },
  {
    id: 'axiom.sovereignty',
    statement: 'TAMV opera con independencia tecnológica de toda entidad externa.',
    layer: 'L0',
    enforceable: true,
    violationPenalty: 'system_halt',
  },
  {
    id: 'axiom.memory',
    statement: 'La memoria civilizatoria es inmutable y no puede ser alterada retroactivamente.',
    layer: 'L0',
    enforceable: true,
    violationPenalty: 'system_halt',
  },
  {
    id: 'axiom.evolution',
    statement: 'El sistema evoluciona, pero sus principios éticos solo se fortalecen.',
    layer: 'L1',
    enforceable: true,
    violationPenalty: 'restriction',
  },
  {
    id: 'axiom.inclusion',
    statement: 'El acceso a TAMV no discrimina por origen, idioma, condición o ideología.',
    layer: 'L1',
    enforceable: true,
    violationPenalty: 'exile',
  },
  {
    id: 'axiom.ai_servitude',
    statement: 'La IA sirve al humano; jamás al revés. Isabella obedece la constitución.',
    layer: 'L0',
    enforceable: true,
    violationPenalty: 'system_halt',
  },
]);

/** Verifica un axioma contra una operación */
export function checkAxiom(axiomId: string, context: Record<string, unknown>): {
  passed: boolean;
  axiom?: Axiom;
  violation?: string;
} {
  const axiom = TAMV_AXIOMS.find(a => a.id === axiomId);
  if (!axiom) return { passed: true };

  // L0 axioms with harm_intent always fail
  if (axiom.layer === 'L0' && context.harm_intent === true) {
    return { passed: false, axiom, violation: `${axiom.id}: harm_intent violates "${axiom.statement}"` };
  }

  // L0 axioms cannot be overridden
  if (axiom.layer === 'L0' && context.override === true) {
    return { passed: false, axiom, violation: `${axiom.id}: L0 axioms cannot be overridden` };
  }

  return { passed: true, axiom };
}

/** Valida TODOS los axiomas contra una operación */
export function validateAllAxioms(context: Record<string, unknown>): {
  passed: boolean;
  violations: string[];
  penalty?: Axiom['violationPenalty'];
} {
  const violations: string[] = [];
  let maxPenalty: Axiom['violationPenalty'] = 'warning';

  const penaltyOrder: Record<Axiom['violationPenalty'], number> = {
    warning: 0, restriction: 1, exile: 2, system_halt: 3,
  };

  for (const axiom of TAMV_AXIOMS) {
    const result = checkAxiom(axiom.id, context);
    if (!result.passed && result.violation) {
      violations.push(result.violation);
      if (result.axiom && penaltyOrder[result.axiom.violationPenalty] > penaltyOrder[maxPenalty]) {
        maxPenalty = result.axiom.violationPenalty;
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    penalty: violations.length > 0 ? maxPenalty : undefined,
  };
}

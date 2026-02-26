/**
 * 🧬 TAMV Kernel – Capas L0 & L1
 * Núcleo ontológico y constitucional inmutable
 */

// L0: Ontología
export { ontologicalEngine, ONTOLOGICAL_ENTITIES, ONTOLOGICAL_NEGATIONS } from './ontology/OntologicalLayer';
export type { OntologicalEntity, OntologicalNegation, OntologicalState, OntologicalViolation } from './ontology/OntologicalLayer';

// L1: Constitución
export { constitutionalEngine, DIGITAL_RIGHTS_CHARTER, CIVILIZATORY_DUTIES } from './constitution/ConstitutionalLayer';
export type { DigitalRight, CivilizatoryDuty, AmendmentRequirement, RightCategory } from './constitution/ConstitutionalLayer';

// Axiomas
export { TAMV_AXIOMS, checkAxiom, validateAllAxioms } from './axioms/Axioms';
export type { Axiom } from './axioms/Axioms';

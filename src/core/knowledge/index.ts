/**
 * 🧬 TAMV MD-X4™ Knowledge System
 * Punto de entrada unificado: Knowledge Cells + Phoenix Protocol
 */

export * from './KnowledgeCell.types';
export * from './KnowledgeRepository';
export { knowledgeRepo } from './KnowledgeRepository';

// Phoenix Protocol
export * from './PhoenixProtocol.types';
export * from './PhoenixProtocol.repository';
export { phoenixRepo as phoenixKnowledgeRepo } from './PhoenixProtocol.repository';

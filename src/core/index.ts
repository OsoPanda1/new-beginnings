/**
 * 🎯 TAMV MD-X4™ Core Modules
 * Unified export point for all core systems
 * 7-Layer Federated Architecture with Quantum & 4D Rendering
 */

// Orchestration
export * from './orchestrator/SystemOrchestrator';
export { systemOrchestrator } from './orchestrator/SystemOrchestrator';

// Quantum Computing
export * from './quantum/QuantumAPI';
export { quantumAPI } from './quantum/QuantumAPI';
export * from './quantum/QuantumCircuit';
export { QuantumCircuit, QuantumCircuits } from './quantum/QuantumCircuit';

// 4D Rendering
export * from './render4d/HyperRender4D';
export { hyperRender4D } from './render4d/HyperRender4D';

// Federation Architecture
export * from './federation/FederatedArchitecture';
export { federatedArchitecture, LAYER_CAPABILITIES } from './federation/FederatedArchitecture';

// Emotional Intelligence
export * from './emotion/EmotionBI';
export { emotionBI } from './emotion/EmotionBI';

// Sensor Integration
export * from './sensors/SensorHub';
export { sensorHub } from './sensors/SensorHub';

// Documentation Generation
export * from './autodoc/AutoDoc';
export { autoDoc } from './autodoc/AutoDoc';

// Security
export * from './security/SecurityLayer';
export { securityLayer } from './security/SecurityLayer';

// Knowledge System
export * from './knowledge';

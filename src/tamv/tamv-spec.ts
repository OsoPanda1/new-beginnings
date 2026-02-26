/**
 * 🧬 TAMV DM-X7™ API Specification
 * 160 endpoints across 13 domains
 */

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type TamvDomain =
  | 'auth' | 'identity' | 'security' | 'economy' | 'xr'
  | 'quantum' | 'governance' | 'utamv' | 'bookpi'
  | 'kernel' | 'ops' | 'social' | 'devtools';

export interface TamvOperationSpec {
  id: string;
  domain: TamvDomain;
  method: HttpMethod;
  path: string;
  authRequired: boolean;
  roles?: string[];
  description: string;
}

const op = (o: TamvOperationSpec): TamvOperationSpec => o;

export const tamvSpec: Record<string, TamvOperationSpec> = {
  // ── AUTH (10) ──
  'auth.genesis': op({ id: 'auth.genesis', domain: 'auth', method: 'POST', path: '/v7/auth/genesis', authRequired: false, description: 'Registro inicial de identidad TAMV (ID-NVIDA).' }),
  'auth.login': op({ id: 'auth.login', domain: 'auth', method: 'POST', path: '/v7/auth/login', authRequired: false, description: 'Inicio de sesión clásico + PQC.' }),
  'auth.logout': op({ id: 'auth.logout', domain: 'auth', method: 'POST', path: '/v7/auth/logout', authRequired: true, description: 'Cierra sesión activa.' }),
  'auth.refresh': op({ id: 'auth.refresh', domain: 'auth', method: 'POST', path: '/v7/auth/refresh', authRequired: false, description: 'Renueva token de acceso.' }),
  'auth.pqcHandshake': op({ id: 'auth.pqcHandshake', domain: 'auth', method: 'POST', path: '/v7/auth/pqc/handshake', authRequired: true, description: 'Negociación PQC Kyber/Dilithium.' }),
  'auth.device.register': op({ id: 'auth.device.register', domain: 'auth', method: 'POST', path: '/v7/auth/device/register', authRequired: true, description: 'Registra dispositivo de confianza.' }),
  'auth.device.list': op({ id: 'auth.device.list', domain: 'auth', method: 'GET', path: '/v7/auth/device/list', authRequired: true, description: 'Lista dispositivos confiables.' }),
  'auth.device.revoke': op({ id: 'auth.device.revoke', domain: 'auth', method: 'DELETE', path: '/v7/auth/device/revoke', authRequired: true, description: 'Revoca dispositivo.' }),
  'auth.session.list': op({ id: 'auth.session.list', domain: 'auth', method: 'GET', path: '/v7/auth/session/list', authRequired: true, description: 'Lista sesiones activas.' }),
  'auth.session.terminate': op({ id: 'auth.session.terminate', domain: 'auth', method: 'POST', path: '/v7/auth/session/terminate', authRequired: true, description: 'Termina sesión específica.' }),

  // ── IDENTITY (12) ──
  'identity.profile.get': op({ id: 'identity.profile.get', domain: 'identity', method: 'GET', path: '/v7/identity/profile', authRequired: true, description: 'Perfil completo del usuario.' }),
  'identity.profile.update': op({ id: 'identity.profile.update', domain: 'identity', method: 'PATCH', path: '/v7/identity/profile', authRequired: true, description: 'Actualiza perfil.' }),
  'identity.dignity.pulse': op({ id: 'identity.dignity.pulse', domain: 'identity', method: 'GET', path: '/v7/identity/dignity-pulse', authRequired: true, description: 'Dignity Score dinámico.' }),
  'identity.roles.list': op({ id: 'identity.roles.list', domain: 'identity', method: 'GET', path: '/v7/identity/roles', authRequired: true, description: 'Roles del usuario.' }),
  'identity.role.grant': op({ id: 'identity.role.grant', domain: 'identity', method: 'POST', path: '/v7/identity/role/grant', authRequired: true, roles: ['admin', 'guardian'], description: 'Concede rol.' }),
  'identity.role.revoke': op({ id: 'identity.role.revoke', domain: 'identity', method: 'POST', path: '/v7/identity/role/revoke', authRequired: true, roles: ['admin', 'guardian'], description: 'Revoca rol.' }),
  'identity.sovereign.transfer': op({ id: 'identity.sovereign.transfer', domain: 'identity', method: 'POST', path: '/v7/identity/sovereign-transfer', authRequired: true, description: 'Migra identidad entre nodos.' }),
  'identity.history': op({ id: 'identity.history', domain: 'identity', method: 'GET', path: '/v7/identity/history', authRequired: true, description: 'Historial de identidad.' }),
  'identity.lock': op({ id: 'identity.lock', domain: 'identity', method: 'POST', path: '/v7/identity/lock', authRequired: true, roles: ['admin', 'guardian'], description: 'Bloquea identidad.' }),
  'identity.unlock': op({ id: 'identity.unlock', domain: 'identity', method: 'POST', path: '/v7/identity/unlock', authRequired: true, roles: ['admin', 'guardian'], description: 'Desbloquea identidad.' }),
  'identity.trust.metrics': op({ id: 'identity.trust.metrics', domain: 'identity', method: 'GET', path: '/v7/identity/trust-metrics', authRequired: true, description: 'Métricas de confianza.' }),
  'identity.devices': op({ id: 'identity.devices', domain: 'identity', method: 'GET', path: '/v7/identity/devices', authRequired: true, description: 'Dispositivos de identidad.' }),

  // ── SECURITY / SENTINEL (12) ──
  'security.threat.map': op({ id: 'security.threat.map', domain: 'security', method: 'GET', path: '/v7/sentinel/horus/threat-map', authRequired: true, roles: ['guardian', 'admin'], description: 'Mapa global de amenazas.' }),
  'security.alerts': op({ id: 'security.alerts', domain: 'security', method: 'GET', path: '/v7/sentinel/horus/alerts', authRequired: true, roles: ['guardian', 'admin'], description: 'Alertas activas.' }),
  'security.anubis.purge': op({ id: 'security.anubis.purge', domain: 'security', method: 'POST', path: '/v7/sentinel/anubis/purge', authRequired: true, roles: ['guardian', 'admin'], description: 'Exilio de actor malicioso.' }),
  'security.anubis.flag': op({ id: 'security.anubis.flag', domain: 'security', method: 'POST', path: '/v7/sentinel/anubis/flag', authRequired: true, description: 'Marca actor sospechoso.' }),
  'security.osiris.restore': op({ id: 'security.osiris.restore', domain: 'security', method: 'POST', path: '/v7/sentinel/osiris/restore', authRequired: true, roles: ['guardian', 'admin'], description: 'Restauración de cuenta.' }),
  'security.audit.logs': op({ id: 'security.audit.logs', domain: 'security', method: 'GET', path: '/v7/sentinel/audit/logs', authRequired: true, roles: ['guardian', 'admin'], description: 'Logs de auditoría.' }),
  'security.incident.report': op({ id: 'security.incident.report', domain: 'security', method: 'POST', path: '/v7/sentinel/incident/report', authRequired: true, description: 'Reporte de incidente.' }),
  'security.incident.get': op({ id: 'security.incident.get', domain: 'security', method: 'GET', path: '/v7/sentinel/incident/:id', authRequired: true, roles: ['guardian', 'admin'], description: 'Detalle de incidente.' }),
  'security.mode.set': op({ id: 'security.mode.set', domain: 'security', method: 'POST', path: '/v7/sentinel/mode/set', authRequired: true, roles: ['guardian', 'admin'], description: 'Modo civilizatorio.' }),
  'security.mode.get': op({ id: 'security.mode.get', domain: 'security', method: 'GET', path: '/v7/sentinel/mode', authRequired: true, description: 'Modo actual.' }),
  'security.ratelimit.state': op({ id: 'security.ratelimit.state', domain: 'security', method: 'GET', path: '/v7/sentinel/rate-limit/state', authRequired: true, roles: ['guardian', 'admin'], description: 'Estado rate limiting.' }),
  'security.firewall.rules': op({ id: 'security.firewall.rules', domain: 'security', method: 'GET', path: '/v7/sentinel/firewall/rules', authRequired: true, roles: ['guardian', 'admin'], description: 'Reglas firewall.' }),

  // ── ECONOMY (22) ──
  'economy.balance': op({ id: 'economy.balance', domain: 'economy', method: 'GET', path: '/v7/economy/balance', authRequired: true, description: 'Saldo del usuario.' }),
  'economy.ledger': op({ id: 'economy.ledger', domain: 'economy', method: 'GET', path: '/v7/economy/ledger', authRequired: true, description: 'Ledger de transacciones.' }),
  'economy.tcep.swap': op({ id: 'economy.tcep.swap', domain: 'economy', method: 'POST', path: '/v7/economy/tcep/atomic-swap', authRequired: true, description: 'Swap atómico TCEP.' }),
  'economy.transfer': op({ id: 'economy.transfer', domain: 'economy', method: 'POST', path: '/v7/economy/transfer', authRequired: true, description: 'Transferencia de valor.' }),
  'economy.lock': op({ id: 'economy.lock', domain: 'economy', method: 'POST', path: '/v7/economy/lock', authRequired: true, description: 'Bloqueo de fondos.' }),
  'economy.unlock': op({ id: 'economy.unlock', domain: 'economy', method: 'POST', path: '/v7/economy/unlock', authRequired: true, description: 'Desbloqueo de fondos.' }),
  'economy.positions': op({ id: 'economy.positions', domain: 'economy', method: 'GET', path: '/v7/economy/positions', authRequired: true, description: 'Posiciones económicas.' }),
  'economy.distribution.audit': op({ id: 'economy.distribution.audit', domain: 'economy', method: 'GET', path: '/v7/economy/distribution/audit', authRequired: true, roles: ['admin'], description: 'Auditoría de distribución.' }),
  'economy.fenix.ignite': op({ id: 'economy.fenix.ignite', domain: 'economy', method: 'POST', path: '/v7/economy/fenix/ignite', authRequired: true, description: 'Ignición Fénix.' }),
  'economy.fenix.regions': op({ id: 'economy.fenix.regions', domain: 'economy', method: 'GET', path: '/v7/economy/fenix/regions', authRequired: true, description: 'Regiones Fénix.' }),
  'economy.gifts.bless': op({ id: 'economy.gifts.bless', domain: 'economy', method: 'POST', path: '/v7/economy/gifts/mini-anubis/bless', authRequired: true, description: 'Bendición Mini-Anubis.' }),
  'economy.gifts.history': op({ id: 'economy.gifts.history', domain: 'economy', method: 'GET', path: '/v7/economy/gifts/history', authRequired: true, description: 'Historial de regalos.' }),
  'economy.lottery.pulse': op({ id: 'economy.lottery.pulse', domain: 'economy', method: 'GET', path: '/v7/economy/lottery/jackpot-pulse', authRequired: true, description: 'Pulso jackpot.' }),
  'economy.lottery.ticket': op({ id: 'economy.lottery.ticket', domain: 'economy', method: 'POST', path: '/v7/economy/lottery/ticket', authRequired: true, description: 'Compra ticket lotería.' }),
  'economy.lottery.tickets': op({ id: 'economy.lottery.tickets', domain: 'economy', method: 'GET', path: '/v7/economy/lottery/tickets', authRequired: true, description: 'Mis tickets.' }),
  'economy.fees.model': op({ id: 'economy.fees.model', domain: 'economy', method: 'GET', path: '/v7/economy/fees/model', authRequired: true, description: 'Modelo de comisiones.' }),
  'economy.stats.velocity': op({ id: 'economy.stats.velocity', domain: 'economy', method: 'GET', path: '/v7/economy/stats/velocity', authRequired: true, description: 'Velocidad económica.' }),
  'economy.stats.volume': op({ id: 'economy.stats.volume', domain: 'economy', method: 'GET', path: '/v7/economy/stats/volume', authRequired: true, description: 'Volumen económico.' }),
  'economy.compliance.reports': op({ id: 'economy.compliance.reports', domain: 'economy', method: 'GET', path: '/v7/economy/compliance/reports', authRequired: true, roles: ['admin'], description: 'Reportes compliance.' }),
  'economy.compliance.flag': op({ id: 'economy.compliance.flag', domain: 'economy', method: 'POST', path: '/v7/economy/compliance/flag', authRequired: true, description: 'Flag compliance.' }),
  'economy.policies.get': op({ id: 'economy.policies.get', domain: 'economy', method: 'GET', path: '/v7/economy/policies', authRequired: true, description: 'Políticas económicas.' }),
  'economy.policies.update': op({ id: 'economy.policies.update', domain: 'economy', method: 'PATCH', path: '/v7/economy/policies', authRequired: true, roles: ['admin'], description: 'Actualizar políticas.' }),

  // ── XR / DREAMSPACE (18) ──
  'xr.world.instantiate': op({ id: 'xr.world.instantiate', domain: 'xr', method: 'POST', path: '/v7/xr/world/instantiate-4d', authRequired: true, description: 'Instanciar mundo 4D.' }),
  'xr.world.list': op({ id: 'xr.world.list', domain: 'xr', method: 'GET', path: '/v7/xr/world/list', authRequired: true, description: 'Lista mundos.' }),
  'xr.world.get': op({ id: 'xr.world.get', domain: 'xr', method: 'GET', path: '/v7/xr/world/:id', authRequired: true, description: 'Detalle mundo.' }),
  'xr.world.state.update': op({ id: 'xr.world.state.update', domain: 'xr', method: 'POST', path: '/v7/xr/world/state/update', authRequired: true, description: 'Actualizar estado mundo.' }),
  'xr.world.state.get': op({ id: 'xr.world.state.get', domain: 'xr', method: 'GET', path: '/v7/xr/world/state', authRequired: true, description: 'Estado actual mundo.' }),
  'xr.physics.gravity.get': op({ id: 'xr.physics.gravity.get', domain: 'xr', method: 'GET', path: '/v7/xr/physics/gravity-config', authRequired: true, description: 'Config gravedad.' }),
  'xr.physics.gravity.update': op({ id: 'xr.physics.gravity.update', domain: 'xr', method: 'PATCH', path: '/v7/xr/physics/gravity-config', authRequired: true, description: 'Actualizar gravedad.' }),
  'dreamspace.object.mint': op({ id: 'dreamspace.object.mint', domain: 'xr', method: 'POST', path: '/v7/dreamspace/object/mint-3d', authRequired: true, description: 'Mint objeto 3D.' }),
  'dreamspace.object.get': op({ id: 'dreamspace.object.get', domain: 'xr', method: 'GET', path: '/v7/dreamspace/object/:id', authRequired: true, description: 'Detalle objeto.' }),
  'dreamspace.inventory': op({ id: 'dreamspace.inventory', domain: 'xr', method: 'GET', path: '/v7/dreamspace/inventory', authRequired: true, description: 'Inventario DreamSpace.' }),
  'dreamspace.reality.patch': op({ id: 'dreamspace.reality.patch', domain: 'xr', method: 'PATCH', path: '/v7/dreamspace/reality/patch', authRequired: true, description: 'Parche de realidad.' }),
  'dreamspace.reality.snapshots': op({ id: 'dreamspace.reality.snapshots', domain: 'xr', method: 'GET', path: '/v7/dreamspace/reality/snapshots', authRequired: true, description: 'Snapshots realidad.' }),
  'xr.session.open': op({ id: 'xr.session.open', domain: 'xr', method: 'POST', path: '/v7/xr/session/open', authRequired: true, description: 'Abrir sesión XR.' }),
  'xr.session.close': op({ id: 'xr.session.close', domain: 'xr', method: 'POST', path: '/v7/xr/session/close', authRequired: true, description: 'Cerrar sesión XR.' }),
  'xr.session.active': op({ id: 'xr.session.active', domain: 'xr', method: 'GET', path: '/v7/xr/session/active', authRequired: true, description: 'Sesiones activas.' }),
  'xr.presence.update': op({ id: 'xr.presence.update', domain: 'xr', method: 'POST', path: '/v7/xr/presence/update', authRequired: true, description: 'Actualizar presencia.' }),
  'xr.presence.get': op({ id: 'xr.presence.get', domain: 'xr', method: 'GET', path: '/v7/xr/presence', authRequired: true, description: 'Estado presencia.' }),
  'xr.telemetry': op({ id: 'xr.telemetry', domain: 'xr', method: 'GET', path: '/v7/xr/telemetry', authRequired: true, description: 'Telemetría XR.' }),

  // ── QUANTUM (14) ──
  'quantum.circuit.execute': op({ id: 'quantum.circuit.execute', domain: 'quantum', method: 'POST', path: '/v7/quantum/circuit/execute', authRequired: true, description: 'Ejecutar circuito cuántico.' }),
  'quantum.circuit.status': op({ id: 'quantum.circuit.status', domain: 'quantum', method: 'GET', path: '/v7/quantum/circuit/:id/status', authRequired: true, description: 'Estado circuito.' }),
  'quantum.circuit.result': op({ id: 'quantum.circuit.result', domain: 'quantum', method: 'GET', path: '/v7/quantum/circuit/:id/result', authRequired: true, description: 'Resultado circuito.' }),
  'quantum.vqe.ecoBalance': op({ id: 'quantum.vqe.ecoBalance', domain: 'quantum', method: 'POST', path: '/v7/quantum/vqe/eco-balance', authRequired: true, description: 'VQE eco-balance.' }),
  'quantum.qaoa.citySync': op({ id: 'quantum.qaoa.citySync', domain: 'quantum', method: 'POST', path: '/v7/quantum/qaoa/city-sync', authRequired: true, description: 'QAOA city sync.' }),
  'quantum.qrng.entropy': op({ id: 'quantum.qrng.entropy', domain: 'quantum', method: 'GET', path: '/v7/quantum/qrng/entropy-source', authRequired: true, description: 'Fuente entropía QRNG.' }),
  'quantum.providers': op({ id: 'quantum.providers', domain: 'quantum', method: 'GET', path: '/v7/quantum/providers', authRequired: true, description: 'Providers cuánticos.' }),
  'quantum.usage.stats': op({ id: 'quantum.usage.stats', domain: 'quantum', method: 'GET', path: '/v7/quantum/usage/stats', authRequired: true, description: 'Stats de uso.' }),
  'quantum.job.cancel': op({ id: 'quantum.job.cancel', domain: 'quantum', method: 'POST', path: '/v7/quantum/job/cancel', authRequired: true, description: 'Cancelar job.' }),
  'quantum.job.list': op({ id: 'quantum.job.list', domain: 'quantum', method: 'GET', path: '/v7/quantum/job/list', authRequired: true, description: 'Lista jobs.' }),
  'quantum.policy.set': op({ id: 'quantum.policy.set', domain: 'quantum', method: 'POST', path: '/v7/quantum/policy/set', authRequired: true, roles: ['admin'], description: 'Set política quantum.' }),
  'quantum.policy.get': op({ id: 'quantum.policy.get', domain: 'quantum', method: 'GET', path: '/v7/quantum/policy', authRequired: true, description: 'Política actual.' }),
  'quantum.health': op({ id: 'quantum.health', domain: 'quantum', method: 'GET', path: '/v7/quantum/health', authRequired: false, description: 'Health check.' }),
  'quantum.backends': op({ id: 'quantum.backends', domain: 'quantum', method: 'GET', path: '/v7/quantum/backends', authRequired: true, description: 'Backends disponibles.' }),

  // ── GOVERNANCE (20) ──
  'governance.proposal.submitMaster': op({ id: 'governance.proposal.submitMaster', domain: 'governance', method: 'POST', path: '/v7/governance/proposal/submit-master', authRequired: true, roles: ['guardian', 'admin'], description: 'Propuesta maestra.' }),
  'governance.proposal.submit': op({ id: 'governance.proposal.submit', domain: 'governance', method: 'POST', path: '/v7/governance/proposal/submit', authRequired: true, description: 'Propuesta estándar.' }),
  'governance.proposals.list': op({ id: 'governance.proposals.list', domain: 'governance', method: 'GET', path: '/v7/governance/proposals', authRequired: true, description: 'Lista propuestas.' }),
  'governance.proposal.get': op({ id: 'governance.proposal.get', domain: 'governance', method: 'GET', path: '/v7/governance/proposal/:id', authRequired: true, description: 'Detalle propuesta.' }),
  'governance.proposal.close': op({ id: 'governance.proposal.close', domain: 'governance', method: 'POST', path: '/v7/governance/proposal/close', authRequired: true, roles: ['guardian', 'admin'], description: 'Cerrar propuesta.' }),
  'governance.voting.cast': op({ id: 'governance.voting.cast', domain: 'governance', method: 'POST', path: '/v7/governance/voting/cast', authRequired: true, description: 'Emitir voto.' }),
  'governance.voting.quadratic': op({ id: 'governance.voting.quadratic', domain: 'governance', method: 'POST', path: '/v7/governance/voting/quadratic-power', authRequired: true, description: 'Poder cuadrático.' }),
  'governance.voting.result': op({ id: 'governance.voting.result', domain: 'governance', method: 'GET', path: '/v7/governance/voting/result/:id', authRequired: true, description: 'Resultado votación.' }),
  'governance.constitution.get': op({ id: 'governance.constitution.get', domain: 'governance', method: 'GET', path: '/v7/governance/constitution', authRequired: true, description: 'Constitución TAMV.' }),
  'governance.constitution.update': op({ id: 'governance.constitution.update', domain: 'governance', method: 'PATCH', path: '/v7/governance/constitution', authRequired: true, roles: ['admin'], description: 'Enmienda constitucional.' }),
  'governance.court.arbitration': op({ id: 'governance.court.arbitration', domain: 'governance', method: 'POST', path: '/v7/governance/court/arbitration', authRequired: true, description: 'Solicitar arbitraje.' }),
  'governance.court.case.get': op({ id: 'governance.court.case.get', domain: 'governance', method: 'GET', path: '/v7/governance/court/case/:id', authRequired: true, description: 'Detalle caso.' }),
  'governance.court.verdict': op({ id: 'governance.court.verdict', domain: 'governance', method: 'POST', path: '/v7/governance/court/verdict', authRequired: true, roles: ['guardian', 'admin'], description: 'Emitir veredicto.' }),
  'governance.blackhole.ban': op({ id: 'governance.blackhole.ban', domain: 'governance', method: 'POST', path: '/v7/governance/protocol/black-hole/ban', authRequired: true, roles: ['admin'], description: 'Ban Black Hole.' }),
  'governance.protocols': op({ id: 'governance.protocols', domain: 'governance', method: 'GET', path: '/v7/governance/protocols', authRequired: true, description: 'Protocolos activos.' }),
  'governance.roles': op({ id: 'governance.roles', domain: 'governance', method: 'GET', path: '/v7/governance/roles', authRequired: true, description: 'Roles gobernanza.' }),
  'governance.role.grant': op({ id: 'governance.role.grant', domain: 'governance', method: 'POST', path: '/v7/governance/role/grant', authRequired: true, roles: ['admin'], description: 'Conceder rol.' }),
  'governance.role.revoke': op({ id: 'governance.role.revoke', domain: 'governance', method: 'POST', path: '/v7/governance/role/revoke', authRequired: true, roles: ['admin'], description: 'Revocar rol.' }),
  'governance.stats.participation': op({ id: 'governance.stats.participation', domain: 'governance', method: 'GET', path: '/v7/governance/stats/participation', authRequired: true, description: 'Stats participación.' }),
  'governance.stats.trust': op({ id: 'governance.stats.trust', domain: 'governance', method: 'GET', path: '/v7/governance/stats/trust', authRequired: true, description: 'Stats confianza.' }),

  // ── UTAMV (10) ──
  'utamv.courses': op({ id: 'utamv.courses', domain: 'utamv', method: 'GET', path: '/v7/utamv/courses', authRequired: true, description: 'Lista cursos.' }),
  'utamv.course.get': op({ id: 'utamv.course.get', domain: 'utamv', method: 'GET', path: '/v7/utamv/course/:id', authRequired: true, description: 'Detalle curso.' }),
  'utamv.classroom.join': op({ id: 'utamv.classroom.join', domain: 'utamv', method: 'GET', path: '/v7/utamv/classroom/join-xr', authRequired: true, description: 'Aula XR.' }),
  'utamv.progress.update': op({ id: 'utamv.progress.update', domain: 'utamv', method: 'POST', path: '/v7/utamv/progress/update', authRequired: true, description: 'Actualizar progreso.' }),
  'utamv.progress.get': op({ id: 'utamv.progress.get', domain: 'utamv', method: 'GET', path: '/v7/utamv/progress', authRequired: true, description: 'Ver progreso.' }),
  'utamv.cert.proof': op({ id: 'utamv.cert.proof', domain: 'utamv', method: 'POST', path: '/v7/utamv/cert/proof-of-knowledge', authRequired: true, description: 'Proof of Knowledge.' }),
  'utamv.cert.get': op({ id: 'utamv.cert.get', domain: 'utamv', method: 'GET', path: '/v7/utamv/cert/:id', authRequired: true, description: 'Detalle certificado.' }),
  'utamv.stats': op({ id: 'utamv.stats', domain: 'utamv', method: 'GET', path: '/v7/utamv/stats', authRequired: true, description: 'Stats universidad.' }),
  'utamv.course.create': op({ id: 'utamv.course.create', domain: 'utamv', method: 'POST', path: '/v7/utamv/course/create', authRequired: true, roles: ['admin'], description: 'Crear curso.' }),
  'utamv.course.update': op({ id: 'utamv.course.update', domain: 'utamv', method: 'PATCH', path: '/v7/utamv/course/:id', authRequired: true, roles: ['admin'], description: 'Editar curso.' }),

  // ── BOOKPI (10) ──
  'bookpi.event.log': op({ id: 'bookpi.event.log', domain: 'bookpi', method: 'POST', path: '/v7/bookpi/event/log', authRequired: true, description: 'Registrar evento.' }),
  'bookpi.event.get': op({ id: 'bookpi.event.get', domain: 'bookpi', method: 'GET', path: '/v7/bookpi/event/:id', authRequired: true, description: 'Detalle evento.' }),
  'bookpi.ledger': op({ id: 'bookpi.ledger', domain: 'bookpi', method: 'GET', path: '/v7/bookpi/ledger', authRequired: true, description: 'Ledger BookPI.' }),
  'bookpi.ledger.witness': op({ id: 'bookpi.ledger.witness', domain: 'bookpi', method: 'GET', path: '/v7/bookpi/ledger/witness', authRequired: true, description: 'Testigo del ledger.' }),
  'bookpi.snapshot.create': op({ id: 'bookpi.snapshot.create', domain: 'bookpi', method: 'POST', path: '/v7/bookpi/snapshot/civilization', authRequired: true, description: 'Snapshot civilización.' }),
  'bookpi.snapshot.get': op({ id: 'bookpi.snapshot.get', domain: 'bookpi', method: 'GET', path: '/v7/bookpi/snapshot/:id', authRequired: true, description: 'Detalle snapshot.' }),
  'bookpi.snapshots': op({ id: 'bookpi.snapshots', domain: 'bookpi', method: 'GET', path: '/v7/bookpi/snapshots', authRequired: true, description: 'Lista snapshots.' }),
  'bookpi.merkle.root': op({ id: 'bookpi.merkle.root', domain: 'bookpi', method: 'GET', path: '/v7/bookpi/merkle/root', authRequired: true, description: 'Raíz Merkle.' }),
  'bookpi.audit.trail': op({ id: 'bookpi.audit.trail', domain: 'bookpi', method: 'GET', path: '/v7/bookpi/audit/trail', authRequired: true, description: 'Trail de auditoría.' }),
  'bookpi.stats': op({ id: 'bookpi.stats', domain: 'bookpi', method: 'GET', path: '/v7/bookpi/stats', authRequired: true, description: 'Stats BookPI.' }),

  // ── KERNEL / IA (12) ──
  'kernel.isabella.intent': op({ id: 'kernel.isabella.intent', domain: 'kernel', method: 'POST', path: '/v7/kernel/isabella/intent-matrix', authRequired: true, description: 'Matriz de intención.' }),
  'kernel.agent.deploy': op({ id: 'kernel.agent.deploy', domain: 'kernel', method: 'POST', path: '/v7/kernel/agent/deploy', authRequired: true, roles: ['admin'], description: 'Deploy agente.' }),
  'kernel.agent.stop': op({ id: 'kernel.agent.stop', domain: 'kernel', method: 'POST', path: '/v7/kernel/agent/stop', authRequired: true, roles: ['admin'], description: 'Stop agente.' }),
  'kernel.agent.get': op({ id: 'kernel.agent.get', domain: 'kernel', method: 'GET', path: '/v7/kernel/agent/:id', authRequired: true, description: 'Detalle agente.' }),
  'kernel.agents': op({ id: 'kernel.agents', domain: 'kernel', method: 'GET', path: '/v7/kernel/agents', authRequired: true, description: 'Lista agentes.' }),
  'kernel.isabella.shutdown': op({ id: 'kernel.isabella.shutdown', domain: 'kernel', method: 'POST', path: '/v7/kernel/isabella/shutdown-preventive', authRequired: true, roles: ['admin'], description: 'Shutdown preventivo.' }),
  'kernel.explainability.trace': op({ id: 'kernel.explainability.trace', domain: 'kernel', method: 'GET', path: '/v7/kernel/explainability/trace', authRequired: true, description: 'Traza explicabilidad.' }),
  'kernel.explainability.list': op({ id: 'kernel.explainability.list', domain: 'kernel', method: 'GET', path: '/v7/kernel/explainability/list', authRequired: true, description: 'Lista trazas.' }),
  'kernel.policy.set': op({ id: 'kernel.policy.set', domain: 'kernel', method: 'POST', path: '/v7/kernel/policy/set', authRequired: true, roles: ['admin'], description: 'Set política kernel.' }),
  'kernel.policy.get': op({ id: 'kernel.policy.get', domain: 'kernel', method: 'GET', path: '/v7/kernel/policy', authRequired: true, description: 'Política kernel.' }),
  'kernel.health': op({ id: 'kernel.health', domain: 'kernel', method: 'GET', path: '/v7/kernel/health', authRequired: false, description: 'Health kernel.' }),
  'kernel.telemetry': op({ id: 'kernel.telemetry', domain: 'kernel', method: 'GET', path: '/v7/kernel/telemetry', authRequired: true, roles: ['admin'], description: 'Telemetría kernel.' }),

  // ── OPS / IRON-GATE (10) ──
  'ops.health.index': op({ id: 'ops.health.index', domain: 'ops', method: 'GET', path: '/v7/ops/system/health-index', authRequired: true, roles: ['admin'], description: 'Índice de salud.' }),
  'ops.status': op({ id: 'ops.status', domain: 'ops', method: 'GET', path: '/v7/ops/system/status', authRequired: true, description: 'Estado sistema.' }),
  'ops.mcp.cleanup': op({ id: 'ops.mcp.cleanup', domain: 'ops', method: 'POST', path: '/v7/ops/mcp/cleanup-auto', authRequired: true, roles: ['admin'], description: 'Cleanup automático.' }),
  'ops.mcp.restart': op({ id: 'ops.mcp.restart', domain: 'ops', method: 'POST', path: '/v7/ops/mcp/restart-service', authRequired: true, roles: ['admin'], description: 'Restart servicio.' }),
  'ops.services': op({ id: 'ops.services', domain: 'ops', method: 'GET', path: '/v7/ops/services', authRequired: true, roles: ['admin'], description: 'Lista servicios.' }),
  'ops.scale.quantum': op({ id: 'ops.scale.quantum', domain: 'ops', method: 'POST', path: '/v7/ops/infrastructure/scale-quantum', authRequired: true, roles: ['admin'], description: 'Escalar quantum.' }),
  'ops.scale.api': op({ id: 'ops.scale.api', domain: 'ops', method: 'POST', path: '/v7/ops/infrastructure/scale-api', authRequired: true, roles: ['admin'], description: 'Escalar API.' }),
  'ops.logs': op({ id: 'ops.logs', domain: 'ops', method: 'GET', path: '/v7/ops/logs', authRequired: true, roles: ['admin'], description: 'Logs operacionales.' }),
  'ops.metrics': op({ id: 'ops.metrics', domain: 'ops', method: 'GET', path: '/v7/ops/metrics', authRequired: true, roles: ['admin'], description: 'Métricas.' }),
  'ops.mode': op({ id: 'ops.mode', domain: 'ops', method: 'GET', path: '/v7/ops/mode', authRequired: true, description: 'Modo operacional.' }),

  // ── SOCIAL (10) ──
  'social.post.create': op({ id: 'social.post.create', domain: 'social', method: 'POST', path: '/v7/social/post/create', authRequired: true, description: 'Crear post.' }),
  'social.post.get': op({ id: 'social.post.get', domain: 'social', method: 'GET', path: '/v7/social/post/:id', authRequired: true, description: 'Detalle post.' }),
  'social.feed': op({ id: 'social.feed', domain: 'social', method: 'GET', path: '/v7/social/feed', authRequired: true, description: 'Feed global.' }),
  'social.post.like': op({ id: 'social.post.like', domain: 'social', method: 'POST', path: '/v7/social/post/like', authRequired: true, description: 'Like post.' }),
  'social.post.report': op({ id: 'social.post.report', domain: 'social', method: 'POST', path: '/v7/social/post/report', authRequired: true, description: 'Reportar post.' }),
  'social.relation.follow': op({ id: 'social.relation.follow', domain: 'social', method: 'POST', path: '/v7/social/relation/follow', authRequired: true, description: 'Seguir usuario.' }),
  'social.relation.unfollow': op({ id: 'social.relation.unfollow', domain: 'social', method: 'POST', path: '/v7/social/relation/unfollow', authRequired: true, description: 'Dejar de seguir.' }),
  'social.relation.list': op({ id: 'social.relation.list', domain: 'social', method: 'GET', path: '/v7/social/relation/list', authRequired: true, description: 'Lista relaciones.' }),
  'social.notifications': op({ id: 'social.notifications', domain: 'social', method: 'GET', path: '/v7/social/notifications', authRequired: true, description: 'Notificaciones.' }),
  'social.message.send': op({ id: 'social.message.send', domain: 'social', method: 'POST', path: '/v7/social/message/send', authRequired: true, description: 'Enviar mensaje.' }),

  // ── DEVTOOLS (10) ──
  'dev.spec': op({ id: 'dev.spec', domain: 'devtools', method: 'GET', path: '/v7/dev/spec', authRequired: false, description: 'Spec completo API.' }),
  'dev.spec.domain': op({ id: 'dev.spec.domain', domain: 'devtools', method: 'GET', path: '/v7/dev/spec/domain/:name', authRequired: false, description: 'Spec por dominio.' }),
  'dev.version': op({ id: 'dev.version', domain: 'devtools', method: 'GET', path: '/v7/dev/version', authRequired: false, description: 'Versión API.' }),
  'dev.runtime.state': op({ id: 'dev.runtime.state', domain: 'devtools', method: 'GET', path: '/v7/dev/runtime/state', authRequired: true, roles: ['admin'], description: 'Estado runtime.' }),
  'dev.runtime.reload': op({ id: 'dev.runtime.reload', domain: 'devtools', method: 'POST', path: '/v7/dev/runtime/reload', authRequired: true, roles: ['admin'], description: 'Reload runtime.' }),
  'dev.featureFlags.get': op({ id: 'dev.featureFlags.get', domain: 'devtools', method: 'GET', path: '/v7/dev/feature-flags', authRequired: true, description: 'Feature flags.' }),
  'dev.featureFlags.update': op({ id: 'dev.featureFlags.update', domain: 'devtools', method: 'PATCH', path: '/v7/dev/feature-flags', authRequired: true, roles: ['admin'], description: 'Actualizar flags.' }),
  'dev.simulations': op({ id: 'dev.simulations', domain: 'devtools', method: 'GET', path: '/v7/dev/simulations', authRequired: true, description: 'Lista simulaciones.' }),
  'dev.simulations.run': op({ id: 'dev.simulations.run', domain: 'devtools', method: 'POST', path: '/v7/dev/simulations/run', authRequired: true, roles: ['admin'], description: 'Ejecutar simulación.' }),
  'dev.echo': op({ id: 'dev.echo', domain: 'devtools', method: 'GET', path: '/v7/dev/echo', authRequired: false, description: 'Echo de prueba.' }),
};

// Utilities
export const getEndpointsByDomain = (domain: TamvDomain) =>
  Object.values(tamvSpec).filter(op => op.domain === domain);

export const getEndpointCount = () => Object.keys(tamvSpec).length;

export const getDomainSummary = () => {
  const domains: TamvDomain[] = ['auth', 'identity', 'security', 'economy', 'xr', 'quantum', 'governance', 'utamv', 'bookpi', 'kernel', 'ops', 'social', 'devtools'];
  return domains.map(d => ({ domain: d, count: getEndpointsByDomain(d).length }));
};

/**
 * UTAMV Navigation Validator
 * Manual de Auditoría, Análisis y Mejora Continua Asistida por IA
 * Sección 4: Paginación, Navegación y Redireccionamiento
 */

export interface NavigationValidationResult {
  valid: boolean;
  issues: NavigationIssue[];
  timestamp: Date;
  stats: NavigationStats;
}

export interface NavigationIssue {
  type: 'broken-link' | 'redirect-chain' | 'circular-redirect' | 'orphan-page' | 'ambiguous-text' | 'missing-error-handling';
  severity: 'critical' | 'warning' | 'info';
  location: string;
  destination?: string;
  message: string;
  suggestion?: string;
}

export interface NavigationStats {
  totalLinks: number;
  validLinks: number;
  brokenLinks: number;
  redirects: number;
  orphanPages: number;
}

export interface RouteConfig {
  path: string;
  element?: string;
  redirect?: string;
  children?: RouteConfig[];
  guards?: string[];
  isPublic: boolean;
}

export interface LinkValidation {
  path: string;
  status: 'valid' | 'broken' | 'redirect' | 'orphan';
  destination?: string;
  lastChecked: Date;
  issues: string[];
}

/**
 * Known routes in the UTAMV Campus Online
 * Based on App.tsx route configuration
 */
export const KNOWN_ROUTES: RouteConfig[] = [
  // Public routes
  { path: '/', isPublic: true },
  { path: '/auth', isPublic: true },
  { path: '/programas', isPublic: true },
  { path: '/programas/:slug', isPublic: true },
  { path: '/docentes', isPublic: true },
  { path: '/investigacion', isPublic: true },
  { path: '/admisiones', isPublic: true },
  { path: '/ayuda', isPublic: true },
  { path: '/preguntas-frecuentes', isPublic: true },
  { path: '/verificar-certificado', isPublic: true },
  
  // Redirects
  { path: '/programa', redirect: '/programas/master-marketing-digital-2026', isPublic: true },
  { path: '/expertos', redirect: '/docentes', isPublic: true },
  { path: '/inscripcion', redirect: '/admisiones', isPublic: true },
  { path: '/certificacion', redirect: '/campus-virtual', isPublic: true },
  { path: '/dashboard', redirect: '/campus-virtual', isPublic: true },
  
  // Protected routes
  { path: '/campus-virtual', isPublic: false, guards: ['RequireAuth'] },
  { path: '/settings', isPublic: false, guards: ['RequireAuth'] },
  { path: '/modulos', isPublic: false, guards: ['RequireAuth', 'RequirePaid'] },
  { path: '/modulos/:id', isPublic: false, guards: ['RequireAuth', 'RequirePaid'] },
  { path: '/module/:moduleIndex', isPublic: false, guards: ['RequireAuth', 'RequirePaid'] },
  
  // 404
  { path: '*', isPublic: true },
];

/**
 * Ambiguous link texts that should be avoided
 * Based on Manual Section 4.2
 */
export const AMBIGUOUS_TEXTS = [
  'click aquí',
  'click aqui',
  'haz clic',
  'haz click',
  'aquí',
  'aquí.',
  'ver más',
  'ver mas',
  'más',
  'leer más',
  'continuar',
  'siguiente',
  'anterior',
  'este enlace',
  'este link',
  'link',
  'enlace',
];

/**
 * Recommended link texts for common actions
 */
export const RECOMMENDED_TEXTS: Record<string, string[]> = {
  'navigation': ['Ir a [página]', 'Explorar [sección]', 'Ver [contenido]'],
  'download': ['Descargar [recurso]', 'Obtener [documento]'],
  'learn-more': ['Conocer más sobre [tema]', 'Profundizar en [área]'],
  'action': ['Inscribirme al programa', 'Comenzar módulo', 'Ver certificado'],
};

/**
 * Validates a route path against known routes
 */
export function validateRoute(
  path: string,
  knownRoutes: RouteConfig[] = KNOWN_ROUTES
): LinkValidation {
  const issues: string[] = [];
  let status: LinkValidation['status'] = 'valid';
  let destination: string | undefined;

  // Normalize path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Check if it's a direct match
  const directMatch = knownRoutes.find((r) => r.path === normalizedPath);

  if (directMatch) {
    if (directMatch.redirect) {
      status = 'redirect';
      destination = directMatch.redirect;
    }
    return {
      path: normalizedPath,
      status,
      destination,
      lastChecked: new Date(),
      issues,
    };
  }

  // Check for dynamic routes (with params like :id, :slug)
  const dynamicMatch = knownRoutes.find((r) => {
    const routeParts = r.path.split('/');
    const pathParts = normalizedPath.split('/');
    
    if (routeParts.length !== pathParts.length) return false;
    
    return routeParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  });

  if (dynamicMatch) {
    if (dynamicMatch.redirect) {
      status = 'redirect';
      destination = dynamicMatch.redirect;
    }
    return {
      path: normalizedPath,
      status,
      destination,
      lastChecked: new Date(),
      issues,
    };
  }

  // Check if it matches a redirect pattern
  const redirectMatch = knownRoutes.find(
    (r) => r.redirect && r.path === normalizedPath
  );

  if (redirectMatch) {
    return {
      path: normalizedPath,
      status: 'redirect',
      destination: redirectMatch.redirect,
      lastChecked: new Date(),
      issues,
    };
  }

  // Not found - broken link
  status = 'broken';
  issues.push('Ruta no encontrada en configuración de la aplicación');

  return {
    path: normalizedPath,
    status,
    lastChecked: new Date(),
    issues,
  };
}

/**
 * Validates link text for clarity
 * Based on Manual Section 4.2
 */
export function validateLinkText(text: string): NavigationIssue | null {
  const normalizedText = text.toLowerCase().trim();

  for (const ambiguous of AMBIGUOUS_TEXTS) {
    if (normalizedText === ambiguous || normalizedText.endsWith(ambiguous)) {
      return {
        type: 'ambiguous-text',
        severity: 'warning',
        location: `Texto: "${text}"`,
        message: `Texto de enlace ambiguo: "${text}"`,
        suggestion: `Usar texto descriptivo que indique claramente la acción o destino. Ejemplos: ${RECOMMENDED_TEXTS['navigation'].join(', ')}`,
      };
    }
  }

  return null;
}

/**
 * Detects circular redirects
 * Based on Manual Section 4.3
 */
export function detectCircularRedirects(
  routes: RouteConfig[] = KNOWN_ROUTES
): NavigationIssue[] {
  const issues: NavigationIssue[] = [];
  const redirectMap = new Map<string, string>();

  // Build redirect map
  for (const route of routes) {
    if (route.redirect) {
      redirectMap.set(route.path, route.redirect);
    }
  }

  // Check for cycles
  for (const [start, _] of redirectMap) {
    const visited = new Set<string>();
    let current: string | undefined = start;

    while (current && !visited.has(current)) {
      visited.add(current);
      current = redirectMap.get(current);
    }

    if (current === start) {
      issues.push({
        type: 'circular-redirect',
        severity: 'critical',
        location: start,
        message: `Redirección circular detectada comenzando en ${start}`,
        suggestion: 'Romper el ciclo de redirecciones',
      });
    }
  }

  return issues;
}

/**
 * Detects redirect chains longer than 1 hop
 * Based on Manual Section 4.3
 */
export function detectRedirectChains(
  routes: RouteConfig[] = KNOWN_ROUTES
): NavigationIssue[] {
  const issues: NavigationIssue[] = [];
  const redirectMap = new Map<string, string>();

  // Build redirect map
  for (const route of routes) {
    if (route.redirect) {
      redirectMap.set(route.path, route.redirect);
    }
  }

  // Check chain lengths
  for (const [start, _] of redirectMap) {
    const path: string[] = [start];
    let current: string | undefined = start;

    while (current && redirectMap.has(current)) {
      current = redirectMap.get(current);
      if (current) {
        path.push(current);
      }
    }

    if (path.length > 2) {
      issues.push({
        type: 'redirect-chain',
        severity: 'warning',
        location: start,
        destination: path[path.length - 1],
        message: `Cadena de redirecciones de ${path.length - 1} saltos: ${path.join(' → ')}`,
        suggestion: 'Redirigir directamente al destino final',
      });
    }
  }

  return issues;
}

/**
 * Identifies orphan pages (pages with no incoming links)
 * Based on Manual Section 4.3
 */
export function detectOrphanPages(
  allLinks: Array<{ from: string; to: string }>,
  allPages: string[]
): NavigationIssue[] {
  const issues: NavigationIssue[] = [];
  const linkedPages = new Set(allLinks.map((l) => l.to));

  // Add entry points
  linkedPages.add('/');
  linkedPages.add('/auth');

  for (const page of allPages) {
    if (!linkedPages.has(page)) {
      issues.push({
        type: 'orphan-page',
        severity: 'warning',
        location: page,
        message: `Página sin enlaces entrantes: ${page}`,
        suggestion: 'Agregar enlaces a esta página desde otras páginas relevantes',
      });
    }
  }

  return issues;
}

/**
 * Validates button configuration
 * Based on Manual Section 4.2
 */
export interface ButtonConfig {
  text: string;
  action: 'navigate' | 'external' | 'download' | 'submit' | 'modal';
  destination?: string;
  ariaLabel?: string;
}

export function validateButton(button: ButtonConfig): NavigationIssue[] {
  const issues: NavigationIssue[] = [];

  // Check for clear action
  if (!button.text || button.text.trim().length === 0) {
    issues.push({
      type: 'ambiguous-text',
      severity: 'critical',
      location: 'Button sin texto',
      message: 'Botón sin texto descriptivo',
      suggestion: 'Agregar texto que describa claramente la acción',
    });
  } else {
    const textIssue = validateLinkText(button.text);
    if (textIssue) {
      issues.push(textIssue);
    }
  }

  // Check for valid destination
  if (button.action === 'navigate' && button.destination) {
    const routeValidation = validateRoute(button.destination);
    if (routeValidation.status === 'broken') {
      issues.push({
        type: 'broken-link',
        severity: 'critical',
        location: button.destination,
        message: `Botón "${button.text}" apunta a ruta inexistente: ${button.destination}`,
        suggestion: 'Corregir la ruta de destino',
      });
    }
  }

  // Check for accessibility
  if (!button.ariaLabel && button.action !== 'submit') {
    issues.push({
      type: 'missing-error-handling',
      severity: 'info',
      location: `Button: "${button.text}"`,
      message: 'Botón sin aria-label para accesibilidad',
      suggestion: 'Agregar aria-label descriptivo para lectores de pantalla',
    });
  }

  return issues;
}

/**
 * Validates pagination configuration
 * Based on Manual Section 4.1
 */
export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export function validatePagination(config: PaginationConfig): NavigationIssue[] {
  const issues: NavigationIssue[] = [];

  // Check for cognitive overload
  if (config.itemsPerPage > 20) {
    issues.push({
      type: 'ambiguous-text',
      severity: 'warning',
      location: 'Paginación',
      message: `Demasiados elementos por página (${config.itemsPerPage})`,
      suggestion: 'Reducir a máximo 20 elementos por página para evitar sobrecarga cognitiva',
    });
  }

  // Check for valid page number
  if (config.currentPage < 1 || config.currentPage > config.totalPages) {
    issues.push({
      type: 'broken-link',
      severity: 'critical',
      location: `Página ${config.currentPage}`,
      message: `Número de página inválido: ${config.currentPage} de ${config.totalPages}`,
      suggestion: 'Corregir el número de página actual',
    });
  }

  // Check for too many pages
  if (config.totalPages > 50) {
    issues.push({
      type: 'ambiguous-text',
      severity: 'info',
      location: 'Paginación',
      message: `Demasiadas páginas (${config.totalPages})`,
      suggestion: 'Considerar filtros o búsqueda para mejorar navegación',
    });
  }

  return issues;
}

/**
 * Generate a navigation audit report
 */
export function generateNavigationAuditReport(
  links: Array<{ from: string; to: string; text: string }>,
  pages: string[]
): string {
  const circularIssues = detectCircularRedirects();
  const chainIssues = detectRedirectChains();
  const orphanIssues = detectOrphanPages(
    links.map((l) => ({ from: l.from, to: l.to })),
    pages
  );

  const allIssues = [...circularIssues, ...chainIssues, ...orphanIssues];

  // Validate each link
  for (const link of links) {
    const routeValidation = validateRoute(link.to);
    if (routeValidation.status === 'broken') {
      allIssues.push({
        type: 'broken-link',
        severity: 'critical',
        location: link.from,
        destination: link.to,
        message: `Enlace roto desde ${link.from} a ${link.to}`,
        suggestion: 'Corregir o eliminar el enlace',
      });
    }

    const textIssue = validateLinkText(link.text);
    if (textIssue) {
      allIssues.push(textIssue);
    }
  }

  let report = `# Reporte de Auditoría de Navegación UTAMV\n`;
  report += `Generado: ${new Date().toISOString()}\n\n`;
  report += `## Estadísticas\n`;
  report += `- **Total de enlaces**: ${links.length}\n`;
  report += `- **Páginas analizadas**: ${pages.length}\n`;
  report += `- **Problemas detectados**: ${allIssues.length}\n\n`;

  const criticalCount = allIssues.filter((i) => i.severity === 'critical').length;
  const warningCount = allIssues.filter((i) => i.severity === 'warning').length;

  report += `- **Críticos**: ${criticalCount}\n`;
  report += `- **Advertencias**: ${warningCount}\n\n`;

  if (allIssues.length > 0) {
    report += `## Problemas Detectados\n\n`;

    const groupedByType = allIssues.reduce((acc, issue) => {
      if (!acc[issue.type]) acc[issue.type] = [];
      acc[issue.type].push(issue);
      return acc;
    }, {} as Record<string, NavigationIssue[]>);

    for (const [type, issues] of Object.entries(groupedByType)) {
      const icon = issues[0].severity === 'critical' ? '🔴' : issues[0].severity === 'warning' ? '🟡' : 'ℹ️';
      report += `### ${icon} ${type.replace(/-/g, ' ').toUpperCase()}\n\n`;

      for (const issue of issues) {
        report += `- **Ubicación**: \`${issue.location}\`\n`;
        if (issue.destination) {
          report += `  - **Destino**: \`${issue.destination}\`\n`;
        }
        report += `  - **Mensaje**: ${issue.message}\n`;
        if (issue.suggestion) {
          report += `  - **Sugerencia**: ${issue.suggestion}\n`;
        }
        report += `\n`;
      }
    }
  }

  report += `## Rutas Conocidas\n\n`;
  report += `### Públicas\n`;
  for (const route of KNOWN_ROUTES.filter((r) => r.isPublic && !r.redirect)) {
    report += `- \`${route.path}\`\n`;
  }
  report += `\n### Protegidas\n`;
  for (const route of KNOWN_ROUTES.filter((r) => !r.isPublic)) {
    report += `- \`${route.path}\` (${route.guards?.join(', ')})\n`;
  }
  report += `\n### Redirecciones\n`;
  for (const route of KNOWN_ROUTES.filter((r) => r.redirect)) {
    report += `- \`${route.path}\` → \`${route.redirect}\`\n`;
  }

  return report;
}

export default {
  validateRoute,
  validateLinkText,
  detectCircularRedirects,
  detectRedirectChains,
  detectOrphanPages,
  validateButton,
  validatePagination,
  generateNavigationAuditReport,
  KNOWN_ROUTES,
  AMBIGUOUS_TEXTS,
  RECOMMENDED_TEXTS,
};

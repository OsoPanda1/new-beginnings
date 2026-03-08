/**
 * UTAMV Academic Content Validator
 * Manual de Auditoría, Análisis y Mejora Continua Asistida por IA
 * Sección 5: Organización Académica del Contenido
 */

export interface AcademicValidationResult {
  valid: boolean;
  issues: AcademicIssue[];
  timestamp: Date;
  stats: AcademicStats;
}

export interface AcademicIssue {
  type: 'orphan-content' | 'missing-outcomes' | 'missing-context' | 'empty-module' | 'invalid-structure' | 'missing-prerequisites';
  severity: 'critical' | 'warning' | 'info';
  location: string;
  message: string;
  suggestion?: string;
}

export interface AcademicStats {
  totalPrograms: number;
  totalModules: number;
  totalSubjects: number;
  totalUnits: number;
  totalResources: number;
  orphanContent: number;
  missingOutcomes: number;
}

/**
 * Academic content hierarchy according to Manual Section 5.1
 */
export interface AcademicContent {
  id: string;
  type: 'program' | 'module' | 'subject' | 'unit' | 'resource';
  title: string;
  description: string;
  learningOutcomes?: string[];
  parent?: string;
  children?: string[];
  resources?: string[];
  prerequisites?: string[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    status: 'draft' | 'published' | 'archived';
    estimatedTime?: number; // in minutes
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}

/**
 * Module structure from data/modules.json
 */
export interface ModuleData {
  id: number;
  order_index: number;
  title: string;
  description: string;
  image_url: string;
  content_outline: string[];
  key_assets: string[];
}

/**
 * Content type classification according to Manual Section 6.3
 */
export type ContentType = 
  | 'peer-reviewed'      // Arbitrado externamente
  | 'internal-research'  // Investigación interna
  | 'educational'        // Material didáctico
  | 'opinion'            // Opinión o análisis
  | 'news'               // Noticia institucional
  | 'promotional';       // Contenido promocional

export interface ContentClassification {
  type: ContentType;
  disclaimer?: string;
  peerReviewed: boolean;
  requiresAttribution: boolean;
}

/**
 * Case study requirements according to Manual Section 5.4
 */
export interface CaseStudyRequirements {
  hasObjective: boolean;
  isContextualized: boolean;
  hasEthicalReflection: boolean;
  hasCriticalAnalysis: boolean;
  hasMultiplePerspectives: boolean;
  latinAmericanContext: boolean;
}

/**
 * Validates academic content structure
 */
export function validateAcademicContent(
  content: AcademicContent,
  allContent: AcademicContent[]
): AcademicIssue[] {
  const issues: AcademicIssue[] = [];

  // Check for required fields
  if (!content.title || content.title.trim().length === 0) {
    issues.push({
      type: 'invalid-structure',
      severity: 'critical',
      location: content.id,
      message: `Contenido sin título: ${content.id}`,
      suggestion: 'Agregar título descriptivo',
    });
  }

  if (!content.description || content.description.trim().length === 0) {
    issues.push({
      type: 'missing-context',
      severity: 'warning',
      location: content.id,
      message: `Contenido sin descripción: ${content.title || content.id}`,
      suggestion: 'Agregar descripción pedagógica que explique el propósito del contenido',
    });
  }

  // Check for learning outcomes (required for subjects and modules)
  if (content.type === 'subject' || content.type === 'module') {
    if (!content.learningOutcomes || content.learningOutcomes.length === 0) {
      issues.push({
        type: 'missing-outcomes',
        severity: 'critical',
        location: content.id,
        message: `${content.type} sin resultados de aprendizaje: ${content.title}`,
        suggestion: 'Definir al menos 3 resultados de aprendizaje medibles y específicos',
      });
    } else {
      // Validate learning outcomes quality
      for (const outcome of content.learningOutcomes) {
        if (!isValidLearningOutcome(outcome)) {
          issues.push({
            type: 'missing-outcomes',
            severity: 'warning',
            location: content.id,
            message: `Resultado de aprendizaje vago o no medible: "${outcome}"`,
            suggestion: 'Usar verbos de la taxonomía de Bloom (analizar, evaluar, crear, aplicar)',
          });
        }
      }
    }
  }

  // Check for orphan content (content without parent)
  if (content.type !== 'program') {
    if (!content.parent) {
      issues.push({
        type: 'orphan-content',
        severity: 'warning',
        location: content.id,
        message: `Contenido huérfano sin padre académico: ${content.title}`,
        suggestion: 'Asignar a un programa, módulo o materia padre',
      });
    } else {
      // Verify parent exists
      const parentExists = allContent.some((c) => c.id === content.parent);
      if (!parentExists) {
        issues.push({
          type: 'orphan-content',
          severity: 'critical',
          location: content.id,
          message: `Padre referenciado no existe: ${content.parent}`,
          suggestion: 'Corregir referencia al padre o crear el contenido padre',
        });
      }
    }
  }

  // Check for empty modules
  if (content.type === 'module' || content.type === 'subject') {
    if (!content.children || content.children.length === 0) {
      issues.push({
        type: 'empty-module',
        severity: 'warning',
        location: content.id,
        message: `${content.type} sin contenido hijo: ${content.title}`,
        suggestion: 'Agregar materias, unidades o recursos al contenido',
      });
    }
  }

  // Check for resources without context
  if (content.type === 'resource') {
    if (!content.description || content.description.length < 50) {
      issues.push({
        type: 'missing-context',
        severity: 'info',
        location: content.id,
        message: `Recurso con descripción insuficiente: ${content.title}`,
        suggestion: 'Agregar contexto pedagógico que explique cómo usar el recurso',
      });
    }
  }

  return issues;
}

/**
 * Validates if a learning outcome is properly formulated
 * Uses Bloom's taxonomy verbs
 */
export function isValidLearningOutcome(outcome: string): boolean {
  const bloomVerbs = [
    // Remember
    'define', 'describe', 'identify', 'list', 'recall', 'recognize', 'definir', 'describir', 'identificar', 'listar', 'reconocer',
    // Understand
    'explain', 'interpret', 'summarize', 'classify', 'compare', 'explicar', 'interpretar', 'resumir', 'clasificar', 'comparar',
    // Apply
    'apply', 'demonstrate', 'implement', 'execute', 'solve', 'aplicar', 'demostrar', 'implementar', 'ejecutar', 'resolver',
    // Analyze
    'analyze', 'differentiate', 'examine', 'investigate', 'categorize', 'analizar', 'diferenciar', 'examinar', 'investigar', 'categorizar',
    // Evaluate
    'evaluate', 'assess', 'critique', 'judge', 'validate', 'evaluar', 'criticar', 'juzgar', 'validar',
    // Create
    'create', 'design', 'develop', 'formulate', 'construct', 'crear', 'diseñar', 'desarrollar', 'formular', 'construir',
  ];

  const lowerOutcome = outcome.toLowerCase();
  return bloomVerbs.some((verb) => lowerOutcome.includes(verb));
}

/**
 * Validates module data from modules.json
 */
export function validateModuleData(module: ModuleData): AcademicIssue[] {
  const issues: AcademicIssue[] = [];

  if (!module.title || module.title.trim().length === 0) {
    issues.push({
      type: 'invalid-structure',
      severity: 'critical',
      location: `module-${module.id}`,
      message: `Módulo sin título: ID ${module.id}`,
      suggestion: 'Agregar título descriptivo al módulo',
    });
  }

  if (!module.description || module.description.trim().length === 0) {
    issues.push({
      type: 'missing-context',
      severity: 'warning',
      location: `module-${module.id}`,
      message: `Módulo sin descripción: ${module.title || module.id}`,
      suggestion: 'Agregar descripción que explique el propósito y alcance del módulo',
    });
  }

  if (!module.content_outline || module.content_outline.length === 0) {
    issues.push({
      type: 'empty-module',
      severity: 'warning',
      location: `module-${module.id}`,
      message: `Módulo sin outline de contenido: ${module.title}`,
      suggestion: 'Definir los temas principales del módulo',
    });
  }

  if (!module.key_assets || module.key_assets.length === 0) {
    issues.push({
      type: 'missing-context',
      severity: 'info',
      location: `module-${module.id}`,
      message: `Módulo sin recursos clave definidos: ${module.title}`,
      suggestion: 'Listar los recursos principales que los estudiantes obtendrán',
    });
  }

  return issues;
}

/**
 * Validates case study according to Manual Section 5.4
 */
export function validateCaseStudy(
  caseStudy: Partial<CaseStudyRequirements> & { title: string; id: string }
): AcademicIssue[] {
  const issues: AcademicIssue[] = [];

  if (!caseStudy.hasObjective) {
    issues.push({
      type: 'missing-context',
      severity: 'critical',
      location: caseStudy.id,
      message: `Caso de estudio sin objetivo formativo: ${caseStudy.title}`,
      suggestion: 'Definir claramente qué aprenderá el estudiante con este caso',
    });
  }

  if (!caseStudy.isContextualized) {
    issues.push({
      type: 'missing-context',
      severity: 'warning',
      location: caseStudy.id,
      message: `Caso de estudio sin contexto: ${caseStudy.title}`,
      suggestion: 'Proporcionar contexto relevante para la toma de decisiones',
    });
  }

  if (!caseStudy.hasEthicalReflection) {
    issues.push({
      type: 'missing-context',
      severity: 'warning',
      location: caseStudy.id,
      message: `Caso de estudio sin reflexión ética: ${caseStudy.title}`,
      suggestion: 'Incluir preguntas o consideraciones éticas relacionadas',
    });
  }

  if (!caseStudy.hasCriticalAnalysis) {
    issues.push({
      type: 'missing-outcomes',
      severity: 'warning',
      location: caseStudy.id,
      message: `Caso de estudio sin análisis crítico: ${caseStudy.title}`,
      suggestion: 'Incluir preguntas que fomenten el pensamiento crítico',
    });
  }

  if (!caseStudy.latinAmericanContext) {
    issues.push({
      type: 'missing-context',
      severity: 'info',
      location: caseStudy.id,
      message: `Caso de estudio sin contexto latinoamericano: ${caseStudy.title}`,
      suggestion: 'Considerar contextualizar en realidad latinoamericana (inspiración: Harvard Business School, INSEAD)',
    });
  }

  return issues;
}

/**
 * Classifies content type according to Manual Section 6.3
 */
export function classifyContent(content: {
  title: string;
  description?: string;
  authors?: string[];
  reviewers?: string[];
  citations?: string[];
}): ContentClassification {
  const hasExternalReviewers = content.reviewers && content.reviewers.length > 0;
  const hasCitations = content.citations && content.citations.length > 0;

  // Determine content type
  let type: ContentType = 'educational';
  let disclaimer: string | undefined;
  let peerReviewed = false;

  if (hasExternalReviewers) {
    type = 'peer-reviewed';
    peerReviewed = true;
  } else if (content.title.toLowerCase().includes('investigación') || 
             content.title.toLowerCase().includes('research')) {
    type = 'internal-research';
    disclaimer = 'Este contenido es investigación interna y no ha sido sometido a revisión por pares externos.';
  } else if (content.title.toLowerCase().includes('opinión') || 
             content.title.toLowerCase().includes('análisis')) {
    type = 'opinion';
    disclaimer = 'Este contenido refleja opiniones y análisis, no constituye investigación científica arbitrada.';
  } else if (content.title.toLowerCase().includes('noticia') || 
             content.title.toLowerCase().includes('anuncio')) {
    type = 'news';
  } else if (content.title.toLowerCase().includes('promoción') || 
             content.title.toLowerCase().includes('inscríbete')) {
    type = 'promotional';
    disclaimer = 'Este es contenido promocional institucional.';
  }

  return {
    type,
    disclaimer,
    peerReviewed,
    requiresAttribution: hasCitations || type === 'peer-reviewed' || type === 'internal-research',
  };
}

/**
 * Validates content classification for transparency
 * Based on Manual Section 6.1
 */
export function validateContentClassification(
  classification: ContentClassification,
  contentId: string
): AcademicIssue[] {
  const issues: AcademicIssue[] = [];

  // Check for proper disclaimer on non-peer-reviewed research
  if (classification.type === 'internal-research' && !classification.disclaimer) {
    issues.push({
      type: 'missing-context',
      severity: 'warning',
      location: contentId,
      message: 'Investigación interna sin advertencia metodológica',
      suggestion: 'Agregar disclaimer indicando que no es artículo científico arbitrado',
    });
  }

  // Check for attribution on content that requires it
  if (classification.requiresAttribution) {
    issues.push({
      type: 'missing-context',
      severity: 'info',
      location: contentId,
      message: 'Contenido que requiere atribución - verificar citas y referencias',
      suggestion: 'Asegurar que todas las fuentes estén correctamente citadas',
    });
  }

  return issues;
}

/**
 * Validates excellence indicators according to Manual Section 7.3
 */
export interface ExcellenceIndicators {
  learningOutcomes: {
    defined: boolean;
    measurable: boolean;
    aligned: boolean;
  };
  content: {
    structured: boolean;
    contextualized: boolean;
    updated: boolean;
  };
  assessment: {
    rubrics: boolean;
    feedback: boolean;
    diverse: boolean;
  };
  engagement: {
    active: boolean;
    collaborative: boolean;
    reflective: boolean;
  };
}

export function validateExcellenceIndicators(
  indicators: Partial<ExcellenceIndicators>,
  contentId: string
): AcademicIssue[] {
  const issues: AcademicIssue[] = [];

  // Learning outcomes
  if (!indicators.learningOutcomes?.defined) {
    issues.push({
      type: 'missing-outcomes',
      severity: 'critical',
      location: contentId,
      message: 'Resultados de aprendizaje no definidos',
      suggestion: 'Definir resultados de aprendizaje claros (OBE - Outcome-Based Education)',
    });
  } else if (!indicators.learningOutcomes?.measurable) {
    issues.push({
      type: 'missing-outcomes',
      severity: 'warning',
      location: contentId,
      message: 'Resultados de aprendizaje no medibles',
      suggestion: 'Formular resultados con criterios de evaluación específicos',
    });
  }

  // Content
  if (!indicators.content?.structured) {
    issues.push({
      type: 'invalid-structure',
      severity: 'warning',
      location: contentId,
      message: 'Contenido no estructurado',
      suggestion: 'Organizar contenido en unidades lógicas con progresión clara',
    });
  }
  if (!indicators.content?.contextualized) {
    issues.push({
      type: 'missing-context',
      severity: 'info',
      location: contentId,
      message: 'Contenido no contextualizado',
      suggestion: 'Proporcionar contexto real y aplicable (inspiración: Stanford - innovación aplicada)',
    });
  }

  // Assessment
  if (!indicators.assessment?.rubrics) {
    issues.push({
      type: 'missing-outcomes',
      severity: 'warning',
      location: contentId,
      message: 'Sin rúbricas de evaluación',
      suggestion: 'Desarrollar rúbricas claras para cada resultado de aprendizaje',
    });
  }
  if (!indicators.assessment?.feedback) {
    issues.push({
      type: 'missing-context',
      severity: 'info',
      location: contentId,
      message: 'Sin mecanismo de feedback',
      suggestion: 'Implementar sistema de retroalimentación para estudiantes',
    });
  }

  // Engagement
  if (!indicators.engagement?.active) {
    issues.push({
      type: 'missing-context',
      severity: 'info',
      location: contentId,
      message: 'Sin actividades de aprendizaje activo',
      suggestion: 'Incluir ejercicios, proyectos o casos prácticos (aprendizaje basado en proyectos)',
    });
  }
  if (!indicators.engagement?.reflective) {
    issues.push({
      type: 'missing-context',
      severity: 'info',
      location: contentId,
      message: 'Sin actividades de metacognición',
      suggestion: 'Agregar momentos de reflexión sobre el aprendizaje',
    });
  }

  return issues;
}

/**
 * Generate an academic content audit report
 */
export function generateAcademicAuditReport(
  modules: ModuleData[],
  additionalContent?: AcademicContent[]
): string {
  const allIssues: AcademicIssue[] = [];

  // Validate modules
  for (const module of modules) {
    const moduleIssues = validateModuleData(module);
    allIssues.push(...moduleIssues);
  }

  // Validate additional content if provided
  if (additionalContent) {
    for (const content of additionalContent) {
      const contentIssues = validateAcademicContent(content, additionalContent);
      allIssues.push(...contentIssues);
    }
  }

  const criticalCount = allIssues.filter((i) => i.severity === 'critical').length;
  const warningCount = allIssues.filter((i) => i.severity === 'warning').length;
  const infoCount = allIssues.filter((i) => i.severity === 'info').length;

  let report = `# Reporte de Auditoría Académica UTAMV\n`;
  report += `Generado: ${new Date().toISOString()}\n\n`;
  report += `## Resumen\n`;
  report += `- **Módulos analizados**: ${modules.length}\n`;
  report += `- **Contenido adicional**: ${additionalContent?.length || 0}\n`;
  report += `- **Total de problemas**: ${allIssues.length}\n`;
  report += `- **Críticos**: ${criticalCount}\n`;
  report += `- **Advertencias**: ${warningCount}\n`;
  report += `- **Informativos**: ${infoCount}\n\n`;

  if (allIssues.length > 0) {
    report += `## Problemas Detectados\n\n`;

    const groupedByType = allIssues.reduce((acc, issue) => {
      if (!acc[issue.type]) acc[issue.type] = [];
      acc[issue.type].push(issue);
      return acc;
    }, {} as Record<string, AcademicIssue[]>);

    for (const [type, issues] of Object.entries(groupedByType)) {
      const icon = issues[0].severity === 'critical' ? ':red_circle:' : 
                   issues[0].severity === 'warning' ? ':yellow_circle:' : ':blue_circle:';
      report += `### ${icon} ${type.replace(/-/g, ' ').toUpperCase()}\n\n`;

      for (const issue of issues) {
        report += `- **Ubicación**: \`${issue.location}\`\n`;
        report += `  - **Mensaje**: ${issue.message}\n`;
        if (issue.suggestion) {
          report += `  - **Sugerencia**: ${issue.suggestion}\n`;
        }
        report += `\n`;
      }
    }
  }

  report += `## Estructura Académica Esperada\n\n`;
  report += '```\n';
  report += `Programas\n`;
  report += `  Módulos\n`;
  report += `    Materias\n`;
  report += `      Unidades\n`;
  report += `        Recursos\n`;
  report += '```\n\n`;

  report += `## Inspiración Internacional\n\n`;
  report += `| Institución | Principio |\n`;
  report += `|-------------|----------|\n`;
  report += `| Oxford | Sistema tutorial |\n`;
  report += `| ETH Zürich | Rigor técnico |\n`;
  report += `| Stanford | Innovación aplicada |\n`;
  report += `| MIT | Contenido abierto |\n`;
  report += `| Harvard | Casos de estudio |\n`;

  return report;
}

export default {
  validateAcademicContent,
  isValidLearningOutcome,
  validateModuleData,
  validateCaseStudy,
  classifyContent,
  validateContentClassification,
  validateExcellenceIndicators,
  generateAcademicAuditReport,
};
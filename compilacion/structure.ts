/**
 * UTAMV Structural Validator
 * Manual de Auditoría, Análisis y Mejora Continua Asistida por IA
 * Sección 3: Análisis Estructural del Repositorio
 */

export interface StructureValidationResult {
  valid: boolean;
  issues: StructureIssue[];
  timestamp: Date;
  version: string;
}

export interface StructureIssue {
  type: 'critical' | 'warning' | 'info';
  category: 'directory' | 'file' | 'content' | 'hierarchy';
  message: string;
  location: string;
  suggestion?: string;
}

export interface DirectoryStructure {
  path: string;
  required: boolean;
  description: string;
  allowedContents?: string[];
}

/**
 * Expected directory structure according to UTAMV standards
 * Based on Manual Section 3.1
 */
export const EXPECTED_STRUCTURE: DirectoryStructure[] = [
  {
    path: 'src',
    required: true,
    description: 'Código de aplicación',
    allowedContents: ['components', 'pages', 'lib', 'hooks', 'contexts', 'assets'],
  },
  {
    path: 'api',
    required: false,
    description: 'Endpoints y funciones serverless',
  },
  {
    path: 'supabase',
    required: false,
    description: 'Configuración de base de datos',
  },
  {
    path: 'institutional',
    required: true,
    description: 'Documentación institucional',
    allowedContents: ['master', 'legal', 'academic', 'governance', 'international'],
  },
  {
    path: 'institutional/master',
    required: true,
    description: 'Documento Maestro y jerarquía superior',
  },
  {
    path: 'institutional/legal',
    required: true,
    description: 'Marcos legales y reglamentos',
  },
  {
    path: 'institutional/academic',
    required: true,
    description: 'Modelos educativos y perfiles',
  },
  {
    path: 'institutional/governance',
    required: true,
    description: 'Sistema de calidad y auditoría',
  },
  {
    path: 'institutional/international',
    required: false,
    description: 'Conformidad internacional',
  },
  {
    path: 'data',
    required: true,
    description: 'Contenido académico estructurado',
    allowedContents: ['modules.json', 'exams.json'],
  },
  {
    path: 'public',
    required: true,
    description: 'Recursos públicos estáticos',
  },
  {
    path: 'docs',
    required: false,
    description: 'Documentación técnica',
  },
];

/**
 * Files that should NOT exist in certain directories
 * Based on Manual Section 3.1: "Ningún documento normativo o legal debe convivir con lógica de aplicación"
 */
export const FORBIDDEN_PATTERNS: Record<string, RegExp[]> = {
  'src': [/\.legal\./, /reglamento/i, /estatuto/i, /normativa/i],
  'api': [/\.legal\./, /reglamento/i, /estatuto/i],
  'institutional': [/\.tsx?$/, /\.jsx?$/, /\.css$/],
  'data': [/\.md$/, /README/i],
};

/**
 * Validates repository structure against UTAMV standards
 */
export function validateStructure(
  existingPaths: string[]
): StructureValidationResult {
  const issues: StructureIssue[] = [];
  const timestamp = new Date();

  // Check required directories
  for (const expected of EXPECTED_STRUCTURE) {
    const exists = existingPaths.some((p) => p.startsWith(expected.path));

    if (expected.required && !exists) {
      issues.push({
        type: 'critical',
        category: 'directory',
        message: `Directorio requerido faltante: ${expected.path}`,
        location: expected.path,
        suggestion: `Crear directorio: ${expected.path} - ${expected.description}`,
      });
    }
  }

  // Check for forbidden patterns
  for (const [directory, patterns] of Object.entries(FORBIDDEN_PATTERNS)) {
    const filesInDir = existingPaths.filter((p) => p.startsWith(directory));

    for (const file of filesInDir) {
      for (const pattern of patterns) {
        if (pattern.test(file)) {
          issues.push({
            type: 'warning',
            category: 'content',
            message: `Archivo en ubicación inapropiada según principio de separación`,
            location: file,
            suggestion: `Mover a directorio apropiado según Manual Sección 3.1`,
          });
        }
      }
    }
  }

  // Check for Documento Maestro existence
  const hasMasterDocument = existingPaths.some(
    (p) => p.includes('institutional/master') && p.endsWith('.md')
  );

  if (!hasMasterDocument) {
    issues.push({
      type: 'critical',
      category: 'file',
      message: 'Documento Maestro UTAMV no encontrado',
      location: 'institutional/master/',
      suggestion: 'Crear Documento Maestro según jerarquía normativa',
    });
  }

  return {
    valid: issues.filter((i) => i.type === 'critical').length === 0,
    issues,
    timestamp,
    version: '1.0.0',
  };
}

/**
 * Validates document hierarchy according to Manual Section 3.2
 */
export interface DocumentHierarchy {
  level: number;
  name: string;
  path: string;
  parent?: string;
}

export const EXPECTED_HIERARCHY: DocumentHierarchy[] = [
  { level: 1, name: 'Documento Maestro UTAMV', path: 'institutional/master/' },
  { level: 2, name: 'Estatuto Orgánico', path: 'institutional/legal/estatuto-organico.md' },
  { level: 3, name: 'Reglamentos Generales', path: 'institutional/legal/' },
  { level: 4, name: 'Políticas Institucionales', path: 'institutional/governance/' },
  { level: 5, name: 'Lineamientos Operativos', path: 'institutional/academic/' },
];

/**
 * Check if a document path is in the correct hierarchy level
 */
export function validateDocumentHierarchy(
  documentPath: string,
  documentType: string
): StructureIssue | null {
  const hierarchyMap: Record<string, string[]> = {
    master: ['institutional/master/'],
    estatuto: ['institutional/legal/estatuto-organico.md'],
    reglamento: ['institutional/legal/'],
    politica: ['institutional/governance/', 'institutional/academic/'],
    lineamiento: ['institutional/academic/'],
  };

  const expectedPaths = hierarchyMap[documentType.toLowerCase()];

  if (expectedPaths && !expectedPaths.some((p) => documentPath.startsWith(p))) {
    return {
      type: 'warning',
      category: 'hierarchy',
      message: `Documento de tipo "${documentType}" en ubicación incorrecta`,
      location: documentPath,
      suggestion: `Mover a una de las ubicaciones: ${expectedPaths.join(', ')}`,
    };
  }

  return null;
}

/**
 * Validates separation between code and documentation
 * Core principle from Manual Section 3.1
 */
export function validateSeparation(existingPaths: string[]): StructureIssue[] {
  const issues: StructureIssue[] = [];

  // Check for code files in institutional directories
  const institutionalPaths = existingPaths.filter((p) =>
    p.startsWith('institutional/')
  );

  for (const path of institutionalPaths) {
    if (/\.(tsx?|jsx?|css|scss)$/.test(path)) {
      issues.push({
        type: 'critical',
        category: 'content',
        message: 'Código de aplicación en directorio institucional',
        location: path,
        suggestion: 'Mover código a directorio src/ o api/',
      });
    }
  }

  // Check for documentation in code directories
  const codePaths = existingPaths.filter(
    (p) => p.startsWith('src/') || p.startsWith('api/')
  );

  for (const path of codePaths) {
    // Allow README and technical docs in code directories
    if (/\.md$/.test(path) && !/README/i.test(path) && !/CHANGELOG/i.test(path)) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Documentación en directorio de código',
        location: path,
        suggestion: 'Mover documentación institucional a directorio institutional/',
      });
    }
  }

  return issues;
}

/**
 * Generate a structural audit report
 */
export function generateStructuralAuditReport(
  existingPaths: string[]
): string {
  const result = validateStructure(existingPaths);
  const separationIssues = validateSeparation(existingPaths);

  const allIssues = [...result.issues, ...separationIssues];

  let report = `# Reporte de Auditoría Estructural UTAMV\n`;
  report += `Generado: ${new Date().toISOString()}\n\n`;
  report += `## Resumen\n`;
  report += `- **Estado**: ${result.valid ? '✅ VÁLIDO' : '❌ PROBLEMAS DETECTADOS'}\n`;
  report += `- **Total de problemas**: ${allIssues.length}\n`;
  report += `- **Críticos**: ${allIssues.filter((i) => i.type === 'critical').length}\n`;
  report += `- **Advertencias**: ${allIssues.filter((i) => i.type === 'warning').length}\n\n`;

  if (allIssues.length > 0) {
    report += `## Problemas Detectados\n\n`;

    for (const issue of allIssues) {
      const icon = issue.type === 'critical' ? '🔴' : issue.type === 'warning' ? '🟡' : 'ℹ️';
      report += `### ${icon} ${issue.category.toUpperCase()}\n`;
      report += `- **Ubicación**: \`${issue.location}\`\n`;
      report += `- **Mensaje**: ${issue.message}\n`;
      if (issue.suggestion) {
        report += `- **Sugerencia**: ${issue.suggestion}\n`;
      }
      report += `\n`;
    }
  }

  report += `## Estructura Esperada\n\n`;
  report += '```\n';
  report += `/\n`;
  report += `├── src/                    # Código de aplicación\n`;
  report += `├── api/                    # Endpoints y funciones serverless\n`;
  report += `├── supabase/               # Configuración de base de datos\n`;
  report += `├── institutional/          # Documentación institucional\n`;
  report += `│   ├── master/             # Documento Maestro y jerarquía superior\n`;
  report += `│   ├── legal/              # Marcos legales y reglamentos\n`;
  report += `│   ├── academic/           # Modelos educativos y perfiles\n`;
  report += `│   ├── governance/         # Sistema de calidad y auditoría\n`;
  report += `│   └── international/      # Conformidad internacional\n`;
  report += `├── data/                   # Contenido académico estructurado\n`;
  report += `├── public/                 # Recursos públicos estáticos\n`;
  report += `└── docs/                   # Documentación técnica\n`;
  report += '```\n';

  return report;
}

export default {
  validateStructure,
  validateDocumentHierarchy,
  validateSeparation,
  generateStructuralAuditReport,
  EXPECTED_STRUCTURE,
  EXPECTED_HIERARCHY,
};

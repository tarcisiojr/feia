/**
 * Barrel file para exportação de tipos
 */

// Tipos de convenções detectadas
export type {
  Confidence,
  DetectionResult,
  Framework,
  CssLibrary,
  TestRunner,
  Linter,
  Formatter,
  FormsLibrary,
  ValidationLibrary,
  StateManagement,
  ComponentDeclaration,
  ExportStyle,
  NamingConvention,
  DetectedPaths,
  DetectedConventions,
} from './conventions.js';

// Tipos de configuração do projeto
export type {
  Domain,
  FigmaConfig,
  ProjectPaths,
  ProjectConfig,
  PromptConfig,
} from './config.js';

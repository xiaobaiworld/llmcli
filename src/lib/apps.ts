import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import yaml from 'js-yaml';

// ────────────────────────────────────────────────────────────
// Type Definitions
// ────────────────────────────────────────────────────────────

/** Coverage status for a single feature */
export type CoverageStatus = 'supported' | 'partial' | 'unsupported';

/** Tool type — CLI binary, MCP server, remote MCP, or raw API wrapper */
export type ToolType = 'cli' | 'mcp' | 'mcp-remote' | 'api';

/** Who maintains the tool */
export type Maintained = 'official' | 'community' | 'unknown';

/**
 * A single feature within a domain, describing whether it can be
 * automated via CLI/MCP and, if so, how.
 */
export interface Feature {
  id: string;
  name: string;
  status: CoverageStatus;
  /** References a tool from the parent App's `tools` array */
  tool_id?: string;
  /** Ready-to-run shell command or MCP call */
  command?: string;
  /** Description of accepted input parameters */
  input?: string;
  /** Sample output from running the command */
  output?: string;
  /** Additional usage notes */
  notes?: string;
  /** Why the feature is unsupported or only partially supported */
  gap_reason?: string;
}

/**
 * A functional domain (e.g. "消息", "日历") grouping related features.
 */
export interface Domain {
  id: string;
  name: string;
  features: Feature[];
}

/**
 * A CLI or MCP tool that can be used to operate an application.
 */
export interface AppTool {
  id: string;
  name: string;
  type: ToolType;
  install_cmd: string;
  repo?: string;
  maintained: Maintained;
  /** Number of built-in AI agent skills (for CLI tools that expose them) */
  agent_skills?: number;
}

/**
 * Top-level application entry — the unit of content in llmcli.
 */
export interface App {
  id: string;
  name: string;
  description: string;
  homepage?: string;
  category: string;
  tools: AppTool[];
  domains: Domain[];
}

// ────────────────────────────────────────────────────────────
// Coverage Statistics
// ────────────────────────────────────────────────────────────

/** Aggregated coverage numbers for an App */
export interface CoverageStats {
  total: number;
  supported: number;
  partial: number;
  unsupported: number;
  /** Percentage of features that are supported or partial (0–100) */
  coveragePercent: number;
}

/**
 * Calculates coverage statistics for a given App by counting features
 * across all domains.
 *
 * @param app - The App to analyse
 * @returns Aggregated counts and a rounded coverage percentage
 */
export function getCoverageStats(app: App): CoverageStats {
  let supported = 0;
  let partial = 0;
  let unsupported = 0;

  for (const domain of app.domains) {
    for (const feature of domain.features) {
      if (feature.status === 'supported') supported++;
      else if (feature.status === 'partial') partial++;
      else unsupported++;
    }
  }

  const total = supported + partial + unsupported;
  const coveragePercent = total === 0 ? 0 : Math.round(((supported + partial * 0.5) / total) * 100);

  return { total, supported, partial, unsupported, coveragePercent };
}

// ────────────────────────────────────────────────────────────
// Data Loading
// ────────────────────────────────────────────────────────────

/**
 * Reads all YAML files from `data/apps/` and returns them as an array
 * of App objects. Files are sorted alphabetically by filename.
 *
 * @returns Array of all App entries
 */
export function getApps(): App[] {
  const appsDir = resolve(process.cwd(), 'data/apps');
  const files = readdirSync(appsDir)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort();

  return files.map((file) => {
    const raw = readFileSync(join(appsDir, file), 'utf-8');
    return yaml.load(raw) as App;
  });
}

/**
 * Returns a single App by its `id` field, or `undefined` if not found.
 *
 * @param id - The app slug (e.g. "feishu", "wecom", "obsidian")
 */
export function getApp(id: string): App | undefined {
  return getApps().find((app) => app.id === id);
}

// ────────────────────────────────────────────────────────────
// Display Helpers
// ────────────────────────────────────────────────────────────

/** Human-readable category labels */
export const CATEGORY_LABELS: Record<string, string> = {
  'enterprise-collab': '企业协作',
  'notes': '笔记 / 知识库',
  'devtools': '开发工具',
  'project': '项目管理',
  'crm': 'CRM / 销售',
};

/** Tailwind colour classes for each category pill */
export const CATEGORY_COLORS: Record<string, string> = {
  'enterprise-collab': 'bg-blue-100 text-blue-800',
  'notes': 'bg-emerald-100 text-emerald-800',
  'devtools': 'bg-teal-100 text-teal-800',
  'project': 'bg-violet-100 text-violet-800',
  'crm': 'bg-orange-100 text-orange-800',
};

/** Tailwind colour classes for coverage status badges */
export const STATUS_COLORS: Record<CoverageStatus, string> = {
  supported: 'bg-green-100 text-green-700',
  partial: 'bg-amber-100 text-amber-700',
  unsupported: 'bg-red-100 text-red-700',
};

/** Human-readable labels for coverage status */
export const STATUS_LABELS: Record<CoverageStatus, string> = {
  supported: '支持',
  partial: '部分支持',
  unsupported: '不支持',
};

/** Human-readable labels for tool types */
export const TOOL_TYPE_LABELS: Record<ToolType, string> = {
  cli: 'CLI',
  mcp: 'MCP',
  'mcp-remote': 'MCP Remote',
  api: 'API',
};

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

export interface Tool {
  id: string;
  name: string;
  command: string;
  category: string;
  kind: string;
  priority: 'A' | 'B';
  agent_ready_level: 'high' | 'medium' | 'low';
  agent_ready_score: number;
  maintained: 'yes' | 'unknown' | 'no';
  install: string[];
  example: string;
  notes?: string;
  homepage?: string;
  repo?: string;
  tags?: string[];
}

interface ToolsData {
  version: string;
  tools: Tool[];
}

export function getTools(): Tool[] {
  const filePath = resolve(process.cwd(), 'data/tools.seed.yaml');
  const raw = readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as ToolsData;
  return data.tools;
}

export const CATEGORY_LABELS: Record<string, string> = {
  'file-text': 'File & Text',
  'http-api': 'HTTP & API',
  'data-db': 'Data & DB',
  'dev-code': 'Dev Tools',
  'ops': 'Ops & Infra',
  'llm-agent': 'AI / LLM',
};

export const CATEGORY_COLORS: Record<string, string> = {
  'file-text': 'bg-blue-100 text-blue-800',
  'http-api': 'bg-purple-100 text-purple-800',
  'data-db': 'bg-orange-100 text-orange-800',
  'dev-code': 'bg-teal-100 text-teal-800',
  'ops': 'bg-rose-100 text-rose-800',
  'llm-agent': 'bg-violet-100 text-violet-800',
};

export const KIND_LABELS: Record<string, string> = {
  'traditional-cli': 'Traditional CLI',
  'ai-native-cli': 'AI Native',
  'mcp-server': 'MCP Server',
  'wrapper-cli': 'Wrapper',
};

export const LEVEL_BG: Record<string, string> = {
  'high': 'bg-green-100 text-green-700',
  'medium': 'bg-amber-100 text-amber-700',
  'low': 'bg-red-100 text-red-700',
};

export const LEVEL_DOT: Record<string, string> = {
  'high': 'fill-green-500',
  'medium': 'fill-amber-400',
  'low': 'fill-red-400',
};

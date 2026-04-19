import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

export type McpType = 'official' | 'community' | 'none';

export interface LandscapeEntry {
  id: string;
  name: string;
  company: string;
  category: string;
  website: string;
  has_mcp: boolean;
  mcp_type: McpType;
  mcp_url?: string;
  has_cli: boolean;
  cli_name?: string;
  cli_url?: string;
  last_checked: string;
}

export const LANDSCAPE_CATEGORY_LABELS: Record<string, string> = {
  devtools: '开发工具',
  project: '项目管理',
  collab: '企业协作',
  productivity: '效率 / 笔记',
  design: '设计',
  data: '数据 / 分析',
  crm: 'CRM / 支持',
  payments: '支付 / 通信',
  cloud: '云服务',
};

export function getLandscape(): LandscapeEntry[] {
  const raw = readFileSync(resolve(process.cwd(), 'data/landscape.yaml'), 'utf-8');
  return yaml.load(raw) as LandscapeEntry[];
}

/** Aggregated stats across all entries */
export function getLandscapeStats(entries: LandscapeEntry[]) {
  const officialMcp = entries.filter(e => e.mcp_type === 'official').length;
  const communityMcp = entries.filter(e => e.mcp_type === 'community').length;
  const noMcp = entries.filter(e => !e.has_mcp).length;
  const hasCli = entries.filter(e => e.has_cli).length;
  return { total: entries.length, officialMcp, communityMcp, noMcp, hasCli };
}

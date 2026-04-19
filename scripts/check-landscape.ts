/**
 * check-landscape.ts
 *
 * 自动检查 data/landscape.yaml 中每个软件的 MCP/CLI 状态。
 * 优先查询 Smithery API，再用 GitHub API 补充，最后更新 YAML。
 *
 * 使用方式：
 *   npx tsx scripts/check-landscape.ts          # 只输出报告
 *   npx tsx scripts/check-landscape.ts --write  # 同时写回 YAML
 *
 * 环境变量：
 *   GITHUB_TOKEN — 提高 GitHub API 速率限制（5000/h vs 60/h）
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

interface LandscapeEntry {
  id: string;
  name: string;
  company: string;
  has_mcp: boolean;
  mcp_type: 'official' | 'community' | 'none';
  mcp_url?: string;
  has_cli: boolean;
  cli_name?: string;
  cli_url?: string;
  last_checked: string;
}

const GITHUB_HEADERS: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

/** Query Smithery registry for a software by name */
async function checkSmithery(name: string): Promise<{ found: boolean; url?: string; official?: boolean }> {
  try {
    const q = encodeURIComponent(name.toLowerCase());
    const res = await fetch(`https://smithery.ai/api/search?q=${q}&limit=3`);
    if (!res.ok) return { found: false };
    const data = await res.json() as { results?: Array<{ name: string; url: string; isOfficial?: boolean }> };
    const results = data.results ?? [];
    if (results.length === 0) return { found: false };
    // Match: name contains the software name (case-insensitive)
    const match = results.find(r =>
      r.name.toLowerCase().includes(name.toLowerCase().split(' ')[0])
    );
    if (!match) return { found: false };
    return { found: true, url: match.url, official: match.isOfficial };
  } catch {
    return { found: false };
  }
}

/** Check npm registry for a *-mcp-server package */
async function checkNpm(query: string): Promise<{ found: boolean; pkg?: string }> {
  try {
    const q = encodeURIComponent(`${query} mcp`);
    const res = await fetch(`https://registry.npmjs.org/-/v1/search?text=${q}&size=3`);
    if (!res.ok) return { found: false };
    const data = await res.json() as { objects?: Array<{ package: { name: string; links: { repository?: string } } }> };
    const pkgs = data.objects ?? [];
    const match = pkgs.find(p =>
      p.package.name.toLowerCase().includes('mcp') &&
      p.package.name.toLowerCase().includes(query.toLowerCase().split(' ')[0])
    );
    return match ? { found: true, pkg: match.package.name } : { found: false };
  } catch {
    return { found: false };
  }
}

/** Check GitHub search for org-level MCP repos */
async function checkGitHub(orgOrName: string): Promise<{ found: boolean; repoUrl?: string }> {
  try {
    const q = encodeURIComponent(`${orgOrName} mcp-server in:name`);
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${q}&sort=stars&per_page=3`,
      { headers: GITHUB_HEADERS }
    );
    if (!res.ok) return { found: false };
    const data = await res.json() as { items?: Array<{ html_url: string; name: string }> };
    const items = data.items ?? [];
    const match = items.find(r => r.name.toLowerCase().includes('mcp'));
    return match ? { found: true, repoUrl: match.html_url } : { found: false };
  } catch {
    return { found: false };
  }
}

async function main() {
  const writeBack = process.argv.includes('--write');
  const filePath = resolve(process.cwd(), 'data/landscape.yaml');
  const raw = readFileSync(filePath, 'utf-8');
  const entries = yaml.load(raw) as LandscapeEntry[];

  console.log(`Checking ${entries.length} software entries...\n`);

  let changed = false;
  const today = new Date().toISOString().slice(0, 10);

  for (const entry of entries) {
    process.stdout.write(`${entry.name.padEnd(20)}`);

    // 1. Try Smithery first
    const smithery = await checkSmithery(entry.name);
    if (smithery.found && !entry.has_mcp) {
      console.log(`  🔴 → MCP found on Smithery! (was: none)`);
      if (writeBack) {
        entry.has_mcp = true;
        entry.mcp_type = smithery.official ? 'official' : 'community';
        entry.mcp_url = smithery.url;
        entry.last_checked = today;
        changed = true;
      }
      continue;
    }

    // 2. Try npm if no MCP recorded
    if (!entry.has_mcp) {
      const npm = await checkNpm(entry.name);
      if (npm.found) {
        console.log(`  🔴 → MCP found on npm! (${npm.pkg})`);
        if (writeBack) {
          entry.has_mcp = true;
          entry.mcp_type = 'community';
          entry.mcp_url = `https://www.npmjs.com/package/${npm.pkg}`;
          entry.last_checked = today;
          changed = true;
        }
        continue;
      }
    }

    // 3. GitHub search fallback
    if (!entry.has_mcp) {
      const gh = await checkGitHub(entry.company.split(' ')[0]);
      if (gh.found) {
        console.log(`  🟡 → potential MCP on GitHub: ${gh.repoUrl}`);
        continue;
      }
    }

    // No change
    const status = entry.mcp_type === 'official' ? '✅ official' :
                   entry.mcp_type === 'community' ? '⚡ community' : '❌ none';
    const cli = entry.has_cli ? ` | CLI: ${entry.cli_name}` : '';
    console.log(`  ${status}${cli}`);

    if (writeBack) {
      entry.last_checked = today;
      changed = true;
    }

    // Throttle: avoid GitHub rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  if (writeBack && changed) {
    writeFileSync(filePath, yaml.dump(entries, { lineWidth: 120, quotingType: '"' }), 'utf-8');
    console.log(`\n✅ Wrote updated data to data/landscape.yaml`);
  } else if (writeBack) {
    console.log('\nNo changes detected.');
  }
}

main().catch(console.error);

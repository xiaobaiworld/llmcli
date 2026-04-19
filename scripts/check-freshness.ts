/**
 * check-freshness.ts
 *
 * Reads all data/apps/*.yaml files, extracts GitHub repo URLs from each tool,
 * calls the GitHub API to get last commit date and star count, then prints a
 * freshness report. Optionally writes results back to YAML with --write flag.
 *
 * Usage:
 *   npx tsx scripts/check-freshness.ts
 *   npx tsx scripts/check-freshness.ts --write
 *
 * Requires GITHUB_TOKEN env var for higher rate limits (5000 req/h vs 60).
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import yaml from 'js-yaml';

interface AppTool {
  id: string;
  name: string;
  repo?: string;
}

interface App {
  id: string;
  name: string;
  tools: AppTool[];
}

interface RepoInfo {
  last_commit: string;
  stars: number;
  archived: boolean;
}

/** Extracts "owner/repo" from a GitHub URL, handling tree/blob paths */
function parseGitHubRepo(url: string): string | null {
  const m = url.match(/github\.com\/([^/]+\/[^/]+?)(?:\/|$)/);
  return m ? m[1] : null;
}

/** Fetches repo metadata from GitHub REST API */
async function fetchRepoInfo(ownerRepo: string): Promise<RepoInfo | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${ownerRepo}`, { headers });
    if (!repoRes.ok) return null;
    const repo = await repoRes.json() as { pushed_at: string; stargazers_count: number; archived: boolean };

    return {
      last_commit: repo.pushed_at.slice(0, 10),
      stars: repo.stargazers_count,
      archived: repo.archived,
    };
  } catch {
    return null;
  }
}

async function main() {
  const writeBack = process.argv.includes('--write');
  const appsDir = resolve(process.cwd(), 'data/apps');
  const files = readdirSync(appsDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml')).sort();

  console.log(`Checking ${files.length} apps...\n`);

  for (const file of files) {
    const filePath = join(appsDir, file);
    const raw = readFileSync(filePath, 'utf-8');
    const app = yaml.load(raw) as App;

    console.log(`── ${app.name} (${app.id})`);

    const updates: Record<string, RepoInfo> = {};

    for (const tool of app.tools) {
      if (!tool.repo?.includes('github.com')) continue;
      const slug = parseGitHubRepo(tool.repo);
      if (!slug) continue;

      const info = await fetchRepoInfo(slug);
      if (!info) {
        console.log(`   ${tool.name}: ❌ fetch failed`);
        continue;
      }

      const age = Math.floor((Date.now() - new Date(info.last_commit).getTime()) / 86400000);
      const freshEmoji = age < 30 ? '🟢' : age < 180 ? '🟡' : '🔴';
      const archiveFlag = info.archived ? ' [ARCHIVED]' : '';
      console.log(`   ${tool.name}: ${freshEmoji} ${info.last_commit} (${age}d ago) ★${info.stars}${archiveFlag}`);

      updates[tool.id] = info;
    }

    if (writeBack && Object.keys(updates).length > 0) {
      // Inject last_commit/stars into each matching tool in the raw YAML
      let updated = raw;
      for (const [toolId, info] of Object.entries(updates)) {
        // Insert after the tool's `maintained:` line
        updated = updated.replace(
          new RegExp(`(  - id: ${toolId}[\\s\\S]*?maintained: \\S+)`),
          `$1\n    last_commit: ${info.last_commit}\n    stars: ${info.stars}${info.archived ? '\n    archived: true' : ''}`
        );
      }
      writeFileSync(filePath, updated, 'utf-8');
      console.log(`   → wrote back to ${file}`);
    }

    console.log('');
  }
}

main().catch(console.error);

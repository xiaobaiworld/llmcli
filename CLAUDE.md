# llmcli — AI Agent 应用操作手册

**产品定位**：以具体生产力应用（飞书、企业微信、Obsidian 等）为中心，精确告诉 AI agent 开发者：
- 这个应用有哪些 CLI / MCP 工具可用
- 每个功能是否可以通过命令行完成（支持 / 部分支持 / 不支持）
- 可用功能：提供可直接复用的命令示例（输入 → 输出）
- 不可用功能：说明原因和替代方案

**一句话**：给 AI agent 的应用操作手册。

---

## 🚨 新 Session 必读

1. 先读 `docs/index.md` — 了解所有文档位置和项目当前状态
2. 再读 `NEXT.md` — 知道当前阶段要做什么，从哪里继续
3. 按 `NEXT.md` 的步骤清单逐步执行，完成一步打一个 ✅
4. 所有文档放在 `docs/` 目录，`docs/index.md` 是索引

## 开发工作流

```
读 docs/index.md → 读 NEXT.md → 逐步执行 → 检查 → 写 CHANGELOG.md → git commit/push → 清空 NEXT.md 写下一阶段
```

## 开发原则

1. **YAML 是唯一数据源** — 内容只改 YAML，代码不硬编码数据
2. **先文档后代码** — Phase 开始前 NEXT.md 要有完整步骤
3. **每步一 commit** — 不积累大量未提交改动
4. **构建必须通过** — 每次提交前 `npm run build` 零错误
5. **代码有注释** — `.ts` 文件函数和接口加 JSDoc 注释
6. **CHANGELOG 必须更新** — 每阶段结束描述产出

---

---

## Project Analysis

### Why this is worth building

- **AI agents need CLI interfaces.** LLMs can't click buttons. Every tool without a CLI is a wall for agents. There's no good directory of "what's agent-usable."
- **MCP server ecosystem is exploding but undiscoverable.** Hundreds of MCP servers exist; no curated, quality-filtered directory exists yet.
- **Developers ask "is there a CLI for X?" constantly.** Current resources (awesome-cli-apps, tldr.sh) are static lists with no quality signals and no AI angle.
- **Two audiences, one product.** Traditional devs looking for CLI tools + AI engineers building agents. Both need the same information.

### Where value comes from

Not a list — a judgment layer. Collect tools, but also rate them:
- Is it maintained? (last commit, issue response rate)
- Is it agent-ready? (non-interactive mode, machine-readable output, no auth prompts)
- Is there an MCP server version?
- What's the install story? (brew, cargo, pip, npm — friction varies)

### Risks to manage

- **Maintenance rot**: tools go stale. Need automation to flag unmaintained entries.
- **SEO competition**: pure directories rank poorly. Need a unique angle — the AI-agent-ready framing is it.
- **Scope creep**: don't try to catalog everything. Start narrow (50-100 tools), go deep.

---

## Project Plan

### Phase 1 — Foundation (MVP)
- [ ] Define data schema for tool entries (name, description, category, install, agent-ready score, MCP status, repo URL)
- [ ] Pick tech stack: static site (Astro or 11ty) + JSON/YAML data files for easy contribution
- [ ] Design information architecture: categories, tags, filtering
- [ ] Seed with 30-50 high-quality tools across 5-6 categories

### Phase 2 — Content
- [ ] Categories to cover: DevOps/Infra, Data/DB, Media/Files, AI/LLM native, Web/HTTP, Productivity
- [ ] For each tool: add "use with AI" example (a prompt or shell snippet showing agent usage)
- [ ] Build contribution workflow (GitHub PRs, JSON schema validation)

### Phase 3 — Quality signals
- [ ] Script to check GitHub last-commit date for each tool
- [ ] Agent-ready scoring rubric (non-interactive flag, JSON output, stdin support, exit codes)
- [ ] MCP server tracker (link to registry or repo when available)

### Phase 4 — Distribution
- [ ] SEO: target "cli tool for X" queries
- [ ] Submit to Hacker News, developer newsletters
- [ ] GitHub awesome-list cross-posting

---

## Tech Stack Decision

**Recommended: Astro + static JSON data files**
- Fast static output, easy deployment to Cloudflare Pages or GitHub Pages
- Data files are plain JSON/YAML — contributors don't need to touch code
- Search via Pagefind (no backend needed)
- Zero runtime cost

---

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health

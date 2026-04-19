# Changelog

## [0.4.0] — 2026-04-19 — Phase 4: 導航完善 + 新 App + SEO

### 新增
- `data/apps/dingtalk.yaml`：釘釘覆蓋矩陣（5 域，工具：dingtalk-mcp 官方）
- `data/apps/slack.yaml`：Slack 覆蓋矩陣（4 域，工具：slack-mcp-server 官方）
- `data/apps/linear.yaml`：Linear 覆蓋矩陣（4 域，工具：linear-mcp-server 官方）
- `src/layouts/BaseLayout.astro`：nav 新增「應用手冊」/ 「CLI 工具」入口；OG meta 完整
- `public/sitemap.xml`：更新至 60 URLs（新增 3 個 app 頁）

### 構建結果
- 60 個頁面，0 錯誤，Pagefind 索引 58 頁

## [0.3.0] — 2026-04-19 — Phase 3: 内容扩展 + 部署上线

### 新增
- `data/apps/github.yaml`：GitHub 覆盖矩阵（6 域 22 功能，工具：gh CLI + github-mcp-server）
- `data/apps/notion.yaml`：Notion 覆盖矩阵（4 域 16 功能，工具：notion-mcp-server）
- `data/apps/feishu.yaml`：补充审批（5）/ HR 假期（4）/ OKR（5）三域
- `src/pages/tools.astro`：独立通用 CLI 工具目录页（/tools）
- `CONTRIBUTING.md`：社区贡献指南（YAML 格式说明 + PR 流程）
- 首页「贡献数据」GitHub 按钮
- `public/sitemap.xml`：更新至 57 URLs

### 部署
- 上线域名：https://shellnav.com（Vercel + Spaceship DNS）
- GA4 接入（G-DLGJDH7H4N）
- Google Search Console meta 验证已部署

### 构建结果
- 57 个页面，Pagefind 索引 55 页 / 1665 词
- `data/apps/` 现覆盖 5 个应用（飞书/企业微信/Obsidian/GitHub/Notion），共约 130 个功能点

---

## [0.2.0] — 2026-04-16 — Phase 2: App 覆盖矩阵

### 新增
- `data/apps.schema.json`：App YAML JSON Schema 验证
- `data/apps/feishu.yaml`：飞书/Lark 覆盖矩阵（7 域 31 功能，工具：larksuite/cli + lark-openapi-mcp）
- `data/apps/wecom.yaml`：企业微信覆盖矩阵（6 域 27 功能，工具：wecom-cli + wecom-mcp）
- `data/apps/obsidian.yaml`：Obsidian 覆盖矩阵（4 域 16 功能，工具：obsidian-mcp + mcpvault）
- `src/lib/apps.ts`：App 数据层（getApps / getApp / getCoverageStats，完整 TS 类型 + JSDoc）
- `src/components/AppCard.astro`：应用卡片（覆盖率进度条、三色统计、工具列表）
- `src/components/CoverageRow.astro`：功能覆盖行（点击展开命令/参数/输出/gap）
- `src/components/ToolBadge.astro`：CLI/MCP 工具标签（类型、维护状态、GitHub 链接）
- `src/pages/app/[id].astro`：应用详情页（概览 + 矩阵 + Gap 总结，data-pagefind-body）

### 修改
- `src/pages/index.astro`：重构为 App 网格首页，保留旧通用工具目录入口

### 构建结果
- 54 个页面（3 App 详情 + 1 首页 + 50 工具详情）
- Pagefind 索引：53 页，1126 词
- 构建时间：~820ms

### 技术决策
- App YAML 设计：以「域 → 功能」二级结构组织，每个功能独立标注 supported/partial/unsupported
- CoverageRow 展开：纯 JS toggle（无框架依赖），避免 Astro island 过度复杂化
- 覆盖率计算：partial 按 0.5 权重计入，避免和 supported 等权

---

## [Unreleased] — Phase 3

---

## [0.1.0] — 2026-04-14 — Phase 1: Astro 基础框架

### 新增
- Astro 4 静态站完整脚手架（astro.config.mjs、tailwind.config.mjs、tsconfig.json）
- `data/tools.seed.yaml`：50 个通用 CLI 工具（file-text、http-api、data-db、dev-code、ops、llm-agent 六类）
- `data/tools.schema.json`：工具数据 JSON Schema 验证
- `src/lib/tools.ts`：YAML 数据读取层，Tool 类型定义
- `src/pages/index.astro`：工具列表页（分类/Kind/Agent-ready 三维过滤，客户端 JS）
- `src/pages/tool/[id].astro`：工具详情页（50 个静态路径）
- `src/components/ToolCard.astro`：工具卡片组件（名称、命令、评分、安装方式）
- `src/layouts/BaseLayout.astro`：全局 HTML 骨架
- Pagefind 全文搜索集成（构建后索引 50 个详情页）
- `vercel.json`：Vercel 部署配置（buildCommand = npm run build）
- `.claude/launch.json`：本地预览服务器配置

### 构建结果
- 51 个页面（50 工具详情 + 1 首页）
- Pagefind 索引：50 页，375 词
- 构建时间：~650ms

### 技术决策
- 选 Astro 4 而非 5（更稳定，升级路径清晰）
- 选 Tailwind v3 而非 v4（v4 配置方式变化大，稳定性优先）
- 搜索用 Pagefind 而非 Algolia（零成本，静态，构建时索引）
- 数据用 YAML 而非数据库（便于 GitHub PR 贡献）

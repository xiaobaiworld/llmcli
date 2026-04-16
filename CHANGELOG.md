# Changelog

## [Unreleased] — Phase 2

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

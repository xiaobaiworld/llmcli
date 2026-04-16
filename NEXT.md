# Phase 2 — 重构为 App 覆盖矩阵

> 目标：把通用 CLI 工具目录改造为「以 App 为中心的 CLI/MCP 功能覆盖矩阵」
> 参考：docs/DEV.md（技术方案）、docs/PRD.md（产品需求）

---

## 步骤清单

### Step 1：新 App 数据 Schema
- [x] 创建 `data/apps.schema.json`（基于 DEV.md 中的数据结构）

### Step 2：飞书数据文件
- [x] 创建 `data/apps/feishu.yaml`
  - 工具：larksuite/cli + lark-openapi-mcp
  - 域：消息、云文档、多维表格、表格、日历、会议、任务、邮件
  - 每个域：≥3 个功能，包含 supported 和 unsupported 各至少 1 个
  - 每个 supported 功能：完整 command + input + output

### Step 3：企业微信数据文件
- [x] 创建 `data/apps/wecom.yaml`
  - 工具：wecom-cli
  - 域：消息、日历、文档、智能表格、会议、待办、通讯录
  - 同上标准

### Step 4：Obsidian 数据文件
- [x] 创建 `data/apps/obsidian.yaml`
  - 工具：obsidian-mcp-server（cyanheads） + mcpvault
  - 域：笔记管理、搜索、标签、Canvas
  - 同上标准

### Step 5：新数据层
- [x] 创建 `src/lib/apps.ts`
  - `getApps()` — 读取所有 data/apps/*.yaml，返回 App[]
  - `getApp(id)` — 获取单个 App
  - 完整 TypeScript 类型（参考 DEV.md）
  - 每个函数加 JSDoc 注释
  - 导出覆盖率计算函数 `getCoverageStats(app)`

### Step 6：组件
- [x] 创建 `src/components/AppCard.astro` — 应用卡片（首页用）
- [x] 创建 `src/components/CoverageRow.astro` — 功能覆盖行（矩阵行）
- [x] 创建 `src/components/ToolBadge.astro` — CLI/MCP 工具标签

### Step 7：重构首页
- [x] 修改 `src/pages/index.astro`
  - 主体改为 App 网格（AppCard）
  - 保留旧工具入口（"浏览通用 CLI 工具" 链接）
  - 搜索框保留 Pagefind

### Step 8：新应用详情页
- [x] 创建 `src/pages/app/[id].astro`
  - 区块 1：应用概览 + 工具列表
  - 区块 2：功能覆盖矩阵（按域分组，CoverageRow 组件）
  - 区块 3：Gap 总结
  - data-pagefind-body 标记（用于搜索索引）

### Step 9：构建验证
- [x] 运行 `npm run build`，确认零错误，零 warning
- [x] 54 页生成（3 个 App 详情页 + 首页 + 50 个工具页）

### Step 10：提交
- [ ] `git add` 所有新文件
- [ ] `git commit -m "feat: phase 2 — app-centric coverage matrix"`
- [ ] `git push origin main`
- [ ] 更新 CHANGELOG.md
- [ ] 清空本文件，写 Phase 3 的 NEXT.md

---

## 当前进度

- [x] 调研完成（docs/RESEARCH.md）
- [x] PRD 完成（docs/PRD.md）
- [x] DEV 完成（docs/DEV.md）
- [x] Step 1–9 完成
- [ ] Step 10 待执行（commit + push + CHANGELOG）

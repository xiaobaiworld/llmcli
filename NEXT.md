# Phase 3 — 内容扩展 + 搜索增强

> 目标：补全飞书域覆盖、新增 GitHub/Notion、优化全文搜索体验
> 参考：docs/DEV.md（Phase 3 规划）

---

## 步骤清单

### Step 1：飞书补全
- [ ] 在 `data/apps/feishu.yaml` 补充以下域：
  - 审批（approval）：发起审批、查询审批状态
  - HR 假期（hr-leave）：查询假期余额、提交请假
  - OKR：创建 OKR、查询进度

### Step 2：新增 GitHub 数据
- [ ] 创建 `data/apps/github.yaml`
  - 工具：gh CLI（官方）+ github-mcp-server（官方）
  - 域：Issue、PR、Actions、Releases、代码搜索、通知

### Step 3：新增 Notion 数据
- [ ] 创建 `data/apps/notion.yaml`
  - 工具：notion-mcp-server（官方）
  - 域：页面管理、数据库、搜索、评论

### Step 4：工具详情页入口（旧工具目录）
- [ ] 将首页 "浏览通用 CLI 工具" 链接指向实际可用的 `/tools` 页
  - 当前 href="/tools" 但该路由不存在（旧首页在 `/`）
  - 方案 A：新建 `src/pages/tools.astro`（重用旧 index.astro 逻辑）
  - 方案 B：保留 `/` 旧首页，新首页改为 `/apps`

### Step 5：搜索体验优化
- [ ] 确认 App 详情页 `data-pagefind-body` 标记被 Pagefind 正确索引
- [ ] 在首页搜索结果中区分「应用功能」和「CLI 工具」两类结果

### Step 6：贡献指南
- [ ] 创建 `CONTRIBUTING.md`（如何贡献新 App / 新工具）
- [ ] 在首页底部加「贡献数据」按钮（指向 GitHub PR）

### Step 7：构建 + 提交
- [ ] `npm run build` 零错误
- [ ] `git commit -m "feat: phase 3 — content expansion"`
- [ ] `git push origin main`
- [ ] 更新 CHANGELOG.md
- [ ] 清空本文件，写 Phase 4 NEXT.md

---

## 当前进度

- [x] Phase 1 完成（Astro 基础框架 + 50 工具）
- [x] Phase 2 完成（App 覆盖矩阵：飞书/企业微信/Obsidian）
- [ ] Step 1–7 待执行

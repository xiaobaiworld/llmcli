# Phase 5 — 質量信號 + 自動化

> 目標：為每個工具/App 加入可信的「質量信號」，讓用戶一眼判斷工具是否值得用

---

## 步驟清單

### Step 1：Agent-ready 評分欄位
- [ ] YAML schema 新增 `agent_ready_score`（0–5）和 `agent_ready_reasons`（list）
- [ ] 評分維度：非互動模式、JSON 輸出、stdin 支持、exit code、MCP 是否存在
- [ ] 更新現有 5 個 App + 工具頁的評分欄位

### Step 2：GitHub 最後活躍時間
- [ ] 寫 `scripts/check-freshness.ts`：讀 YAML repo 欄位 → GitHub API → 輸出最後 commit 日期
- [ ] YAML schema 新增 `last_commit` / `stars` 欄位（腳本填寫，非手動）
- [ ] 首頁/詳情頁展示「最後更新」badge

### Step 3：MCP Server 追蹤頁
- [ ] 新增 `/mcp` 頁面：列出所有 App 的 MCP server 狀態（官方/社區/無）
- [ ] YAML 中已有 `mcp_servers` 欄位，直接聚合展示

### Step 4：搜索增強
- [ ] 首頁搜索框加入 placeholder 示例（「搜索 slack、jq、docker…」）
- [ ] 工具列表支持按 agent_ready_score 排序

### Step 5：Build + commit + deploy
- [ ] `npm run build` 零錯誤
- [ ] `git commit` + `git push` + `vercel deploy --prod`
- [ ] 更新 CHANGELOG.md
- [ ] 清空本文件，寫 Phase 6 NEXT.md

---

## 當前進度

- [x] Phase 1–4 已完成（8 個 App，60 頁，shellnav.com 上線）
- [ ] Step 1–5 待執行

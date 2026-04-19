# Phase 4 — 導航完善 + 新 App + SEO 打磨

> 目標：補齊導航缺口、新增釘釘/Slack/Linear、強化 OG/SEO、修正 footer

---

## 步驟清單

### Step 1：導航欄改版
- [ ] `BaseLayout.astro` nav 加入「應用手冊」和「CLI 工具」兩個入口
- [ ] footer 更新：域名改為 shellnav.com、sitemap 鏈接、貢獻鏈接

### Step 2：Open Graph + SEO meta
- [ ] `BaseLayout.astro` 加 og:title / og:description / og:url / og:type
- [ ] 詳情頁傳入頁面級 og:description

### Step 3：新增釘釘數據
- [ ] 創建 `data/apps/dingtalk.yaml`
  - 工具：dingtalk-mcp（官方）
  - 域：消息、日曆、文檔、審批、待辦

### Step 4：新增 Slack 數據
- [ ] 創建 `data/apps/slack.yaml`
  - 工具：slack-mcp-server（官方 MCP）
  - 域：消息、頻道、文件、工作流

### Step 5：新增 Linear 數據
- [ ] 創建 `data/apps/linear.yaml`
  - 工具：linear-mcp-server（官方）
  - 域：Issue、Project、Cycle、Comment

### Step 6：Build + commit + deploy
- [ ] `npm run build` 零錯誤
- [ ] 更新 sitemap（新增 3 個 app 頁）
- [ ] `git commit` + `git push` + `vercel deploy --prod`
- [ ] 更新 CHANGELOG.md
- [ ] 清空本文件，寫 Phase 5 NEXT.md

---

## 當前進度

- [x] Phase 1–3 已完成（5 個 App，57 頁，shellnav.com 上線）
- [ ] Step 1–6 待執行

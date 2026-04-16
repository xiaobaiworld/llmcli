# llmcli 开发文档 (DEV)

> 技术方案、阶段规划、数据结构定义
> 更新时间：2026-04-14

---

## 一、技术栈

| 层 | 技术 | 原因 |
|----|------|------|
| 框架 | Astro 4（静态输出） | 零运行时成本，Vercel 直接部署 |
| 样式 | Tailwind CSS v3 | 快速迭代，无构建复杂度 |
| 数据 | YAML → js-yaml 读取 | 人类可读，易于贡献 |
| 搜索 | Pagefind | 构建时索引，静态搜索，零后端 |
| 部署 | Vercel（`npm run build` = astro build + pagefind） | 自动 CI/CD |

---

## 二、目录结构

```
llmcli/
├── data/
│   ├── apps/                      # 每个 App 一个 YAML 文件
│   │   ├── feishu.yaml            # 飞书/Lark
│   │   ├── wecom.yaml             # 企业微信
│   │   ├── obsidian.yaml          # Obsidian
│   │   └── ...
│   ├── apps.schema.json           # App YAML 验证 schema
│   └── tools.seed.yaml            # Phase 1 遗留（通用工具，保留备用）
├── docs/                          # 项目文档（所有文档放这里）
│   ├── index.md                   # 文档索引（每次 session 先读）
│   ├── PRD.md                     # 产品需求
│   ├── DEV.md                     # 本文件
│   └── RESEARCH.md                # 市场调研
├── src/
│   ├── components/
│   │   ├── AppCard.astro          # 应用卡片（首页用）
│   │   ├── ToolBadge.astro        # CLI/MCP 工具标签
│   │   ├── CoverageRow.astro      # 功能覆盖行（矩阵用）
│   │   └── ToolCard.astro         # Phase 1 遗留，保留
│   ├── layouts/
│   │   └── BaseLayout.astro       # 全局 HTML 骨架
│   ├── lib/
│   │   ├── apps.ts                # App 数据读取 + 类型定义
│   │   └── tools.ts               # Phase 1 遗留
│   └── pages/
│       ├── index.astro            # 首页（应用网格）
│       ├── app/
│       │   └── [id].astro         # 应用详情页
│       └── tool/
│           └── [id].astro         # Phase 1 遗留工具详情页
├── public/
├── NEXT.md                        # 当前阶段任务（根目录）
├── CHANGELOG.md                   # 变更日志（根目录）
├── CLAUDE.md                      # 项目 AI 助手说明
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
└── vercel.json
```

---

## 三、核心数据结构

### App YAML 格式（data/apps/feishu.yaml 示例片段）

```yaml
# 应用基本信息
id: feishu
name: 飞书 / Lark
description: 字节跳动出品的企业协作套件，覆盖 IM、文档、日历、会议等。
homepage: https://www.feishu.cn
category: enterprise-collab   # enterprise-collab | notes | devtools | project | crm

# 可用的 CLI/MCP 工具
tools:
  - id: larksuite-cli
    name: larksuite/cli
    type: cli                  # cli | mcp | mcp-remote | api
    install_cmd: "npm install -g @larksuite/cli"
    repo: https://github.com/larksuite/cli
    maintained: official       # official | community | unknown
    agent_skills: 22           # 内置 AI Agent Skills 数量

  - id: lark-openapi-mcp
    name: lark-openapi-mcp
    type: mcp
    install_cmd: "npx @larksuite/lark-openapi-mcp"
    repo: https://github.com/larksuite/lark-openapi-mcp
    maintained: official

# 功能覆盖矩阵
domains:
  - id: messenger
    name: 消息 / IM
    features:
      - id: send-text-message
        name: 发送文字消息（单聊）
        status: supported       # supported | partial | unsupported
        tool_id: larksuite-cli
        command: "lark im message send --user @alice --text 'Hello'"
        input: |
          --user: 用户 open_id 或 @mention
          --text: 消息文字内容
        output: |
          { "message_id": "om_xxx", "status": "sent" }
        notes: "支持 text / markdown / card 格式"

      - id: send-group-message
        name: 发送消息到群组
        status: supported
        tool_id: larksuite-cli
        command: "lark im message send --chat @dev-team --text 'Deploy done'"
        input: "--chat: 群组 chat_id 或 @mention"
        output: '{ "message_id": "om_xxx" }'

      - id: recall-message
        name: 撤回消息
        status: unsupported
        gap_reason: "CLI 暂未实现，API 支持但需代码调用"

  - id: docs
    name: 云文档
    features:
      - id: create-doc
        name: 创建文档
        status: supported
        tool_id: larksuite-cli
        command: "lark docs create --title '会议记录' --folder-token xxx"
        output: '{ "doc_token": "doxcnXxx", "url": "https://..." }'

      - id: ai-compose
        name: AI 智能创作
        status: unsupported
        gap_reason: "仅限 GUI，未开放 API"
```

### TypeScript 类型（src/lib/apps.ts）

```typescript
export type CoverageStatus = 'supported' | 'partial' | 'unsupported';
export type ToolType = 'cli' | 'mcp' | 'mcp-remote' | 'api';
export type Maintained = 'official' | 'community' | 'unknown';

export interface Feature {
  id: string;
  name: string;
  status: CoverageStatus;
  tool_id?: string;
  command?: string;
  input?: string;
  output?: string;
  notes?: string;
  gap_reason?: string;
}

export interface Domain {
  id: string;
  name: string;
  features: Feature[];
}

export interface AppTool {
  id: string;
  name: string;
  type: ToolType;
  install_cmd: string;
  repo?: string;
  maintained: Maintained;
  agent_skills?: number;
}

export interface App {
  id: string;
  name: string;
  description: string;
  homepage?: string;
  category: string;
  tools: AppTool[];
  domains: Domain[];
}
```

---

## 四、阶段规划

### Phase 1 ✅（已完成）
- Astro 静态站基础框架
- 50 个通用 CLI 工具（tools.seed.yaml）
- 工具列表页 + 详情页
- Vercel 部署配置

### Phase 2 🔄（当前阶段）
**目标**：重构为以 App 为中心的覆盖矩阵

- [ ] 新 data schema（data/apps.schema.json）
- [ ] 飞书数据（data/apps/feishu.yaml）— 完整功能矩阵
- [ ] 企业微信数据（data/apps/wecom.yaml）
- [ ] Obsidian 数据（data/apps/obsidian.yaml）
- [ ] 新数据层（src/lib/apps.ts）
- [ ] 重构首页（应用网格，保留旧工具入口）
- [ ] 新应用详情页（/app/[id]）
- [ ] 组件：AppCard、CoverageRow、ToolBadge
- [ ] Build + Pagefind 重新索引
- [ ] Commit + Deploy

### Phase 3（下阶段）
- 补全飞书所有域（审批、HR、OKR 的 Gap 分析）
- GitHub、Notion 数据
- 功能搜索（按 feature 名称）
- 贡献指南（CONTRIBUTING.md + PR 模板）

### Phase 4（未来）
- 自动检测工具版本是否过期
- 覆盖率百分比自动计算
- 多语言（中英文）

---

## 五、开发规则

1. **先写文档再写代码**：每个 Phase 开始前确保 NEXT.md 有完整步骤
2. **YAML 是唯一数据源**：所有内容改动只改 YAML，代码不硬编码数据
3. **每步骤 commit 一次**：不要积累大量未提交改动
4. **构建必须通过**：每次提交前运行 `npm run build`，确认零错误
5. **CHANGELOG 必须更新**：每阶段结束写 CHANGELOG，描述做了什么
6. **代码加注释**：所有 `.ts` 文件的函数和接口加 JSDoc 注释

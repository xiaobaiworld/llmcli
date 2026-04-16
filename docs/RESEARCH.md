# 市场调研：AI Agent CLI 工具现状

> 更新时间：2026-04-14
> 调研范围：主流生产力应用的 CLI/MCP 工具覆盖情况

---

## 一、接入方式的三种层次

| 方式 | 耦合度 | 适合场景 | 优点 | 缺点 |
|------|--------|---------|------|------|
| **纯 API** | 高（紧耦合） | SDK 集成 | 功能完整 | 需要写代码调用、对 agent 不友好 |
| **CLI** | 低（松耦合） | Terminal / Agent subprocess | 无需代码、token 效率高、任务完成率高 28% | 功能可能不全、需要安装 |
| **MCP Server** | 标准化松耦合 | 所有 MCP 兼容客户端 | 通用标准、动态工具发现 | 消耗 40-50% context window（debate 中） |

**用户洞察**：纯 API 是紧结合方式，不适合 agent 直接调用。CLI 和 MCP 是 agent 实际可用的两种路径，两者互补。

---

## 二、主要应用 CLI/MCP 工具清单

### 飞书 / Lark

| 工具 | 类型 | 维护方 | 状态 |
|------|------|--------|------|
| [larksuite/cli](https://github.com/larksuite/cli) | CLI | 官方 | ✅ 活跃 |
| [larksuite/lark-openapi-mcp](https://github.com/larksuite/lark-openapi-mcp) | MCP | 官方 | ✅ 活跃 |
| Remote MCP（7天有效链接） | MCP Remote | 官方 | ✅ Beta |
| [yjwong/lark-cli](https://github.com/yjwong/lark-cli) | CLI | 社区 | 🟡 活跃 |

**CLI 覆盖域**：IM 消息、云文档(Docs)、多维表格(Base)、表格(Sheets)、演示文稿(Slides)、日历、邮件、任务、会议 (200+ 命令，22 个 AI Skills)

**已知 Gap**：审批、HR、OKR、考勤、行政（会议室）、企业百科、实名认证

---

### 企业微信 / WeCom

| 工具 | 类型 | 维护方 | 状态 |
|------|------|--------|------|
| [WecomTeam/wecom-cli](https://github.com/WecomTeam/wecom-cli) | CLI | 官方 | ✅ 活跃 |
| [WecomTeam/wecom-openclaw-plugin](https://github.com/WecomTeam/wecom-openclaw-plugin) | OpenClaw Plugin | 官方 | ✅ 活跃 |

**CLI 覆盖域**：消息（单聊/群聊）、日历、文档、智能表格、会议、待办、通讯录 (12 个 AI Skills)

**已知 Gap**：审批/OA、公告、客服、外部联系人(CRM)、支付、打卡/考勤

---

### Obsidian

| 工具 | 类型 | 维护方 | 状态 |
|------|------|--------|------|
| [cyanheads/obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server) | MCP | 社区 | ✅ 活跃 |
| [bitbonsai/mcpvault](https://github.com/bitbonsai/mcpvault) | MCP (无需插件) | 社区 | ✅ 活跃 |
| [jacksteamdev/obsidian-mcp-tools](https://github.com/jacksteamdev/obsidian-mcp-tools) | MCP | 社区 | 🟡 活跃 |

**MCP 覆盖域**：笔记读/写/搜索、标签管理、Frontmatter 操作、Canvas、Dataview 查询、附件管理 (121+ 工具)

**架构分两类**：
- REST API 方案：需要 Obsidian 运行 + Local REST API 插件
- 文件系统方案：直接读写 Markdown，无需 Obsidian 运行

**已知 Gap**：图谱分析(只读不写)、插件管理、主题切换、社区同步(Obsidian Sync)

---

### Notion

| 工具 | 类型 | 维护方 | 状态 |
|------|------|--------|------|
| [notion.so MCP](https://developers.notion.com/docs/mcp) | MCP Remote | 官方 | ✅ 活跃 |

**覆盖域**：页面读/写、数据库查询/更新、搜索
**已知 Gap**：无官方 CLI（只有 Remote MCP）

---

### GitHub

| 工具 | 类型 | 维护方 | 状态 |
|------|------|--------|------|
| [gh CLI](https://github.com/cli/cli) | CLI | 官方 | ✅ 成熟 |
| GitHub MCP Server | MCP | 官方 | ✅ 活跃 |

**覆盖域**：repo、PR、issue、gist、codespace、actions、release
**Agent 友好度**：最高（`--json` 输出、完整退出码、非交互模式）

---

### Slack

| 工具 | 类型 | 维护方 | 状态 |
|------|------|--------|------|
| Slack MCP Server | MCP | 社区/官方 | 🟡 OAuth 复杂 |

**已知 Gap**：无官方 CLI，MCP 依赖 OAuth browser flow，不利于 headless agent

---

### Linear

| 工具 | 类型 | 维护方 | 状态 |
|------|------|--------|------|
| Linear MCP Server | MCP | 官方 | ✅ 活跃 |

**覆盖域**：Issue CRUD、项目管理、团队查询

---

## 三、Agent 互操作性现状（2026 年 4 月）

- **MCP** 已成为行业标准，97M 月下载量，Anthropic/OpenAI/Google/Microsoft 全部支持
- **A2A (Agent-to-Agent)** 协议正在兴起，用于多 agent 协作（MCP 负责工具调用，A2A 负责 agent 间任务传递）
- **CLI 效率更高**：有研究显示 CLI 比 MCP 任务完成率高 28%，token 利用更有效
- **当前局限**：大多数工具还在 API 层，CLI/MCP 覆盖率不足，这正是 llmcli 的机会

---

## 四、数据来源

- [GitHub - larksuite/cli](https://github.com/larksuite/cli)
- [GitHub - WecomTeam/wecom-cli](https://github.com/WecomTeam/wecom-cli)
- [GitHub - cyanheads/obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server)
- [Feishu Open Platform - MCP 文档](https://open.feishu.cn/document/mcp_open_tools/feishu-cli-let-ai-actually-do-your-work-in-feishu)
- [Why CLI Tools Are Beating MCP for AI Agents](https://jannikreinhard.com/2026/02/22/why-cli-tools-are-beating-mcp-for-ai-agents/)
- [MCP vs A2A 2026 Complete Guide](https://dev.to/pockit_tools/mcp-vs-a2a-the-complete-guide-to-ai-agent-protocols-in-2026-30li)

# llmcli 项目文档索引

> 每次开新 session 先读这个文件，确认当前所处阶段，然后按 NEXT.md 继续工作。

## 文档目录

| 文件 | 用途 | 状态 |
|------|------|------|
| [PRD.md](./PRD.md) | 产品需求文档（业务目标、用户、核心功能） | ✅ 已完成 |
| [DEV.md](./DEV.md) | 开发规划（技术方案、阶段拆分、数据结构） | ✅ 已完成 |
| [RESEARCH.md](./RESEARCH.md) | 市场调研（CLI 工具现状、各 App 覆盖情况） | ✅ 已完成 |
| [../NEXT.md](../NEXT.md) | 当前阶段待完成任务（每阶段结束后清空重写） | 🔄 进行中 |
| [../CHANGELOG.md](../CHANGELOG.md) | 变更日志（每阶段完成后追加） | 🔄 进行中 |

## 开发工作流（每个 session 必须遵守）

```
1. 读 docs/index.md        → 了解项目状态
2. 读 NEXT.md              → 知道本阶段要做什么
3. 按 NEXT.md 步骤逐步执行  → 一步一 check
4. 完成后写 CHANGELOG.md   → 记录本阶段产出
5. git commit + push       → 推到 GitHub
6. 清空 NEXT.md 写下一阶段  → 为下次 session 准备
```

## 项目当前状态

- **当前阶段**: Phase 2 — 重构数据模型 + 首批 App 数据
- **上一阶段产出**: Phase 1 已完成 Astro 静态站基础框架（50 个通用 CLI 工具）
- **下一里程碑**: 以 App 为中心的覆盖率矩阵上线（飞书、企业微信、Obsidian）

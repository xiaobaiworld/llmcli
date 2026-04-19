# 贡献指南

感谢你对 **shellnav / llmcli** 的关注！项目的数据完全由社区维护，贡献一个 App 或修正一条功能描述都非常欢迎。

---

## 贡献方式

### 方式 A：新增/修正 App 数据（最常见）

每个 App 是 `data/apps/` 下的一个 YAML 文件。  
格式参考 `data/apps.schema.json`，示例参考 `data/apps/feishu.yaml`。

**步骤：**

```bash
# 1. Fork 本仓库，克隆到本地
git clone https://github.com/xiaobaiworld/llmcli.git
cd llmcli

# 2. 安装依赖
npm install

# 3. 新建或修改 YAML
# 新 App：cp data/apps/feishu.yaml data/apps/yourapp.yaml 然后修改
# 修正已有数据：直接编辑对应 YAML

# 4. 本地预览
npm run dev

# 5. 构建验证（必须零错误）
npm run build

# 6. 提交 PR
git checkout -b feat/add-yourapp
git add data/apps/yourapp.yaml
git commit -m "feat: add yourapp coverage matrix"
git push origin feat/add-yourapp
```

### 方式 B：修正已有工具数据

通用 CLI 工具数据在 `data/tools.seed.yaml`，直接编辑对应条目即可。

---

## App YAML 格式说明

```yaml
id: yourapp              # 小写 kebab-case，唯一
name: YourApp            # 显示名称
description: 一句话描述   # 不超过 60 字
homepage: https://...
category: notes          # enterprise-collab | notes | devtools | project | crm

tools:
  - id: yourapp-cli
    name: yourapp-cli
    type: cli             # cli | mcp | mcp-remote | api
    install_cmd: "brew install yourapp-cli"
    repo: https://github.com/...
    maintained: official  # official | community | unknown

domains:
  - id: notes
    name: 笔记管理
    features:
      - id: create-note
        name: 创建笔记
        status: supported      # supported | partial | unsupported
        tool_id: yourapp-cli
        command: "yourapp note create --title 'Hello'"
        input: "--title: 笔记标题"
        output: '{ "id": "xxx" }'
        notes: "可选备注"

      - id: delete-note
        name: 永久删除笔记
        status: unsupported
        gap_reason: "API 不支持删除，仅 GUI 可操作"
```

**规则：**
- 每个域至少 3 个功能
- `supported` 和 `unsupported` 各至少 1 个
- `supported` 功能必须有完整的 `command`（可直接复制运行）
- `unsupported` / `partial` 必须有 `gap_reason`

---

## PR 审核标准

| 项目 | 要求 |
|------|------|
| 命令可运行 | `command` 字段可直接在终端执行，无占位符 |
| 有依据 | 基于官方文档或亲测，非猜测 |
| 构建通过 | `npm run build` 零错误 |
| 无硬编码数据 | 所有内容改 YAML，不改 `.ts`/`.astro` |

---

## 有问题？

- 开一个 [Issue](https://github.com/xiaobaiworld/llmcli/issues) 描述你遇到的问题
- 或者直接在 PR 中说明背景

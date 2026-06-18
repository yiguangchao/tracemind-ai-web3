# 三天新功能开发计划

目标：在现有“交易哈希解释器”基础上，补齐更适合 GitHub 展示和课程验收的功能闭环。

## 总目标

三天内完成一组小而完整的新功能：

1. 示例交易库：用户不用自己找交易哈希，也能快速体验。
2. 本地历史记录：保留最近查询过的交易，方便学习复盘。
3. 风险解释增强：把规则风险、AI 解释、人工确认清单串成更清晰的学习流程。

最终效果：

```text
选择示例 / 输入交易哈希
↓
查询链上交易
↓
展示交易概览 + 风险评估 + AI/规则解释
↓
自动保存到本地历史
↓
复制 Markdown 学习记录
```

## Day 1：示例交易库

### 目标

让用户进入页面后，可以直接选择一种示例交易进行体验。

### 功能范围

- 新增示例交易数据文件：`src/lib/exampleTransactions.ts`
- 支持示例类型：
  - 普通测试网 ETH 转账
  - 合约调用交易
  - 合约部署交易
  - 失败交易
  - 疑似 ERC-20 approve 交易
- 在输入组件中展示“示例交易”选择区。
- 点击示例后自动填入网络和交易哈希。

### UI 设计

在 `TxInputCard` 中增加一个紧凑的示例列表：

```text
示例交易
[普通转账] [合约调用] [合约部署] [失败交易] [Approve]
```

每个示例包含：

- 标题
- 网络
- 交易哈希
- 简短说明

### 验收标准

- 点击示例后自动填入 network 和 hash。
- 用户可以直接点击“查询交易”。
- README 中说明示例交易可以替换为自己的测试网交易。

## Day 2：本地历史记录

### 目标

用户查询成功后，自动保存最近记录，方便回看和复制学习记录。

### 功能范围

- 新增 `src/lib/history.ts`
- 使用 `localStorage` 保存最近 5 到 10 条查询记录。
- 保存字段：
  - network
  - hash
  - status
  - risk level
  - timestamp
- 首页增加“最近查询”区域。
- 点击历史记录后可以重新填入并查询。
- 支持清空历史。

### UI 设计

建议放在输入卡片下方或右侧：

```text
最近查询
Sepolia · success · medium
0x1234...abcd
2026-06-07 21:30
```

### 验收标准

- 查询成功后自动写入本地历史。
- 刷新页面后历史仍存在。
- 不保存私钥、助记词、钱包敏感信息。
- 可以清空历史。

## Day 3：风险解释增强与交付打磨

### 目标

让项目展示更完整：风险结果更易懂，Markdown 更适合直接提交。

### 功能范围

- 优化 `RiskPanel`
  - 根据风险等级显示不同颜色
  - 展示风险 flags
  - 高风险时突出人工确认
- 优化 Markdown 模板
  - 增加区块浏览器链接
  - 增加风险 flags
  - 增加“我学到了什么”
  - 增加截图建议
- README 增加：
  - 新功能说明
  - 三天计划摘要
  - Demo 截图占位说明
- 补充 `docs/EXAMPLES.md` 中的示例交易占位表。

### 验收标准

- 不同风险等级视觉上容易区分。
- Markdown 内容可以直接作为学习记录提交。
- `npm run typecheck` 通过。
- `npm run lint` 通过。

## 实施顺序

建议按下面顺序开发：

1. Day 1 先做示例交易库，因为它能立刻改善 demo 体验。
2. Day 2 做历史记录，增强学习工具属性。
3. Day 3 做风险展示和 Markdown 打磨，提升提交质量。

## 不纳入三天范围

以下功能建议后续再做，避免三天计划过大：

- 钱包连接
- ABI 解码
- PDF 导出
- 主网交易分析
- 数据库持久化
- 用户账户系统

## 建议提交拆分

```bash
git add src/lib/exampleTransactions.ts src/components/TxInputCard.tsx docs/
git commit -m "feat: add example transaction presets"

git add src/lib/history.ts src/app/page.tsx docs/
git commit -m "feat: add local transaction history"

git add src/components/RiskPanel.tsx src/lib/markdown.ts README.md docs/
git commit -m "feat: improve risk explanation and markdown export"
```

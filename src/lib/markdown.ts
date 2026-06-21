import type { AiExplanationResult, RiskResult, TransactionSummary } from '@/types/transaction';

export function generateTransactionMarkdown(
  transaction: TransactionSummary,
  risk: RiskResult,
  explanation: AiExplanationResult,
) {
  const aiChecklist = explanation.confirmationChecklist.length > 0
    ? explanation.confirmationChecklist.map((item) => `- [ ] ${item}`).join('\n')
    : '- [ ] AI 未提供具体清单，请人工确认交易目的与目标。';

  const ruleChecklist = risk.humanChecklist.length > 0
    ? risk.humanChecklist.map((item) => `- [ ] ${item}`).join('\n')
    : '- [ ] 在区块浏览器中核对交易哈希、状态和目标地址。';

  return `# 测试网交易分析记录

## 1. 基本信息

- 网络：${transaction.network}
- 交易哈希：${transaction.hash}
- 区块浏览器链接：${transaction.explorerUrl}
- 状态：${transaction.status}
- From：${transaction.from}
- To：${transaction.to ?? '无，可能是合约部署交易'}
- Value：${transaction.valueEth} ETH
- Gas Limit：${transaction.gas ?? '未知'}
- Gas Used：${transaction.gasUsed ?? '未知'}
- Effective Gas Price：${transaction.effectiveGasPrice ?? '未知'}
- Block Number：${transaction.blockNumber ?? '未知'}
- Function Selector：${transaction.functionSelector ?? '无'}
- Contract Address：${transaction.contractAddress ?? '无'}
- Logs Count：${transaction.logsCount}

## 2. AI 解读

${explanation.summary}

## 3. 风险检查

- 风险等级：${risk.level}
- 风险说明：${risk.title}

### 风险原因

${risk.reasons.map((item) => `- ${item}`).join('\n')}

### 风险提示

${explanation.riskTip}

## 4. 人工确认清单

${ruleChecklist}

### AI 补充清单

${aiChecklist}

## 5. 我的理解

${explanation.learningNotes}

## 6. 截图建议

- 图 1：项目页面输入交易哈希截图。
- 图 2：链上交易基础信息展示截图。
- 图 3：AI 交易解读和风险提示截图。
- 图 4：区块浏览器交易详情截图。
`;
}

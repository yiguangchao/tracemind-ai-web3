import type { AiExplanationResult, RiskResult, TransactionSummary } from '@/types/transaction';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function explainTransaction(
  transaction: TransactionSummary,
  risk: RiskResult,
): Promise<AiExplanationResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const prompt = buildPrompt(transaction, risk);
  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            '你是一个中文 Web3 交易解释助手。只解释链上数据，不提供投资建议、不编造信息。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI 通信失败: ${response.status} ${text}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content;
  if (!message) {
    throw new Error('OpenAI 未返回有效解释内容');
  }

  return parseAiResponse(message);
}

function buildPrompt(transaction: TransactionSummary, risk: RiskResult) {
  return `请根据以下链上交易信息，用中文生成结构化解释：

- 网络：${transaction.network}
- 交易哈希：${transaction.hash}
- 发送方：${transaction.from}
- 接收方：${transaction.to ?? '空地址 / 合约部署'}
- ETH 值：${transaction.valueEth}
- 状态：${transaction.status}
- 是否失败：${risk.flags.isFailed}
- 是否合约调用：${risk.flags.isContractCall}
- 是否合约部署：${risk.flags.isContractDeployment}
- function selector：${transaction.functionSelector ?? '未知'}
- 是否存在 event logs：${risk.flags.hasLogs}
- 风险等级：${risk.level}
- 风险判断原因：${risk.reasons.join('；')}

请输出：
1. 这笔交易在做什么。
2. 交易参与方说明。
3. 是否涉及 ETH 转账。
4. 是否是合约调用或部署。
5. Gas 和交易状态解释。
6. 对新手的重点提示。
7. 风险点总结。
8. 不确定项说明。

要求：以中文回答，分段清晰，避免编造合约名称或目的，不输出私钥、助记词或签名指引。`;
}

function parseAiResponse(message: string): AiExplanationResult {
  const lines = message.split(/\r?\n/).filter(Boolean);
  const summary = lines.slice(0, 5).join('\n');
  const riskTip = lines.slice(5, 8).join('\n') || '请参考上述风险提示并谨慎操作。';
  const learningNotes = lines.slice(8).join('\n') || '已生成解释，可用于学习和记录。';

  return {
    summary,
    riskTip,
    confirmationChecklist: [],
    learningNotes,
  };
}

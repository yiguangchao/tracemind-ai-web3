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

请严格只返回一个 JSON 对象，且不要附加额外解释文本。JSON 对象必须包含以下字段：
- summary: 简要摘要，说明交易在做什么
- riskTip: 风险提示说明
- confirmationChecklist: 人工确认清单，数组形式，每一项是一个字符串
- learningNotes: 学习记录备注

示例格式：
{
  "summary": "...",
  "riskTip": "...",
  "confirmationChecklist": ["...", "..."],
  "learningNotes": "..."
}

要求：
- 仅返回 JSON，不要返回 Markdown 或额外说明。
- 使用中文字段内容。
- 不要输出私钥、助记词、签名或投资建议。
`;
}

function parseAiResponse(message: string): AiExplanationResult {
  const jsonText = extractJson(message);
  if (jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      return {
        summary: String(parsed.summary ?? '未生成摘要。'),
        riskTip: String(parsed.riskTip ?? '请参考交易风险，并谨慎操作。'),
        confirmationChecklist: normalizeChecklist(parsed.confirmationChecklist),
        learningNotes: String(parsed.learningNotes ?? '已生成学习记录。'),
      };
    } catch {
      // Fall through to text fallback below.
    }
  }

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

function extractJson(text: string): string | null {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1 || first > last) {
    return null;
  }
  return text.slice(first, last + 1);
}

function normalizeChecklist(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map((item) => item.replace(/^\s*[-*\d\.\)]+\s*/, '').trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

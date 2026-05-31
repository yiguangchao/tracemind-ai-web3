import type { AiExplanationResult, RiskResult, TransactionSummary } from '@/types/transaction';

interface MarkdownExportProps {
  transaction: TransactionSummary;
  risk: RiskResult;
  explanation: AiExplanationResult;
}

export function MarkdownExport({ transaction, risk, explanation }: MarkdownExportProps) {
  const markdown = `# 交易学习记录\n\n` +
    `- 网络：${transaction.network}\n` +
    `- 交易哈希：${transaction.hash}\n` +
    `- 状态：${transaction.status}\n` +
    `- 发送方：${transaction.from}\n` +
    `- 接收方：${transaction.to ?? '合约部署 / 空地址'}\n` +
    `- ETH 值：${transaction.valueEth}\n` +
    `- Gas：${transaction.gas}\n` +
    `- Gas Used：${transaction.gasUsed}\n` +
    `- 风险等级：${risk.level}\n\n` +
    `## AI 解释\n${explanation.summary}\n\n` +
    `## 风险提示\n${explanation.riskTip}\n\n` +
    `## 人工确认清单\n${risk.humanChecklist.map((item) => `- ${item}`).join('\n')}\n\n` +
    `## 我的理解\n${explanation.learningNotes}\n`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdown);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Markdown 导出</h2>
          <p className="mt-2 text-slate-400">复制学习记录到 GitHub 仓库或个人笔记。</p>
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          复制 Markdown
        </button>
      </div>
      <pre className="mt-6 max-h-[22rem] overflow-auto rounded-3xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-200 scrollbar-thin">
        {markdown}
      </pre>
    </section>
  );
}

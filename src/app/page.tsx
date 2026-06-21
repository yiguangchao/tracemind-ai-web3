"use client";
import { useState } from 'react';
import { TxInputCard } from '@/components/TxInputCard';
import { TransactionOverview } from '@/components/TransactionOverview';
import { AiExplanation } from '@/components/AiExplanation';
import { RiskPanel } from '@/components/RiskPanel';
import { MarkdownExport } from '@/components/MarkdownExport';
import type { TransactionSummary, RiskResult, AiExplanationResult } from '@/types/transaction';

const initialTransaction: TransactionSummary | null = null;
const initialRisk: RiskResult | null = null;
const initialExplanation: AiExplanationResult | null = null;

function buildFallbackExplanation(
  transaction: TransactionSummary,
  risk: RiskResult,
): AiExplanationResult {
  const actionParts = [
    risk.flags.hasValueTransfer ? '包含原生 ETH 转账' : '未发现原生 ETH 转账',
    risk.flags.isContractDeployment ? '可能是合约部署交易' : null,
    risk.flags.isContractCall ? '包含合约调用数据' : '未发现合约调用数据',
    risk.flags.hasLogs ? '产生了事件日志' : '未发现事件日志',
  ].filter(Boolean);

  return {
    summary: `这是一笔发生在 ${transaction.network} 上的交易，状态为 ${transaction.status}。规则检查显示：${actionParts.join('，')}。`,
    riskTip: `${risk.title} ${risk.reasons.join(' ') || '请在区块浏览器中继续核对交易细节。'}`,
    confirmationChecklist: risk.humanChecklist,
    learningNotes: '本条记录由本地规则生成，可用于没有配置 AI Key 时的学习记录。AI 解释仅是辅助，最终仍应以链上数据和人工核对为准。',
  };
}

export default function HomePage() {
  const [transaction, setTransaction] = useState<TransactionSummary | null>(initialTransaction);
  const [risk, setRisk] = useState<RiskResult | null>(initialRisk);
  const [explanation, setExplanation] = useState<AiExplanationResult | null>(initialExplanation);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'transaction' | 'ai' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleFetch = async (network: string, hash: string) => {
    setLoading(true);
    setLoadingStage('transaction');
    setError(null);
    setAiError(null);
    setTransaction(null);
    setRisk(null);
    setExplanation(null);

    try {
      const txRes = await fetch(`/api/transaction?network=${encodeURIComponent(network)}&hash=${encodeURIComponent(hash)}`);
      const txData = await txRes.json();
      if (!txRes.ok) {
        throw new Error(txData.error || '查询交易失败');
      }
      setTransaction(txData.transaction);
      setRisk(txData.risk);
      setLoadingStage('ai');

      try {
        const explainRes = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: txData.transaction, risk: txData.risk }),
        });
        const explainData = await explainRes.json();
        if (!explainRes.ok) {
          throw new Error(explainData.error || '调用 AI 失败');
        }
        setExplanation(explainData.explanation);
      } catch (aiRequestError) {
        setAiError(aiRequestError instanceof Error ? aiRequestError.message : 'AI 解读暂不可用');
        setExplanation(buildFallbackExplanation(txData.transaction, txData.risk));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
      setLoadingStage(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-soft">
          <h1 className="text-4xl font-semibold text-white">Tracemind AI Web3</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            输入测试网交易哈希，读取链上数据，并生成 AI 中文解释、风险提示和 Markdown 学习记录。
          </p>
        </section>

        <TxInputCard onFetch={handleFetch} loading={loading} />

        {loadingStage ? (
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-sky-100">
            {loadingStage === 'transaction' ? '正在查询链上数据...' : '链上数据已返回，正在生成 AI 解读...'}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-100">{error}</div>
        ) : null}

        {aiError ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100">
            AI 解读暂不可用：{aiError}。链上交易数据和规则风险评估仍可正常查看。
          </div>
        ) : null}

        {transaction ? (
          <section className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <TransactionOverview transaction={transaction} />
              {explanation ? <AiExplanation explanation={explanation} /> : null}
            </div>
            <div className="space-y-6">
              {risk ? <RiskPanel risk={risk} /> : null}
              {transaction && explanation && risk ? (
                <MarkdownExport transaction={transaction} explanation={explanation} risk={risk} />
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

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

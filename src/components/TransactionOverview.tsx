'use client';

import type { TransactionSummary } from '@/types/transaction';

interface TransactionOverviewProps {
  transaction: TransactionSummary;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const copy = async () => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-xl border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-sky-400 hover:text-sky-200"
    >
      复制{label}
    </button>
  );
}

function infoRow(label: string, value: string | number | null, copyValue?: string) {
  return (
    <div className="grid gap-1 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="flex items-start gap-2 break-all text-slate-100">
        <span className="min-w-0 flex-1">{value ?? '-'}</span>
        {copyValue ? <CopyButton value={copyValue} label={label} /> : null}
      </span>
    </div>
  );
}

export function TransactionOverview({ transaction }: TransactionOverviewProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">交易概览</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {infoRow('网络', transaction.network)}
        {infoRow('交易哈希', transaction.hash, transaction.hash)}
        {infoRow('状态', transaction.status)}
        {infoRow('区块高度', transaction.blockNumber)}
        {infoRow('发送方', transaction.from, transaction.from)}
        {infoRow('接收方', transaction.to ?? '合约部署 / 空地址', transaction.to ?? undefined)}
        {infoRow('ETH 值', transaction.valueEth)}
        {infoRow('Gas Limit', transaction.gas)}
        {infoRow('Gas Used', transaction.gasUsed)}
        {infoRow('Effective Gas Price', transaction.effectiveGasPrice)}
        {infoRow('交易索引', transaction.transactionIndex)}
        {infoRow('事件日志数量', transaction.logsCount)}
        {infoRow('合约地址', transaction.contractAddress, transaction.contractAddress ?? undefined)}
        {infoRow('Function Selector', transaction.functionSelector)}
      </div>
      <div className="mt-6 space-y-4">
        <a
          href={transaction.explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-2xl border border-sky-500/50 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:border-sky-300 hover:text-white"
        >
          打开区块浏览器
        </a>
        <details className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-200">查看 input data</summary>
          <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap break-all text-xs text-slate-300">
            {transaction.input}
          </pre>
        </details>
      </div>
    </section>
  );
}

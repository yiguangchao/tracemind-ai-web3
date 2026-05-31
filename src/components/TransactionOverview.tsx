import type { TransactionSummary } from '@/types/transaction';

interface TransactionOverviewProps {
  transaction: TransactionSummary;
}

function infoRow(label: string, value: string | number | null) {
  return (
    <div className="grid gap-1 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="break-all text-slate-100">{value ?? '-'}</span>
    </div>
  );
}

export function TransactionOverview({ transaction }: TransactionOverviewProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">交易概览</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {infoRow('网络', transaction.network)}
        {infoRow('交易哈希', transaction.hash)}
        {infoRow('状态', transaction.status)}
        {infoRow('区块高度', transaction.blockNumber)}
        {infoRow('发送方', transaction.from)}
        {infoRow('接收方', transaction.to ?? '合约部署 / 空地址')}
        {infoRow('ETH 值', transaction.valueEth)}
        {infoRow('Gas Limit', transaction.gas)}
        {infoRow('Gas Used', transaction.gasUsed)}
        {infoRow('Effective Gas Price', transaction.effectiveGasPrice)}
        {infoRow('交易索引', transaction.transactionIndex)}
        {infoRow('事件日志数量', transaction.logsCount)}
      </div>
    </section>
  );
}

import { formatEther } from 'viem';
import type { TransactionSummary } from '@/types/transaction';
import { supportedChains, type SupportedNetwork } from './chains';

export function formatTransactionSummary(transaction: any, receipt: any, network: SupportedNetwork): TransactionSummary {
  const chain = supportedChains[network];
  const valueEth = transaction.value ? formatEther(transaction.value) : '0';
  const input = transaction.input ?? '0x';
  const selector = input !== '0x' ? input.slice(0, 10) : null;
  const status = receipt?.status === 'success'
    ? 'success'
    : receipt?.status === 'reverted'
      ? 'reverted'
      : transaction.blockNumber
        ? 'unknown'
        : 'pending';

  return {
    network: chain.name,
    chainId: chain.id,
    hash: transaction.hash,
    explorerUrl: `${chain.explorerBaseUrl}${transaction.hash}`,
    from: transaction.from,
    to: transaction.to,
    valueEth,
    input,
    functionSelector: selector,
    blockNumber: transaction.blockNumber?.toString() ?? null,
    gas: transaction.gas?.toString() ?? null,
    gasUsed: receipt?.gasUsed?.toString() ?? null,
    effectiveGasPrice: receipt?.effectiveGasPrice ? receipt.effectiveGasPrice.toString() : null,
    status,
    contractAddress: receipt?.contractAddress ?? null,
    logsCount: Array.isArray(receipt?.logs) ? receipt.logs.length : 0,
    transactionIndex: transaction.transactionIndex ?? null,
  };
}

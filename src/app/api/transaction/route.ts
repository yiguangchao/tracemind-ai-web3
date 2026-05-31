import { NextResponse } from 'next/server';
import { createClient } from '@/lib/viemClient';
import { formatTransactionSummary } from '@/lib/transaction';
import { calculateRisk } from '@/lib/riskCheck';
import { isValidTransactionHash } from '@/lib/validators';
import type { SupportedNetwork } from '@/lib/chains';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const network = url.searchParams.get('network') as SupportedNetwork | null;
  const hash = url.searchParams.get('hash') ?? '';

  if (!network) {
    return NextResponse.json({ error: '缺少网络参数' }, { status: 400 });
  }

  if (!isValidTransactionHash(hash)) {
    return NextResponse.json({ error: '交易哈希格式不正确' }, { status: 400 });
  }

  try {
    const client = createClient(network);
    const transaction = await client.getTransaction({ hash });
    if (!transaction) {
      return NextResponse.json({ error: '未找到交易信息' }, { status: 404 });
    }
    const receipt = await client.getTransactionReceipt({ hash });
    const summary = formatTransactionSummary(transaction, receipt, network);
    const risk = calculateRisk(transaction, receipt);

    return NextResponse.json({ transaction: summary, risk });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '查询失败' }, { status: 500 });
  }
}

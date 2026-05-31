import { NextResponse } from 'next/server';
import { explainTransaction } from '@/lib/ai';
import type { RiskResult, TransactionSummary } from '@/types/transaction';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction = body.transaction as TransactionSummary;
    const risk = body.risk as RiskResult;

    if (!transaction || !risk) {
      return NextResponse.json({ error: '请求体缺少 transaction 或 risk' }, { status: 400 });
    }

    const explanation = await explainTransaction(transaction, risk);
    return NextResponse.json({ explanation });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'AI 解释失败' }, { status: 500 });
  }
}

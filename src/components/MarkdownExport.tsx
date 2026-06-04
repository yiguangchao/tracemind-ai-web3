'use client';

import { useState } from 'react';
import type { AiExplanationResult, RiskResult, TransactionSummary } from '@/types/transaction';
import { generateTransactionMarkdown } from '@/lib/markdown';

interface MarkdownExportProps {
  transaction: TransactionSummary;
  risk: RiskResult;
  explanation: AiExplanationResult;
}

export function MarkdownExport({ transaction, risk, explanation }: MarkdownExportProps) {
  const [copied, setCopied] = useState(false);
  const markdown = generateTransactionMarkdown(transaction, risk, explanation);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
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
          {copied ? '已复制' : '复制 Markdown'}
        </button>
      </div>
      <pre className="mt-6 max-h-[22rem] overflow-auto rounded-3xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-200 scrollbar-thin">
        {markdown}
      </pre>
    </section>
  );
}

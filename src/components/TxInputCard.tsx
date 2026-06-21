'use client';

import { useState } from 'react';
import { exampleTransactions } from '@/lib/exampleTransactions';

interface TxInputCardProps {
  loading: boolean;
  onFetch: (network: string, hash: string) => void;
}

export function TxInputCard({ loading, onFetch }: TxInputCardProps) {
  const [network, setNetwork] = useState('sepolia');
  const [hash, setHash] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(null);

  const submit = () => {
    const normalizedHash = hash.trim();
    if (!/^0x[a-fA-F0-9]{64}$/.test(normalizedHash)) {
      setInputError('请输入 0x 开头的 66 位交易哈希。');
      return;
    }

    setInputError(null);
    onFetch(network, normalizedHash);
  };

  const fillExample = (exampleId: string) => {
    const example = exampleTransactions.find((item) => item.id === exampleId);
    if (!example) return;

    setNetwork(example.network);
    setHash(example.hash);
    setSelectedExampleId(example.id);
    setInputError(null);
  };

  const selectedExample = exampleTransactions.find((item) => item.id === selectedExampleId);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">查询交易</h2>
          <p className="text-slate-400">输入测试网交易哈希，从链上读取数据并生成 AI 解释。</p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">示例交易</h3>
            <p className="mt-1 text-sm text-slate-400">选择一个测试网交易，快速体验查询、风险评估和 Markdown 导出。</p>
          </div>
          {selectedExample ? (
            <p className="max-w-md text-sm text-sky-200">{selectedExample.description}</p>
          ) : null}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {exampleTransactions.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => fillExample(example.id)}
              className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                selectedExampleId === example.id
                  ? 'border-sky-400 bg-sky-500/15 text-sky-100'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500'
              }`}
            >
              <span className="block font-semibold">{example.title}</span>
              <span className="mt-1 block text-xs text-slate-400">{example.network === 'sepolia' ? 'Sepolia' : 'Base Sepolia'}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr]">
        <label className="block text-sm text-slate-300">
          网络
          <select
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-400"
            value={network}
            onChange={(event) => setNetwork(event.target.value)}
          >
            <option value="sepolia">Sepolia</option>
            <option value="baseSepolia">Base Sepolia</option>
          </select>
        </label>
        <label className="block text-sm text-slate-300">
          交易哈希
          <input
            value={hash}
            onChange={(event) => {
              setHash(event.target.value);
              setInputError(null);
            }}
            placeholder="0x..."
            aria-invalid={Boolean(inputError)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-400"
          />
          {inputError ? <span className="mt-2 block text-sm text-red-300">{inputError}</span> : null}
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">不上传私钥，不执行转账。仅用于测试网交易解释。</p>
        <button
          type="button"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={submit}
        >
          {loading ? '查询中...' : '查询交易'}
        </button>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';

interface TxInputCardProps {
  loading: boolean;
  onFetch: (network: string, hash: string) => void;
}

const defaultHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

export function TxInputCard({ loading, onFetch }: TxInputCardProps) {
  const [network, setNetwork] = useState('sepolia');
  const [hash, setHash] = useState('');

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">查询交易</h2>
          <p className="text-slate-400">输入测试网交易哈希，从链上读取数据并生成 AI 解释。</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
            onClick={() => setHash(defaultHash)}
          >
            示例哈希
          </button>
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
            onChange={(event) => setHash(event.target.value)}
            placeholder="0x..."
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-400"
          />
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">不上传私钥，不执行转账。仅用于测试网交易解释。</p>
        <button
          type="button"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onFetch(network, hash)}
        >
          {loading ? '查询中...' : '查询交易'}
        </button>
      </div>
    </section>
  );
}

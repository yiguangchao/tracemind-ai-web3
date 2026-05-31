import type { RiskResult } from '@/types/transaction';

interface RiskPanelProps {
  risk: RiskResult;
}

export function RiskPanel({ risk }: RiskPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">风险评估</h2>
      <div className="mt-4 space-y-4 text-slate-200">
        <div className="rounded-2xl bg-slate-950/70 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-400">风险等级</p>
          <p className="mt-2 text-3xl font-semibold text-white">{risk.level}</p>
          <p className="mt-1 text-slate-400">{risk.title}</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">判定原因</h3>
          <ul className="mt-3 space-y-2 text-slate-300">
            {risk.reasons.map((reason) => (
              <li key={reason} className="list-disc pl-5">{reason}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">人工确认清单</h3>
          <ul className="mt-3 space-y-2 text-slate-300">
            {risk.humanChecklist.map((item) => (
              <li key={item} className="list-decimal pl-5">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

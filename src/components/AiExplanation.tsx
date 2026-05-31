import type { AiExplanationResult } from '@/types/transaction';

interface AiExplanationProps {
  explanation: AiExplanationResult;
}

export function AiExplanation({ explanation }: AiExplanationProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">AI 中文解释</h2>
      <div className="mt-6 space-y-4 text-slate-200">
        <div>
          <h3 className="text-base font-semibold text-white">摘要</h3>
          <p className="mt-2 whitespace-pre-wrap">{explanation.summary}</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">风险提示</h3>
          <p className="mt-2 whitespace-pre-wrap">{explanation.riskTip}</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">学习记录</h3>
          <p className="mt-2 whitespace-pre-wrap">{explanation.learningNotes}</p>
        </div>
      </div>
    </section>
  );
}

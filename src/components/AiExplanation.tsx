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
          <h3 className="text-base font-semibold text-white">人工确认清单</h3>
          <ul className="mt-2 space-y-2 text-slate-300">
            {explanation.confirmationChecklist.length > 0 ? (
              explanation.confirmationChecklist.map((item) => (
                <li key={item} className="list-decimal pl-5">{item}</li>
              ))
            ) : (
              <li className="list-decimal pl-5 text-slate-400">AI 未提供具体清单，建议人工确认交易目的与目标。</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">学习记录</h3>
          <p className="mt-2 whitespace-pre-wrap">{explanation.learningNotes}</p>
        </div>
      </div>
    </section>
  );
}

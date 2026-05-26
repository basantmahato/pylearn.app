"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { QuizSet, QuizQuestion } from "../../../../../lib/api";

interface Props {
  set: QuizSet;
  diffColor: string;
}

export default function QuizRunner({ set }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const total = set.questions.length;

  function pick(qi: number, opt: number) {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qi]: opt }));
  }

  function handleSubmit() {
    if (Object.keys(selected).length < total) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setSelected({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const score = useMemo(() => {
    if (!submitted) return 0;
    return set.questions.reduce((acc, q, i) => acc + (selected[i] === q.answer ? 1 : 0), 0);
  }, [set.questions, submitted, selected]);

  const pct = Math.round((score / total) * 100);

  return (
    <div>
      {/* Score Result */}
      {submitted && (
        <div className={`rounded-3xl p-8 mb-8 text-center border-2 transition-all animate-scale-in ${
          pct >= 50 ? "bg-accent/5 border-accent/20" : "bg-error/5 border-error/20"
        }`}>
          <p className={`text-6xl font-black mb-2 ${pct >= 50 ? "text-accent" : "text-error"}`}>
            {score} / {total}
          </p>
          <p className={`text-2xl font-black mb-4 ${pct >= 50 ? "text-accent" : "text-error"}`}>
            {pct}%
          </p>
          <p className="text-text-secondary font-bold mb-6">
            {pct >= 80 ? "🎉 Excellent!" : pct >= 50 ? "👍 Good job!" : "📖 Keep practicing!"}
          </p>

          <div className="bg-border rounded-full h-2.5 overflow-hidden max-w-sm mx-auto">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                pct >= 80 ? "bg-accent" : pct >= 50 ? "bg-accent-warm" : "bg-error"
              } ${
                pct >= 100 ? 'w-[100%]' :
                pct >= 95  ? 'w-[95%]' :
                pct >= 90  ? 'w-[90%]' :
                pct >= 85  ? 'w-[85%]' :
                pct >= 80  ? 'w-[80%]' :
                pct >= 75  ? 'w-[75%]' :
                pct >= 70  ? 'w-[70%]' :
                pct >= 65  ? 'w-[65%]' :
                pct >= 60  ? 'w-[60%]' :
                pct >= 55  ? 'w-[55%]' :
                pct >= 50  ? 'w-[50%]' :
                pct >= 45  ? 'w-[45%]' :
                pct >= 40  ? 'w-[40%]' :
                pct >= 35  ? 'w-[35%]' :
                pct >= 30  ? 'w-[30%]' :
                pct >= 25  ? 'w-[25%]' :
                pct >= 20  ? 'w-[20%]' :
                pct >= 15  ? 'w-[15%]' :
                pct >= 10  ? 'w-[10%]' :
                pct >= 5   ? 'w-[5%]' : 'w-0'
              }`}
            />
          </div>

          <button
            onClick={handleReset}
            className="mt-8 px-10 py-3.5 rounded-full bg-primary text-white font-bold transition-all hover:scale-105 shadow-xl shadow-primary/20"
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {/* Questions */}
      <div className="flex flex-col gap-6">
        {set.questions.map((q, qi) => (
          <QuestionCard
            key={q.id ?? qi}
            q={q}
            qi={qi}
            selected={selected[qi]}
            submitted={submitted}
            onPick={pick}
          />
        ))}
      </div>

      {/* Submit */}
      {!submitted && (
        <div className="text-center mt-12 pb-8">
          <p className="text-text-muted text-sm font-bold mb-4">
            {Object.keys(selected).length} / {total} answered
          </p>
          <button
            onClick={handleSubmit}
            className="btn-primary px-12 py-4 rounded-full font-black text-lg transition-all hover:scale-105 shadow-2xl shadow-primary/30"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}

// ── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({
  q, qi, selected, submitted, onPick,
}: {
  q: QuizQuestion; qi: number; selected: number | undefined; submitted: boolean;
  onPick: (qi: number, opt: number) => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-border p-6 md:p-8 shadow-sm">
      <div className="flex gap-3 items-start mb-6">
        <span className="text-primary font-black text-xl leading-tight">Q{qi + 1}.</span>
        <p className="font-bold text-text text-lg leading-snug">
          {q.question}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {q.options.map((opt, oi) => {
          const isSelected = selected === oi;
          const isCorrect = oi === q.answer;
          
          let stateClass = "bg-bg-surface border-border/50 text-text-secondary hover:border-primary/30 hover:bg-white";
          let badgeClass = "bg-primary/10 text-primary";

          if (submitted) {
            if (isCorrect) {
              stateClass = "bg-accent/10 border-accent/40 text-accent shadow-sm shadow-accent/10";
              badgeClass = "bg-accent text-white";
            } else if (isSelected && !isCorrect) {
              stateClass = "bg-error/10 border-error/40 text-error shadow-sm shadow-error/10";
              badgeClass = "bg-error text-white";
            } else {
              stateClass = "bg-gray-50 border-border/30 text-text-muted opacity-60";
              badgeClass = "bg-gray-200 text-gray-400";
            }
          } else if (isSelected) {
            stateClass = "bg-primary/5 border-primary text-primary shadow-md shadow-primary/10";
            badgeClass = "bg-primary text-white";
          }

          return (
            <button
              key={oi}
              onClick={() => onPick(qi, oi)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-bold text-[0.95rem] transition-all text-left ${
                submitted ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
              } ${stateClass}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors ${badgeClass}`}>
                {String.fromCharCode(65 + oi)}
              </span>
              <span className="flex-1">{opt}</span>
              {submitted && isCorrect && (
                <span className="text-xl">✅</span>
              )}
              {submitted && isSelected && !isCorrect && (
                <span className="text-xl">❌</span>
              )}
            </button>
          );
        })}
      </div>
      {submitted && q.explanation && (
        <div className="mt-6 p-5 bg-primary/5 rounded-2xl border-l-4 border-primary animate-slide-up">
          <p className="text-sm text-text-secondary leading-relaxed">
            <strong className="text-primary uppercase tracking-wider text-[0.7rem] block mb-1">💡 Explanation</strong>
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

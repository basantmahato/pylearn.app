/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

import { useState, useMemo } from "react";
import type { Chapter, QuizSet, QuizQuestion } from "../../lib/api";

interface Props {
  chapters: Chapter[];
  quizSets: QuizSet[];
  error: string;
}

const DIFF_COLOR: Record<string, string> = {
  easy: "#10b981",
  medium: "#f59e0b",
  hard: "#ef4444",
};

export default function QuizClient({ chapters, quizSets, error }: Props) {
  const sorted = [...chapters].sort((a, b) => a.order - b.order);
  const [activeChapter, setActiveChapter] = useState<string>(sorted[0]?.chapterId ?? "");
  const [activeSet, setActiveSet] = useState<QuizSet | null>(null);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const chapterSets = useMemo(
    () => quizSets.filter((s) => s.chapterId === activeChapter),
    [quizSets, activeChapter]
  );

  function openSet(set: QuizSet) {
    setActiveSet(set);
    setSelected({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pick(qi: number, opt: number) {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qi]: opt }));
  }

  function handleSubmit() {
    if (Object.keys(selected).length < (activeSet?.questions.length ?? 0)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
  }

  const score = useMemo(() => {
    if (!activeSet || !submitted) return 0;
    return activeSet.questions.reduce((acc, q, i) => acc + (selected[i] === q.answer ? 1 : 0), 0);
  }, [activeSet, submitted, selected]);

  if (error) {
    return (
      <div className="container" style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", flexDirection: "column", alignItems: "center",
          gap: 16, background: "rgba(186,26,26,0.06)", border: "1px solid rgba(186,26,26,0.2)",
          borderRadius: 20, padding: "40px 48px",
        }}>
          <span style={{ fontSize: "2.5rem" }}>⚠️</span>
          <p style={{ color: "#ba1a1a", fontWeight: 600 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (activeSet) {
    return <QuizRunner
      set={activeSet}
      selected={selected}
      submitted={submitted}
      score={score}
      onPick={pick}
      onSubmit={handleSubmit}
      onBack={() => setActiveSet(null)}
    />;
  }

  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <span className="section-label"> Practice</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Quiz Bank
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8, maxWidth: 540, margin: "8px auto 0" }}>
            100+ chapter-wise MCQs with instant feedback &amp; explanations.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>
          {/* Chapter Sidebar */}
          <aside style={{
            background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)", overflow: "hidden", position: "sticky", top: 100,
          }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
              <p style={{ fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--primary)" }}>
                Chapters
              </p>
            </div>
            <nav style={{ padding: 8 }}>
              {sorted.map((ch) => {
                const active = ch.chapterId === activeChapter;
                const count = quizSets.filter((s) => s.chapterId === ch.chapterId).length;
                return (
                  <button
                    key={ch.chapterId}
                    id={`quiz-ch-${ch.chapterId}`}
                    onClick={() => setActiveChapter(ch.chapterId)}
                    style={{
                      width: "100%", textAlign: "left", padding: "10px 14px",
                      borderRadius: 12, border: "none", cursor: "pointer",
                      background: active ? "rgba(0,90,181,0.1)" : "transparent",
                      color: active ? "var(--primary)" : "var(--text-secondary)",
                      fontWeight: active ? 700 : 500, fontSize: "0.875rem",
                      transition: "var(--transition)", display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <span>{ch.title}</span>
                    {count > 0 && (
                      <span style={{ background: active ? "var(--primary)" : "var(--bg-surface)", color: active ? "#fff" : "var(--text-muted)", fontSize: "0.7rem", fontWeight: 700, padding: "2px 7px", borderRadius: 100 }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Quiz Sets Grid */}
          <div>
            {chapterSets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
                <span style={{ fontSize: "2.5rem" }}>📭</span>
                <p style={{ marginTop: 12, fontWeight: 600 }}>No quizzes yet for this chapter.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {chapterSets.map((set) => {
                  const diff = set.difficulty?.toLowerCase() ?? "medium";
                  const color = DIFF_COLOR[diff] ?? "#005ab5";
                  return (
                    <button
                      key={set._id}
                      id={`quiz-set-${set.setId}`}
                      onClick={() => openSet(set)}
                      className="card"
                      style={{
                        padding: "24px", textAlign: "left", cursor: "pointer",
                        border: "none", width: "100%", background: "var(--bg-card)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: "1.8rem" }}>🧩</span>
                        <span style={{ background: `${color}18`, color, fontSize: "0.7rem", fontWeight: 800, padding: "4px 10px", borderRadius: 100, textTransform: "uppercase" }}>
                          {set.difficulty ?? "Medium"}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: 6 }}>{set.setName}</h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{set.questions.length} questions</p>
                      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem" }}>
                        Start Quiz
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Quiz Runner ──────────────────────────────────────────────────────── */

interface RunnerProps {
  set: QuizSet;
  selected: Record<number, number>;
  submitted: boolean;
  score: number;
  onPick: (qi: number, opt: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

function QuizRunner({ set, selected, submitted, score, onPick, onSubmit, onBack }: RunnerProps) {
  const total = set.questions.length;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        {/* Back button */}
        <button
          id="quiz-back-btn"
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontWeight: 700, marginBottom: 24, fontSize: "0.9rem" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Quizzes
        </button>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))", borderRadius: 24, padding: "28px 32px", color: "#fff", marginBottom: 24 }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase" }}>Quiz</p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginTop: 4 }}>{set.setName}</h2>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: "0.85rem", opacity: 0.85 }}>
            <span>🧩 {total} questions</span>
            {set.difficulty && <span>📊 {set.difficulty}</span>}
          </div>
        </div>

        {/* Score result */}
        {submitted && (
          <div style={{
            background: score / total >= 0.5 ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
            border: `1.5px solid ${score / total >= 0.5 ? "#10b981" : "#ef4444"}`,
            borderRadius: 20, padding: "24px 32px", marginBottom: 24, textAlign: "center",
          }}>
            <p style={{ fontSize: "2.5rem", fontWeight: 900, color: score / total >= 0.5 ? "#10b981" : "#ef4444" }}>
              {score} / {total}
            </p>
            <p style={{ color: "var(--text-secondary)", marginTop: 4, fontWeight: 600 }}>
              {score / total >= 0.8 ? "🎉 Excellent!" : score / total >= 0.5 ? "👍 Good job!" : "📖 Keep practicing!"}
            </p>
          </div>
        )}

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {set.questions.map((q, qi) => (
            <QuestionCard key={q.id ?? qi} q={q} qi={qi} selected={selected[qi]} submitted={submitted} onPick={onPick} />
          ))}
        </div>

        {!submitted && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button
              id="quiz-submit-btn"
              onClick={onSubmit}
              className="btn btn-primary btn-lg"
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function QuestionCard({ q, qi, selected, submitted, onPick }: {
  q: QuizQuestion; qi: number; selected: number | undefined; submitted: boolean;
  onPick: (qi: number, opt: number) => void;
}) {
  return (
    <div className="card" style={{ padding: "24px 28px" }}>
      <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 16, lineHeight: 1.5 }}>
        <span style={{ color: "var(--primary)", marginRight: 8 }}>Q{qi + 1}.</span>
        {q.question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, oi) => {
          const isSelected = selected === oi;
          const isCorrect = oi === q.answer;
          let bg = "var(--bg-surface)";
          let borderColor = "transparent";
          let color = "var(--text-secondary)";
          if (submitted) {
            if (isCorrect) { bg = "rgba(16,185,129,0.12)"; borderColor = "#10b981"; color = "#059669"; }
            else if (isSelected && !isCorrect) { bg = "rgba(239,68,68,0.1)"; borderColor = "#ef4444"; color = "#ef4444"; }
          } else if (isSelected) {
            bg = "rgba(0,90,181,0.1)"; borderColor = "var(--primary)"; color = "var(--primary)";
          }
          return (
            <button
              key={oi}
              id={`q${qi}-opt${oi}`}
              onClick={() => onPick(qi, oi)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                borderRadius: 12, border: `1.5px solid ${borderColor || "var(--border)"}`,
                background: bg, color, fontWeight: 500, fontSize: "0.9rem",
                cursor: submitted ? "default" : "pointer", textAlign: "left", transition: "var(--transition)",
              }}
            >
              <span style={{ minWidth: 26, height: 26, borderRadius: "50%", background: borderColor === "transparent" ? "rgba(0,90,181,0.08)" : borderColor, color: isSelected || isCorrect ? "#fff" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>
                {String.fromCharCode(65 + oi)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {submitted && q.explanation && (
        <div style={{ marginTop: 14, padding: "12px 16px", background: "rgba(0,90,181,0.05)", borderRadius: 12, borderLeft: "3px solid var(--primary)" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--primary)" }}>💡 Explanation: </strong>{q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

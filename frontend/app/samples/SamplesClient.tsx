/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

import { useState } from "react";
import type { SamplePaper } from "../../lib/api";

interface Props {
  papers: SamplePaper[];
  error: string;
}

const DIFF_COLOR: Record<string, string> = {
  easy: "#10b981",
  medium: "#f59e0b",
  hard: "#ef4444",
};

export default function SamplesClient({ papers, error }: Props) {
  const [activePaper, setActivePaper] = useState<SamplePaper | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const difficulties = ["all", ...Array.from(new Set(papers.map((p) => (p.difficulty ?? "Medium").toLowerCase())))];

  const filtered = papers.filter((p) => {
    if (filter === "all") return true;
    return (p.difficulty ?? "medium").toLowerCase() === filter;
  });

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

  if (activePaper) {
    return <PaperDetail paper={activePaper} onBack={() => setActivePaper(null)} />;
  }

  return (
    <section className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <span className="section-label"> Practice Papers</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Sample Papers
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8, maxWidth: 540, margin: "8px auto 0" }}>
            Full-length CBSE Class 12 Python sample papers with section-wise questions &amp; explanations.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          {difficulties.map((d) => (
            <button
              key={d}
              id={`filter-${d}`}
              onClick={() => setFilter(d)}
              style={{
                padding: "8px 20px", borderRadius: 100, border: "1.5px solid",
                borderColor: filter === d ? "var(--primary)" : "var(--border)",
                background: filter === d ? "var(--primary)" : "var(--bg-card)",
                color: filter === d ? "#fff" : "var(--text-secondary)",
                fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
                textTransform: "capitalize", transition: "var(--transition)",
              }}
            >
              {d === "all" ? "All Papers" : d}
            </button>
          ))}
        </div>

        {/* Papers Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "2.5rem" }}>📭</span>
            <p style={{ marginTop: 12, fontWeight: 600 }}>No papers found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filtered.map((paper, i) => {
              const diff = (paper.difficulty ?? "Medium").toLowerCase();
              const dColor = DIFF_COLOR[diff] ?? "#005ab5";
              const totalQ = (paper.sections ?? []).reduce((acc, s) => acc + (s.questions ?? []).length, 0);
              return (
                <button
                  key={paper._id}
                  id={`paper-${paper.paperId}`}
                  onClick={() => setActivePaper(paper)}
                  className="card"
                  style={{ padding: "28px", textAlign: "left", cursor: "pointer", border: "none", width: "100%", background: "var(--bg-card)" }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: `linear-gradient(135deg, ${dColor}20, ${dColor}35)`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
                    }}>
                      📄
                    </div>
                    <span style={{ background: `${dColor}18`, color: dColor, fontSize: "0.7rem", fontWeight: 800, padding: "4px 10px", borderRadius: 100, textTransform: "uppercase" }}>
                      {paper.difficulty ?? "Medium"}
                    </span>
                  </div>

                  <div style={{ marginBottom: 4, color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                    PAPER {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", lineHeight: 1.4, marginBottom: 6 }}>{paper.title}</h3>
                  {paper.subtitle && <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: 12 }}>{paper.subtitle}</p>}

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: "auto" }}>
                    {paper.totalMarks && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                        ⭐ {paper.totalMarks} marks
                      </span>
                    )}
                    {paper.duration && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                        ⏱ {paper.duration}
                      </span>
                    )}
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                      ❓ {totalQ} questions
                    </span>
                  </div>

                  <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6, color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem" }}>
                    View Paper
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Paper Detail View ─────────────────────────────────────────────────── */

function PaperDetail({ paper, onBack }: { paper: SamplePaper; onBack: () => void }) {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <button
          id="paper-back-btn"
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontWeight: 700, marginBottom: 24, fontSize: "0.9rem" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Papers
        </button>

        {/* Paper header */}
        <div style={{ background: "linear-gradient(135deg, #0f1729, #1e2d50)", borderRadius: 24, padding: "32px", color: "#fff", marginBottom: 28 }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, opacity: 0.6, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            {paper.paperId}
          </p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, lineHeight: 1.3 }}>{paper.title}</h2>
          {paper.subtitle && <p style={{ opacity: 0.7, marginTop: 6, fontSize: "0.9rem" }}>{paper.subtitle}</p>}
          <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
            {paper.duration && <Chip icon="⏱" label={paper.duration} />}
            {paper.totalMarks && <Chip icon="⭐" label={`${paper.totalMarks} Marks`} />}
            {paper.difficulty && <Chip icon="📊" label={paper.difficulty} />}
          </div>
        </div>

        {/* Sections */}
        {(paper.sections ?? []).map((section) => (
          <div key={section.sectionId} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "var(--primary)", color: "#fff", fontWeight: 800, fontSize: "0.8rem", padding: "6px 14px", borderRadius: 100 }}>
                {section.sectionId}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>{section.title}</h3>
              {section.marks && <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>{section.marks} marks</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(section.questions ?? []).map((q, qi) => (
                <div key={q.id ?? qi} className="card" style={{ padding: "20px 24px" }}>
                  <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: q.options && q.options.length > 0 ? 12 : 0, lineHeight: 1.55 }}>
                    <span style={{ color: "var(--primary)", marginRight: 8 }}>Q{qi + 1}.</span>
                    {q.question}
                    {q.marks && <span style={{ color: "var(--text-muted)", fontWeight: 500, marginLeft: 8, fontSize: "0.82rem" }}>[{q.marks} mark{q.marks > 1 ? "s" : ""}]</span>}
                  </p>
                  {q.options && q.options.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {q.options.map((opt, oi) => (
                        <div key={oi} style={{
                          display: "flex", gap: 10, padding: "10px 14px", borderRadius: 10,
                          background: oi === q.answer ? "rgba(16,185,129,0.08)" : "var(--bg-surface)",
                          border: `1.5px solid ${oi === q.answer ? "#10b981" : "transparent"}`,
                        }}>
                          <span style={{ color: "var(--primary)", fontWeight: 800, fontSize: "0.8rem", minWidth: 20 }}>
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          <span style={{ fontSize: "0.87rem", color: oi === q.answer ? "#059669" : "var(--text-secondary)", fontWeight: oi === q.answer ? 600 : 400 }}>
                            {opt}
                          </span>
                          {oi === q.answer && <span style={{ marginLeft: "auto", fontSize: "0.8rem" }}>✅</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.explanation && (
                    <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(0,90,181,0.05)", borderRadius: 10, borderLeft: "3px solid var(--primary)" }}>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        <strong style={{ color: "var(--primary)" }}>💡 </strong>{q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", padding: "6px 14px", borderRadius: 100, fontSize: "0.8rem", fontWeight: 600 }}>
      {icon} {label}
    </span>
  );
}

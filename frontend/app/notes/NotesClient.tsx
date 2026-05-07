/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

import { useState, useMemo } from "react";
import type { Chapter, NoteBlock } from "../../lib/api";

interface Props {
  chapters11: Chapter[];
  chapters12: Chapter[];
  notes: NoteBlock[];
  error: string;
}

const COLORS = ["#005ab5", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

export default function NotesClient({ chapters11, chapters12, notes, error }: Props) {
  const [activeClass, setActiveClass] = useState<11 | 12>(12);
  const chapters = activeClass === 11 ? chapters11 : chapters12;
  const sorted = [...chapters].sort((a, b) => a.order - b.order);
  const [activeChapter, setActiveChapter] = useState<string>(sorted[0]?.chapterId ?? "");
  const [search, setSearch] = useState("");

  // Reset active chapter when switching classes
  const handleClassChange = (cls: 11 | 12) => {
    setActiveClass(cls);
    const newChapters = cls === 11 ? chapters11 : chapters12;
    const sortedNew = [...newChapters].sort((a, b) => a.order - b.order);
    setActiveChapter(sortedNew[0]?.chapterId ?? "");
    setSearch("");
  };

  const chapterNotes = useMemo(
    () =>
      notes
        .filter((n) => n.chapterId === activeChapter)
        .filter((n) => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          return (
            n.heading?.toLowerCase().includes(q) ||
            n.text?.toLowerCase().includes(q) ||
            n.items?.some((i) => i.toLowerCase().includes(q)) ||
            n.code?.toLowerCase().includes(q)
          );
        })
        .sort((a, b) => a.order - b.order),
    [notes, activeChapter, search]
  );

  const activeChapterData = sorted.find((c) => c.chapterId === activeChapter);

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

  return (
    <section className="section">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <span className="section-label"> Study Material</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text)" }}>
            Chapter Notes
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8, maxWidth: 540, margin: "8px auto 0" }}>
            Structured notes for every chapter — paragraphs, bullet points &amp; code examples.
          </p>
        </div>

        {/* Class Selector Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
          <button
            onClick={() => handleClassChange(11)}
            style={{
              padding: "12px 28px",
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              background: activeClass === 11 ? "#8b5cf6" : "var(--card-bg)",
              color: activeClass === 11 ? "#fff" : "var(--text-secondary)",
              boxShadow: activeClass === 11 ? "0 4px 14px rgba(139,92,246,0.35)" : "var(--shadow-sm)",
            }}
          >
            Class 11
          </button>
          <button
            onClick={() => handleClassChange(12)}
            style={{
              padding: "12px 28px",
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              background: activeClass === 12 ? "#005ab5" : "var(--card-bg)",
              color: activeClass === 12 ? "#fff" : "var(--text-secondary)",
              boxShadow: activeClass === 12 ? "0 4px 14px rgba(0,90,181,0.35)" : "var(--shadow-sm)",
            }}
          >
            Class 12
          </button>
        </div>

        {/* Search */}
        <div style={{ maxWidth: 480, margin: "0 auto 32px", position: "relative" }}>
          <input
            id="notes-search"
            type="text"
            placeholder="Search within notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 44px",
              borderRadius: 100, border: "1.5px solid var(--border)",
              background: "var(--bg-card)", color: "var(--text)",
              fontSize: "0.9rem", outline: "none",
              boxShadow: "var(--shadow-sm)", transition: "var(--transition)",
            }}
          />
          <svg style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>
          {/* Chapter Sidebar */}
          <aside style={{
            background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)", overflow: "hidden", position: "sticky", top: 100,
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
              <p style={{ fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--primary)" }}>
                Class {activeClass} • {sorted.length} Chapters
              </p>
            </div>
            <nav style={{ padding: 8 }}>
              {sorted.map((ch, i) => {
                const active = ch.chapterId === activeChapter;
                return (
                  <button
                    key={ch.chapterId}
                    id={`chapter-btn-${ch.chapterId}`}
                    onClick={() => { setActiveChapter(ch.chapterId); setSearch(""); }}
                    style={{
                      width: "100%", textAlign: "left", padding: "10px 14px",
                      borderRadius: 12, border: "none", cursor: "pointer",
                      background: active ? `${COLORS[i % COLORS.length]}14` : "transparent",
                      color: active ? COLORS[i % COLORS.length] : "var(--text-secondary)",
                      fontWeight: active ? 700 : 500, fontSize: "0.875rem",
                      transition: "var(--transition)", display: "flex", alignItems: "center", gap: 10,
                    }}
                  >
                    <span style={{
                      minWidth: 26, height: 26, borderRadius: 8,
                      background: active ? COLORS[i % COLORS.length] : "var(--bg-surface)",
                      color: active ? "#fff" : "var(--text-muted)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 800,
                    }}>
                      {ch.order}
                    </span>
                    {ch.title}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Notes Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Chapter header card */}
            {activeChapterData && (
              <div style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                borderRadius: 24, padding: "28px 32px", color: "#fff",
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Chapter {activeChapterData.order}
                </p>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, letterSpacing: "-0.02em", marginTop: 4 }}>
                  {activeChapterData.title}
                </h2>
                {activeChapterData.summary?.short_summary && (
                  <p style={{ marginTop: 8, opacity: 0.85, fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {activeChapterData.summary.short_summary}
                  </p>
                )}
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 600 }}>
                    {chapterNotes.length} blocks
                  </span>
                </div>
              </div>
            )}

            {chapterNotes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
                <span style={{ fontSize: "2.5rem" }}>📭</span>
                <p style={{ marginTop: 12, fontWeight: 600 }}>
                  {search ? "No results for your search." : "No notes yet for this chapter."}
                </p>
              </div>
            ) : (
              chapterNotes.map((note) => <NoteCard key={note._id} note={note} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NoteCard({ note }: { note: NoteBlock }) {
  if (note.type === "code") {
    return (
      <div style={{
        background: "#0f1729", borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)", boxShadow: "var(--shadow-md)",
      }}>
        {note.heading && (
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: "0.75rem", background: "rgba(0,90,181,0.3)", color: "#4d96e0", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
              {note.language ?? "python"}
            </span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", fontWeight: 600 }}>{note.heading}</span>
          </div>
        )}
        <pre style={{ padding: "20px 24px", overflowX: "auto", margin: 0, color: "#a5f3fc", fontSize: "0.875rem", lineHeight: 1.7 }}>
          <code>{note.code}</code>
        </pre>
      </div>
    );
  }

  if (note.type === "bullet_list") {
    return (
      <div className="card" style={{ padding: "24px 28px" }}>
        {note.heading && <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 14, color: "var(--text)" }}>{note.heading}</h3>}
        <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {note.items?.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ minWidth: 22, height: 22, borderRadius: 6, background: "rgba(0,90,181,0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, marginTop: 1 }}>
                {i + 1}
              </span>
              <span style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.9rem" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // paragraph
  return (
    <div className="card" style={{ padding: "24px 28px" }}>
      {note.heading && <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 10, color: "var(--text)" }}>{note.heading}</h3>}
      {note.text && <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: "0.9rem" }}>{note.text}</p>}
    </div>
  );
}

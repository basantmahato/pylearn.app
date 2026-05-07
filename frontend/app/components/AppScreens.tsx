/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

import { useState } from "react";

const SCREENS = [
  {
    id: "home",
    label: "Home",
    icon: "🏠",
    color: "#005ab5",
    description: "Your personalised learning dashboard with progress tracking, streak counter, and quick-access bento cards.",
    content: (
      <div style={{ padding: "16px 14px", height: "100%", background: "#f8faff", overflowY: "auto" }}>
        {/* Greeting */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>Good Morning 👋</div>
          <div style={{ fontSize: "18px", fontWeight: 900, color: "#0f1729", letterSpacing: "-0.03em" }}>Arjun Kumar</div>
        </div>
        {/* Progress Hero */}
        <div style={{ background: "linear-gradient(135deg, #005ab5, #4d96e0)", borderRadius: "20px", padding: "18px", marginBottom: "14px" }}>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "6px" }}>OVERALL PROGRESS</div>
          <div style={{ color: "#fff", fontSize: "28px", fontWeight: 900, letterSpacing: "-0.04em" }}>72%</div>
          <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "100px", height: "6px", marginTop: "8px" }}>
            <div style={{ width: "72%", height: "100%", background: "#fff", borderRadius: "100px" }} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "9px", marginTop: "6px" }}>13 of 18 chapters completed</div>
        </div>
        {/* Bento Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "Notes", icon: "📚", pct: "72%", color: "#005ab5", bg: "#eef4ff" },
            { label: "Quiz", icon: "🧠", pct: "68%", color: "#059669", bg: "#f0fdf4" },
            { label: "Samples", icon: "📄", pct: "45%", color: "#d97706", bg: "#fffbeb" },
            { label: "Profile", icon: "👤", pct: "85%", color: "#7c3aed", bg: "#faf5ff" },
          ].map(c => (
            <div key={c.label} style={{ background: c.bg, borderRadius: "16px", padding: "14px", border: `1px solid ${c.color}20` }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{c.icon}</div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#0f1729" }}>{c.label}</div>
              <div style={{ background: "rgba(0,0,0,0.07)", borderRadius: "100px", height: "4px", marginTop: "8px" }}>
                <div style={{ width: c.pct, height: "100%", background: c.color, borderRadius: "100px" }} />
              </div>
              <div style={{ fontSize: "9px", color: c.color, fontWeight: 700, marginTop: "4px" }}>{c.pct}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "notes",
    label: "Notes",
    icon: "📚",
    color: "#005ab5",
    description: "Browse all 18 Python chapters across 5 units. Search instantly, filter by topic, and bookmark chapters you want to revisit.",
    content: (
      <div style={{ padding: "14px", height: "100%", background: "#f8faff", overflowY: "auto" }}>
        <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f1729", letterSpacing: "-0.03em", marginBottom: "4px" }}>Notes</div>
        <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "14px" }}>Search Python chapters & units</div>
        {/* Search Bar */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #e5e7eb", marginBottom: "14px" }}>
          <span>🔍</span>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Search chapters...</span>
        </div>
        {/* Units */}
        {[
          { unit: "Unit 1 – Python Fundamentals", chapters: ["Ch 1: Introduction to Python", "Ch 2: Variables & Data Types", "Ch 3: Control Flow"] },
          { unit: "Unit 2 – Functions & Modules", chapters: ["Ch 4: Functions", "Ch 5: Modules & Packages"] },
          { unit: "Unit 3 – File Handling", chapters: ["Ch 6: File Handling Basics", "Ch 7: CSV Files"] },
        ].map(u => (
          <div key={u.unit} style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>{u.unit}</div>
            {u.chapters.map(ch => (
              <div key={ch} style={{
                background: "#fff", borderRadius: "12px", padding: "10px 12px",
                marginBottom: "6px", border: "1px solid #e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#0f1729" }}>{ch}</span>
                <span style={{ fontSize: "14px" }}>›</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: "🧠",
    color: "#059669",
    description: "10 quiz sets per chapter, colour-coded by difficulty from Easy (blue) to Expert (black). Expand any chapter to pick your set.",
    content: (
      <div style={{ padding: "14px", height: "100%", background: "#f8faff", overflowY: "auto" }}>
        <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f1729", letterSpacing: "-0.03em", marginBottom: "4px" }}>Smart Quiz</div>
        <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "16px" }}>Select a module and test your mastery</div>
        {/* Chapter Cards */}
        {[
          { ch: "Ch 1: Introduction to Python", sets: [1,2,3,4,5,6,7,8,9,10], open: true },
          { ch: "Ch 2: Variables & Data Types", sets: [], open: false },
          { ch: "Ch 3: Control Flow Statements", sets: [], open: false },
        ].map(item => (
          <div key={item.ch} style={{ background: "#fff", borderRadius: "16px", padding: "12px 14px", marginBottom: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#0f1729" }}>{item.ch}</div>
              <span style={{ fontSize: "14px" }}>{item.open ? "▲" : "▽"}</span>
            </div>
            <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "2px" }}>Module · 10 Sets</div>
            {item.open && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "10px" }}>
                {item.sets.map(s => {
                  const colors = ["#005ab5","#006adc","#007eea","#b35e00","#ca6a00","#e17600","#ba1a1a","#d32f2f","#f44336","#111c2d"];
                  return (
                    <div key={s} style={{
                      padding: "8px", borderRadius: "10px", background: "#f8faff",
                      border: "1px solid #e5e7eb", textAlign: "center",
                    }}>
                      <div style={{ fontSize: "9px", fontWeight: 900, color: colors[s-1], letterSpacing: "0.1em", textTransform: "uppercase" }}>SET {s}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "samples",
    label: "Sample Papers",
    icon: "📄",
    color: "#d97706",
    description: "20 comprehensive Python sample papers. Filter by difficulty, search by name, and track which ones you've completed.",
    content: (
      <div style={{ padding: "14px", height: "100%", background: "#f8faff", overflowY: "auto" }}>
        <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f1729", letterSpacing: "-0.03em", marginBottom: "4px" }}>Sample Papers</div>
        <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "12px" }}>Practice with 20 comprehensive assessments</div>
        {/* Stats */}
        <div style={{ background: "rgba(0,90,181,0.06)", borderRadius: "16px", padding: "12px 14px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>📊</span>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 900, color: "#0f1729" }}>20</div>
            <div style={{ fontSize: "9px", color: "#6b7280" }}>Total Papers</div>
          </div>
        </div>
        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
          {["All","Easy","Medium","Hard"].map((f, i) => (
            <div key={f} style={{
              padding: "4px 10px", borderRadius: "100px", fontSize: "9px", fontWeight: 700,
              background: i === 0 ? "#005ab5" : "#f3f4f6",
              color: i === 0 ? "#fff" : "#6b7280",
              border: i === 0 ? "none" : "1px solid #e5e7eb",
            }}>{f}</div>
          ))}
        </div>
        {/* Paper List */}
        {["Sample Paper 1 – Full Syllabus", "Sample Paper 2 – Unit 1 Focus", "Sample Paper 3 – OOP Deep Dive", "Sample Paper 4 – File Handling"].map((p, i) => (
          <div key={p} style={{
            background: "#fff", borderRadius: "12px", padding: "10px 12px",
            marginBottom: "6px", border: "1px solid #e5e7eb",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#0f1729" }}>{p}</div>
              <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "2px" }}>
                {["Easy","Medium","Hard","Medium"][i]} · 30 Questions
              </div>
            </div>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i < 2 ? "#10b981" : "#e5e7eb",
            }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: "👤",
    color: "#7c3aed",
    description: "Your personal stats hub — chapters completed, quiz averages, current streak, bookmarked chapters, and recent quiz history.",
    content: (
      <div style={{ padding: "14px", height: "100%", background: "#f8faff", overflowY: "auto" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #e8f0ff, #c7d8ff)",
            margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px",
          }}>🦊</div>
          <div style={{ fontSize: "16px", fontWeight: 900, color: "#0f1729" }}>Arjun Kumar</div>
          <div style={{ fontSize: "10px", color: "#9ca3af" }}>Python Student</div>
        </div>
        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
          {[
            { icon: "📖", label: "Completed", value: "13/18", color: "#005ab5" },
            { icon: "📈", label: "Progress", value: "72%", color: "#059669" },
            { icon: "🧠", label: "Quizzes", value: "47", color: "#d97706" },
            { icon: "🏆", label: "Avg Score", value: "81%", color: "#7c3aed" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: "12px", padding: "10px", border: "1px solid #e5e7eb", textAlign: "center" }}>
              <div style={{ fontSize: "16px" }}>{s.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: 900, color: "#0f1729" }}>{s.value}</div>
              <div style={{ fontSize: "9px", color: "#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Streak Banner */}
        <div style={{ background: "rgba(0,90,181,0.06)", borderRadius: "14px", padding: "12px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "18px" }}>🔥</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f1729" }}>Current Streak</span>
          </div>
          <span style={{ fontSize: "22px", fontWeight: 900, color: "#005ab5" }}>12</span>
        </div>
        {/* Bookmarks */}
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#0f1729", marginBottom: "8px" }}>Bookmarked Chapters</div>
        {["Ch 5: Modules & Packages","Ch 8: OOP Concepts"].map(b => (
          <div key={b} style={{ background: "#fff", borderRadius: "10px", padding: "9px 12px", marginBottom: "5px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🔖</span>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#0f1729" }}>{b}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function AppScreens() {
  const [active, setActive] = useState(0);
  const screen = SCREENS[active];

  return (
    <section className="section" id="screens" style={{ background: "var(--bg-surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>
             App Screens
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)", marginBottom: "16px" }}>
            See Every Screen in Action
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75 }}>
            Click each tab to explore exactly how PyLearn looks and works — right here in your browser.
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "56px",
        }}>
          {SCREENS.map((s, i) => (
            <button
              key={s.id}
              id={`screen-tab-${s.id}`}
              onClick={() => setActive(i)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", borderRadius: "100px",
                border: active === i ? "none" : "1.5px solid var(--border)",
                background: active === i ? `linear-gradient(135deg, ${s.color}, ${s.color}cc)` : "#fff",
                color: active === i ? "#fff" : "var(--text-secondary)",
                fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                transition: "var(--transition)",
                boxShadow: active === i ? `0 4px 20px ${s.color}40` : "none",
              }}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }} className="screen-grid">
          {/* Left: Description */}
          <div>
            <div className={`badge badge-${["blue","blue","green","yellow","purple"][active]}`} style={{ marginBottom: "20px" }}>
              {screen.icon} {screen.label}
            </div>
            <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "var(--text)", marginBottom: "16px", letterSpacing: "-0.03em" }}>
              {screen.label === "Home" && "Your Learning Dashboard"}
              {screen.label === "Notes" && "Structured Study Notes"}
              {screen.label === "Quiz" && "Smart Quiz Engine"}
              {screen.label === "Sample Papers" && "Practice Sample Papers"}
              {screen.label === "Profile" && "Track Your Progress"}
            </h3>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "32px" }}>
              {screen.description}
            </p>

            {/* Feature pills for the active tab */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {[
                ["18 Chapters", "5 Units", "Bookmarks", "Search"],
                ["18 Chapters", "Search & Filter", "Topic Pills", "Progress Track"],
                ["100+ Sets", "10 Sets/Chapter", "Difficulty Colors", "Score History"],
                ["20 Papers", "Easy-Hard Filter", "Search", "Completion Track"],
                ["Stats Grid", "Streak Counter", "Bookmarks", "Activity Log"],
              ][active].map(tag => (
                <span key={tag} style={{
                  padding: "6px 14px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 600,
                  background: `${screen.color}12`, color: screen.color,
                  border: `1px solid ${screen.color}25`,
                }}>
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Phone Preview */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="phone-mockup" style={{ width: 300, height: 600 }}>
              <div className="phone-notch" />
              <div className="phone-screen">
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflowY: "auto" }}>
                  {/* Status Bar */}
                  <div style={{ background: "#f8faff", padding: "14px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 5 }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f1729" }}>9:41</span>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #005ab5, #4d96e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>Py</div>
                  </div>
                  {/* Screen Content */}
                  <div style={{ paddingBottom: "80px" }}>
                    {screen.content}
                  </div>
                </div>

                {/* Tab Bar */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "10px 8px 14px", display: "flex", justifyContent: "space-around", zIndex: 10 }}>
                  {SCREENS.map((s, i) => (
                    <div
                      key={s.id}
                      onClick={() => setActive(i)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                        cursor: "pointer", padding: "4px 6px", borderRadius: "8px",
                        color: active === i ? s.color : "#9ca3af",
                        fontSize: "9px", fontWeight: 700,
                        transition: "var(--transition)",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{s.icon}</span>
                      {s.label.split(" ")[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .screen-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

const UNITS = [
  {
    id: "U1",
    title: "Python Fundamentals",
    color: "#005ab5",
    bg: "#eef4ff",
    icon: "🐍",
    chapters: ["Introduction to Python", "Variables & Data Types", "Operators", "Control Flow (if/else)", "Loops (for/while)"],
  },
  {
    id: "U2",
    title: "Functions & Modules",
    color: "#059669",
    bg: "#f0fdf4",
    icon: "⚙️",
    chapters: ["Functions & Scope", "Recursion", "Built-in Functions", "Modules & Packages", "Python Standard Library"],
  },
  {
    id: "U3",
    title: "Data Structures",
    color: "#d97706",
    bg: "#fffbeb",
    icon: "📦",
    chapters: ["Lists & Tuples", "Dictionaries", "Sets", "Stacks & Queues", "Sorting Algorithms"],
  },
  {
    id: "U4",
    title: "Object-Oriented Programming",
    color: "#7c3aed",
    bg: "#faf5ff",
    icon: "🏗️",
    chapters: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation", "Exception Handling"],
  },
  {
    id: "U5",
    title: "File Handling & Databases",
    color: "#dc2626",
    bg: "#fef2f2",
    icon: "💾",
    chapters: ["Text Files", "Binary Files", "CSV Files", "SQL Basics", "MySQL with Python"],
  },
];

export default function Syllabus() {
  return (
    <section className="section" id="syllabus" style={{ background: "#fff" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>
            Full Curriculum
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)", marginBottom: "16px" }}>
            Complete CBSE Class 12 Syllabus
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75 }}>
            Every topic in the official CBSE Computer Science (Python) syllabus — 18 chapters across 5 units, fully covered.
          </p>
        </div>

        {/* Unit Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {UNITS.map((unit) => (
            <div
              key={unit.id}
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "28px",
                background: unit.bg,
                border: `1px solid ${unit.color}20`,
                transition: "var(--transition)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px ${unit.color}15`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Unit header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "14px",
                  background: `${unit.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem", border: `1px solid ${unit.color}25`,
                }}>
                  {unit.icon}
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: unit.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {unit.id}
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--text)", fontSize: "1rem", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                    {unit.title}
                  </div>
                </div>
              </div>

              {/* Chapter List */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {unit.chapters.map((ch, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      fontSize: "0.875rem", color: "var(--text-secondary)",
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.6)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.8)",
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: `${unit.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.65rem", fontWeight: 700, color: unit.color, flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    {ch}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div style={{
          textAlign: "center",
          marginTop: "48px",
          padding: "28px 32px",
          background: "linear-gradient(135deg, rgba(0,90,181,0.05), rgba(139,92,246,0.05))",
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(0,90,181,0.1)",
        }}>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
            ✅ All 18 chapters are available <strong>completely free</strong> — notes, quizzes, and sample papers included.
            No subscription, no hidden fees.
          </p>
        </div>
      </div>
    </section>
  );
}

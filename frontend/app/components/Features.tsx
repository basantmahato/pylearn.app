/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

export default function Features() {
  const features = [
    {
      icon: "📚",
      iconBg: "rgba(0,90,181,0.1)",
      color: "#005ab5",
      badge: "Notes",
      badgeClass: "badge-blue",
      title: "Structured Chapter Notes",
      description:
        "Every CBSE Class 12 Python topic — from fundamentals to file handling, OOP, and stacks — covered in beautifully organised, easy-to-read notes.",
      bullets: ["18 chapters across 5 units", "Search & filter by topic", "Bookmark chapters for later", "Track reading progress"],
    },
    {
      icon: "🧠",
      iconBg: "rgba(16,185,129,0.1)",
      color: "#059669",
      badge: "Quiz",
      badgeClass: "badge-green",
      title: "Smart Adaptive Quizzes",
      description:
        "10 difficulty-graded quiz sets per chapter, colour-coded from Easy to Expert. Test your knowledge and watch your score climb with every attempt.",
      bullets: ["100+ quiz sets total", "10 sets per chapter", "Colour-coded difficulty", "Instant score & feedback"],
    },
    {
      icon: "📄",
      iconBg: "rgba(245,158,11,0.1)",
      color: "#d97706",
      badge: "Sample Papers",
      badgeClass: "badge-yellow",
      title: "20 Sample Papers",
      description:
        "Exam-pattern sample papers covering the full syllabus. Filter by difficulty, search by topic, and practice end-to-end like a real board exam.",
      bullets: ["20 full-length papers", "Easy / Medium / Hard filter", "Searchable paper library", "Completion tracking"],
    },
    {
      icon: "📊",
      iconBg: "rgba(139,92,246,0.1)",
      color: "#7c3aed",
      badge: "Profile",
      badgeClass: "badge-purple",
      title: "Progress & Streak Tracking",
      description:
        "Your personal learning dashboard — overall progress, quiz averages, daily streaks, bookmarks, and a full activity history all in one place.",
      bullets: ["Chapter & quiz analytics", "Daily streak calendar", "Bookmark manager", "Recent activity timeline"],
    },
    {
      icon: "🔍",
      iconBg: "rgba(0,90,181,0.08)",
      color: "#005ab5",
      badge: "Search",
      badgeClass: "badge-blue",
      title: "Instant Search & Discovery",
      description:
        "Find any chapter, topic, or concept in milliseconds. Topic-pill shortcuts let you jump straight into OOP, File I/O, Stacks, and more.",
      bullets: ["Full-text chapter search", "Topic-pill quick-filter", "Unit-level navigation", "Zero-latency results"],
    },
    {
      icon: "🏆",
      iconBg: "rgba(245,158,11,0.08)",
      color: "#d97706",
      badge: "Gamification",
      badgeClass: "badge-yellow",
      title: "Daily Challenges & Streaks",
      description:
        "Stay motivated with a daily challenge system. Maintain streaks, earn personal bests, and turn exam preparation into an engaging daily habit.",
      bullets: ["Daily challenge prompts", "Streak risk alerts", "Personal best tracking", "Longest streak records"],
    },
  ];

  return (
    <section className="section" id="features" style={{ background: "#fff" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>
             Everything You Need
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)", marginBottom: "16px" }}>
            One App. Complete Python Prep.
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.75 }}>
            PyLearn brings together everything a CBSE Class 12 student needs to master Python — beautifully designed, distraction-free.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}>
          {features.map((feat, i) => (
            <div key={i} className="card" style={{ padding: "32px" }}>
              {/* Icon + Badge Row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                <div className="icon-box" style={{ background: feat.iconBg, fontSize: "1.6rem" }}>
                  {feat.icon}
                </div>
                <span className={`badge ${feat.badgeClass}`}>{feat.badge}</span>
              </div>

              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                {feat.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", lineHeight: 1.75, marginBottom: "20px" }}>
                {feat.description}
              </p>

              {/* Bullet List */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {feat.bullets.map((b, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: feat.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill={feat.color}>
                        <path d="M10 3L5 8.5 2 5.5" stroke={feat.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

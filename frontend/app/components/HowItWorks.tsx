/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: "📲",
      title: "Download PyLearn",
      description:
        "Install the free app from the Play Store or App Store. Set up your profile with a name and avatar — no sign-up required.",
      color: "#005ab5",
      bg: "rgba(0,90,181,0.08)",
    },
    {
      step: "02",
      icon: "📚",
      title: "Study Chapter Notes",
      description:
        "Browse 18 structured chapters across 5 units. Read at your own pace, bookmark key chapters, and track your reading progress automatically.",
      color: "#059669",
      bg: "rgba(16,185,129,0.08)",
    },
    {
      step: "03",
      icon: "🧠",
      title: "Take Adaptive Quizzes",
      description:
        "After reading, challenge yourself with 10 difficulty-graded quiz sets. Review your answers instantly and watch your score improve each round.",
      color: "#d97706",
      bg: "rgba(245,158,11,0.08)",
    },
    {
      step: "04",
      icon: "📄",
      title: "Practice Sample Papers",
      description:
        "Attempt full-length sample papers in exam style. Filter by difficulty and check off completed papers to measure your readiness.",
      color: "#7c3aed",
      bg: "rgba(139,92,246,0.08)",
    },
    {
      step: "05",
      icon: "🔥",
      title: "Build Daily Streaks",
      description:
        "Return every day to maintain your streak. The Daily Challenge keeps you motivated, and alerts warn you before your streak breaks.",
      color: "#dc2626",
      bg: "rgba(220,38,38,0.08)",
    },
    {
      step: "06",
      icon: "🏆",
      title: "Ace Your Exams",
      description:
        "With consistent practice tracked in your profile — chapters read, quizzes taken, and papers attempted — walk into exams with full confidence.",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
    },
  ];

  return (
    <section className="section" id="how-it-works" style={{ background: "#fff" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>
             How It Works
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)", marginBottom: "16px" }}>
            From Download to Distinction
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75 }}>
            PyLearn is built around a simple, proven loop: study → quiz → practice → repeat. Here&apos;s the full journey.
          </p>
        </div>

        {/* Steps Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                border: "1px solid var(--border)",
                transition: "var(--transition)",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
                (e.currentTarget as HTMLDivElement).style.borderColor = `${step.color}30`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
              }}
            >
              {/* Step Number (Watermark) */}
              <div style={{
                position: "absolute",
                top: "16px", right: "20px",
                fontSize: "4rem", fontWeight: 900,
                color: step.color,
                lineHeight: 1,
                letterSpacing: "-0.05em",
                userSelect: "none" as const,
                opacity: 0.12,
              }}>
                {step.step}
              </div>

              {/* Icon */}
              <div style={{
                width: 56, height: 56,
                borderRadius: "16px",
                background: step.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.6rem",
                marginBottom: "20px",
              }}>
                {step.icon}
              </div>

              {/* Step Label */}
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: step.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
                Step {step.step}
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text)", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

export default function Testimonials() {
  const reviews = [
    {
      name: "Priya Sharma",
      role: "Class 12 Student, Delhi",
      avatar: "🐱",
      avatarBg: "#fce4ec",
      rating: 5,
      text: "PyLearn completely changed how I study Python. The chapter notes are so much clearer than my textbook, and the quiz difficulty levels really helped me identify my weak spots. Got 95% in my boards!",
      tag: "⭐ Board Topper",
      tagColor: "#f59e0b",
    },
    {
      name: "Rahul Verma",
      role: "Class 12 Student, Mumbai",
      avatar: "🐶",
      avatarBg: "#e3f2fd",
      rating: 5,
      text: "The sample papers are exactly like the actual board exam pattern. I attempted all 20 before my exam and felt completely prepared. The streak feature kept me disciplined throughout my prep.",
      tag: "📄 Sample Paper Fan",
      tagColor: "#005ab5",
    },
    {
      name: "Ananya Gupta",
      role: "Class 12 Student, Bangalore",
      avatar: "🐼",
      avatarBg: "#e8f5e9",
      rating: 5,
      text: "I love how the Quiz page lets you pick exactly which chapter and difficulty. No more random practice — I could focus on exactly what I needed. The profile page tracking is super motivating too!",
      tag: "🧠 Quiz Champion",
      tagColor: "#059669",
    },
    {
      name: "Karan Mehta",
      role: "Class 12 Student, Pune",
      avatar: "🐰",
      avatarBg: "#f3e5f5",
      rating: 5,
      text: "Maintaining a 21-day streak was the push I needed. Every morning I'd open the app, read a chapter, and do a quiz set. PyLearn made studying Python actually enjoyable — something I never thought possible.",
      tag: "🔥 Streak Master",
      tagColor: "#dc2626",
    },
    {
      name: "Sneha Patel",
      role: "Class 12 Student, Ahmedabad",
      avatar: "🦊",
      avatarBg: "#fff3e0",
      rating: 5,
      text: "The bookmarks feature is so useful — I'd bookmark chapters I found tough and revisit them before the exam. The search is super fast and the topic filter pills are genius. 10/10 app!",
      tag: "📚 Notes Nerd",
      tagColor: "#7c3aed",
    },
    {
      name: "Arjun Singh",
      role: "Class 12 Student, Jaipur",
      avatar: "🐧",
      avatarBg: "#e0f7fa",
      rating: 5,
      text: "I was struggling with OOP and file handling until PyLearn. The chapters break everything down perfectly, and after 3 quiz sets I could answer any question confidently. Best free study app for CS!",
      tag: "💡 Concept Clicker",
      tagColor: "#0891b2",
    },
  ];

  return (
    <section className="section" id="testimonials" style={{ background: "var(--bg)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>
             Student Reviews
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)", marginBottom: "16px" }}>
            Loved by Class 12 Students
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}>
            Thousands of students have improved their Python scores with PyLearn. Here&apos;s what they say.
          </p>

          {/* Aggregate Rating */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "var(--text)" }}>4.9 / 5</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>from 2,400+ reviews</div>
          </div>
        </div>

        {/* Review Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}>
          {reviews.map((r, i) => (
            <div key={i} className="testimonial-card">
              {/* Stars */}
              <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= r.rating ? "#f59e0b" : "#e5e7eb"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                marginBottom: "20px",
                fontStyle: "italic",
              }}>
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: r.avatarBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.3rem", flexShrink: 0,
                  }}>
                    {r.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.9rem" }}>{r.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{r.role}</div>
                  </div>
                </div>

                <span style={{
                  padding: "4px 10px", borderRadius: "100px",
                  fontSize: "0.7rem", fontWeight: 700,
                  background: `${r.tagColor}12`,
                  color: r.tagColor,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {r.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

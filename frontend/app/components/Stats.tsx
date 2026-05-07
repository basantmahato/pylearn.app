/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 18, suffix: "", label: "Python Chapters", icon: "📚", color: "#005ab5", desc: "Covering full CBSE Class 12 syllabus" },
  { value: 100, suffix: "+", label: "Quiz Sets", icon: "🧠", color: "#059669", desc: "10 adaptive sets per chapter" },
  { value: 20, suffix: "", label: "Sample Papers", icon: "📄", color: "#d97706", desc: "Full-length board-pattern papers" },
  { value: 10, suffix: "K+", label: "Students", icon: "🎓", color: "#7c3aed", desc: "Across India preparing with PyLearn" },
  { value: 4.9, suffix: "★", label: "App Rating", icon: "⭐", color: "#f59e0b", desc: "2,400+ verified reviews" },
  { value: 5, suffix: " Units", label: "Curriculum Units", icon: "🗂️", color: "#dc2626", desc: "Mapped to CBSE CS syllabus" },
];

function Counter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const isDecimal = target % 1 !== 0;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section
      className="section"
      id="stats"
      style={{
        background: "linear-gradient(135deg, #0f1729 0%, #1a2540 50%, #0f1729 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 600px 400px at 20% 50%, rgba(0,90,181,0.15) 0%, transparent 70%), radial-gradient(ellipse 500px 350px at 80% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ justifyContent: "center", color: "rgba(255,255,255,0.6)" }}>
            By the Numbers
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", marginBottom: "16px" }}>
            Built for Serious Learners
          </h2>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}>
            Numbers don&apos;t lie — PyLearn is packed with content and trusted by thousands of Class 12 students.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}>
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-lg)",
                padding: "32px 24px",
                textAlign: "center",
                transition: "var(--transition)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.09)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.borderColor = `${stat.color}60`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: "14px",
                background: `${stat.color}20`,
                border: `1px solid ${stat.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.4rem", margin: "0 auto 20px",
              }}>
                {stat.icon}
              </div>

              {/* Counter */}
              <div style={{
                fontSize: "2.8rem", fontWeight: 900, lineHeight: 1,
                letterSpacing: "-0.04em",
                color: stat.color,
                marginBottom: "8px",
              }}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>

              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "24px", fontSize: "0.95rem" }}>
            Join 10,000+ students already learning with PyLearn
          </p>
          <a href="#download" className="btn btn-primary btn-lg" style={{ display: "inline-flex" }}>
            Start Learning Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

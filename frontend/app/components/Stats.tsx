"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 50, suffix: "+", label: "Chapters Added", icon: "📚", color: "text-primary", hex: "#005ab5", desc: "Across all categories and units" },
  { value: 500, suffix: "+", label: "Quiz Questions", icon: "🧠", color: "text-accent", hex: "#059669", desc: "Adaptive difficulty for every chapter" },
  { value: 30, suffix: "+", label: "Sample Papers", icon: "📄", color: "text-accent-warm", hex: "#d97706", desc: "Targeted practice for all courses" },
  { value: 10, suffix: "K+", label: "Students", icon: "🎓", color: "text-purple", hex: "#7c3aed", desc: "Learning Python & CS with PyLearn" },
  { value: 4.9, suffix: "★", label: "App Rating", icon: "⭐", color: "text-yellow-500", hex: "#f59e0b", desc: "2,400+ verified reviews" },
  { value: 5, suffix: "", label: "Courses Offered", icon: "🗂️", color: "text-red-500", hex: "#dc2626", desc: "Class 11, 12, BCA, B.Tech & AI" },
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
      className="py-24 md:py-28 bg-[#0f1729] relative overflow-hidden"
      id="stats"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-purple/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-white/50 mb-4">
            <div className="flex-1 h-px bg-white/10 min-w-[20px]" />
            By the Numbers
            <div className="flex-1 h-px bg-white/10 min-w-[20px]" />
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-white leading-tight mb-4 tracking-tight">
            Built for Serious Learners
          </h2>
          <p className="text-lg text-white/60 max-w-[480px] mx-auto leading-relaxed">
            Numbers don&apos;t lie — PyLearn is packed with content and trusted by thousands of students across India.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="group bg-white/5 border border-white/10 rounded-3xl p-8 text-center transition-all hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 backdrop-blur-md"
            >
              {/* Icon */}
              <div 
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl mx-auto mb-5 transition-transform group-hover:scale-110 shadow-lg ${stat.color.replace('text-', 'bg-')}/15 ${stat.color.replace('text-', 'border-')}/30`}
              >
                {stat.icon}
              </div>

              {/* Counter */}
              <div 
                className={`text-[3rem] font-black leading-none tracking-tighter mb-2 ${stat.color}`}
              >
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>

              <div className="text-lg font-black text-white mb-1.5 tracking-tight">
                {stat.label}
              </div>
              <div className="text-[0.9rem] text-white/45 leading-relaxed">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/50 mb-6 text-[0.95rem] font-medium tracking-wide">
            Join 10,000+ students already learning with PyLearn
          </p>
          <a href="#download" className="btn-primary px-8 py-4 text-base rounded-full font-bold inline-flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-primary/25">
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

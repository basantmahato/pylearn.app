"use client";

import { useState } from "react";

const SCREENS = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    color: "primary",
    hex: "#005ab5",
    description: "Your personalised learning dashboard with progress tracking, streak counter, and quick-access bento cards.",
    content: (
      <div className="p-4 h-full bg-bg overflow-y-auto">
        {/* Greeting */}
        <div className="mb-3.5">
          <div className="text-[11px] text-text-muted font-semibold">Good Morning</div>
          <div className="text-lg font-black text-text tracking-tight">Arjun Kumar</div>
        </div>
        {/* Progress Hero */}
        <div className="bg-gradient-to-br from-primary to-primary-light rounded-[20px] p-4.5 mb-3.5">
          <div className="text-white/75 text-[9px] font-bold tracking-wider mb-1.5 uppercase">OVERALL PROGRESS</div>
          <div className="text-white text-[28px] font-black tracking-tight leading-none">72%</div>
          <div className="bg-white/25 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="w-[72%] h-full bg-white rounded-full" />
          </div>
          <div className="text-white/75 text-[9px] mt-1.5">13 of 18 chapters completed</div>
        </div>
        {/* Bento Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Notes", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            ), pct: "72%", color: "primary", bg: "bg-primary/5", border: "border-primary/10" },
            { label: "Quiz", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ), pct: "68%", color: "accent", bg: "bg-accent/5", border: "border-accent/10" },
            { label: "Samples", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            ), pct: "45%", color: "accent-warm", bg: "bg-accent-warm/5", border: "border-accent-warm/10" },
            { label: "Profile", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ), pct: "85%", color: "purple", bg: "bg-purple/5", border: "border-purple/10" },
          ].map(c => (
            <div key={c.label} className={`${c.bg} rounded-2xl p-3.5 border ${c.border}`}>
              <div className={`mb-1.5 text-${c.color}`}>{c.icon}</div>
              <div className="text-xs font-extrabold text-text tracking-tight">{c.label}</div>
              <div className="bg-black/7 rounded-full h-1 mt-2 overflow-hidden">
                <div className={`h-full rounded-full bg-${c.color} ${
                  c.pct === '72%' ? 'w-[72%]' :
                  c.pct === '68%' ? 'w-[68%]' :
                  c.pct === '45%' ? 'w-[45%]' : 'w-[85%]'
                }`} />
              </div>
              <div className={`text-[9px] font-bold mt-1 text-${c.color}`}>{c.pct}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "notes",
    label: "Notes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    ),
    color: "primary",
    hex: "#005ab5",
    description: "Browse all 18 Python chapters across 5 units. Search instantly, filter by topic, and bookmark chapters you want to revisit.",
    content: (
      <div className="p-3.5 h-full bg-bg overflow-y-auto">
        <div className="text-xl font-black text-text tracking-tight mb-1">Notes</div>
        <div className="text-[10px] text-text-secondary mb-3.5">Search Python chapters & units</div>
        {/* Search Bar */}
        <div className="bg-white rounded-xl p-2.5 px-3 flex items-center gap-2 border border-border mb-3.5 shadow-sm text-text-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span className="text-[11px] font-medium">Search chapters...</span>
        </div>
        {/* Units */}
        {[
          { unit: "Unit 1 – Python Fundamentals", chapters: ["Ch 1: Introduction to Python", "Ch 2: Variables & Data Types", "Ch 3: Control Flow"] },
          { unit: "Unit 2 – Functions & Modules", chapters: ["Ch 4: Functions", "Ch 5: Modules & Packages"] },
          { unit: "Unit 3 – File Handling", chapters: ["Ch 6: File Handling Basics", "Ch 7: CSV Files"] },
        ].map(u => (
          <div key={u.unit} className="mb-3.5">
            <div className="text-[9px] font-black text-text-muted tracking-[0.12em] uppercase mb-2">{u.unit}</div>
            {u.chapters.map(ch => (
              <div key={ch} className="bg-white rounded-xl p-2.5 px-3 mb-1.5 border border-border flex items-center justify-between shadow-sm">
                <span className="text-[11px] font-bold text-text tracking-tight">{ch}</span>
                <span className="text-sm text-text-muted">›</span>
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
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    ),
    color: "accent",
    hex: "#059669",
    description: "10 quiz sets per chapter, colour-coded by difficulty from Easy (blue) to Expert (black). Expand any chapter to pick your set.",
    content: (
      <div className="p-3.5 h-full bg-bg overflow-y-auto">
        <div className="text-xl font-black text-text tracking-tight mb-1">Smart Quiz</div>
        <div className="text-[10px] text-text-secondary mb-4">Select a module and test your mastery</div>
        {/* Chapter Cards */}
        {[
          { ch: "Ch 1: Introduction to Python", sets: [1,2,3,4,5,6,7,8,9,10], open: true },
          { ch: "Ch 2: Variables & Data Types", sets: [], open: false },
          { ch: "Ch 3: Control Flow Statements", sets: [], open: false },
        ].map(item => (
          <div key={item.ch} className="bg-white rounded-2xl p-3.5 px-4 mb-2 border border-border shadow-sm">
            <div className="flex justify-between items-center">
              <div className="text-[11px] font-extrabold text-text tracking-tight">{item.ch}</div>
              <span className="text-xs text-text-muted">{item.open ? "▲" : "▼"}</span>
            </div>
            <div className="text-[9px] text-text-muted mt-0.5 font-medium">Module · 10 Sets</div>
            {item.open && (
              <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                {item.sets.map(s => {
                  const colors = ["text-blue-600","text-blue-500","text-blue-400","text-amber-600","text-amber-500","text-amber-400","text-red-600","text-red-500","text-red-400","text-slate-900"];
                  return (
                    <div key={s} className="p-2 rounded-xl bg-bg border border-border text-center">
                      <div className={`text-[9px] font-black tracking-widest uppercase ${colors[s-1]}`}>SET {s}</div>
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
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
    ),
    color: "accent-warm",
    hex: "#d97706",
    description: "20 comprehensive Python sample papers. Filter by difficulty, search by name, and track which ones you've completed.",
    content: (
      <div className="p-3.5 h-full bg-bg overflow-y-auto">
        <div className="text-xl font-black text-text tracking-tight mb-1">Sample Papers</div>
        <div className="text-[10px] text-text-secondary mb-3">Practice with 20 comprehensive assessments</div>
        {/* Stats */}
        <div className="bg-primary/5 rounded-2xl p-3 px-4 mb-3 flex items-center gap-2.5 border border-primary/10 text-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          <div>
            <div className="text-lg font-black text-text tracking-tight leading-none">20</div>
            <div className="text-[9px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">Total Papers</div>
          </div>
        </div>
        {/* Filter Pills */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {["All","Easy","Medium","Hard"].map((f, i) => (
            <div key={f} className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
              i === 0 ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border"
            }`}>{f}</div>
          ))}
        </div>
        {/* Paper List */}
        {["Sample Paper 1 – Full Syllabus", "Sample Paper 2 – Unit 1 Focus", "Sample Paper 3 – OOP Deep Dive", "Sample Paper 4 – File Handling"].map((p, i) => (
          <div key={p} className="bg-white rounded-xl p-2.5 px-3 mb-1.5 border border-border flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-extrabold text-text tracking-tight leading-tight">{p}</div>
              <div className="text-[9px] text-text-muted mt-0.5 font-bold">
                {["Easy","Medium","Hard","Medium"][i]} · 30 Questions
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${i < 2 ? "bg-accent" : "bg-border"}`} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    color: "purple",
    hex: "#7c3aed",
    description: "Your personal stats hub — chapters completed, quiz averages, current streak, bookmarked chapters, and recent quiz history.",
    content: (
      <div className="p-3.5 h-full bg-bg overflow-y-auto">
        {/* Avatar */}
        <div className="text-center mb-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e8f0ff] to-[#c7d8ff] mx-auto mb-2 flex items-center justify-center text-xs font-bold text-primary">AK</div>
          <div className="text-base font-black text-text tracking-tight">Arjun Kumar</div>
          <div className="text-[10px] text-text-muted font-bold tracking-wide uppercase">Python Student</div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          {[
            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, label: "Completed", value: "13/18", color: "text-primary" },
            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>, label: "Progress", value: "72%", color: "text-accent" },
            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: "Quizzes", value: "47", color: "text-accent-warm" },
            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>, label: "Avg Score", value: "81%", color: "text-purple" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-2.5 border border-border text-center shadow-sm">
              <div className={`mb-0.5 flex justify-center ${s.color}`}>{s.icon}</div>
              <div className="text-sm font-black text-text tracking-tight leading-tight">{s.value}</div>
              <div className="text-[9px] text-text-muted font-bold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
        {/* Streak Banner */}
        <div className="bg-primary/5 rounded-2xl p-3 mb-2.5 flex justify-between items-center border border-primary/10">
          <div className="flex items-center gap-1.5">
            <div className="text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="text-[11px] font-extrabold text-text tracking-tight uppercase">Current Streak</span>
          </div>
          <span className="text-2xl font-black text-primary leading-none">12</span>
        </div>
        {/* Bookmarks */}
        <div className="text-[11px] font-black text-text tracking-[0.12em] uppercase mb-2">Bookmarked</div>
        {["Ch 5: Modules & Packages","Ch 8: OOP Concepts"].map(b => (
          <div key={b} className="bg-white rounded-xl p-2 px-3 mb-1.5 border border-border flex items-center gap-2 shadow-sm text-text-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            <span className="text-[10px] font-bold text-text-secondary tracking-tight">{b}</span>
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
    <section className="py-24 md:py-28 bg-bg-surface" id="screens">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            App Screens
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-text leading-tight mb-4 tracking-tight">
            See Every Screen in Action
          </h2>
          <p className="text-lg text-text-secondary max-w-[520px] mx-auto leading-relaxed">
            Click each tab to explore exactly how PyLearn looks and works — right here in your browser.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center gap-2 flex-wrap mb-14">
          {SCREENS.map((s, i) => {
            const activeTab = active === i;
            return (
              <button
                key={s.id}
                id={`screen-tab-${s.id}`}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[0.9rem] transition-all cursor-pointer ${
                  activeTab 
                    ? s.color === 'primary' ? 'bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/30 text-white border-transparent' :
                      s.color === 'accent' ? 'bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent/30 text-white border-transparent' :
                      s.color === 'accent-warm' ? 'bg-gradient-to-br from-accent-warm to-accent-warm/80 shadow-lg shadow-accent-warm/30 text-white border-transparent' :
                      'bg-gradient-to-br from-purple to-purple/80 shadow-lg shadow-purple/30 text-white border-transparent'
                    : "bg-white text-text-secondary border border-border hover:shadow-md"
                }`}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Description */}
          <div className="order-2 lg:order-1">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide mb-5 ${
              active === 0 ? "bg-primary/10 text-primary" :
              active === 1 ? "bg-primary/10 text-primary" :
              active === 2 ? "bg-accent/10 text-accent" :
              active === 3 ? "bg-accent-warm/10 text-accent-warm" : "bg-purple/10 text-purple"
            }`}>
              {screen.icon} {screen.label}
            </div>
            <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-black text-text leading-tight mb-4 tracking-tight">
              {screen.label === "Home" && "Your Learning Dashboard"}
              {screen.label === "Notes" && "Structured Study Notes"}
              {screen.label === "Quiz" && "Smart Quiz Engine"}
              {screen.label === "Sample Papers" && "Practice Sample Papers"}
              {screen.label === "Profile" && "Track Your Progress"}
            </h3>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              {screen.description}
            </p>

            {/* Feature pills for the active tab */}
            <div className="flex flex-wrap gap-2.5">
              {[
                ["18 Chapters", "5 Units", "Bookmarks", "Search"],
                ["18 Chapters", "Search & Filter", "Topic Pills", "Progress Track"],
                ["100+ Sets", "10 Sets/Chapter", "Difficulty Colors", "Score History"],
                ["20 Papers", "Easy-Hard Filter", "Search", "Completion Track"],
                ["Stats Grid", "Streak Counter", "Bookmarks", "Activity Log"],
              ][active].map(tag => (
                <span key={tag} 
                  className={`px-3.5 py-1.5 rounded-full text-[0.8rem] font-bold border ${
                    active === 0 ? "bg-primary/10 text-primary border-primary/20" :
                    active === 1 ? "bg-primary/10 text-primary border-primary/20" :
                    active === 2 ? "bg-accent/10 text-accent border-accent/20" :
                    active === 3 ? "bg-accent-warm/10 text-accent-warm border-accent-warm/20" : 
                    "bg-purple/10 text-purple border-purple/20"
                  }`}
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Phone Preview */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="phone-mockup w-[300px] h-[600px]">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[100px] h-7 bg-[#0f1729] rounded-b-[20px] z-10" />
              <div className="phone-screen relative">
                <div className="absolute inset-0 overflow-y-auto">
                  {/* Status Bar */}
                  <div className="bg-bg px-5 pt-3.5 pb-1.5 flex justify-between items-center sticky top-0 z-5">
                    <span className="text-[11px] font-bold text-text">9:41</span>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-[10px] text-white font-bold">Py</div>
                  </div>
                  {/* Screen Content */}
                  <div className="pb-20">
                    {screen.content}
                  </div>
                </div>

                {/* Tab Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2.5 pb-3.5 flex justify-around z-10">
                  {SCREENS.map((s, i) => (
                    <div
                      key={s.id}
                      onClick={() => setActive(i)}
                      className={`flex flex-col items-center gap-0.5 cursor-pointer px-1.5 py-1 rounded-lg transition-all text-[9px] font-bold ${
                        active === i 
                          ? s.id === "home" ? "text-primary" :
                            s.id === "notes" ? "text-primary" :
                            s.id === "quiz" ? "text-accent" :
                            s.id === "samples" ? "text-accent-warm" : "text-purple"
                          : "text-text-muted"
                      }`}
                    >
                      <span className="text-lg">{s.icon}</span>
                      {s.label.split(" ")[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

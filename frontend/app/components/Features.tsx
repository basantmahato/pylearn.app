"use client";

export default function Features() {
  const features = [
    {
      icon: "📚",
      iconBg: "bg-primary/10",
      color: "text-primary",
      badge: "Notes",
      badgeClass: "bg-primary/10 text-primary",
      title: "Structured Chapter Notes",
      description:
        "Comprehensive Python and CS topics — from fundamentals and file handling to advanced data structures — covered in beautifully organised notes.",
      bullets: ["Unit-wise curriculum", "Search & filter by topic", "Bookmark chapters for later", "Track reading progress"],
    },
    {
      icon: "🧠",
      iconBg: "bg-accent/10",
      color: "text-accent",
      badge: "Quiz",
      badgeClass: "bg-accent/10 text-accent",
      title: "Smart Adaptive Quizzes",
      description:
        "Difficulty-graded quiz sets for every chapter, colour-coded from Easy to Expert. Test your knowledge and watch your score climb.",
      bullets: ["Hundreds of quiz questions", "Adaptive difficulty sets", "Colour-coded challenges", "Instant score & feedback"],
    },
    {
      icon: "📄",
      iconBg: "bg-accent-warm/10",
      color: "text-accent-warm",
      badge: "Sample Papers",
      badgeClass: "bg-accent-warm/10 text-accent-warm",
      title: "Extensive Sample Papers",
      description:
        "Exam-pattern sample papers covering full syllabi for all categories. Filter by difficulty, search by topic, and practice like a pro.",
      bullets: ["Full-length practice papers", "Easy / Medium / Hard filter", "Searchable paper library", "Completion tracking"],
    },
    {
      icon: "📊",
      iconBg: "bg-purple/10",
      color: "text-purple",
      badge: "Profile",
      badgeClass: "bg-purple/10 text-purple",
      title: "Progress & Streak Tracking",
      description:
        "Your personal learning dashboard — overall progress, quiz averages, daily streaks, bookmarks, and a full activity history all in one place.",
      bullets: ["Chapter & quiz analytics", "Daily streak calendar", "Bookmark manager", "Recent activity timeline"],
    },
    {
      icon: "🔍",
      iconBg: "bg-primary/8",
      color: "text-primary",
      badge: "Search",
      badgeClass: "bg-primary/10 text-primary",
      title: "Instant Search & Discovery",
      description:
        "Find any chapter, topic, or concept in milliseconds. Topic-pill shortcuts let you jump straight into what matters most for your course.",
      bullets: ["Full-text chapter search", "Topic-pill quick-filter", "Unit-level navigation", "Zero-latency results"],
    },
    {
      icon: "🏆",
      iconBg: "bg-accent-warm/8",
      color: "text-accent-warm",
      badge: "Gamification",
      badgeClass: "bg-accent-warm/10 text-accent-warm",
      title: "Daily Challenges & Streaks",
      description:
        "Stay motivated with a daily challenge system. Maintain streaks, earn personal bests, and turn exam preparation into an engaging daily habit.",
      bullets: ["Daily challenge prompts", "Streak risk alerts", "Personal best tracking", "Longest streak records"],
    },
  ];

  return (
    <section className="py-24 md:py-28 bg-white" id="features">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            Everything You Need
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-text leading-tight mb-4 tracking-tight">
            One App. Complete Python Prep.
          </h2>
          <p className="text-lg text-text-secondary max-w-[560px] mx-auto leading-relaxed">
            PyLearn brings together everything a student needs to master Python and Computer Science — beautifully designed and distraction-free.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="card bg-white rounded-3xl border border-border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
              {/* Icon + Badge Row */}
              <div className="flex items-start justify-between mb-5">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${feat.iconBg}`}>
                  {feat.icon}
                </div>
                <span className={`px-3.5 py-1.5 rounded-full text-[0.75rem] font-bold tracking-wider uppercase ${feat.badgeClass}`}>
                  {feat.badge}
                </span>
              </div>

              <h3 className="text-xl font-black text-text mb-3 tracking-tight">
                {feat.title}
              </h3>
              <p className="text-[0.925rem] text-text-secondary leading-relaxed mb-5">
                {feat.description}
              </p>

              {/* Bullet List */}
              <ul className="flex flex-col gap-2.5">
                {feat.bullets.map((b, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-[0.875rem] text-text-secondary">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feat.iconBg}`}>
                      <svg width="11" height="11" viewBox="0 0 12 12" className={feat.color}>
                        <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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

"use client";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: "📲",
      title: "Download PyLearn",
      description:
        "Install the free app from the Play Store or App Store. Set up your profile with a name and avatar — no sign-up required.",
      color: "text-primary",
      bg: "bg-primary/10",
      hex: "#005ab5",
    },
    {
      step: "02",
      icon: "📚",
      title: "Study Chapter Notes",
      description:
        "Browse structured chapters across different curriculum units. Read at your own pace, bookmark key chapters, and track your reading progress automatically.",
      color: "text-accent",
      bg: "bg-accent/10",
      hex: "#059669",
    },
    {
      step: "03",
      icon: "🧠",
      title: "Take Adaptive Quizzes",
      description:
        "After reading, challenge yourself with 10 difficulty-graded quiz sets. Review your answers instantly and watch your score improve each round.",
      color: "text-accent-warm",
      bg: "bg-accent-warm/10",
      hex: "#d97706",
    },
    {
      step: "04",
      icon: "📄",
      title: "Practice Sample Papers",
      description:
        "Attempt full-length sample papers in exam style. Filter by difficulty and check off completed papers to measure your readiness.",
      color: "text-purple",
      bg: "bg-purple/10",
      hex: "#7c3aed",
    },
    {
      step: "05",
      icon: "🔥",
      title: "Build Daily Streaks",
      description:
        "Return every day to maintain your streak. The Daily Challenge keeps you motivated, and alerts warn you before your streak breaks.",
      color: "text-red-600",
      bg: "bg-red-50",
      hex: "#dc2626",
    },
    {
      step: "06",
      icon: "🏆",
      title: "Ace Your Exams",
      description:
        "With consistent practice tracked in your profile — chapters read, quizzes taken, and papers attempted — walk into exams with full confidence.",
      color: "text-accent-warm",
      bg: "bg-accent-warm/10",
      hex: "#f59e0b",
    },
  ];

  return (
    <section className="py-24 md:py-28 bg-white" id="how-it-works">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            How It Works
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-text leading-tight mb-4 tracking-tight">
            From Download to Distinction
          </h2>
          <p className="text-lg text-text-secondary max-w-[520px] mx-auto leading-relaxed">
            PyLearn is built around a simple, proven loop: study → quiz → practice → repeat. Here&apos;s the full journey.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-3xl p-8 border border-border transition-all hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            >
              {/* Step Number (Watermark) */}
              <div 
                className={`absolute top-4 right-5 text-[4rem] font-black leading-none tracking-tighter select-none opacity-10 transition-opacity group-hover:opacity-15 ${step.color}`}
              >
                {step.step}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm transition-transform group-hover:scale-110 ${step.bg}`}>
                {step.icon}
              </div>

              {/* Step Label */}
              <div className={`text-[0.72rem] font-black tracking-widest uppercase mb-2 ${step.color}`}>
                Step {step.step}
              </div>

              <h3 className="text-xl font-black text-text mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[0.925rem] text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

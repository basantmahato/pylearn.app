"use client";

export default function Testimonials() {
  const reviews = [
    {
      name: "Priya Sharma",
      role: "Class 12 Student, Delhi",
      avatar: "🐱",
      avatarBg: "bg-pink-50",
      rating: 5,
      text: "PyLearn completely changed how I study Python. The chapter notes are so much clearer than my textbook, and the quiz difficulty levels really helped me identify my weak spots. Got 95% in my boards!",
      tag: "⭐ Board Topper",
      tagColor: "text-yellow-500",
      tagHex: "#f59e0b",
    },
    {
      name: "Rahul Verma",
      role: "Class 12 Student, Mumbai",
      avatar: "🐶",
      avatarBg: "bg-blue-50",
      rating: 5,
      text: "The sample papers are exactly like the actual board exam pattern. I attempted all 20 before my exam and felt completely prepared. The streak feature kept me disciplined throughout my prep.",
      tag: "📄 Sample Paper Fan",
      tagColor: "text-primary",
      tagHex: "#005ab5",
    },
    {
      name: "Ananya Gupta",
      role: "Class 12 Student, Bangalore",
      avatar: "🐼",
      avatarBg: "bg-green-50",
      rating: 5,
      text: "I love how the Quiz page lets you pick exactly which chapter and difficulty. No more random practice — I could focus on exactly what I needed. The profile page tracking is super motivating too!",
      tag: "🧠 Quiz Champion",
      tagColor: "text-accent",
      tagHex: "#059669",
    },
    {
      name: "Karan Mehta",
      role: "Class 12 Student, Pune",
      avatar: "🐰",
      avatarBg: "bg-purple-50",
      rating: 5,
      text: "Maintaining a 21-day streak was the push I needed. Every morning I'd open the app, read a chapter, and do a quiz set. PyLearn made studying Python actually enjoyable — something I never thought possible.",
      tag: "🔥 Streak Master",
      tagColor: "text-red-600",
      tagHex: "#dc2626",
    },
    {
      name: "Sneha Patel",
      role: "Class 12 Student, Ahmedabad",
      avatar: "FOX",
      avatarBg: "bg-orange-50",
      rating: 5,
      text: "The bookmarks feature is so useful — I'd bookmark chapters I found tough and revisit them before the exam. The search is super fast and the topic filter pills are genius. 10/10 app!",
      tag: "📚 Notes Nerd",
      tagColor: "text-purple",
      tagHex: "#7c3aed",
    },
    {
      name: "Arjun Singh",
      role: "Class 12 Student, Jaipur",
      avatar: "🐧",
      avatarBg: "bg-cyan-50",
      rating: 5,
      text: "I was struggling with OOP and file handling until PyLearn. The chapters break everything down perfectly, and after 3 quiz sets I could answer any question confidently. Best free study app for CS!",
      tag: "💡 Concept Clicker",
      tagColor: "text-cyan-600",
      tagHex: "#0891b2",
    },
  ];

  return (
    <section className="py-24 md:py-28 bg-bg" id="testimonials">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            Student Reviews
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-text leading-tight mb-4 tracking-tight">
            Loved by Class 12 Students
          </h2>
          <p className="text-lg text-text-secondary max-w-[480px] mx-auto leading-relaxed">
            Thousands of students have improved their Python scores with PyLearn. Here&apos;s what they say.
          </p>

          {/* Aggregate Rating */}
          <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <div className="font-black text-xl text-text leading-none">4.9 / 5</div>
            <div className="text-text-muted text-sm font-medium">from 2,400+ reviews</div>
          </div>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-3xl border border-border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= r.rating ? "#f59e0b" : "#e5e7eb"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[0.95rem] text-text-secondary leading-relaxed mb-8 italic flex-grow">
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between gap-4 mt-auto pt-6 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0 ${r.avatarBg}`}>
                    {r.avatar === "FOX" ? "🦊" : r.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-text text-sm truncate">{r.name}</div>
                    <div className="text-text-muted text-[0.75rem] truncate">{r.role}</div>
                  </div>
                </div>

                <span 
                  className={`px-2.5 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider whitespace-nowrap shrink-0 ${r.tagColor.replace('text-', 'bg-')}/10 ${r.tagColor}`}
                >
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

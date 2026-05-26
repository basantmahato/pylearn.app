"use client";

export default function Hero() {
  return (
    <section 
      className="gradient-hero min-h-screen flex items-center pt-[100px] pb-20 relative overflow-hidden" 
      id="hero"
    >
      {/* Background Orbs */}
      <div className="orb w-[500px] h-[500px] bg-primary -top-[150px] -left-[150px] animate-float" />
      <div className="orb w-[400px] h-[400px] bg-purple -bottom-[100px] -right-[100px] animate-float [animation-delay:3s]" />
      <div className="orb w-[300px] h-[300px] bg-accent top-[40%] left-[60%] animate-float [animation-delay:5s]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <div className="text-center md:text-left">
            {/* Announcement Pill */}
            <div className="mb-6">
              <span className="badge bg-primary/10 text-primary animate-slide-up [animation-delay:0s] opacity-0 fill-mode-forwards">
                <span>Now Available on Google Play Store</span>
              </span>
            </div>

            <h1
              className="text-[clamp(2.8rem,5vw,4.2rem)] font-black leading-[1.1] tracking-tight text-text mb-6 animate-slide-up [animation-delay:0.1s] opacity-0 fill-mode-forwards"
            >
              Master Python<br />
              for <span className="gradient-text">All Courses</span>
            </h1>

            <p
              className="text-lg text-text-secondary leading-relaxed max-w-[480px] mb-10 mx-auto md:mx-0 animate-slide-up [animation-delay:0.2s] opacity-0 fill-mode-forwards"
            >
              PyLearn is your all-in-one study companion for Class 11, 12, BCA, and B.Tech. 
              Get structured notes, smart adaptive quizzes, and complete sample papers for 
              every level of your journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start animate-slide-up [animation-delay:0.3s] opacity-0 fill-mode-forwards">
              <a
                href="https://play.google.com/store/apps/details?id=com.pylearn12"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-10 py-[18px] rounded-full font-extrabold text-[1.05rem] shadow-[0_4px_20px_rgba(0,90,181,0.35)] hover:shadow-[0_8px_30px_rgba(0,90,181,0.45)] hover:-translate-y-0.5 transition-all flex items-center gap-2.5"
                id="hero-download-btn"
              >
                {/* Google Play icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.37.21.8.22 1.19.03l11.5-6.64-2.5-2.5-10.19 9.11zM.5 1.4C.19 1.75 0 2.27 0 2.93v18.14c0 .66.19 1.18.5 1.53l.08.08 10.16-10.16v-.24L.58 1.32.5 1.4zM20.54 10.3l-2.91-1.68-2.82 2.82 2.82 2.82 2.94-1.7c.84-.48.84-1.27-.03-1.76zM4.37.21L15.87 6.85l-2.5 2.5L3.18.24C3.56.05 4 .05 4.37.21z"/>
                </svg>
                <div className="flex flex-col leading-none text-left">
                  <span className="text-[0.65rem] font-medium opacity-85">GET IT ON</span>
                  <span className="text-base font-extrabold">Google Play</span>
                </div>
              </a>
              <a 
                href="#screens" 
                className="inline-flex items-center gap-2 px-10 py-[18px] rounded-full font-extrabold text-[1.05rem] bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 hover:-translate-y-0.5 transition-all" 
                id="hero-explore-btn"
              >
                Explore Features
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                </svg>
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-5 justify-center md:justify-start animate-slide-up [animation-delay:0.4s] opacity-0 fill-mode-forwards">
              {/* Stars */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="font-bold text-text text-[0.95rem]">4.9</span>
                <span className="text-text-muted text-[0.875rem]">(2,400+ reviews)</span>
              </div>
              <div className="w-[1px] h-5 bg-border hidden sm:block" />
              <span className="text-text-secondary text-[0.875rem] font-semibold">
                10,000+ students learning
              </span>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="flex justify-center relative animate-scale-in" id="hero-phone">
            {/* Decorative rings */}
            <div className="absolute w-[380px] h-[380px] rounded-full border border-primary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-[500px] h-[500px] rounded-full border border-primary/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <div className="phone-mockup animate-float">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[100px] h-7 bg-[#0f1729] rounded-b-[20px] z-10" />
              <div className="phone-screen bg-bg relative">
                {/* Status Bar */}
                <div className="bg-bg px-5 pt-3.5 pb-1.5 flex justify-between items-center">
                  <span className="text-[11px] font-bold text-text">9:41</span>
                  <div className="flex gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-text"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-text"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                  </div>
                </div>

                {/* App Header */}
                <div className="px-5 py-2 flex justify-between items-center">
                  <div>
                    <div className="text-[11px] text-text-muted font-semibold">Good Morning</div>
                    <div className="text-base font-black text-text tracking-tight">Arjun Kumar</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e8f0ff] to-[#c7d8ff] flex items-center justify-center text-xs font-bold text-primary">
                    AK
                  </div>
                </div>

                {/* Progress Hero */}
                <div className="mx-3 mb-3 bg-gradient-to-br from-primary to-primary-light rounded-[20px] p-4 shadow-lg">
                  <div className="text-[rgba(255,255,255,0.8)] text-[10px] font-bold mb-1 uppercase tracking-wider">OVERALL PROGRESS</div>
                  <div className="text-white text-2xl font-black tracking-tight mb-2">72%</div>
                  <div className="bg-white/25 rounded-full h-1.5 overflow-hidden">
                    <div className="w-[72%] h-full bg-white rounded-full transition-all duration-1000" />
                  </div>
                  <div className="text-[rgba(255,255,255,0.8)] text-[9px] mt-1.5">13 of 18 chapters completed</div>
                </div>

                {/* Bento Mini Grid */}
                <div className="grid grid-cols-2 gap-2 px-3">
                  {[
                    { label: "Notes", icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    ), color: "primary", prog: "72%" },
                    { label: "Quiz", icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    ), color: "accent", prog: "68%" },
                    { label: "Samples", icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                    ), color: "accent-warm", prog: "45%" },
                    { label: "Profile", icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    ), color: "purple", prog: "85%" },
                  ].map(item => (
                    <div key={item.label} className={`bg-${item.color}/5 border border-${item.color}/10 rounded-2xl p-3`}>
                      <div className={`mb-1 text-${item.color}`}>{item.icon}</div>
                      <div className="text-[10px] font-bold text-text">{item.label}</div>
                      <div className={`text-[9px] font-semibold text-${item.color}`}>{item.prog}</div>
                    </div>
                  ))}
                </div>

                {/* Tab Bar */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="flex justify-around p-2 pb-3.5 bg-white border-t border-gray-100">
                    {[
                      { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Home", active: true },
                      { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, label: "Notes" },
                      { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label: "Quiz" },
                      { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>, label: "Samples" },
                      { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: "Profile" },
                    ].map(t => (
                      <div key={t.label} className={`flex flex-col items-center gap-0.5 text-[10px] ${t.active ? "text-primary font-bold" : "text-gray-400"} cursor-pointer px-2 py-1`}>
                        <span className="mb-0.5">{t.icon}</span>
                        <span>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-[10%] -right-5 bg-white rounded-2xl p-2.5 px-3.5 shadow-lg border border-border flex items-center gap-2 animate-float [animation-delay:1s] z-[2] hidden lg:flex">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div>
                <div className="font-extrabold text-[0.9rem] text-text leading-none">12 Day Streak!</div>
                <div className="text-[0.7rem] text-text-muted mt-0.5">Keep it up!</div>
              </div>
            </div>

            <div className="absolute bottom-[15%] -left-[30px] bg-white rounded-2xl p-2.5 px-3.5 shadow-lg border border-border flex items-center gap-2 animate-float [animation-delay:2s] z-[2] hidden lg:flex">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
              </div>
              <div>
                <div className="font-extrabold text-[0.9rem] text-text leading-none">Quiz Score: 95%</div>
                <div className="text-[0.7rem] text-text-muted mt-0.5">Chapter 5 · Set 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-[0.75rem] font-semibold text-text-muted tracking-widest uppercase">Scroll</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary opacity-40">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>
    </section>
  );
}

/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

export default function Hero() {
  return (
    <section className="gradient-hero" id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "100px", paddingBottom: "80px", position: "relative" }}>
      {/* Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }} className="hero-grid">

          {/* Left: Copy */}
          <div>
            {/* Announcement Pill */}
            <div style={{ marginBottom: "24px" }}>
              <span className="badge badge-blue animate-up" style={{ animationDelay: "0s", opacity: 0 }}>
                <span>🚀</span>
                <span>Now Available on Google Play Store</span>
              </span>
            </div>

            <h1
              className="animate-up"
              style={{
                fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                color: "var(--text)",
                marginBottom: "24px",
                opacity: 0,
                animationDelay: "0.1s",
              }}
            >
              Master Python<br />
              for{" "}
              <span className="gradient-text">CBSE Class 12</span>
            </h1>

            <p
              className="animate-up"
              style={{
                fontSize: "1.15rem",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                maxWidth: "480px",
                marginBottom: "40px",
                opacity: 0,
                animationDelay: "0.2s",
              }}
            >
              PyLearn is your all-in-one study companion — structured chapter notes,
              smart adaptive quizzes, and complete sample papers. Track your progress,
              maintain streaks, and ace your board exams.
            </p>

            {/* CTA Buttons */}
            <div className="animate-up" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px", opacity: 0, animationDelay: "0.3s" }}>
              <a
                href="https://play.google.com/store/apps/details?id=com.pylearn12"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                id="hero-download-btn"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {/* Google Play icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.37.21.8.22 1.19.03l11.5-6.64-2.5-2.5-10.19 9.11zM.5 1.4C.19 1.75 0 2.27 0 2.93v18.14c0 .66.19 1.18.5 1.53l.08.08 10.16-10.16v-.24L.58 1.32.5 1.4zM20.54 10.3l-2.91-1.68-2.82 2.82 2.82 2.82 2.94-1.7c.84-.48.84-1.27-.03-1.76zM4.37.21L15.87 6.85l-2.5 2.5L3.18.24C3.56.05 4 .05 4.37.21z"/>
                </svg>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, textAlign: "left" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 500, opacity: 0.85 }}>GET IT ON</span>
                  <span style={{ fontSize: "1rem", fontWeight: 800 }}>Google Play</span>
                </span>
              </a>
              <a href="#screens" className="btn btn-secondary btn-lg" id="hero-explore-btn">
                Explore Features
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                </svg>
              </a>
            </div>

            {/* Social Proof */}
            <div className="animate-up" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", opacity: 0, animationDelay: "0.4s" }}>
              {/* Stars */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>4.9</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>(2,400+ reviews)</span>
              </div>
              <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />
              <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>
                🎓 10,000+ students learning
              </span>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }} className="animate-scale" id="hero-phone">
            {/* Decorative rings */}
            <div style={{
              position: "absolute",
              width: "380px", height: "380px",
              borderRadius: "50%",
              border: "1px solid rgba(0,90,181,0.12)",
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
            }} />
            <div style={{
              position: "absolute",
              width: "500px", height: "500px",
              borderRadius: "50%",
              border: "1px solid rgba(0,90,181,0.06)",
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
            }} />

            <div className="phone-mockup" style={{ animation: "float 6s ease-in-out infinite" }}>
              <div className="phone-notch" />
              <div className="phone-screen">
                {/* Status Bar */}
                <div style={{ background: "var(--bg)", padding: "14px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text)" }}>9:41</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text)"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text)"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                  </div>
                </div>

                {/* App Header */}
                <div style={{ padding: "8px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Good Morning 👋</div>
                    <div style={{ fontSize: "16px", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.03em" }}>Arjun Kumar</div>
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #e8f0ff, #c7d8ff)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px",
                  }}>🦊</div>
                </div>

                {/* Progress Hero */}
                <div style={{ margin: "0 12px 12px", background: "linear-gradient(135deg, #005ab5, #4d96e0)", borderRadius: "20px", padding: "16px" }}>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "10px", fontWeight: 700, marginBottom: "4px" }}>OVERALL PROGRESS</div>
                  <div style={{ color: "#fff", fontSize: "24px", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "8px" }}>72%</div>
                  <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "100px", height: "6px" }}>
                    <div style={{ width: "72%", height: "100%", background: "#fff", borderRadius: "100px" }} />
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "9px", marginTop: "6px" }}>13 of 18 chapters completed</div>
                </div>

                {/* Bento Mini Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "0 12px" }}>
                  {[
                    { label: "Notes", icon: "📚", color: "#005ab5", bg: "#eef4ff", prog: "72%" },
                    { label: "Quiz", icon: "🧠", color: "#059669", bg: "#f0fdf4", prog: "68%" },
                    { label: "Samples", icon: "📄", color: "#d97706", bg: "#fffbeb", prog: "45%" },
                    { label: "Profile", icon: "👤", color: "#7c3aed", bg: "#faf5ff", prog: "85%" },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: item.bg, borderRadius: "16px", padding: "12px",
                      border: `1px solid ${item.color}18`,
                    }}>
                      <div style={{ fontSize: "18px", marginBottom: "4px" }}>{item.icon}</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text)" }}>{item.label}</div>
                      <div style={{ fontSize: "9px", color: item.color, fontWeight: 600 }}>{item.prog}</div>
                    </div>
                  ))}
                </div>

                {/* Tab Bar */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                  <div className="tab-bar">
                    {[
                      { icon: "🏠", label: "Home", active: true },
                      { icon: "📚", label: "Notes" },
                      { icon: "🧠", label: "Quiz" },
                      { icon: "📄", label: "Samples" },
                      { icon: "👤", label: "Profile" },
                    ].map(t => (
                      <div key={t.label} className={`tab-item ${t.active ? "active" : ""}`}>
                        <span style={{ fontSize: "18px" }}>{t.icon}</span>
                        <span>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div style={{
              position: "absolute", top: "10%", right: "-20px",
              background: "#fff", borderRadius: "16px", padding: "10px 14px",
              boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: "8px",
              animation: "float 5s ease-in-out infinite 1s",
              zIndex: 2,
            }} className="hide-mobile">
              <span style={{ fontSize: "20px" }}>🔥</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.1 }}>12 Day Streak!</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Keep it up!</div>
              </div>
            </div>

            <div style={{
              position: "absolute", bottom: "15%", left: "-30px",
              background: "#fff", borderRadius: "16px", padding: "10px 14px",
              boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: "8px",
              animation: "float 7s ease-in-out infinite 2s",
              zIndex: 2,
            }} className="hide-mobile">
              <span style={{ fontSize: "20px" }}>🏆</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.1 }}>Quiz Score: 95%</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Chapter 5 · Set 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        animation: "float 2s ease-in-out infinite",
      }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)" opacity="0.4">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
          #hero-phone { margin: 0 auto; }
          #hero { padding-top: 120px !important; }
        }
      `}</style>
    </section>
  );
}

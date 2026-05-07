/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

export default function Download() {
  return (
    <section
      id="download"
      style={{
        padding: "120px 0",
        background: "linear-gradient(135deg, #eef4ff 0%, #f5f0ff 50%, #f0fdf4 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: "-100px", right: "-100px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,90,181,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", left: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          background: "linear-gradient(135deg, #0f1729 0%, #1e2d4a 100%)",
          borderRadius: "48px",
          padding: "72px 64px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Inner glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 800px 400px at 50% 0%, rgba(0,90,181,0.2) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* App Icon */}
            <div style={{
              width: 88, height: 88, borderRadius: 24,
              background: "linear-gradient(135deg, #005ab5, #4d96e0)",
              margin: "0 auto 28px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.4rem", fontWeight: 900, color: "#fff",
              boxShadow: "0 20px 40px rgba(0,90,181,0.4)",
              animation: "pulse-ring 3s infinite",
            }}>
              Py
            </div>

            <div className="badge badge-blue" style={{ background: "rgba(77,150,224,0.2)", color: "#7bb8f0", marginBottom: "20px", display: "inline-flex" }}>
               100% Free — No Subscription Required
            </div>

            <h2 style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 900, color: "#fff",
              letterSpacing: "-0.04em",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}>
              Ready to Ace Python?
            </h2>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.75 }}>
              Download PyLearn for free. No account needed. Start studying with 18 chapters, 100+ quizzes, and 20 sample papers — right away.
            </p>

            {/* Download Buttons */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}>
              <a
                href="#"
                id="app-store-btn"
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  background: "#fff", color: "#0f1729",
                  padding: "16px 28px", borderRadius: "16px",
                  textDecoration: "none", fontWeight: 800,
                  transition: "var(--transition)",
                  boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
                  minWidth: "200px",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)", e.currentTarget.style.boxShadow = "0 12px 30px rgba(255,255,255,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)", e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.15)")}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#0f1729">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.96zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280", lineHeight: 1 }}>Download on the</div>
                  <div style={{ fontSize: "1rem", fontWeight: 900, lineHeight: 1.2 }}>App Store</div>
                </div>
              </a>

              <a
                href="#"
                id="play-store-btn"
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  background: "rgba(255,255,255,0.1)", color: "#fff",
                  padding: "16px 28px", borderRadius: "16px",
                  textDecoration: "none", fontWeight: 800,
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "var(--transition)",
                  minWidth: "200px",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)", e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)", e.currentTarget.style.transform = "translateY(0)")}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                  <path d="M3.18 23.76c.26.14.56.21.87.19l12.97-8.31-2.94-2.94-10.9 11.06zm-.93-20.45C2.09 3.58 2 3.87 2 4.18v15.64c0 .31.09.6.25.85l.09.08 8.76-8.76v-.22L2.25 3.22l-.01.09zM20.66 10l-2.79-1.59-3.12 3.12 3.12 3.12 2.81-1.6c.8-.45.8-1.59-.02-2.05zm-18.43 13l11.03-11.03.01-.01-3-3L2.23 21l.01.01v1.99z"/>
                </svg>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", lineHeight: 1 }}>Get it on</div>
                  <div style={{ fontSize: "1rem", fontWeight: 900, lineHeight: 1.2 }}>Google Play</div>
                </div>
              </a>
            </div>

            {/* Trust Signals */}
            <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
              {[
                { icon: "🔒", label: "No Account Needed" },
                { icon: "📱", label: "iOS & Android" },
                { icon: "🆓", label: "Completely Free" },
                { icon: "⚡", label: "Offline Ready" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontWeight: 600 }}>
                  <span>{t.icon}</span>
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

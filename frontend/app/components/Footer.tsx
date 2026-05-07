/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

export default function Footer() {
  return (
    <footer style={{
      background: "#0f1729",
      color: "rgba(255,255,255,0.6)",
      padding: "64px 0 32px",
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "48px",
          marginBottom: "48px",
        }} className="footer-grid">
          {/* Brand Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "linear-gradient(135deg, #005ab5, #4d96e0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", fontWeight: 900, color: "#fff",
              }}>
                Py
              </div>
              <span style={{ fontWeight: 900, fontSize: "1.2rem", color: "#fff", letterSpacing: "-0.03em" }}>
                Learn<span style={{ color: "#4d96e0" }}>.app</span>
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.75, maxWidth: "280px", marginBottom: "20px" }}>
              The all-in-one Python learning app for CBSE Class 12 students. Notes, quizzes, and sample papers — beautifully designed.
            </p>
            {/* <div style={{ display: "flex", gap: "8px" }}>
              {[
                { icon: "📱", label: "App Store" },
                { icon: "▶", label: "Play Store" },
              ].map(s => (
                <a
                  key={s.label}
                  href="#download"
                  aria-label={s.label}
                  style={{
                    width: 40, height: 40, borderRadius: "10px",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.12)",
                    transition: "var(--transition)",
                    color: "white",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                >
                  {s.icon}
                </a>
              ))}
            </div> */}
          </div>

          {/* App Column */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: "16px", fontSize: "0.9rem" }}>App</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["#features", "Features"],
                ["#screens", "App Screens"],
                ["#how-it-works", "How It Works"],
                ["#download", "Download"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{
                    color: "rgba(255,255,255,0.5)", textDecoration: "none",
                    fontSize: "0.875rem", transition: "var(--transition)",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Column */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: "16px", fontSize: "0.9rem" }}>Content</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["18 Python Chapters", "5 Curriculum Units", "100+ Quiz Sets", "20 Sample Papers", "Streak Tracking"].map(item => (
                <li key={item} style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: "16px", fontSize: "0.9rem" }}>Legal</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["#", "Privacy Policy"],
                ["#", "Terms of Service"],
                ["#", "CBSE Guidelines"],
                ["#", "Contact Us"],
              ].map(([href, label]) => (
                <li key={label}>
                  <a href={href} style={{
                    color: "rgba(255,255,255,0.5)", textDecoration: "none",
                    fontSize: "0.875rem", transition: "var(--transition)",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "24px" }} />

        {/* Bottom Bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: "16px", flexWrap: "wrap",
        }}>
          <div style={{ fontSize: "0.825rem" }}>
            © {new Date().getFullYear()} PyLearn. All rights reserved. Made with ❤️ for CBSE Students.
          </div>
          <div style={{ display: "flex", gap: "16px", fontSize: "0.825rem" }}>
            <span>PyLearn v1.0.0</span>
            <span>·</span>
            <span>CBSE CS 2025-26</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

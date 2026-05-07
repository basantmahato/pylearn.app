/* eslint-disable react/no-inline-styles, react/forbid-component-props, @typescript-eslint/no-inline-styles */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #005ab5, #4d96e0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", fontWeight: 900, color: "#fff",
              boxShadow: "0 4px 12px rgba(0,90,181,0.35)",
            }}>
              Py
            </div>
            <span style={{ fontWeight: 900, fontSize: "1.2rem", color: "var(--text)", letterSpacing: "-0.03em" }}>
              Learn<span style={{ color: "var(--primary)" }}>.app</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <DesktopNav />

          {/* CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href="#download"
              className="btn btn-primary hide-mobile"
              style={{ padding: "10px 24px", fontSize: "0.875rem" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 16.5l-8-8h5V3h6v5.5h5l-8 8zm-8 3.5h16v2H4v-2z"/>
              </svg>
              Download App
            </a>

            {/* Hamburger */}
            <button
              id="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="show-mobile"
              style={{
                background: "rgba(0,90,181,0.06)", border: "none", cursor: "pointer",
                padding: "8px", borderRadius: "10px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="17" x2="21" y2="17"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </div>
    </nav>
  );
}

/* ── Desktop Nav ─────────────────────────────────────────────────────── */
function DesktopNav() {
  const pathname = usePathname();

  const anchorLinks: [string, string][] = [
    ["/#features", "Features"],
    // ["/#screens", "App Screens"],
    ["/#how-it-works", "How It Works"],
    ["/#stats", "Stats"],
    ["/#testimonials", "Reviews"],
  ];

  const pageLinks: [string, string, string][] = [
    ["/notes",   "", "Notes"],
    ["/quiz",    "", "Quiz"],
    ["/samples", "", "Samples"],
    ["/blog",    "", "Blog"],
  ];

  return (
    <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {anchorLinks.map(([href, label]) => (
        <a
          key={href}
          href={href}
          style={{
            padding: "8px 14px",
            borderRadius: "100px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            transition: "var(--transition)",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "rgba(0,90,181,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
        >
          {label}
        </a>
      ))}

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 6px" }} />

      {pageLinks.map(([href, icon, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              padding: "8px 14px",
              borderRadius: "100px",
              color: active ? "var(--primary)" : "var(--text-secondary)",
              background: active ? "rgba(0,90,181,0.08)" : "transparent",
              textDecoration: "none",
              fontWeight: active ? 700 : 600,
              fontSize: "0.875rem",
              transition: "var(--transition)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ fontSize: "0.95rem" }}>{icon}</span>
            {label}
          </Link>
        );
      })}
    </div>
  );
}

/* ── Mobile Menu ──────────────────────────────────────────────────────── */
function MobileMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  const allLinks: [string, string, boolean][] = [
    ["/#features",  "✨ Features",   false],
    ["/#screens",   "📱 App Screens", false],
    ["/#how-it-works", "🚀 How It Works", false],
    ["/#stats",     "📊 Stats",      false],
    ["/#testimonials", "💬 Reviews", false],
    ["/notes",      "📚 Notes",      true],
    ["/quiz",       "🧠 Quiz",       true],
    ["/samples",    "📝 Samples",    true],
    ["/blog",       "📝 Blog",       true],
    ["/#download",  "⬇️ Download App", false],
  ];

  return (
    <div style={{
      marginTop: "16px",
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      border: "1px solid var(--border)",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      boxShadow: "var(--shadow-lg)",
    }}>
      {allLinks.map(([href, label, isPage]) => {
        const active = isPage && pathname === href;
        const Tag = isPage ? Link : "a";
        return (
          <Tag
            key={href}
            href={href}
            onClick={onClose}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              color: active ? "var(--primary)" : "var(--text)",
              background: active ? "rgba(0,90,181,0.07)" : "transparent",
              textDecoration: "none",
              fontWeight: active ? 700 : 600,
              fontSize: "0.95rem",
              transition: "var(--transition)",
              display: "block",
            }}
          >
            {label}
          </Tag>
        );
      })}
    </div>
  );
}

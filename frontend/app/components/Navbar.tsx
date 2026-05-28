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
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled 
          ? "bg-white/92 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)] py-3" 
          : "bg-transparent py-4"
      }`} 
      id="navbar"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <img 
              src="/icon.png" 
              alt="PyLearn Logo" 
              className="w-10 h-10 object-cover rounded-[22%] overflow-hidden shadow-[0_4px_12px_rgba(0,90,181,0.15)] transition-transform hover:scale-105" 
            />
            <span className="font-black text-xl text-text tracking-tight">
              PyLearn<span className="text-primary">.app</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <DesktopNav />

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#download"
              className="btn-primary px-6 py-2.5 text-sm rounded-full font-bold hidden md:flex items-center gap-2"
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
              className="flex md:hidden bg-primary/5 border-none cursor-pointer p-2 rounded-xl"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round">
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
    ["/#how-it-works", "Working"],
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
    <div className="hidden md:flex items-center gap-1">
      {anchorLinks.map(([href, label]) => (
        <a
          key={href}
          href={href}
          className="px-3.5 py-2 rounded-full text-text-secondary no-underline font-semibold text-sm transition-all hover:text-primary hover:bg-primary/5"
        >
          {label}
        </a>
      ))}

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-1.5" />

      {pageLinks.map(([href, icon, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-3.5 py-2 rounded-full no-underline font-semibold text-sm transition-all flex items-center gap-1.5 ${
              active ? "text-primary bg-primary/10 font-bold" : "text-text-secondary hover:text-primary hover:bg-primary/5"
            }`}
          >
            <span className="text-[0.95rem]">{icon}</span>
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
    ["/#features",  "Features",      false],
    ["/#screens",   "App Screens",   false],
    ["/#how-it-works", "How It Works", false],
    ["/#stats",     "Stats",         false],
    ["/#testimonials", "Reviews",       false],
    ["/notes",      "Notes",         true],
    ["/quiz",       "Quiz",          true],
    ["/samples",    "Samples",       true],
    ["/blog",       "Blog",          true],
    ["/#download",  "Download App",  false],
  ];

  return (
    <div className="mt-4 bg-white/95 backdrop-blur-xl rounded-[20px] border border-border p-4 flex flex-col gap-1 shadow-xl">
      {allLinks.map(([href, label, isPage]) => {
        const active = isPage && pathname === href;
        const Tag = isPage ? Link : "a";
        return (
          <Tag
            key={href}
            href={href}
            onClick={onClose}
            className={`block px-4 py-3 rounded-xl no-underline font-semibold text-base transition-all ${
              active ? "text-primary bg-primary/10 font-bold" : "text-text hover:bg-primary/5"
            }`}
          >
            {label}
          </Tag>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f1729] text-white/60 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-sm font-black text-white">
                Py
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Learn<span className="text-[#4d96e0]">.app</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-[280px]">
              The all-in-one learning app for Python and Computer Science students. Notes, quizzes, and sample papers — beautifully designed.
            </p>
          </div>

          {/* App Column */}
          <div>
            <h4 className="text-white font-black mb-6 text-sm uppercase tracking-wider">App</h4>
            <ul className="flex flex-col gap-3">
              {[
                ["#features", "Features"],
                ["#screens", "App Screens"],
                ["#how-it-works", "How It Works"],
                ["#download", "Download"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a 
                    href={href} 
                    className="text-white/50 hover:text-white transition-colors text-sm no-underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Column */}
          <div>
            <h4 className="text-white font-black mb-6 text-sm uppercase tracking-wider">Content</h4>
            <ul className="flex flex-col gap-3">
              {["50+ Structured Chapters", "5 Multi-level Courses", "500+ Quiz Questions", "30+ Sample Papers", "Streak Tracking"].map(item => (
                <li key={item} className="text-white/40 text-sm">{item}</li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-black mb-6 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="flex flex-col gap-3">
              {[
                ["/privacy-policy", "Privacy Policy"],
                ["/terms-of-service", "Terms of Service"],
                ["/cbse-guidelines", "CBSE Guidelines"],
                ["/contact", "Contact Us"],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link 
                    href={href} 
                    className="text-white/50 hover:text-white transition-colors text-sm no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[0.825rem]">
          <div>
            © {new Date().getFullYear()} PyLearn. All rights reserved. Made for Students.
          </div>
          <div className="flex items-center gap-4 text-white/30">
            <span>PyLearn v1.1.0</span>
            <span className="text-white/10">·</span>
            <span>Python & CS Prep 2025-26</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

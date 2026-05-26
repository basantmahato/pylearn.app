"use client";

export default function Download() {
  return (
    <section
      id="download"
      className="py-24 md:py-32 bg-gradient-to-br from-[#eef4ff] via-[#f5f0ff] to-[#f0fdf4] relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-purple/10 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-gradient-to-br from-[#0f1729] to-[#1e2d4a] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_400px_at_50%_0%,rgba(0,90,181,0.2)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10">
            {/* App Icon */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-primary to-blue-400 mx-auto mb-8 flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-[0_20px_40px_rgba(0,90,181,0.4)] animate-pulse">
              Py
            </div>

            <div className="bg-blue-500/20 text-[#7bb8f0] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 inline-flex border border-blue-500/30">
               100% Free — No Subscription Required
            </div>

            <h2 className="text-[clamp(2.25rem,5vw,3.5rem)] font-black text-white leading-[1.1] mb-6 tracking-tighter">
              Ready to Ace Python?
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-[520px] mx-auto mb-10 md:mb-12 leading-relaxed">
              Download PyLearn for free. No account needed. Start studying with structured chapters, hundreds of quizzes, and extensive sample papers — right away.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#"
                id="app-store-btn"
                className="flex items-center gap-4 bg-white text-[#0f1729] px-8 py-4 rounded-2xl font-black transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20 min-w-[220px]"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.96zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Download on the</div>
                  <div className="text-lg font-black leading-none">App Store</div>
                </div>
              </a>

              <a
                href="#"
                id="play-store-btn"
                className="flex items-center gap-4 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-white/15 hover:-translate-y-1 min-w-[220px]"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.26.14.56.21.87.19l12.97-8.31-2.94-2.94-10.9 11.06zm-.93-20.45C2.09 3.58 2 3.87 2 4.18v15.64c0 .31.09.6.25.85l.09.08 8.76-8.76v-.22L2.25 3.22l-.01.09zM20.66 10l-2.79-1.59-3.12 3.12 3.12 3.12 2.81-1.6c.8-.45.8-1.59-.02-2.05zm-18.43 13l11.03-11.03.01-.01-3-3L2.23 21l.01.01v1.99z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[0.65rem] font-bold text-white/50 uppercase tracking-widest leading-none mb-1">Get it on</div>
                  <div className="text-lg font-black leading-none">Google Play</div>
                </div>
              </a>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {[
                { icon: "🔒", label: "No Account Needed" },
                { icon: "📱", label: "iOS & Android" },
                { icon: "🆓", label: "Completely Free" },
                { icon: "⚡", label: "Offline Ready" },
              ].map(t => (
                <div key={t.label} className="flex items-center gap-2.5 text-white/50 text-sm font-bold tracking-tight">
                  <span className="text-base">{t.icon}</span>
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

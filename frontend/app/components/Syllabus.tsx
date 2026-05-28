"use client";

import { useState, useEffect } from "react";
import { fetchChapters, fetchCourses, type Chapter, type Category, type ApiCourse } from "../../lib/api";

export default function Syllabus() {
  const [categories, setCategories] = useState<ApiCourse[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchCourses();
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].key);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchChapters(activeCategory);
        setChapters(data.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error("Failed to fetch syllabus:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeCategory]);

  const activeCatMeta = categories.find(c => c.key === activeCategory) ?? categories[0];

  return (
    <section className="py-24 md:py-28 bg-white" id="syllabus">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            Full Curriculum
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-text leading-tight mb-4 tracking-tight">
            Comprehensive Course Syllabus
          </h2>
          <p className="text-lg text-text-secondary max-w-[520px] mx-auto leading-relaxed">
            Explore the complete chapter-wise breakdown for all our courses, updated for the current session.
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex justify-center gap-2.5 mb-14 flex-wrap">
          {categories.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-6 py-2.5 rounded-full font-bold text-[0.9rem] transition-all cursor-pointer ${
                  active 
                    ? 'bg-primary shadow-lg shadow-primary/20 text-white'
                    : "bg-white text-text-secondary border border-border hover:shadow-md"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-text-muted font-bold">Loading syllabus...</p>
          </div>
        ) : chapters.length === 0 ? (
          <div className="text-center py-20 px-6 bg-bg-surface rounded-3xl border border-dashed border-border">
            <p className="mt-3 font-bold text-lg text-text-secondary">No chapters added for {activeCatMeta?.label} yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Group chapters by some logic or just show them all. 
                For the landing page, showing a list is clean. */}
            {chapters.map((ch, i) => {
              const colorClass = 
                (i % 5 === 0) ? 'text-primary bg-primary/5 border-primary/10' :
                (i % 5 === 1) ? 'text-accent bg-accent/5 border-accent/10' :
                (i % 5 === 2) ? 'text-accent-warm bg-accent-warm/5 border-accent-warm/10' :
                (i % 5 === 3) ? 'text-purple bg-purple/5 border-purple/10' :
                'text-red-500 bg-red-50 border-red-100';

              return (
                <div
                  key={ch._id}
                  className={`rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${colorClass} border`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-border">
                      <div className={`w-2 h-2 rounded-full ${colorClass.split(' ')[0].replace('text-', 'bg-')}`} />
                    </div>
                    <div>
                      <div className="text-[0.7rem] font-black tracking-widest uppercase opacity-70">
                        Chapter {ch.order}
                      </div>
                      <h3 className="font-black text-text text-base leading-tight tracking-tight">
                        {ch.title}
                      </h3>
                    </div>
                  </div>
                  {ch.summary?.short_summary && (
                    <p className="text-xs text-text-secondary line-clamp-2 mt-3 leading-relaxed">
                      {ch.summary.short_summary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Note */}
        {!loading && chapters.length > 0 && (
          <div className={`text-center mt-12 p-8 px-10 rounded-3xl border transition-all duration-500 ${
            activeCategory === 'class11' ? 'bg-purple/5 border-purple/10' :
            activeCategory === 'class12' ? 'bg-primary/5 border-primary/10' :
            activeCategory === 'bca' ? 'bg-accent/5 border-accent/10' :
            activeCategory === 'btech' ? 'bg-accent-warm/5 border-accent-warm/10' :
            'bg-red-50 border-red-100'
          }`}>
            <p className="text-lg text-text-secondary leading-relaxed">
              All <strong className="text-text font-black">{chapters.length} chapters</strong> for {activeCatMeta?.label} are available <strong className="text-text font-black">completely free</strong>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

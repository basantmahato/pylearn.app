"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { SamplePaper, Category } from "../../lib/api";
import { CATEGORIES } from "../../lib/api";

interface Props {
  papers: SamplePaper[];
  error: string;
}



import StateView from "../components/StateView";

export default function SamplesClient({ papers, error }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>("class12");
  const [filter, setFilter] = useState<string>("all");



  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const catMatch = p.category === activeCategory;
      if (!catMatch) return false;
      if (filter === "all") return true;
      return (p.difficulty ?? "medium").toLowerCase() === filter;
    });
  }, [papers, activeCategory, filter]);

  const difficulties = useMemo(() => {
    const catPapers = papers.filter(p => p.category === activeCategory);
    return ["all", ...Array.from(new Set(catPapers.map((p) => (p.difficulty ?? "Medium").toLowerCase())))];
  }, [papers, activeCategory]);

  if (error) {
    return <StateView message={`Failed to load sample papers: ${error}`} type="error" />;
  }

  return (
    <section className="py-24 md:py-28">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            Practice Papers
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black text-text leading-tight tracking-tight">
            Sample Papers
          </h1>
          <p className="text-text-secondary mt-2 max-w-[540px] mx-auto leading-relaxed">
            Full-length section-wise questions &amp; explanations for all categories.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2.5 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setFilter("all"); }}
                className={`px-6 py-2.5 rounded-full font-bold text-[0.9rem] transition-all cursor-pointer ${
                  active 
                    ? 'bg-primary shadow-lg shadow-primary/20 text-white'
                    : "bg-white text-text-secondary shadow-sm hover:shadow-md border border-border/50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-2.5 justify-center flex-wrap mb-12">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-5 py-2 rounded-full text-[0.8rem] font-bold capitalize transition-all border cursor-pointer ${
                filter === d 
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                  : "bg-white text-text-secondary border-border hover:shadow-sm"
              }`}
            >
              {d === "all" ? "All Papers" : d}
            </button>
          ))}
        </div>

        {/* Papers Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 px-6 text-text-muted">
            <span className="text-4xl">📭</span>
            <p className="mt-3 font-bold text-lg">No papers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((paper, i) => {
              const diff = (paper.difficulty ?? "Medium").toLowerCase();
              const diffColors: Record<string, string> = {
                easy: "text-accent bg-accent/10 border-accent/20",
                medium: "text-accent-warm bg-accent-warm/10 border-accent-warm/20",
                hard: "text-error bg-error/10 border-error/20",
              };
              const colorClass = diffColors[diff] || "text-primary bg-primary/10 border-primary/20";
              const totalQ = (paper.sections ?? []).reduce((acc, s) => acc + (s.questions ?? []).length, 0);

              return (
                <Link
                  key={paper._id}
                  href={`/samples/${activeCategory}/${paper.paperId}`}
                  className="group bg-white rounded-2xl border border-border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 flex flex-col h-full no-underline"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-surface border border-border group-hover:border-primary/20">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={colorClass.split(' ')[0]}>
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-black uppercase tracking-wider border ${colorClass}`}>
                      {paper.difficulty ?? "Medium"}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest mb-1">
                      Paper {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-base font-black text-text leading-tight mb-2 tracking-tight group-hover:text-primary transition-colors">
                      {paper.title}
                    </h3>
                  </div>

                  <div className="flex gap-4 flex-wrap mt-4 pt-4 border-t border-border/50">
                    {paper.totalMarks && (
                      <span className="text-[0.65rem] text-text-muted font-bold uppercase tracking-wider">
                        Marks: {paper.totalMarks}
                      </span>
                    )}
                    {paper.duration && (
                      <span className="text-[0.65rem] text-text-muted font-bold uppercase tracking-wider">
                        Time: {paper.duration}
                      </span>
                    )}
                    <span className="text-[0.65rem] text-text-muted font-bold uppercase tracking-wider">
                      Qs: {totalQ}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

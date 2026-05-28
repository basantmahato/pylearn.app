"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Chapter, QuizSet, Category, ApiCourse } from "../../lib/api";

interface Props {
  categories: ApiCourse[];
  chaptersByCategory: Record<string, Chapter[]>;
  quizSetsByCategory: Record<string, QuizSet[]>;
  error: string;
}



import StateView from "../components/StateView";

export default function QuizClient({ categories, chaptersByCategory, quizSetsByCategory, error }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>(() => categories[0]?.key ?? "class12");
  const activeCatMeta = categories.find((c) => c.key === activeCategory) ?? categories[0];

  const chapters = useMemo(() => 
    (chaptersByCategory[activeCategory] ?? []).sort((a, b) => a.order - b.order),
    [chaptersByCategory, activeCategory]
  );
  
  const quizSets = useMemo(() => 
    quizSetsByCategory[activeCategory] ?? [],
    [quizSetsByCategory, activeCategory]
  );

  const [activeChapter, setActiveChapter] = useState<string>(
    () => (chaptersByCategory[activeCategory] ?? [])[0]?.chapterId ?? ""
  );

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    const sorted = (chaptersByCategory[cat] ?? []).sort((a, b) => a.order - b.order);
    setActiveChapter(sorted[0]?.chapterId ?? "");
  };

  const chapterSets = useMemo(
    () => quizSets.filter((s) => s.chapterId === activeChapter),
    [quizSets, activeChapter, activeCategory]
  );

  if (error) {
    return <StateView message={`Failed to load quiz bank: ${error}`} type="error" />;
  }

  return (
    <section className="py-24 md:py-28">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            Practice
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black text-text leading-tight tracking-tight">
            Quiz Bank
          </h1>
          <p className="text-text-secondary mt-2 max-w-[540px] mx-auto leading-relaxed">
            100+ chapter-wise MCQs with instant feedback &amp; explanations.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2.5 mb-8 flex-wrap">
          {categories.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
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

        {chapters.length === 0 ? (
          <div className="text-center py-20 px-6 text-text-muted">
            <p className="mt-3 font-bold text-lg">No quizzes yet for {activeCatMeta.label}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Chapter Sidebar */}
            <aside className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden lg:sticky lg:top-[100px]">
              <div className="px-5 py-4 border-b border-border bg-bg-surface">
                <p 
                  className={`font-bold text-[0.78rem] tracking-wider uppercase ${
                    activeCategory === 'class11' ? 'text-purple' :
                    activeCategory === 'class12' ? 'text-primary' :
                    activeCategory === 'bca' ? 'text-accent' :
                    activeCategory === 'btech' ? 'text-accent-warm' : 'text-red-500'
                  }`}
                >
                  {activeCatMeta.label}
                </p>
              </div>
              <nav className="p-2 space-y-1">
                {chapters.map((ch) => {
                  const active = ch.chapterId === activeChapter;
                  const count = quizSets.filter((s) => s.chapterId === ch.chapterId).length;
                  const activeBgClass = 
                    activeCategory === 'class11' ? 'bg-purple/10' :
                    activeCategory === 'class12' ? 'bg-primary/10' :
                    activeCategory === 'bca' ? 'bg-accent/10' :
                    activeCategory === 'btech' ? 'bg-accent-warm/10' : 'bg-red-500/10';
                  
                  const activeTextClass = 
                    activeCategory === 'class11' ? 'text-purple' :
                    activeCategory === 'class12' ? 'text-primary' :
                    activeCategory === 'bca' ? 'text-accent' :
                    activeCategory === 'btech' ? 'text-accent-warm' : 'text-red-500';

                  const badgeBgClass = 
                    activeCategory === 'class11' ? 'bg-purple' :
                    activeCategory === 'class12' ? 'bg-primary' :
                    activeCategory === 'bca' ? 'bg-accent' :
                    activeCategory === 'btech' ? 'bg-accent-warm' : 'bg-red-500';

                  return (
                    <button
                      key={ch.chapterId}
                      onClick={() => setActiveChapter(ch.chapterId)}
                      className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl no-underline text-[0.875rem] transition-all ${
                        active 
                          ? `font-bold ${activeTextClass} ${activeBgClass}` 
                          : "text-text-secondary font-medium hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate mr-2">{ch.title}</span>
                      {count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[0.7rem] font-bold ${
                          active ? `text-white ${badgeBgClass}` : "bg-bg-surface text-text-muted"
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Quiz Sets Grid */}
            <div className="flex flex-col gap-4">
              {chapterSets.length === 0 ? (
                <div className="text-center py-20 px-6 text-text-muted">
                  <p className="mt-3 font-bold">No quizzes yet for this chapter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {chapterSets.map((set) => {
                    const diff = set.difficulty?.toLowerCase() ?? "medium";
                    const diffColors: Record<string, string> = {
                      easy: "text-accent bg-accent/10 border-accent/20",
                      medium: "text-accent-warm bg-accent-warm/10 border-accent-warm/20",
                      hard: "text-error bg-error/10 border-error/20",
                    };
                    const colorClass = diffColors[diff] || "text-primary bg-primary/10 border-primary/20";

                    return (
                      <Link
                        key={set._id}
                        href={`/quiz/${activeCategory}/${activeChapter}/${set.setId}`}
                        className="group bg-white rounded-2xl border border-border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 no-underline"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-bg-surface border border-border group-hover:border-primary/20 ${colorClass.split(' ')[0]}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                              <path d="m9 12 2 2 4-4"/>
                            </svg>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-black uppercase tracking-wider border ${colorClass}`}>
                            {set.difficulty ?? "Medium"}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-text mb-1.5 leading-tight tracking-tight group-hover:text-primary transition-colors">
                          {set.setName}
                        </h3>
                        <p className="text-[0.82rem] text-text-secondary">
                          {set.questions?.length || 0} questions
                        </p>
                        <div className="mt-4 flex items-center gap-1.5 text-primary font-bold text-[0.85rem]">
                          Start Quiz
                          <svg className="transition-transform group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}



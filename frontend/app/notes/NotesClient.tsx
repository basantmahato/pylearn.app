"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Chapter, NoteBlock, Category } from "../../lib/api";
import { CATEGORIES } from "../../lib/api";
import { slugify } from "../../lib/slugify";
import StateView from "../components/StateView";

interface Props {
  chaptersByCategory: Record<string, Chapter[]>;
  notes: NoteBlock[];
  error: string;
}



export default function NotesClient({ chaptersByCategory, notes, error }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>("class12");
  const chapters = useMemo(() => 
    (chaptersByCategory[activeCategory] ?? []).sort((a, b) => a.order - b.order),
    [chaptersByCategory, activeCategory]
  );
  
  const [activeChapter, setActiveChapter] = useState<string>(() => 
    (chaptersByCategory["class12"] ?? [])[0]?.chapterId ?? ""
  );
  const [search, setSearch] = useState("");

  const activeCatMeta = CATEGORIES.find((c) => c.key === activeCategory)!;

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    const sorted = (chaptersByCategory[cat] ?? []).sort((a, b) => a.order - b.order);
    setActiveChapter(sorted[0]?.chapterId ?? "");
    setSearch("");
  };

  const chapterNotes = useMemo(
    () =>
      notes
        .filter((n) => n.chapterId === activeChapter)
        .filter((n) => !n.category || n.category === activeCategory)
        .filter((n) => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          return (
            n.heading?.toLowerCase().includes(q) ||
            n.text?.toLowerCase().includes(q) ||
            n.items?.some((i) => i.toLowerCase().includes(q)) ||
            n.code?.toLowerCase().includes(q)
          );
        })
        .sort((a, b) => a.order - b.order),
    [notes, activeChapter, activeCategory, search]
  );

  const activeChapterData = chapters.find((c) => c.chapterId === activeChapter);

  if (error) {
    return <StateView message={`Failed to load notes: ${error}`} type="error" />;
  }

  return (
    <section className="py-24 md:py-28">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            Study Material
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black text-text leading-tight tracking-tight">
            Chapter Notes
          </h1>
          <p className="text-text-secondary mt-2 max-w-[540px] mx-auto leading-relaxed">
            Structured notes for every chapter — paragraphs, bullet points &amp; code examples.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex justify-center gap-2.5 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-6 py-2.5 rounded-full font-bold text-[0.9rem] transition-all cursor-pointer ${
                  active 
                    ? 'bg-primary shadow-lg shadow-primary/20 text-white'
                    : "bg-white text-text-secondary shadow-sm hover:shadow-md"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="max-w-[480px] mx-auto mb-8 relative">
          <input
            id="notes-search"
            type="text"
            placeholder="Search within notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-white text-text text-[0.9rem] outline-none shadow-sm transition-all focus:border-primary/50 focus:shadow-md"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-40"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-20 px-6 text-text-muted">
            <p className="mt-3 font-bold text-lg">No chapters yet for {activeCatMeta.label}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Chapter Sidebar */}
            <aside className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden lg:sticky lg:top-[100px]">
              <div className="px-5 py-4 border-b border-border bg-bg-surface">
                <p 
                  className={`font-bold text-[0.8rem] tracking-wider uppercase ${
                    activeCategory === 'class11' ? 'text-purple' :
                    activeCategory === 'class12' ? 'text-primary' :
                    activeCategory === 'bca' ? 'text-accent' :
                    activeCategory === 'btech' ? 'text-accent-warm' : 'text-red-500'
                  }`}
                >
                  {activeCatMeta.label} • {chapters.length} Chapters
                </p>
              </div>
              <nav className="p-2 space-y-1">
                {chapters.map((ch, i) => {
                  const active = ch.chapterId === activeChapter;
                  const colorClass = 
                    (i % 6 === 0) ? 'text-primary' :
                    (i % 6 === 1) ? 'text-purple' :
                    (i % 6 === 2) ? 'text-accent' :
                    (i % 6 === 3) ? 'text-accent-warm' :
                    (i % 6 === 4) ? 'text-red-500' : 'text-cyan-500';
                  
                  const bgClass = 
                    (i % 6 === 0) ? 'bg-primary/10' :
                    (i % 6 === 1) ? 'bg-purple/10' :
                    (i % 6 === 2) ? 'bg-accent/10' :
                    (i % 6 === 3) ? 'bg-accent-warm/10' :
                    (i % 6 === 4) ? 'bg-red-500/10' : 'bg-cyan-500/10';

                  const badgeBgClass = 
                    (i % 6 === 0) ? 'bg-primary' :
                    (i % 6 === 1) ? 'bg-purple' :
                    (i % 6 === 2) ? 'bg-accent' :
                    (i % 6 === 3) ? 'bg-accent-warm' :
                    (i % 6 === 4) ? 'bg-red-500' : 'bg-cyan-500';

                  return (
                    <Link
                      key={ch.chapterId}
                      href={`/notes/${activeCategory}/${slugify(ch.title)}`}
                      onClick={() => { setActiveChapter(ch.chapterId); setSearch(""); }}
                      className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl no-underline text-sm transition-all ${
                        active 
                          ? `font-bold ${colorClass} ${bgClass}` 
                          : "text-text-secondary font-medium hover:bg-gray-50"
                      }`}
                    >
                      <span 
                        className={`min-w-[26px] h-[26px] rounded-lg flex items-center justify-center text-[0.7rem] font-black ${
                          active ? `text-white ${badgeBgClass}` : "bg-bg-surface text-text-muted"
                        }`}
                      >
                        {ch.order}
                      </span>
                      {ch.title}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Notes Content */}
            <div className="flex flex-col gap-4">
              {activeChapterData && (
                <div 
                  className={`rounded-3xl p-8 text-white shadow-md shadow-primary/10 bg-gradient-to-br ${
                    activeCategory === 'class11' ? 'from-purple to-purple/80' :
                    activeCategory === 'class12' ? 'from-primary to-primary/80' :
                    activeCategory === 'bca' ? 'from-accent to-accent/80' :
                    activeCategory === 'btech' ? 'from-accent-warm to-accent-warm/80' :
                    'from-red-500 to-red-600'
                  }`}
                >
                  <p className="text-[0.75rem] font-bold opacity-70 tracking-widest uppercase mb-1">
                    Chapter {activeChapterData.order}
                  </p>
                  <h2 className="text-2xl font-black tracking-tight mb-2">
                    {activeChapterData.title}
                  </h2>
                  {activeChapterData.summary?.short_summary && (
                    <p className="opacity-90 text-[0.95rem] leading-relaxed mb-4">
                      {activeChapterData.summary.short_summary}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-[0.75rem] font-bold">
                      {chapterNotes.length} blocks
                    </span>
                  </div>
                </div>
              )}

              {chapterNotes.length === 0 ? (
                <div className="text-center py-16 px-6 text-text-muted">
                  <p className="mt-3 font-bold">
                    {search ? "No results for your search." : "No notes yet for this chapter."}
                  </p>
                </div>
              ) : (
                chapterNotes.map((note) => <NoteCard key={note._id} note={note} />)
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function NoteCard({ note }: { note: NoteBlock }) {
  if (note.type === "code") {
    return (
      <div className="bg-[#0f1729] rounded-[20px] overflow-hidden border border-white/5 shadow-md">
        {note.heading && (
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
            <span className="text-[0.75rem] bg-primary/30 text-primary-light px-2 py-0.5 rounded-md font-bold">
              {note.language ?? "python"}
            </span>
            <span className="text-white/60 text-[0.875rem] font-semibold">{note.heading}</span>
          </div>
        )}
        <pre className="p-6 md:px-7 overflow-x-auto m-0 text-[#a5f3fc] text-[0.875rem] leading-relaxed">
          <code>{note.code}</code>
        </pre>
      </div>
    );
  }

  if (note.type === "bullet_list") {
    return (
      <div className="bg-white rounded-3xl border border-border p-6 md:p-7 shadow-sm">
        {note.heading && <h3 className="font-black text-lg mb-4 text-text tracking-tight">{note.heading}</h3>}
        <ul className="flex flex-col gap-2.5">
          {note.items?.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="min-w-[22px] h-[22px] rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[0.7rem] font-black mt-0.5 shrink-0">
                {i + 1}
              </span>
              <span className="text-text-secondary leading-relaxed text-[0.95rem]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border p-6 md:p-7 shadow-sm">
      {note.heading && <h3 className="font-black text-lg mb-3 text-text tracking-tight">{note.heading}</h3>}
      {note.text && <p className="text-text-secondary leading-relaxed text-[0.95rem]">{note.text}</p>}
    </div>
  );
}

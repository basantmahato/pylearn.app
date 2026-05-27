import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import {
  fetchChapters,
  fetchNotesByChapter,
  CATEGORIES,
  type Chapter,
  type NoteBlock,
  type Category,
} from "../../../../lib/api";
import { slugify } from "../../../../lib/slugify";

// ── Static params for SSG ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const params: { category: string; chapterId: string }[] = [];
    for (const cat of CATEGORIES) {
      const chapters = await fetchChapters(cat.key);
      chapters.forEach((ch) => {
        if (!ch.title) return;
        params.push({ category: String(cat.key), chapterId: slugify(ch.title) });
      });
    }
    return params;
  } catch {
    return [];
  }
}

// ── Dynamic metadata per chapter ──────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; chapterId: string }>;
}): Promise<Metadata> {
  const { category, chapterId: slug } = await params;
  try {
    const chapters = await fetchChapters(category as Category);
    const chapter = chapters.find((c) => slugify(c.title) === slug);
    if (!chapter) return {};
    const catLabel = CATEGORIES.find((c) => c.key === category)?.label ?? category;
    return {
      title: `${chapter.title} Notes — ${catLabel} | PyLearn`,
      description:
        chapter.summary?.short_summary ??
        `Detailed Python notes for "${chapter.title}" (${catLabel}) — structured paragraphs, bullet lists & code examples.`,
      openGraph: {
        title: `${chapter.title} Notes — ${catLabel} | PyLearn`,
        description:
          chapter.summary?.short_summary ??
          `Study notes for ${chapter.title} in ${catLabel}`,
        type: "article",
      },
    };
  } catch {
    return {};
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ChapterNotesPage({
  params,
}: {
  params: Promise<{ category: string; chapterId: string }>;
}) {
  const { category, chapterId: slug } = await params;

  const catMeta = CATEGORIES.find((c) => c.key === category);
  if (!catMeta) notFound();

  let chapter: Chapter | undefined;
  let notes: NoteBlock[] = [];
  let allChapters: Chapter[] = [];

  try {
    [allChapters, ] = await Promise.all([
      fetchChapters(category as Category),
      Promise.resolve([]),
    ]);
    chapter = allChapters.find((c) => slugify(c.title) === slug);
    if (chapter) {
      notes = await fetchNotesByChapter(chapter.chapterId, category as Category);
    }
  } catch {
    /* will show error state below */
  }

  if (!chapter) notFound();

  const sortedChapters = allChapters.sort((a, b) => a.order - b.order);
  const sortedNotes = notes.sort((a, b) => a.order - b.order);

  // Category-specific Tailwind classes
  const catStyles = {
    class11: { text: "text-purple", bg: "bg-purple/10", border: "border-purple", gradient: "from-purple to-purple-light", badge: "bg-purple/15 text-purple" },
    class12: { text: "text-primary", bg: "bg-primary/10", border: "border-primary", gradient: "from-primary to-primary-light", badge: "bg-primary/15 text-primary" },
    bca: { text: "text-accent", bg: "bg-accent/10", border: "border-accent", gradient: "from-accent to-accent/80", badge: "bg-accent/15 text-accent" },
    btech: { text: "text-accent-warm", bg: "bg-accent-warm/10", border: "border-accent-warm", gradient: "from-accent-warm to-accent-warm/80", badge: "bg-accent-warm/15 text-accent-warm" },
    aiml: { text: "text-error", bg: "bg-error/10", border: "border-error", gradient: "from-error to-error/80", badge: "bg-error/15 text-error" },
  }[category as Category] || { text: "text-primary", bg: "bg-primary/10", border: "border-primary", gradient: "from-primary to-primary-light", badge: "bg-primary/15 text-primary" };

  const NOTE_COLOR_CLASSES = [
    { text: "text-primary", bg: "bg-primary/10", badge: "bg-primary" },
    { text: "text-purple", bg: "bg-purple/10", badge: "bg-purple" },
    { text: "text-accent", bg: "bg-accent/10", badge: "bg-accent" },
    { text: "text-accent-warm", bg: "bg-accent-warm/10", badge: "bg-accent-warm" },
    { text: "text-error", bg: "bg-error/10", badge: "bg-error" },
    { text: "text-cyan-600", bg: "bg-cyan-50", badge: "bg-cyan-600" },
  ];

  // JSON-LD for AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": `${chapter.title} Notes`,
    "description": chapter.summary?.short_summary || `Python notes for ${chapter.title}`,
    "educationalLevel": catMeta.label,
    "learningResourceType": "Study Guide",
    "interactivityType": "active",
    "about": {
      "@type": "Thing",
      "name": "Python Programming"
    },
    "author": {
      "@type": "Organization",
      "name": "PyLearn"
    }
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-32 min-h-screen bg-bg">
        <section className="pb-20">
          <div className="container mx-auto px-6">

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[0.82rem] mb-8 flex-wrap">
              <Link href="/" className="text-text-muted hover:text-primary transition-colors">Home</Link>
              <span className="text-text-muted">›</span>
              <Link href="/notes" className="text-text-muted hover:text-primary transition-colors">Notes</Link>
              <span className="text-text-muted">›</span>
              <Link 
                href={`/notes?category=${category}`} 
                className={`font-bold hover:opacity-80 transition-opacity ${catStyles.text}`}
              >
                {catMeta.label}
              </Link>
              <span className="text-text-muted">›</span>
              <span className="text-text font-black">{chapter.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
              {/* Chapter Sidebar */}
              <aside className="bg-bg-card rounded-[24px] border border-border shadow-sm overflow-hidden lg:sticky lg:top-32 order-2 lg:order-1">
                <div className="px-5 py-4 border-b border-border bg-bg-surface">
                  <p className={`font-bold text-[0.75rem] uppercase tracking-wider ${catStyles.text}`}>
                    {catMeta.label} • {sortedChapters.length} Chapters
                  </p>
                </div>
                <nav className="p-2 flex flex-col gap-1">
                  {sortedChapters.map((ch, i) => {
                    const active = slugify(ch.title) === slug;
                    const colorStyles = NOTE_COLOR_CLASSES[i % NOTE_COLOR_CLASSES.length];
                    return (
                      <Link
                        key={ch.chapterId}
                        href={`/notes/${category}/${slugify(ch.title)}`}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group ${
                          active 
                            ? `${colorStyles.bg} ${colorStyles.text} font-bold` 
                            : "text-text-secondary hover:bg-bg-surface"
                        }`}
                      >
                        <span 
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[0.7rem] font-black shrink-0 transition-colors ${
                            active ? `text-white ${colorStyles.badge}` : "bg-bg-surface text-text-muted group-hover:text-text"
                          }`}
                        >
                          {ch.order}
                        </span>
                        <span className="line-clamp-1">{ch.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </aside>

              {/* Notes Content */}
              <div className="flex flex-col gap-6 order-1 lg:order-2">
                {/* Chapter Header Banner */}
                <div className={`rounded-[32px] p-8 md:p-10 text-white shadow-lg overflow-hidden relative bg-gradient-to-br ${catStyles.gradient}`}>
                  <div className="relative z-10">
                    <p className="text-[0.75rem] font-black uppercase tracking-[0.12em] opacity-80 mb-3">
                      {catMeta.label} • Chapter {chapter.order}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4">
                      {chapter.title}
                    </h1>
                    {chapter.summary?.short_summary && (
                      <p className="text-lg opacity-90 max-w-2xl leading-relaxed mb-6">
                        {chapter.summary.short_summary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">
                        {sortedNotes.length} note blocks
                      </span>
                      {chapter.summary?.exam_focus && chapter.summary.exam_focus.length > 0 && (
                        <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">
                          {chapter.summary.exam_focus.length} exam topics
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Decorative background shape */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                </div>

                {/* Exam Focus */}
                {chapter.summary?.exam_focus && chapter.summary.exam_focus.length > 0 && (
                  <div className={`bg-white rounded-3xl p-6 border border-border shadow-sm border-l-4 ${catStyles.border}`}>
                    <h2 className={`font-black text-[0.8rem] uppercase tracking-widest mb-4 flex items-center gap-2 ${catStyles.text}`}>
                      🎯 Exam Focus Areas
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {chapter.summary.exam_focus.map((topic, i) => (
                        <span key={i} className={`px-4 py-1.5 rounded-full text-xs font-bold ${catStyles.badge}`}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note Blocks */}
                <div className="flex flex-col gap-6">
                  {sortedNotes.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-border">
                      <span className="text-5xl mb-4 block">📭</span>
                      <p className="text-text-secondary font-bold text-lg">No notes yet for this chapter.</p>
                    </div>
                  ) : (
                    sortedNotes.map((note) => <NoteCard key={note._id} note={note} />)
                  )}
                </div>

                {/* Revision Notes */}
                {chapter.summary?.revision_notes && chapter.summary.revision_notes.length > 0 && (
                  <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10 shadow-sm relative overflow-hidden">
                    <h2 className="font-black text-[0.8rem] uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                      📝 Quick Revision Points
                    </h2>
                    <ul className="flex flex-col gap-4">
                      {chapter.summary.revision_notes.map((point, i) => (
                        <li key={i} className="flex gap-4 items-start group">
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[0.7rem] font-black shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                            {i + 1}
                          </span>
                          <span className="text-text-secondary leading-relaxed text-[0.95rem]">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prev / Next navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {(() => {
                    const idx = sortedChapters.findIndex((c) => slugify(c.title) === slug);
                    const prev = sortedChapters[idx - 1];
                    const next = sortedChapters[idx + 1];
                    return (
                      <>
                        {prev ? (
                          <Link 
                            href={`/notes/${category}/${slugify(prev.title)}`} 
                            className="flex flex-col gap-1 p-5 bg-white rounded-2xl border border-border transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 group"
                          >
                            <span className="text-[0.7rem] text-text-muted font-black uppercase tracking-widest group-hover:text-primary transition-colors">← Previous</span>
                            <span className="font-black text-text group-hover:text-primary transition-colors line-clamp-1">{prev.title}</span>
                          </Link>
                        ) : <div className="hidden sm:block" />}
                        {next ? (
                          <Link 
                            href={`/notes/${category}/${slugify(next.title)}`} 
                            className="flex flex-col gap-1 p-5 bg-white rounded-2xl border border-border transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 text-right group"
                          >
                            <span className="text-[0.7rem] text-text-muted font-black uppercase tracking-widest group-hover:text-primary transition-colors">Next →</span>
                            <span className="font-black text-text group-hover:text-primary transition-colors line-clamp-1">{next.title}</span>
                          </Link>
                        ) : <div className="hidden sm:block" />}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ── Note Card ─────────────────────────────────────────────────────────────────
function NoteCard({ note }: { note: NoteBlock }) {
  if (note.type === "code") {
    return (
      <div className="bg-[#0f1729] rounded-[24px] overflow-hidden border border-white/5 shadow-xl transition-all hover:shadow-2xl hover:shadow-primary/5">
        {note.heading && (
          <div className="px-6 py-3.5 border-b border-white/5 flex items-center gap-3">
            <span className="text-[0.65rem] bg-primary/20 text-primary-light px-2.5 py-1 rounded-md font-black uppercase tracking-wider">
              {note.language ?? "python"}
            </span>
            <span className="text-white/70 text-sm font-bold tracking-tight">{note.heading}</span>
          </div>
        )}
        <div className="relative">
          <pre className="p-6 md:p-8 overflow-x-auto text-[0.9rem] leading-[1.7] text-[#a5f3fc] font-mono scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <code>{note.code}</code>
          </pre>
          {/* Subtle code bg glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none" />
        </div>
      </div>
    );
  }

  if (note.type === "bullet_list") {
    return (
      <div className="bg-white rounded-[24px] p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
        {note.heading && <h3 className="text-lg font-black text-text tracking-tight mb-6">{note.heading}</h3>}
        <ul className="flex flex-col gap-4">
          {note.items?.map((item, i) => (
            <li key={i} className="flex gap-4 items-start group">
              <span className="w-6 h-6 rounded-lg bg-primary/5 text-primary flex items-center justify-center text-[0.7rem] font-black shrink-0 mt-0.5 transition-colors group-hover:bg-primary group-hover:text-white">
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
    <div className="bg-white rounded-[24px] p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
      {note.heading && <h3 className="text-lg font-black text-text tracking-tight mb-4">{note.heading}</h3>}
      {note.text && <p className="text-text-secondary leading-[1.8] text-[0.95rem]">{note.text}</p>}
    </div>
  );
}

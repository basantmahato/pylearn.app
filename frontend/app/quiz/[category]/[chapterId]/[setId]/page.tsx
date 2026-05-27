import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import QuizRunner from "./QuizRunner";
import {
  fetchChapters,
  fetchQuizzesByChapter,
  CATEGORIES,
  type Chapter,
  type QuizSet,
  type Category,
} from "../../../../../lib/api";

// ── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const params: { category: string; chapterId: string; setId: string }[] = [];
    for (const cat of CATEGORIES) {
      const chapters = await fetchChapters(cat.key);
      for (const ch of chapters) {
        const sets = await fetchQuizzesByChapter(ch.chapterId, cat.key);
        sets.forEach((s) => {
          if (!s.setId || typeof s.setId !== "string") return;
          params.push({
            category: String(cat.key),
            chapterId: String(ch.chapterId),
            setId: String(s.setId),
          });
        });
      }
    }
    return params;
  } catch {
    return [];
  }
}

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; chapterId: string; setId: string }>;
}): Promise<Metadata> {
  const { category, chapterId, setId } = await params;
  try {
    const [chapters, sets] = await Promise.all([
      fetchChapters(category as Category),
      fetchQuizzesByChapter(chapterId, category as Category),
    ]);
    const chapter = chapters.find((c) => c.chapterId === chapterId);
    const set = sets.find((s) => s.setId === setId);
    if (!chapter || !set) return {};
    const catLabel = CATEGORIES.find((c) => c.key === category)?.label ?? category;
    return {
      title: `${set.setName} — ${chapter.title} Quiz | ${catLabel} | PyLearn`,
      description: `Practice "${set.setName}" — ${set.questions.length} MCQs for ${chapter.title} (${catLabel}) with instant feedback and explanations.`,
      openGraph: {
        title: `${set.setName} Quiz — ${chapter.title} | PyLearn`,
        description: `${set.questions.length} Python MCQs for ${chapter.title} (${catLabel})`,
        type: "article",
      },
    };
  } catch {
    return {};
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizSetPage({
  params,
}: {
  params: Promise<{ category: string; chapterId: string; setId: string }>;
}) {
  const { category, chapterId, setId } = await params;

  const catMeta = CATEGORIES.find((c) => c.key === category);
  if (!catMeta) notFound();

  let chapter: Chapter | undefined;
  let set: QuizSet | undefined;
  let chapterSets: QuizSet[] = [];

  try {
    const [chapters, sets] = await Promise.all([
      fetchChapters(category as Category),
      fetchQuizzesByChapter(chapterId, category as Category),
    ]);
    chapter = chapters.find((c) => c.chapterId === chapterId);
    chapterSets = sets;
    set = sets.find((s) => s.setId === setId);
  } catch {
    /* fall through to notFound */
  }

  if (!chapter || !set) notFound();

  // Category-specific Tailwind classes
  const catStyles = {
    class11: { text: "text-purple", bg: "bg-purple/10", border: "border-purple", gradient: "from-purple to-purple-light", badge: "bg-purple/15 text-purple" },
    class12: { text: "text-primary", bg: "bg-primary/10", border: "border-primary", gradient: "from-primary to-primary-light", badge: "bg-primary/15 text-primary" },
    bca: { text: "text-accent", bg: "bg-accent/10", border: "border-accent", gradient: "from-accent to-accent/80", badge: "bg-accent/15 text-accent" },
    btech: { text: "text-accent-warm", bg: "bg-accent-warm/10", border: "border-accent-warm", gradient: "from-accent-warm to-accent-warm/80", badge: "bg-accent-warm/15 text-accent-warm" },
    aiml: { text: "text-error", bg: "bg-error/10", border: "border-error", gradient: "from-error to-error/80", badge: "bg-error/15 text-error" },
  }[category as Category] || { text: "text-primary", bg: "bg-primary/10", border: "border-primary", gradient: "from-primary to-primary-light", badge: "bg-primary/15 text-primary" };

  const DIFF_COLORS: Record<string, string> = {
    easy: "text-accent bg-accent/10 border-accent/30",
    medium: "text-accent-warm bg-accent-warm/10 border-accent-warm/30",
    hard: "text-error bg-error/10 border-error/30",
  };



  // JSON-LD for AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": `${set.setName} — ${chapter.title}`,
    "description": `Practice ${set.questions.length} MCQs on ${chapter.title}`,
    "educationalLevel": catMeta.label,
    "educationalAlignment": {
      "@type": "AlignmentObject",
      "alignmentType": "educationalLevel",
      "educationalFramework": "CBSE / Higher Education",
      "targetName": catMeta.label
    },
    "hasPart": set.questions.map((q, i) => ({
      "@type": "Question",
      "name": `Question ${i + 1}`,
      "text": q.question
    }))
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
          <div className="container mx-auto px-6 max-w-[820px]">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[0.82rem] mb-8 flex-wrap">
              <Link href="/" className="text-text-muted hover:text-primary transition-colors">Home</Link>
              <span className="text-text-muted">›</span>
              <Link href="/quiz" className="text-text-muted hover:text-primary transition-colors">Quiz</Link>
              <span className="text-text-muted">›</span>
              <Link 
                href={`/quiz?category=${category}`} 
                className={`font-bold hover:opacity-80 transition-opacity ${catStyles.text}`}
              >
                {catMeta.label}
              </Link>
              <span className="text-text-muted">›</span>
              <span className="text-text-muted">{chapter.title}</span>
              <span className="text-text-muted">›</span>
              <span className="text-text font-black">{set.setName}</span>
            </nav>

            {/* Quiz Header */}
            <div className={`rounded-[32px] p-8 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden bg-gradient-to-br ${catStyles.gradient}`}>
              <div className="relative z-10">
                <p className="text-[0.75rem] font-black uppercase tracking-[0.12em] opacity-80 mb-3">
                  {catMeta.label} • {chapter.title}
                </p>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-6">
                  {set.setName}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">
                    🧩 {set.questions.length} Questions
                  </span>
                  {set.difficulty && (
                    <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 capitalize">
                      📊 {set.difficulty}
                    </span>
                  )}
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            </div>

            {/* Other sets in same chapter */}
            {chapterSets.length > 1 && (
              <div className="mb-10">
                <p className="text-[0.75rem] font-black text-text-muted uppercase tracking-[0.12em] mb-4">
                  Other sets in this chapter
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {chapterSets.filter((s) => s.setId !== setId).map((s) => {
                    const diffClass = DIFF_COLORS[s.difficulty?.toLowerCase() ?? "medium"] || DIFF_COLORS.medium;
                    return (
                      <Link
                        key={s.setId}
                        href={`/quiz/${category}/${chapterId}/${s.setId}`}
                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-md font-bold text-xs uppercase tracking-wider ${diffClass}`}
                      >
                        {s.setName}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interactive Quiz Runner (client component) */}
            <QuizRunner set={set} diffColor="#005ab5" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

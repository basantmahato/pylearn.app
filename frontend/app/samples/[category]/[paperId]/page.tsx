import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import {
  fetchSamplePapers,
  fetchCourses,
  type SamplePaper,
  type Category,
  type ApiCourse,
} from "../../../../lib/api";

// ── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const params: { category: string; paperId: string }[] = [];
    const CATEGORIES = await fetchCourses();
    for (const cat of CATEGORIES) {
      const papers = await fetchSamplePapers(cat.key);
      papers.forEach((p) => {
        params.push({ category: cat.key, paperId: p.paperId });
      });
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
  params: Promise<{ category: string; paperId: string }>;
}): Promise<Metadata> {
  const { category, paperId } = await params;
  try {
    const CATEGORIES = await fetchCourses();
    const papers = await fetchSamplePapers(category as Category);
    const paper = papers.find((p) => p.paperId === paperId);
    if (!paper) return {};
    const catLabel = CATEGORIES.find((c) => c.key === category)?.label ?? category;
    return {
      title: `${paper.title} — ${catLabel} Sample Paper | PyLearn`,
      description:
        paper.subtitle ??
        `Attempt full-length sample paper "${paper.title}" for ${catLabel}. Detailed questions, marks and explanations.`,
      openGraph: {
        title: `${paper.title} — ${catLabel} Sample Paper | PyLearn`,
        description: paper.subtitle ?? `Sample paper for ${catLabel}`,
        type: "article",
      },
    };
  } catch {
    return {};
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SamplePaperPage({
  params,
}: {
  params: Promise<{ category: string; paperId: string }>;
}) {
  const { category, paperId } = await params;

  let CATEGORIES: ApiCourse[] = [];
  try {
    CATEGORIES = await fetchCourses();
  } catch {}

  const catMeta = CATEGORIES.find((c) => c.key === category);
  if (!catMeta) notFound();

  let paper: SamplePaper | undefined;
  try {
    const papers = await fetchSamplePapers(category as Category);
    paper = papers.find((p) => p.paperId === paperId);
  } catch {
    /* error state handled by notFound */
  }

  if (!paper) notFound();

  // Category-specific Tailwind classes
  const catStyles = {
    class11: { text: "text-purple", bg: "bg-purple/10", border: "border-purple", gradient: "from-purple to-purple-light", badge: "bg-purple/15 text-purple" },
    class12: { text: "text-primary", bg: "bg-primary/10", border: "border-primary", gradient: "from-primary to-primary-light", badge: "bg-primary/15 text-primary" },
    bca: { text: "text-accent", bg: "bg-accent/10", border: "border-accent", gradient: "from-accent to-accent/80", badge: "bg-accent/15 text-accent" },
    btech: { text: "text-accent-warm", bg: "bg-accent-warm/10", border: "border-accent-warm", gradient: "from-accent-warm to-accent-warm/80", badge: "bg-accent-warm/15 text-accent-warm" },
    aiml: { text: "text-error", bg: "bg-error/10", border: "border-error", gradient: "from-error to-error/80", badge: "bg-error/15 text-error" },
  }[category as Category] || { text: "text-primary", bg: "bg-primary/10", border: "border-primary", gradient: "from-primary to-primary-light", badge: "bg-primary/15 text-primary" };

  return (
    <>
      <Navbar />
      <main className="pt-32 min-h-screen bg-bg">
        <section className="pb-20">
          <div className="container mx-auto px-6 max-w-[800px]">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[0.82rem] mb-8 flex-wrap">
              <Link href="/" className="text-text-muted hover:text-primary transition-colors">Home</Link>
              <span className="text-text-muted">›</span>
              <Link href="/samples" className="text-text-muted hover:text-primary transition-colors">Sample Papers</Link>
              <span className="text-text-muted">›</span>
              <Link 
                href={`/samples?category=${category}`} 
                className={`font-bold hover:opacity-80 transition-opacity ${catStyles.text}`}
              >
                {catMeta.label}
              </Link>
              <span className="text-text-muted">›</span>
              <span className="text-text font-black">{paper.title}</span>
            </nav>

            {/* Paper header */}
            <div className="bg-gradient-to-br from-[#0f1729] to-[#1e2d50] rounded-[32px] p-8 md:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[0.7rem] font-black uppercase tracking-[0.2em] opacity-60 mb-3">
                  {paper.paperId}
                </p>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4">{paper.title}</h1>
                {paper.subtitle && <p className="text-lg opacity-80 leading-relaxed max-w-2xl">{paper.subtitle}</p>}
                <div className="flex flex-wrap gap-4 mt-8">
                  {paper.duration && <Chip icon="⏱" label={paper.duration} />}
                  {paper.totalMarks && <Chip icon="⭐" label={`${paper.totalMarks} Marks`} />}
                  {paper.difficulty && <Chip icon="📊" label={paper.difficulty} />}
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-12">
              {(paper.sections ?? []).map((section) => (
                <div key={section.sectionId}>
                  <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
                    <div className="bg-primary text-white font-black text-xs px-4 py-1.5 rounded-full shadow-md shadow-primary/20">
                      {section.sectionId}
                    </div>
                    <h3 className="font-black text-xl text-text tracking-tight">{section.title}</h3>
                    {section.marks && <span className="ml-auto text-text-muted font-bold text-sm">{section.marks} marks</span>}
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {(section.questions ?? []).map((q, qi) => (
                      <div key={q.id ?? qi} className="bg-white rounded-3xl p-6 md:p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-6">
                          <div className="flex items-start gap-3">
                            <span className="text-primary font-black text-lg leading-none shrink-0">Q{qi + 1}.</span>
                            <div className="flex flex-col gap-1">
                              <p className="font-bold text-text leading-relaxed text-[1.05rem]">
                                {q.question}
                              </p>
                              {q.marks && (
                                <span className="text-text-muted font-bold text-[0.75rem] uppercase tracking-wider">
                                  [{q.marks} mark{q.marks > 1 ? "s" : ""}]
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            {q.options.map((opt, oi) => (
                              <div 
                                key={oi} 
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                  oi === q.answer 
                                    ? "bg-accent/5 border-accent shadow-sm" 
                                    : "bg-bg-surface border-transparent"
                                }`}
                              >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                                  oi === q.answer ? "bg-accent text-white" : "bg-white text-primary shadow-sm"
                                }`}>
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                <span className={`text-[0.95rem] ${oi === q.answer ? "text-accent font-bold" : "text-text-secondary"}`}>
                                  {opt}
                                </span>
                                {oi === q.answer && <span className="ml-auto text-lg">✅</span>}
                              </div>
                            ))}
                          </div>
                        )}

                        {q.explanation && (
                          <div className="bg-primary/5 rounded-2xl p-5 border-l-4 border-primary">
                            <div className="flex items-start gap-3">
                              <span className="text-lg shrink-0">💡</span>
                              <p className="text-[0.9rem] text-text-secondary leading-relaxed">
                                <strong className="text-primary font-black uppercase text-[0.7rem] tracking-widest mr-2">Explanation:</strong>
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold border border-white/10 shadow-sm">
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </span>
  );
}

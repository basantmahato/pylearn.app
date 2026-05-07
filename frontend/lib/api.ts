const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Typed helpers ────────────────────────────────────────────────────────────

export interface Chapter {
  _id: string;
  chapterId: string;
  title: string;
  order: number;
  class?: 11 | 12;
  summary?: {
    short_summary?: string;
    detailed_summary?: string;
    exam_focus?: string[];
    revision_notes?: string[];
  };
}

export interface NoteBlock {
  _id: string;
  chapterId: string;
  type: "paragraph" | "bullet_list" | "code";
  heading?: string;
  text?: string;
  items?: string[];
  code?: string;
  language?: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface QuizSet {
  _id: string;
  chapterId: string;
  setId: string;
  setName: string;
  difficulty?: string;
  questions: QuizQuestion[];
}

export interface SamplePaper {
  _id: string;
  paperId: string;
  title: string;
  subtitle?: string;
  duration?: string;
  totalMarks?: number;
  difficulty?: string;
  sections: {
    sectionId: string;
    title: string;
    marks?: number;
    questions: {
      id: string;
      question: string;
      options?: string[];
      answer?: string | number;
      marks?: number;
      explanation?: string;
    }[];
  }[];
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  tags: string[];
  category: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  publishedAt: string;
  status: 'draft' | 'published';
  readingTime: number;
  linkedChapterId: string | null;
  isFeatured: boolean;
}

export const fetchChapters   = (classNum?: 11 | 12)  => apiFetch<Chapter[]>(classNum ? `/chapters?class=${classNum}` : "/chapters");
export const fetchNotes      = ()  => apiFetch<NoteBlock[]>("/notes");
export const fetchNotesByChapter = (chId: string) => apiFetch<NoteBlock[]>(`/notes/${chId}`);
export const fetchQuizzes    = ()  => apiFetch<QuizSet[]>("/quizzes");
export const fetchSamplePapers = () => apiFetch<SamplePaper[]>("/sample-papers");
export const fetchBlogs      = ()  => apiFetch<{ blogs: Blog[], total: number }>("/blogs");
export const fetchBlogBySlug = (slug: string) => apiFetch<Blog>(`/blogs/${slug}`);
export const fetchFeaturedBlogs = () => apiFetch<Blog[]>("/blogs/featured");

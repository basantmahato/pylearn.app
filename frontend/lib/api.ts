const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000/api/v1";

export type Category = string;

export interface ApiCourse {
  key: string;
  label: string;
  description: string;
  color: string;
  lightColor: string;
}

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
  category?: Category;
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
  category?: Category;
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
  category?: Category;
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
  category?: Category;
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

export const fetchChapters          = (category?: Category) => apiFetch<Chapter[]>(category ? `/chapters?category=${category}` : "/chapters");
export const fetchNotes             = (category?: Category) => apiFetch<NoteBlock[]>(category ? `/notes?category=${category}` : "/notes");
export const fetchNotesByChapter    = (chId: string, category?: Category) => apiFetch<NoteBlock[]>(category ? `/notes/${chId}?category=${category}` : `/notes/${chId}`);
export const fetchQuizzes           = (category?: Category) => apiFetch<QuizSet[]>(category ? `/quizzes?category=${category}` : "/quizzes");
export const fetchQuizzesByChapter  = (chId: string, category?: Category) => apiFetch<QuizSet[]>(category ? `/quizzes/${chId}?category=${category}` : `/quizzes/${chId}`);
export const fetchSamplePapers      = (category?: Category) => apiFetch<SamplePaper[]>(category ? `/sample-papers?category=${category}` : "/sample-papers");
export const fetchBlogs             = ()  => apiFetch<{ blogs: Blog[], total: number }>("/blogs");
export const fetchBlogBySlug        = (slug: string) => apiFetch<Blog>(`/blogs/${slug}`);
export const fetchFeaturedBlogs     = () => apiFetch<Blog[]>("/blogs/featured");
export const fetchCourses           = () => apiFetch<{ success: boolean, data: ApiCourse[] }>("/courses").then(r => r.data);

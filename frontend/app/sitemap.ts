import type { MetadataRoute } from "next";
import { CATEGORIES, Category } from "../lib/api";
import { slugify } from "../lib/slugify";

const BASE_URL = "https://pylearn.com/"; // ← update to your production domain

// ── helpers ──────────────────────────────────────────────────────────────────

async function safeApiFetch<T>(path: string): Promise<T | null> {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000/api";
    const res = await fetch(`${apiBase}${path}`, {
      cache: "no-store",
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

interface ChapterItem {
  chapterId: string;
  title: string;
  category?: string;
}

interface BlogItem {
  slug: string;
  publishedAt: string;
}

// ── sitemap ───────────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/notes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/quiz`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/samples`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // ── Category index pages (notes / quiz / samples per category) ───────────────
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.flatMap(
    (cat: { key: Category }) => [
      {
        url: `${BASE_URL}/notes/${cat.key}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/quiz/${cat.key}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/samples/${cat.key}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ]
  );

  // ── Dynamic chapter/detail pages ─────────────────────────────────────────────
  const chapterRoutes: MetadataRoute.Sitemap = [];

  for (const cat of CATEGORIES) {
    const chapters = await safeApiFetch<ChapterItem[]>(
      `/chapters?category=${cat.key}`
    );
    if (chapters) {
      for (const ch of chapters) {
        // Notes detail — uses slugified title to match frontend routing
        if (ch.title) {
          chapterRoutes.push({
            url: `${BASE_URL}/notes/${cat.key}/${slugify(ch.title)}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
        // Quiz detail — still uses chapterId
        chapterRoutes.push({
          url: `${BASE_URL}/quiz/${cat.key}/${ch.chapterId}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  // ── Blog post pages ─────────────────────────────────────────────────────────
  const blogsData = await safeApiFetch<{ blogs: BlogItem[] }>("/blogs");
  const blogRoutes: MetadataRoute.Sitemap =
    blogsData?.blogs?.map((blog) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: blog.publishedAt ? new Date(blog.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) ?? [];

  return [...staticRoutes, ...categoryRoutes, ...chapterRoutes, ...blogRoutes];
}

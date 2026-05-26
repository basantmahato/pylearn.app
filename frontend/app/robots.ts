import type { MetadataRoute } from "next";

const BASE_URL = "https://pylearn.vercel.app"; // ← update to your production domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",        // backend proxy routes (if any)
          "/_next/",      // Next.js internals
          "/admin/",      // admin panel (separate app, but block crawling here too)
        ],
      },
      // Politely block known heavy AI scrapers to save bandwidth
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

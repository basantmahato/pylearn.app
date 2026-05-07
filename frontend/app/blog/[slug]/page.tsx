import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogBySlug, fetchBlogs, Blog } from "@/lib/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Generate static params for all blog slugs
export async function generateStaticParams() {
  try {
    const response = await fetchBlogs();
    return (response.blogs || []).map((blog) => ({
      slug: blog.slug,
    }));
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await fetchBlogBySlug(slug);
    
    return {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      keywords: blog.metaKeywords || blog.tags,
      authors: [{ name: blog.author }],
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        type: "article",
        publishedTime: blog.publishedAt,
        authors: [blog.author],
        images: blog.featuredImage ? [{ url: blog.featuredImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        images: blog.featuredImage ? [blog.featuredImage] : undefined,
      },
      alternates: {
        canonical: `/blog/${blog.slug}`,
      },
    };
  } catch {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
}

// JSON-LD structured data for SEO
function generateJsonLd(blog: Blog): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage,
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "PyLearn",
      logo: {
        "@type": "ImageObject",
        url: "https://pylearn.app/logo.png",
      },
    },
    keywords: blog.tags?.join(", "),
    articleSection: blog.category,
    url: `https://pylearn.app/blog/${blog.slug}`,
  };

  return JSON.stringify(jsonLd);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let blog: Blog | null = null;

  try {
    blog = await fetchBlogBySlug(slug);
  } catch {
    notFound();
  }

  if (!blog) {
    notFound();
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJsonLd(blog) }}
      />
      
      <Navbar />
      <article
        style={{
          minHeight: "100vh",
          background: "var(--background)",
          padding: "120px 0 60px",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Breadcrumb */}
            <nav
              style={{
                marginBottom: "24px",
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              <Link
                href="/"
                style={{ color: "var(--primary)", textDecoration: "none" }}
              >
                Home
              </Link>
              <span style={{ margin: "0 8px" }}>/</span>
              <Link
                href="/blog"
                style={{ color: "var(--primary)", textDecoration: "none" }}
              >
                Blog
              </Link>
              <span style={{ margin: "0 8px" }}>/</span>
              <span style={{ color: "var(--text-secondary)" }}>{blog.title}</span>
            </nav>

            {/* Header */}
            <header style={{ marginBottom: "40px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    background: "rgba(0,90,181,0.1)",
                    color: "var(--primary)",
                    padding: "6px 14px",
                    borderRadius: "100px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {blog.category}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  {blog.readingTime} min read
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  marginBottom: "24px",
                  lineHeight: 1.2,
                }}
              >
                {blog.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #005ab5, #4d96e0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                    }}
                  >
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>
                    {blog.author}
                  </span>
                </div>
                <span>•</span>
                <time dateTime={blog.publishedAt}>
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div
                style={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  marginBottom: "40px",
                }}
              >
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: "var(--text)",
              }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--border)" }}>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "16px",
                  }}
                >
                  Tags
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        padding: "6px 14px",
                        borderRadius: "100px",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div style={{ marginTop: "48px", textAlign: "center" }}>
              <Link
                href="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "100px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "transform 0.2s ease",
                }}
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}

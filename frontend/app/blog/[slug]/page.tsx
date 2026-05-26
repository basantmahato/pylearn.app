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
      <article className="min-h-screen bg-bg pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-[800px] mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
              <Link href="/" className="text-primary hover:underline font-medium">Home</Link>
              <span className="opacity-40">/</span>
              <Link href="/blog" className="text-primary hover:underline font-medium">Blog</Link>
              <span className="opacity-40">/</span>
              <span className="text-text-muted truncate">{blog.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[0.7rem] font-black uppercase tracking-wider">
                  {blog.category}
                </span>
                <span className="text-text-secondary text-sm font-medium">
                  {blog.readingTime} min read
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text mb-8 leading-[1.1]">
                {blog.title}
              </h1>

              <div className="flex items-center gap-5 text-text-secondary text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-black text-sm shadow-md">
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-text">
                    {blog.author}
                  </span>
                </div>
                <span className="opacity-20">•</span>
                <time dateTime={blog.publishedAt} className="font-medium">
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
              <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-primary/5">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="blog-content prose prose-lg prose-primary max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-text-secondary prose-p:leading-relaxed prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-16 pt-10 border-t border-border">
                <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6">
                  Related Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-bg-surface border border-border px-4 py-2 rounded-full text-xs font-bold text-text-secondary hover:text-primary hover:border-primary/30 transition-all cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="mt-16 flex justify-center">
              <Link
                href="/blog"
                className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-sm transition-all hover:-translate-y-1 hover:shadow-xl"
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

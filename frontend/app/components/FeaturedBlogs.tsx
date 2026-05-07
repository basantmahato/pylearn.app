import Link from "next/link";
import { fetchFeaturedBlogs, Blog } from "@/lib/api";

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="featured-blog-card"
      style={{
        display: "block",
        background: "var(--card-bg)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        className="blog-image"
        style={{
          height: "160px",
          backgroundImage: blog.featuredImage
            ? `url(${blog.featuredImage})`
            : "linear-gradient(135deg, #005ab5, #4d96e0)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
            fontSize: "0.7rem",
            color: "var(--text-secondary)",
          }}
        >
          <span
            style={{
              background: "rgba(0,90,181,0.1)",
              color: "var(--primary)",
              padding: "3px 8px",
              borderRadius: "100px",
              fontWeight: 600,
            }}
          >
            {blog.category}
          </span>
          <span>{blog.readingTime} min</span>
        </div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            marginBottom: "8px",
            color: "var(--text)",
            lineHeight: 1.3,
          }}
        >
          {blog.title}
        </h3>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {blog.excerpt}
        </p>
      </div>
    </Link>
  );
}

export default async function FeaturedBlogs() {
  let blogs: Blog[] = [];

  try {
    blogs = await fetchFeaturedBlogs();
  } catch {
    // Silently fail - don't show section if API fails
    return null;
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section
      id="blogs"
      className="section"
      style={{
        background: "var(--background)",
        padding: "80px 0",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            className="section-label"
            style={{
              display: "inline-block",
              background: "rgba(0,90,181,0.1)",
              color: "var(--primary)",
              padding: "6px 16px",
              borderRadius: "100px",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            Latest from Our Blog
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "16px",
            }}
          >
            Python Tips & Study Guides
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Expert advice, tutorials, and strategies to help you ace your CBSE Class 12 Computer Science exam
          </p>
        </div>

        {/* Blog Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/blog"
            className="btn btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View All Articles
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

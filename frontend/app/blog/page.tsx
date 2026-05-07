import { Metadata } from "next";
import Link from "next/link";
import { fetchBlogs, Blog } from "@/lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "PyLearn Blog - Python & CBSE Class 12 Tips",
  description: "Read expert Python programming tips, CBSE Class 12 Computer Science guides, study strategies, and coding tutorials on the PyLearn blog.",
  keywords: ["Python blog", "CBSE Class 12", "Computer Science", "Python tutorials", "coding tips"],
  openGraph: {
    title: "PyLearn Blog - Python & CBSE Class 12 Tips",
    description: "Expert Python programming tips and CBSE Class 12 Computer Science guides",
    type: "website",
  },
};

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="blog-card"
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
          height: "200px",
          backgroundImage: blog.featuredImage ? `url(${blog.featuredImage})` : "linear-gradient(135deg, #005ab5, #4d96e0)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
          }}
        >
          <span
            style={{
              background: "rgba(0,90,181,0.1)",
              color: "var(--primary)",
              padding: "4px 10px",
              borderRadius: "100px",
              fontWeight: 600,
            }}
          >
            {blog.category}
          </span>
          <span>{blog.readingTime} min read</span>
        </div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            marginBottom: "12px",
            color: "var(--text)",
            lineHeight: 1.3,
          }}
        >
          {blog.title}
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: "16px",
          }}
        >
          {blog.excerpt}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
          }}
        >
          <span>{blog.author}</span>
          <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  let blogs: Blog[] = [];
  let error = null;

  try {
    const response = await fetchBlogs();
    blogs = response.blogs || [];
  } catch (err) {
    error = "Failed to load blogs. Please try again later.";
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          background: "var(--background)",
          padding: "120px 0 60px",
        }}
      >
        <div className="container">
          {/* Page Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
              📝 PyLearn Blog
            </span>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "var(--text)",
                marginBottom: "16px",
              }}
            >
              Python & CBSE Tips
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Expert guides, study strategies, and programming tutorials to help you excel in CBSE Class 12 Computer Science
            </p>
          </div>

          {/* Blog Grid */}
          {error ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-secondary)",
              }}
            >
              <p>{error}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-secondary)",
              }}
            >
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "24px",
              }}
            >
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { fetchBlogs, Blog } from "@/lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StateView from "../components/StateView";

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
      className="group bg-white rounded-2xl border border-border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 no-underline"
    >
      <div className="h-[220px] overflow-hidden relative">
        {blog.featuredImage ? (
          <img 
            src={blog.featuredImage} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light transition-transform group-hover:scale-105 duration-500" />
        )}
      </div>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4 text-[0.75rem] text-text-secondary">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
            {blog.category}
          </span>
          <span className="font-medium">{blog.readingTime} min read</span>
        </div>
        <h2 className="text-xl font-black text-text leading-tight mb-3 group-hover:text-primary transition-colors">
          {blog.title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
          {blog.excerpt}
        </p>
        <div className="flex items-center justify-between text-[0.8rem] text-text-muted font-bold pt-6 border-t border-border/50">
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

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg pt-32 pb-20">
          <StateView message={error} type="error" />
        </main>
        <Footer />
      </>
    );
  }

  if (blogs.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg pt-32 pb-20">
          <StateView message="No blog posts available yet. Check back soon!" type="empty" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-text leading-[1.1] tracking-tight mb-6">
              Python by PyLearn
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Expert guides, study strategies, and programming tutorials to help you excel in CBSE Class 12 Computer Science
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

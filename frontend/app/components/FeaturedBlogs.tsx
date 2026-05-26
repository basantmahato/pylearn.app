import Link from "next/link";
import { fetchFeaturedBlogs, Blog } from "@/lib/api";

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group bg-white rounded-2xl border border-border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 block no-underline text-inherit"
    >
      <div className="h-40 overflow-hidden relative">
        {blog.featuredImage ? (
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light transition-transform duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 text-[0.7rem] text-text-secondary font-bold uppercase tracking-wider">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {blog.category}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {blog.readingTime} min
          </span>
        </div>
        <h3 className="text-base font-black text-text mb-2 leading-tight tracking-tight group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        <p className="text-[0.8rem] text-text-secondary leading-relaxed line-clamp-2">
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
    <section className="py-20 md:py-24 bg-white" id="blogs">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
            Latest from Our Blog
            <div className="flex-1 h-px bg-primary/25 min-w-[20px]" />
          </div>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black text-text leading-tight mb-4 tracking-tight">
            Python Tips & Study Guides
          </h2>
          <p className="text-lg text-text-secondary max-w-[500px] mx-auto leading-relaxed">
            Expert advice, tutorials, and strategies to help you ace your CBSE Class 12 Computer Science exam
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/blog"
            className="btn-primary px-7 py-3.5 text-sm rounded-full font-bold inline-flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-primary/20"
          >
            View All Articles
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

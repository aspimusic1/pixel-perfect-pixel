import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Calendar, Tag, ArrowRight } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string | null;
  author_name: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
};

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_url, author_name, tags, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data as BlogPost[]) ?? []);
        setLoading(false);
      });
  }, []);

  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <PageTransition>
      <SEO
        title="Blog | GetBooked.Live — Music Industry Insights"
        description="Booking tips, music industry insights, and platform updates from the GetBooked.Live team."
        canonicalUrl="https://getbooked.live/blog"
      />
      <div className="min-h-screen bg-background pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-14">
            <span className="section-label text-primary">from the team</span>
            <h1 className="section-heading text-4xl sm:text-5xl mt-2">The GetBooked Blog</h1>
            <p className="section-subtext mt-3">
              Booking tips, music industry insights, and platform updates.
            </p>
          </div>

          {/* Posts grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] h-64 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground font-body text-sm">No posts yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((post, idx) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group block rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-primary/30 transition-all duration-200 hover:bg-white/[0.05]"
                >
                  {/* Cover image */}
                  {post.cover_url ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading={idx < 2 ? "eager" : "lazy"}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                      <span className="text-4xl opacity-20">🎵</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[10px] font-display font-semibold uppercase tracking-wider text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="font-display font-bold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/30 font-body">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.published_at ?? post.created_at)}
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-primary font-display font-semibold group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

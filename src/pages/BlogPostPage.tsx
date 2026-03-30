import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Calendar, ArrowLeft, Tag } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  author_name: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPost(data as BlogPost);
        }
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  if (notFound) return <Navigate to="/blog" replace />;

  return (
    <PageTransition>
      {post && (
        <SEO
          title={`${post.title} | GetBooked.Live Blog`}
          description={post.excerpt}
          canonicalUrl={`https://getbooked.live/blog/${post.slug}`}
          ogImage={post.cover_url ?? undefined}
        />
      )}
      <div className="min-h-screen bg-background pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-primary transition-colors font-body mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blog
          </Link>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-white/[0.05] rounded w-3/4" />
              <div className="h-4 bg-white/[0.03] rounded w-1/2" />
              <div className="aspect-[16/9] bg-white/[0.03] rounded-2xl" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-white/[0.03] rounded" />
                ))}
              </div>
            </div>
          ) : post ? (
            <article>
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
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

              {/* Title */}
              <h1 className="font-display font-extrabold text-foreground text-3xl sm:text-4xl leading-[1.1] mb-4">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-3 text-[12px] text-white/35 font-body mb-8 pb-8 border-b border-white/[0.06]">
                <span>{post.author_name}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.published_at ?? post.created_at)}
                </span>
              </div>

              {/* Cover image */}
              {post.cover_url && (
                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10">
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}

              {/* Content — rendered as HTML from Penny's rich text */}
              <div
                className="prose prose-invert prose-sm max-w-none
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                  prose-p:font-body prose-p:text-muted-foreground prose-p:leading-[1.8]
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground
                  prose-li:text-muted-foreground prose-li:font-body
                  prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground
                  prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded
                  prose-hr:border-white/[0.06]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* CTA */}
              <div className="mt-16 pt-10 border-t border-white/[0.06] text-center">
                <p className="text-muted-foreground font-body text-sm mb-4">
                  Ready to book your next show?
                </p>
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center gap-2 bg-primary text-black font-display font-bold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  Join GetBooked.Live free
                </Link>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </PageTransition>
  );
}

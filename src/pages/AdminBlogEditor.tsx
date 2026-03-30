import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PageTransition from "@/components/PageTransition";
import { Plus, Trash2, Eye, EyeOff, ArrowLeft, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  author_name: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
};

const EMPTY: Omit<BlogPost, "id" | "created_at"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_url: "",
  author_name: "GetBooked Team",
  tags: [],
  published: false,
  published_at: null,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export default function AdminBlogEditor() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selected, setSelected] = useState<Partial<BlogPost> | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Guard — admin only
  useEffect(() => {
    if (profile && profile.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [profile, navigate]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNew = () => {
    setSelected({ ...EMPTY });
    setTagInput("");
  };

  const handleSelect = (post: BlogPost) => {
    setSelected({ ...post });
    setTagInput(post.tags.join(", "));
  };

  const handleTitleChange = (title: string) => {
    setSelected((prev) => ({
      ...prev,
      title,
      slug: prev?.id ? prev.slug : slugify(title),
    }));
  };

  const handleSave = async (publish?: boolean) => {
    if (!selected) return;
    if (!selected.title?.trim()) { toast.error("Title is required"); return; }
    if (!selected.slug?.trim()) { toast.error("Slug is required"); return; }
    if (!selected.excerpt?.trim()) { toast.error("Excerpt is required"); return; }
    if (!selected.content?.trim()) { toast.error("Content is required"); return; }

    setSaving(true);
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      ...selected,
      tags,
      published: publish ?? selected.published ?? false,
      published_at: (publish ?? selected.published) ? (selected.published_at ?? new Date().toISOString()) : null,
    };

    let error;
    if (selected.id) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", selected.id));
    } else {
      const { data, error: insertError } = await supabase.from("blog_posts").insert(payload).select().single();
      error = insertError;
      if (data) setSelected(data as BlogPost);
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(publish ? "Post published!" : "Draft saved");
      fetchPosts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    setSelected(null);
    fetchPosts();
    toast.success("Post deleted");
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const nowPublished = !post.published;
    await supabase.from("blog_posts").update({
      published: nowPublished,
      published_at: nowPublished ? (post.published_at ?? new Date().toISOString()) : null,
    }).eq("id", post.id);
    fetchPosts();
    if (selected?.id === post.id) {
      setSelected((prev) => ({ ...prev, published: nowPublished }));
    }
    toast.success(nowPublished ? "Post published" : "Post unpublished");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <div className="h-12 border-b border-white/[0.06] flex items-center gap-3 px-4 sm:px-6">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-[11px] text-muted-foreground font-body lowercase">admin / blog editor</span>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/blog" target="_blank" className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> View blog
            </Link>
          </div>
        </div>

        <div className="flex h-[calc(100vh-48px)]">
          {/* Sidebar — post list */}
          <aside className="w-64 shrink-0 border-r border-white/[0.06] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/[0.06]">
              <button
                onClick={handleNew}
                className="w-full flex items-center justify-center gap-2 bg-primary text-black font-display font-bold text-xs px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> New Post
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-white/[0.03] rounded animate-pulse" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <p className="p-4 text-[11px] text-muted-foreground font-body">No posts yet.</p>
              ) : (
                posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handleSelect(post)}
                    className={`w-full text-left px-3 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                      selected?.id === post.id ? "bg-white/[0.05] border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[12px] font-body text-foreground line-clamp-2 leading-snug">{post.title}</span>
                      <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-1 ${post.published ? "bg-green-400" : "bg-white/20"}`} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-body mt-0.5 block">
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Editor */}
          <main className="flex-1 overflow-y-auto p-6">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground font-body text-sm mb-4">Select a post to edit or create a new one.</p>
                <button
                  onClick={handleNew}
                  className="flex items-center gap-2 bg-primary text-black font-display font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> New Post
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={selected.title ?? ""}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Your post title"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Slug *</label>
                  <input
                    type="text"
                    value={selected.slug ?? ""}
                    onChange={(e) => setSelected((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="url-friendly-slug"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">getbooked.live/blog/<span className="text-primary">{selected.slug || "slug"}</span></p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Excerpt * <span className="normal-case font-normal">(shown on blog index + SEO description)</span></label>
                  <textarea
                    value={selected.excerpt ?? ""}
                    onChange={(e) => setSelected((p) => ({ ...p, excerpt: e.target.value }))}
                    placeholder="One or two sentences summarising the post..."
                    rows={2}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 resize-none"
                  />
                </div>

                {/* Cover URL */}
                <div>
                  <label className="block text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Cover Image URL <span className="normal-case font-normal">(optional)</span></label>
                  <input
                    type="url"
                    value={selected.cover_url ?? ""}
                    onChange={(e) => setSelected((p) => ({ ...p, cover_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Author Name</label>
                  <input
                    type="text"
                    value={selected.author_name ?? ""}
                    onChange={(e) => setSelected((p) => ({ ...p, author_name: e.target.value }))}
                    placeholder="GetBooked Team"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Tags <span className="normal-case font-normal">(comma-separated)</span></label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="booking tips, artists, industry"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Content * <span className="normal-case font-normal">(HTML or plain text — paste Penny's output here)</span>
                  </label>
                  <textarea
                    value={selected.content ?? ""}
                    onChange={(e) => setSelected((p) => ({ ...p, content: e.target.value }))}
                    placeholder="Paste your blog post content here. HTML is supported — <h2>, <p>, <strong>, <ul>, <li>, <blockquote>, <a href='...'> all work."
                    rows={20}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 resize-y font-mono"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 pb-10">
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-foreground font-display font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-white/[0.1] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving ? "Saving…" : "Save Draft"}
                  </button>

                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-black font-display font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {saving ? "Publishing…" : "Publish"}
                  </button>

                  {selected.id && (
                    <button
                      onClick={() => handleTogglePublish(selected as BlogPost)}
                      className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] text-muted-foreground font-display font-semibold text-sm px-4 py-2.5 rounded-full hover:text-foreground transition-colors"
                    >
                      {selected.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {selected.published ? "Unpublish" : "Publish"}
                    </button>
                  )}

                  {selected.id && (
                    <button
                      onClick={() => handleDelete(selected.id!)}
                      className="ml-auto flex items-center gap-1.5 text-destructive/70 hover:text-destructive font-body text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  );
}

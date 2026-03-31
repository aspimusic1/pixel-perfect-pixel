/**
 * BlogAdminPage — standalone blog editor at /blog-admin
 *
 * This page is intentionally NOT wrapped in ProtectedRoute or LaunchGate.
 * It handles its own auth: shows a login form if the user is not signed in,
 * then renders the full editor once they are authenticated as admin.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Eye, EyeOff, Save, ExternalLink, LogOut } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

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

// ── Login screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.user) {
      setError(authError?.message ?? "Login failed");
      setLoading(false);
      return;
    }
    // Verify admin role via has_role RPC (same check used by the rest of the app)
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      await supabase.auth.signOut();
      setError("This account does not have admin access.");
      setLoading(false);
      return;
    }
    onLogin(data.user);
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Blog Editor</h1>
          <p className="text-sm text-white/40">Sign in with your admin account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/50"
              placeholder="admin@getbooked.live"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/50"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8FF3E] text-black font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Editor screen ─────────────────────────────────────────────────────────────

function EditorScreen({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selected, setSelected] = useState<Partial<BlogPost> | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleNew = () => { setSelected({ ...EMPTY }); setTagInput(""); };
  const handleSelect = (post: BlogPost) => { setSelected({ ...post }); setTagInput(post.tags.join(", ")); };
  const handleTitleChange = (title: string) => {
    setSelected((prev) => ({ ...prev, title, slug: prev?.id ? prev.slug : slugify(title) }));
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
    if (error) { toast.error(error.message); } else { toast.success(publish ? "Post published!" : "Draft saved"); fetchPosts(); }
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
    if (selected?.id === post.id) setSelected((prev) => ({ ...prev, published: nowPublished }));
    toast.success(nowPublished ? "Post published" : "Post unpublished");
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex flex-col">
      {/* Top bar */}
      <div className="h-12 border-b border-white/[0.06] flex items-center gap-3 px-4 sm:px-6 shrink-0">
        <span className="text-[11px] text-white/40 font-mono">getbooked / blog editor</span>
        <div className="ml-auto flex items-center gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-white/40 hover:text-[#C8FF3E] flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> View blog
          </a>
          <button
            onClick={onLogout}
            className="text-[11px] text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-white/[0.06] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/[0.06]">
            <button
              onClick={handleNew}
              className="w-full flex items-center justify-center gap-2 bg-[#C8FF3E] text-black font-bold text-xs px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" /> New Post
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-white/[0.03] rounded animate-pulse" />)}
              </div>
            ) : posts.length === 0 ? (
              <p className="p-4 text-[11px] text-white/30">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handleSelect(post)}
                  className={`w-full text-left px-3 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${selected?.id === post.id ? "bg-white/[0.05] border-l-2 border-l-[#C8FF3E]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[12px] text-white line-clamp-2 leading-snug">{post.title}</span>
                    <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-1 ${post.published ? "bg-green-400" : "bg-white/20"}`} />
                  </div>
                  <span className="text-[10px] text-white/30 mt-0.5 block">{post.published ? "Published" : "Draft"}</span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Editor */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-white/40 text-sm mb-4">Select a post or create a new one.</p>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 bg-[#C8FF3E] text-black font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">Title *</label>
                <input type="text" value={selected.title ?? ""} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Your post title"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/40" />
              </div>
              {/* Slug */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">Slug *</label>
                <input type="text" value={selected.slug ?? ""} onChange={(e) => setSelected((p) => ({ ...p, slug: e.target.value }))} placeholder="url-friendly-slug"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/40 font-mono" />
                <p className="text-[10px] text-white/30 mt-1">getbooked.live/blog/<span className="text-[#C8FF3E]">{selected.slug || "slug"}</span></p>
              </div>
              {/* Excerpt */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">Excerpt * <span className="normal-case font-normal">(SEO description)</span></label>
                <textarea value={selected.excerpt ?? ""} onChange={(e) => setSelected((p) => ({ ...p, excerpt: e.target.value }))} placeholder="One or two sentences…" rows={2}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/40 resize-none" />
              </div>
              {/* Cover URL */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">Cover Image URL <span className="normal-case font-normal">(optional)</span></label>
                <input type="url" value={selected.cover_url ?? ""} onChange={(e) => setSelected((p) => ({ ...p, cover_url: e.target.value }))} placeholder="https://…"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/40" />
              </div>
              {/* Author */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">Author Name</label>
                <input type="text" value={selected.author_name ?? ""} onChange={(e) => setSelected((p) => ({ ...p, author_name: e.target.value }))} placeholder="GetBooked Team"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/40" />
              </div>
              {/* Tags */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">Tags <span className="normal-case font-normal">(comma-separated)</span></label>
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="artists, booking, tips"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/40" />
              </div>
              {/* Content */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">Content * <span className="normal-case font-normal">(Markdown supported)</span></label>
                <textarea value={selected.content ?? ""} onChange={(e) => setSelected((p) => ({ ...p, content: e.target.value }))} placeholder="Write your post in Markdown…" rows={20}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C8FF3E]/40 resize-y font-mono" />
              </div>
              {/* Actions */}
              <div className="flex items-center gap-3 pb-10">
                <button onClick={() => handleSave(false)} disabled={saving}
                  className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-white/[0.1] transition-colors disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Draft"}
                </button>
                <button onClick={() => handleSave(true)} disabled={saving}
                  className="flex items-center gap-2 bg-[#C8FF3E] text-black font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50">
                  <Eye className="w-4 h-4" /> {saving ? "Publishing…" : "Publish"}
                </button>
                {selected.id && (
                  <>
                    <button onClick={() => handleTogglePublish(selected as BlogPost)}
                      className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] text-white/60 font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-white/[0.08] transition-colors">
                      {selected.published ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish</>}
                    </button>
                    <button onClick={() => handleDelete(selected.id!)}
                      className="ml-auto flex items-center gap-2 text-red-400/70 hover:text-red-400 text-sm transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export default function BlogAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already logged in and is admin
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user ?? null;
      if (sessionUser) {
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: sessionUser.id,
          _role: "admin",
        });
        if (isAdmin) {
          setUser(sessionUser);
        }
      }
      setChecking(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#C8FF3E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={setUser} />;
  return <EditorScreen user={user} onLogout={handleLogout} />;
}

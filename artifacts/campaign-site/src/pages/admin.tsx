import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, PlusCircle, LogOut, Lock, Image, Video, Link2, X, ExternalLink } from "lucide-react";

interface PostMedia {
  type: "image" | "video" | "link";
  url: string;
  caption?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  media: PostMedia[];
  createdAt: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<PostMedia[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // media adder state
  const [addingType, setAddingType] = useState<"image" | "video" | "link" | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/posts");
    if (res.ok) setPosts(await res.json());
  }, []);

  useEffect(() => {
    if (authed) fetchPosts();
  }, [authed, fetchPosts]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const testCreate = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ title: "__authcheck__", content: "__authcheck__" }),
    });
    if (testCreate.status === 401) {
      setAuthError(true);
      return;
    }
    if (testCreate.ok) {
      const created = await testCreate.json();
      await fetch(`/api/posts/${created.id}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
    }
    setAuthed(true);
    setAuthError(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setMedia((m) => [...m, { type: "image", url: dataUrl, caption: mediaCaption || undefined }]);
      setMediaCaption("");
      setAddingType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  function handleAddMedia() {
    if (!mediaUrl.trim()) return;
    if (addingType === "image") {
      setMedia((m) => [...m, { type: "image", url: mediaUrl.trim(), caption: mediaCaption || undefined }]);
    } else if (addingType === "video") {
      setMedia((m) => [...m, { type: "video", url: mediaUrl.trim(), caption: mediaCaption || undefined }]);
    } else if (addingType === "link") {
      setMedia((m) => [...m, { type: "link", url: mediaUrl.trim(), caption: mediaCaption || undefined }]);
    }
    setMediaUrl("");
    setMediaCaption("");
    setAddingType(null);
  }

  function removeMedia(i: number) {
    setMedia((m) => m.filter((_, idx) => idx !== i));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ title, content, media }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      setMedia([]);
      fetchPosts();
    } else {
      setError("Failed to post. Check your password.");
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    fetchPosts();
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm border-none shadow-xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-serif text-foreground">More Than Media</h1>
              <p className="text-sm text-muted-foreground">Admin — enter your password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/10"
                autoComplete="current-password"
                data-testid="admin-password-input"
              />
              {authError && <p className="text-sm text-red-500">Incorrect password.</p>}
              <Button type="submit" className="w-full rounded-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif text-foreground">Post an Update</h1>
          <Button variant="ghost" size="sm" onClick={() => { setAuthed(false); setPassword(""); }} data-testid="admin-logout">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 space-y-5">
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="What's this update about?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-secondary/10"
                  data-testid="admin-title-input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Write whatever you want..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[160px] bg-secondary/10"
                  data-testid="admin-content-input"
                />
              </div>

              {/* Media items list */}
              {media.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Attached media</label>
                  <div className="space-y-2">
                    {media.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-secondary/10 rounded-xl px-4 py-3">
                        <span className="text-primary shrink-0">
                          {item.type === "image" && <Image className="w-4 h-4" />}
                          {item.type === "video" && <Video className="w-4 h-4" />}
                          {item.type === "link" && <Link2 className="w-4 h-4" />}
                        </span>
                        <span className="text-sm text-muted-foreground truncate flex-1">
                          {item.caption || item.url.slice(0, 60)}{item.url.length > 60 ? "…" : ""}
                        </span>
                        <button type="button" onClick={() => removeMedia(i)} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add media buttons */}
              {addingType === null ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Add media</label>
                  <div className="flex gap-2 flex-wrap">
                    <Button type="button" variant="outline" size="sm" className="rounded-full gap-2" onClick={() => setAddingType("image")}>
                      <Image className="w-3.5 h-3.5" /> Image
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="rounded-full gap-2" onClick={() => setAddingType("video")}>
                      <Video className="w-3.5 h-3.5" /> Video
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="rounded-full gap-2" onClick={() => setAddingType("link")}>
                      <Link2 className="w-3.5 h-3.5" /> Link
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 border border-border/60 rounded-2xl p-4 bg-secondary/5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {addingType === "image" && "Add Image"}
                      {addingType === "video" && "Add Video (YouTube / Vimeo URL)"}
                      {addingType === "link" && "Add Link"}
                    </span>
                    <button type="button" onClick={() => { setAddingType(null); setMediaUrl(""); setMediaCaption(""); }} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {addingType === "image" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Upload from device</label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="block w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-px flex-1 bg-border" /> or paste URL <div className="h-px flex-1 bg-border" />
                      </div>
                    </>
                  )}

                  <Input
                    placeholder={
                      addingType === "image" ? "https://... (image URL)" :
                      addingType === "video" ? "https://youtube.com/watch?v=... or youtu.be/..." :
                      "https://..."
                    }
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="bg-background text-sm"
                  />
                  <Input
                    placeholder={addingType === "link" ? "Label (e.g. Read the full article)" : "Caption (optional)"}
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    className="bg-background text-sm"
                  />
                  <Button type="button" size="sm" className="rounded-full" onClick={handleAddMedia} disabled={!mediaUrl.trim()}>
                    Add
                  </Button>
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="rounded-full px-6" disabled={submitting || !title || !content} data-testid="admin-post-btn">
                <PlusCircle className="w-4 h-4 mr-2" />
                {submitting ? "Posting..." : "Publish Update"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Published posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Published Updates ({posts.length})</h2>
          {posts.length === 0 && (
            <p className="text-muted-foreground text-sm">No updates yet. Write your first one above.</p>
          )}
          {posts.map((post) => (
            <Card key={post.id} className="border border-border/50">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{post.content}</p>
                    {post.media?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.media.map((m, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-xs bg-secondary/30 text-muted-foreground rounded-full px-2.5 py-1">
                            {m.type === "image" && <Image className="w-3 h-3" />}
                            {m.type === "video" && <Video className="w-3 h-3" />}
                            {m.type === "link" && <ExternalLink className="w-3 h-3" />}
                            {m.caption || m.type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500 shrink-0"
                    onClick={() => handleDelete(post.id)}
                    data-testid={`admin-delete-${post.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

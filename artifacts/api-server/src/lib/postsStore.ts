import fs from "fs";
import path from "path";

export interface PostMedia {
  type: "image" | "video" | "link";
  url: string;
  caption?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  media: PostMedia[];
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(POSTS_FILE)) fs.writeFileSync(POSTS_FILE, "[]", "utf8");
}

export function getPosts(): Post[] {
  ensureFile();
  const raw = JSON.parse(fs.readFileSync(POSTS_FILE, "utf8")) as Post[];
  return raw.map((p) => ({ ...p, media: p.media ?? [] }));
}

export function createPost(title: string, content: string, media: PostMedia[] = []): Post {
  const posts = getPosts();
  const post: Post = {
    id: Date.now().toString(),
    title,
    content,
    media,
    createdAt: new Date().toISOString(),
  };
  posts.unshift(post);
  ensureFile();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf8");
  return post;
}

export function deletePost(id: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  ensureFile();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}

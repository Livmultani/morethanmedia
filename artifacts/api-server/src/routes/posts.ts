import { Router } from "express";
import { getPosts, createPost, deletePost, type PostMedia } from "../lib/postsStore";

const router = Router();

function checkAdmin(req: import("express").Request, res: import("express").Response): boolean {
  const adminPassword = process.env["ADMIN_PASSWORD"];
  const provided = req.headers["x-admin-password"] as string | undefined;
  if (!adminPassword || provided !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

router.get("/posts", (_req, res) => {
  res.json(getPosts());
});

router.post("/posts", (req, res) => {
  if (!checkAdmin(req, res)) return;
  const { title, content, media } = req.body as { title?: string; content?: string; media?: PostMedia[] };
  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required." });
    return;
  }
  const post = createPost(title, content, Array.isArray(media) ? media : []);
  res.status(201).json(post);
});

router.delete("/posts/:id", (req, res) => {
  if (!checkAdmin(req, res)) return;
  const deleted = deletePost(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Post not found." });
    return;
  }
  res.json({ success: true });
});

export default router;

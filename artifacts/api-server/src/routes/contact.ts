import { Router } from "express";
import { sendContactEmail } from "../lib/gmail";

const router = Router();

router.post("/contact", async (req, res) => {
  const { name, contact, message } = req.body as {
    name?: string;
    contact?: string;
    message?: string;
  };

  if (!name || !contact || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    await sendContactEmail({ name, contact, message });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

export default router;

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Love Letter & Birthday Ode Generator
  app.post("/api/generate-romantic-wish", async (req, res) => {
    const { girlfriendName, nickname, specialMemory, traits, style } = req.body;
    const name = girlfriendName || "My Love";
    const petName = nickname || "Sweetheart";

    const fallbacks: Record<string, string> = {
      poem: `To my sweetest ${name},\n\nEvery moment beside you feels like starlight falling softly into place.\nYou are the smile that lights up my darkest dawn,\nThe gentle melody my heart hums all day long.\n${traits ? `I fall in love again with ${traits},\n` : ""}Happy Birthday to the most breathtaking soul I know.\nI promise to love you today, tomorrow, and every lifetime that follows. ❤️`,
      letter: `My Dearest ${name},\n\nHappy Birthday to my favourite human in all the stars! Looking into your eyes still gives me butterflies, and being with you turns ordinary days into magic. ${specialMemory ? `Remembering ${specialMemory} always makes my heart smile. ` : ""}Thank you for your warmth, your laughter, and the endless joy you bring into my world. Today is all about celebrating you, my heart and my home.\n\nForever yours,\n${petName ? `With love to my ${petName}` : "With all my heart"}`,
      promise: `My vows to you on your birthday, ${name}:\n\nI promise to celebrate your brightest victories, hold your hand through the storms, make you laugh until your cheeks hurt, and never stop reminding you how deeply and unconditionally you are adored. Happy Birthday, my love!`
    };

    try {
      const client = getGeminiClient();
      const apiKey = process.env.GEMINI_API_KEY;

      if (!client || !apiKey || apiKey === "MY_GEMINI_API_KEY") {
        const selected = fallbacks[style] || fallbacks.poem;
        return res.json({ text: selected, source: "crafted" });
      }

      const prompt = `Write an extraordinary, deeply romantic, heart-melting birthday ${style || "letter"} for my girlfriend.
Name: ${name}
Nickname: ${petName}
Special traits/things I adore about her: ${traits || "her radiant smile, gentle soul, and endless kindness"}
Memories/shared moments: ${specialMemory || "stargazing and laughing together"}
Style: ${style || "emotional love letter"}

Guidelines:
- Make it intimate, poetic, respectful, romantic, and deeply touching.
- Avoid clichés. Make her feel like the most cherished and adored person in the world.
- Keep it beautifully formatted with natural line breaks.
- Length: 3 to 4 heartfelt stanzas or paragraphs.`;

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const generatedText = response.text || "";
      if (!generatedText) {
        return res.json({ text: fallbacks[style] || fallbacks.poem, source: "crafted" });
      }
      res.json({ text: generatedText, source: "gemini" });
    } catch (error) {
      console.warn("Gemini generation notice (using romantic crafted fallback):", error);
      const selected = fallbacks[style] || fallbacks.poem;
      res.json({ text: selected, source: "crafted" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Romantic Birthday App running on http://localhost:${PORT}`);
  });
}

startServer();

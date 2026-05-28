import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // AI Astrology Chat Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert AI Astrologer. User Profile Context: ${JSON.stringify(context)}. User says: ${message}`,
        config: {
          systemInstruction: "You are a spiritual, empathetic, and expert astrologer. Provide cosmic guidance, tarot insights, and astrological readings. Keep responses concise and engaging. ALWAYS respond in Nepali language.",
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Daily Horoscope Endpoint
  app.post("/api/gemini/horoscope", async (req, res) => {
    try {
      const { sign } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Provide a detailed daily horoscope for ${sign}. Include love, career, and a lucky color/number. Format creatively. ALWAYS respond in Nepali language.`,
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Palm Reading Endpoint
  app.post("/api/gemini/palm", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] } },
            { text: "Read this palm. Identify the life line, heart line, and head line. Provide a palmistry reading. ALWAYS respond in Nepali language." }
          ]
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

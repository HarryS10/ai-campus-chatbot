import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../../../constants.js";

const router = Router();
const fallbackReply =
  "I don't have that specific information. Please contact NIST University directly at hello@nist.edu or call 0680-3925403";
const maxMessageLength = 2000;

router.post("/", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    res.status(400).json({ reply: "Please enter a question before sending." });
    return;
  }

  if (message.length > maxMessageLength) {
    res.status(413).json({
      reply: `Please keep your question under ${maxMessageLength} characters.`,
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(503).json({
      reply:
        "Google AI Studio API key is not configured. Add GEMINI_API_KEY to backend/.env and restart the server.",
    });
    return;
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 600,
        temperature: 0.2,
      },
    });

    const reply = response.text?.trim() || fallbackReply;
    res.json({ reply });
  } catch (error) {
    console.error("Gemini request failed:", error);
    res.status(502).json({
      reply: "I could not reach the AI service right now. Please try again shortly.",
    });
  }
});

export default router;

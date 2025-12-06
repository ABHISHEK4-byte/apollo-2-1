// server.js
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

// To read JSON from frontend
app.use(express.json());

// Serve the files in "public" folder (your website)
app.use(express.static(path.join(__dirname, "public")));

// Groq client (free Llama models)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Chat API for APOLLO 2.1
app.post("/api/chat", async (req, res) => {
  try {
    const message = (req.body.message || "").trim();

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are APOLLO 2.1, a friendly and smart AI assistant. You help with studies, coding, exams, quizzes and ideas. Explain things simply and clearly.",
        },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Sorry, APOLLO 2.1 could not generate a reply.";

    res.json({ reply });
  } catch (error) {
    console.error("APOLLO 2.1 (Groq) error:", error);
    res.status(500).json({
      error: "Something went wrong while talking to APOLLO 2.1 (Groq).",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`💫 APOLLO 2.1 (Groq) running at http://localhost:${PORT}`);
});

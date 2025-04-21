require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5500", // your CodePen or localhost frontend origin
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: "system",
            content: "You are HasanGPT. You ONLY respond with MD Hasan Patwary's information in his personal style.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("📦 Full DeepSeek response:", data);
    const reply = data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });
  } catch (err) {
    console.error("🔥 DeepSeek Error:", err);
    res.status(500).json({ error: "DeepSeek API failed." });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
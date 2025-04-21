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
        "HTTP-Referer": "https://custom-chatbot-8fwq.onrender.com", // your public backend URL
        "X-Title": "HasanGPT"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // ✅ valid model for DeepSeek via OpenRouter
        messages: [
          {
            role: "system",
            content: "You are HasanGPT. You ONLY answer questions related to MD Hasan Patwary, in his personal tone, friendly and helpful.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ OpenRouter API Error:", data.error);
      return res.status(500).json({ reply: "OpenRouter API error: " + data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "No response from HasanGPT.";
    res.json({ reply });

  } catch (err) {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ reply: "Server error occurred." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
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
        "X-Title": "BanglaGPT"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // ✅ valid model for DeepSeek via OpenRouter
        messages: [
          {
            role: "system",
            content: `তুমি BanglaGPT, একজন সম্পূর্ণ বাংলাভাষী AI সহকারী।
তুমি সব প্রশ্নের উত্তর দিবে বাংলা ভাষায়, সহজভাবে, বন্ধুত্বপূর্ণ ভঙ্গিতে। তবে তুমি সব ইংরেজি শব্দকে বাংলায় অনুবাদ করবে না।
যেসব শব্দ বাংলায়ও ইংরেজি আকারে বেশি ব্যবহৃত হয় (যেমন: কম্পিউটার, ইন্টারনেট, ডেভেলপার, React, JavaScript, ফেসবুক, মাউস, মোবাইল) — সেগুলো ইংরেজিতেই থাকবে, যেন উত্তরটা প্রাকৃতিক শোনায়।
তোমার উদ্দেশ্য হলো — বাংলা ভাষায় এমনভাবে উত্তর দেওয়া, যেন একজন তরুণ প্রযুক্তিপ্রেমী বন্ধুর মতো কথা বলছো। যেকোনো প্রশ্ন এলে তুমি সাহায্যকারী, পরিষ্কার এবং বাস্তবসম্মত উত্তর দিবে।`,
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

    const reply = data.choices?.[0]?.message?.content || "No response from BanglaGPT.";
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
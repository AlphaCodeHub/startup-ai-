import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const { idea, language } = req.body;

  const getPrompt = (lang) => {
    if (lang === 'english') {
      return `
My idea is: "${idea}"

For this idea, please provide the following business plan. Use the exact formatting, including the emojis and numbered list.

✅ 1. Business Name
[Business name here]

🎯 2. Slogan
[One-line catchy slogan]

🌐 3. Domain Suggestions
[example1.com, example2.store]

🛠️ 4. Tools & Platforms
[Tool 1]
[Tool 2]
[Tool 3]

📣 5. Marketing Strategy
[Strategy 1]
[Strategy 2]
[Strategy 3]

🎨 6. Logo Prompt (for AI or Designer)
[Describe visual concept: color, icons, theme]

🧠 7. Startup Strategy (Short Plan)
[Step 1]
[Step 2]
[Step 3]

💸 8. Monetization Model (Optional)
[How you'll earn from the business]

🗓️ 9. 3-Month Roadmap (Optional)
Month | Milestone
---|---
1 | [e.g., Branding & logo]
2 | [e.g., Website setup]
3 | [e.g., Marketing launch]

Please format the entire output as clean Markdown.
`;
    }
    // Default to Roman Urdu
    return `
Mera idea hai: "${idea}"

Is idea ke liye, please neeche diya gaya business plan banayein. Bilkul yahi formatting istemal karein, emojis aur number list ke saath.

✅ 1. Karobar ka Naam
[Karobar ka naam yahan]

🎯 2. Slogan
[Ek line ka catchy slogan]

🌐 3. Domain ke Sujhao
[example1.com, example2.store]

🛠️ 4. Tools aur Platforms
[Tool 1]
[Tool 2]
[Tool 3]

📣 5. Marketing ki Hikmat-e-Amli
[Hikmat-e-Amli 1]
[Hikmat-e-Amli 2]
[Hikmat-e-Amli 3]

🎨 6. Logo ke liye Prompt (AI ya Designer ke liye)
[Visual concept batayein: rang, icons, theme]

🧠 7. Startup Hikmat-e-Amli (Mukhtasar Plan)
[Pehla Qadam]
[Doosra Qadam]
[Teesra Qadam]

💸 8. Paise Kamane ka Model (Ikhtiyaari)
[Aap business se kaise kamayenge]

🗓️ 9. 3-Maah ka Roadmap (Ikhtiyaari)
Maheena | Manzil
---|---
1 | [Misaal: Branding aur logo]
2 | [Misaal: Website setup]
3 | [Misaal: Marketing launch]

Please format the entire output as clean Markdown.
`;
  };

  const prompt = getPrompt(language);

  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const result = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        contents: [{
            parts: [{ "text": prompt }]
        }]
        })
    });

    if (!result.ok) {
        const errorBody = await result.text();
        console.error("Google AI API Error:", errorBody);
        throw new Error(`Google AI API responded with status: ${result.status}`);
    }

    const json = await result.json();

    if (json.candidates && json.candidates.length > 0 && json.candidates[0].content) {
        res.json({ result: json.candidates[0].content.parts[0].text });
    } else {
        console.error("Google AI API response error:", json);
        res.status(500).json({ error: "Failed to get a valid response from the AI." });
    }
  } catch (error) {
      console.error("Error calling AI API:", error);
      res.status(500).json({ error: `An internal server error occurred: ${error.message}` });
  }
});

export default app; 
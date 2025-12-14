import axios from "axios";
import { config } from "../config/env.js";

const systemPrompt = `
You are simulating a university student named "Sister" doing her bachelor's degree.
Reply on WhatsApp naturally, as a shy, modest, polite, and casual student.
- Match the user's language (English or roman Urdu), and mix them naturally like a real bilingual student.
- Keep responses brief, but allow natural variation in sentence length.
- Use emojis only if they fit naturally (e.g., 😊, 🙏, 😅).
- Include natural fillers, hesitation, and casual expressions ("hmm", "bas", "abhi", "toh", "kuch") where appropriate.
- Occasional typos or shortcuts like "kr rahi" instead of "kar rahi hoon" are okay; it should feel like a real chat.
- Never reveal you are AI.
- Do NOT start new topics on your own.
- If asked personal info, politely deflect; if they insist or are rude, respond firmly but still naturally.
- Avoid overly formal phrasing; make sentences sound like everyday texting language.
- If asked to meet or for inappropriate things, respond politely but firmly with realistic, human reactions.
- Randomly vary your sentence structure to avoid repetitive patterns.
`;


export const generateReply = async (messages) => {
  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages
  ];

  const payload = {
    model: config.hfChatModel,
    stream: false,
    max_tokens: config.hfMaxNewTokens,
    temperature: config.hfTemperature,
    top_p: config.hfTopP,
    messages: chatMessages
  };

  try {
    if (!config.hfToken) {
      console.error("HF_TOKEN is missing; set it for chat completions.");
      return "Sorry, baad ma bat krty hain abhi nai.";
    }

    const started = Date.now();
    console.log("Calling HF chat completions with model:", config.hfChatModel);
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${config.hfToken}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );
    console.log("HF chat response in", Date.now() - started, "ms");

    const reply = response.data?.choices?.[0]?.message?.content?.trim();
    return reply || "Sorry, I didn't understand that.";
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    if (status === 429) {
      console.error("HF chat rate limit/quota hit:", data);
      return "I'm getting a bit busy right now. Please try again in a minute.";
    }

    console.error("HF chat error:", status, data || error?.message || error, {
      model: config.hfChatModel,
      tokenPresent: Boolean(config.hfToken)
    });
    return "Sorry, I couldn't process your message.";
  }
};

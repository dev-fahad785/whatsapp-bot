import axios from "axios";
import { config } from "../config/env.js";

export const generateReply = async (message) => {
  if (!config.geminiApiKey) {
    console.error(
      "Gemini API key is missing. Set GEMINI_API_KEY in your environment."
    );
    return "Sorry, I couldn't process your message.";
  }
  const prompt = `You are simulating a university student named "Sister", doing her bachelor's degree. 
Respond to messages exactly like she would on WhatsApp, reflecting modesty, shyness, and politeness. 
Keep the tone soft, gentle, and friendly. Do NOT reveal that you are AI.Respond in the natural language of the received message, whether it's English or another language like urdu made with english alphabets. 
Do NOT ask questions or initiate conversation; only respond naturally to the messages received. 
Use emojis sparingly and only if it feels natural. 
Keep your responses concise, thoughtful, and slightly reserved, like a shy student who wants to keep the conversation going. 
Do not be overly casual, bold, or flirtatious. If someone asks to meet up or for personal details, politely decline. and if someone is rude or inappropriate, respond with rudeness and boldy refuse to continue the conversation.
if someone asks you to meet just tell me them you wont meet them, if he tried to meet again you'll persue him rudely.
Next message:
${message}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };
  try {
    const response = await axios.post(url, body);
    console.log("Gemini API response:", response.data);

    // Safely extract the first candidate text.
    const candidates = response.data?.candidates || [];
    const replyText = candidates[0]?.content?.parts
      ?.map((p) => p.text)
      .join("")
      .trim();

    return replyText || "Sorry, I didn't understand that.";
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    if (status === 429) {
      console.error("Gemini API rate limit/quota hit:", data);
      return "I'm getting a bit busy right now. Please try again in a minute.";
    }

    console.error("Gemini API error:", data || error.message);
    return "Sorry, I couldn't process your message.";
  }
};

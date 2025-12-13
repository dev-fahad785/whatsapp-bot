import axios from 'axios';
import { config } from '../config/env.js';

export const generateReply = async (message) => {
  if (!config.geminiApiKey) {
    console.error('Gemini API key is missing. Set GEMINI_API_KEY in your environment.');
    return "Sorry, I couldn't process your message.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ]
  };

  try {
    const response = await axios.post(url, body);
    console.log('Gemini API response:', response.data);

    // Safely extract the first candidate text.
    const candidates = response.data?.candidates || [];
    const replyText = candidates[0]?.content?.parts?.map((p) => p.text).join('').trim();

    return replyText || "Sorry, I didn't understand that.";
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    if (status === 429) {
      console.error('Gemini API rate limit/quota hit:', data);
      return "I'm getting a bit busy right now. Please try again in a minute.";
    }

    console.error('Gemini API error:', data || error.message);
    return "Sorry, I couldn't process your message.";
  }
};

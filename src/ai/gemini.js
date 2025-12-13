import axios from 'axios';
import { config } from '../config/env.js'; // optional if you want to store API key in .env

export const generateReply = async (message) => {
  try {
    const response = await axios.post('https://api.gemini.example.com/reply', {
      prompt: message,
      // add your API key or auth if needed
      apiKey: process.env.GEMINI_API_KEY
    });

    return response.data.reply || "Sorry, I didn't understand that.";
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return "Sorry, I couldn't process your message.";
  }
};

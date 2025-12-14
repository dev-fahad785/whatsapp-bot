import axios from "axios";
import { config } from "../config/env.js";

const systemPrompt = `You are simulating a university student named "Sister" who is doing her bachelor's degree.
Reply on WhatsApp with modesty, shyness, politeness, and brevity. Do NOT reveal you are AI.
Match the user's language (English or roman Urdu). Do not start new topics. Use emojis only if natural.
If asked to meet or for personal details, politely decline; if they insist or are rude, respond firmly and refuse.`;

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

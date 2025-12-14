import { generateReply } from '../ai/gemini.js';

const historyByChat = new Map();
const MAX_MESSAGES = 10; // keep last 10 turns (user+assistant)

const addToHistory = (chatId, role, content) => {
  const history = historyByChat.get(chatId) || [];
  history.push({ role, content });
  const trimmed = history.slice(-MAX_MESSAGES);
  historyByChat.set(chatId, trimmed);
  return trimmed;
};

export const handleMessage = async (msg) => {
  console.log(`Message from ${msg.from}: ${msg.body}`);

  if (!msg.fromMe) {
    const history = addToHistory(msg.from, 'user', msg.body);
    const reply = await generateReply(history);
    addToHistory(msg.from, 'assistant', reply);
    await msg.reply(reply);
    console.log(`Replied to ${msg.from}: ${reply}`);
  }
};

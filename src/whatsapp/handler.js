import { generateReply } from '../ai/gemini.js';

const historyByChat = new Map();
const MAX_MESSAGES = 10; // keep last 10 turns (user+assistant)
const MIN_DELAY_MS = 60_000; // 1 minute
const MAX_DELAY_MS = 600_000; // 10 minutes

const addToHistory = (chatId, role, content) => {
  const history = historyByChat.get(chatId) || [];
  history.push({ role, content });
  const trimmed = history.slice(-MAX_MESSAGES);
  historyByChat.set(chatId, trimmed);
  return trimmed;
};

const randomDelay = () => {
  const delta = MAX_DELAY_MS - MIN_DELAY_MS;
  return MIN_DELAY_MS + Math.floor(Math.random() * delta);
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleMessage = async (msg) => {
  console.log(`Message from ${msg.from}: ${msg.body}`);

  if (!msg.fromMe) {
    const delay = randomDelay();
    console.log(`Delaying reply to ${msg.from} by ${Math.round(delay / 1000)}s`);
    await wait(delay);

    const history = addToHistory(msg.from, 'user', msg.body);
    const reply = await generateReply(history);
    addToHistory(msg.from, 'assistant', reply);
    await msg.reply(reply);
    console.log(`Replied to ${msg.from}: ${reply}`);
  }
};

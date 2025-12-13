import { generateReply } from '../ai/gemini.js';

export const handleMessage = async (msg) => {
  console.log(`Message from ${msg.from}: ${msg.body}`);

  // Only reply to unknown numbers if you want
  if (!msg.fromMe) {
    const reply = await generateReply(msg.body);
    await msg.reply(reply);
    console.log(`Replied to ${msg.from}: ${reply}`);
  }
};

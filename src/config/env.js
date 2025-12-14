import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toInteger = (value, fallback) => {
  const num = Number.parseInt(value, 10);
  return Number.isFinite(num) ? num : fallback;
};

const clean = (value) => (typeof value === 'string' ? value.trim() : value);

export const config = {
  port: clean(process.env.PORT) || 3000,
  // hfModel: clean(process.env.HF_MODEL) || 'Xenova/blenderbot-400M-distill',
  hfChatModel: clean(process.env.HF_CHAT_MODEL) || 'meta-llama/Llama-3.1-8B-Instruct:novita',
  hfMaxNewTokens: toInteger(process.env.HF_MAX_NEW_TOKENS, 60),
  hfTemperature: toNumber(process.env.HF_TEMPERATURE, 0.7),
  hfTopP: toNumber(process.env.HF_TOP_P, 0.9),
  hfToken: clean(process.env.HF_TOKEN) || ''
};

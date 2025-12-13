import express from 'express';
import { config } from './config/env.js';
import client from './whatsapp/client.js';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
client.initialize();    

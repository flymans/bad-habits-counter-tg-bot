import { Telegraf } from 'telegraf';
import 'dotenv/config';

import { sequelize } from './db';
import { start, list, getInfo } from './commands';

const API_TOKEN = process.env.TELEGRAM_BOT_API || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://bad-habits-counter-tg-bot.herokuapp.com';

const bot = new Telegraf(API_TOKEN);

const startDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const startBot = () => {
  if (process.env.NODE_ENV === 'production') {
    bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
    bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
  } else {
    bot.launch();
  }
};

bot.start(start(bot));
bot.command('list', list);
bot.command('info', getInfo);

bot.on('callback_query', (ctx) => console.log(ctx));

startDB();
startBot();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

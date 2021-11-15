const { Telegraf } = require('telegraf');

require('dotenv').config();

const API_TOKEN = process.env.TELEGRAM_BOT_API || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://bad-habits-counter-tg-bot.herokuapp.com';

const bot = new Telegraf(API_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);

const getBadHabit = (context) => {
  context.reply('Welcome. Enter your bad habbit:\nДобро пожаловать! Введите свою вредную привычку:');
  bot.on('text', async (ctx, next) => {
    ctx.reply(`You entered: ${ctx.update.message.text}`);
    return next();
  });
};
bot.command('count', (ctx) => ctx.reply(`${ctx.update.message.text} was used 1 time`));
bot.start(getBadHabit);
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

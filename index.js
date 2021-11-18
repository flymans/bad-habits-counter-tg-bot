import { markdownTable } from 'markdown-table';
import { Telegraf } from 'telegraf';
import moment from 'moment';
import 'dotenv/config';

import { sequelize, Habit } from './db';

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

const getBadHabit = (context) => {
  context.reply('Welcome. Enter your bad habbit:\nДобро пожаловать! Введите свою вредную привычку:');
  bot.on('text', async (ctx) => {
    ctx.reply(`You entered: ${ctx.update.message.text}`);
    await Habit.upsert({ name: ctx.update.message.text, userId: ctx.from.id });
  });
};

bot.command('list', async (ctx) => {
  const badHabits = await Habit.findAll({ attributes: ['name', 'createdAt'], where: { userId: ctx.from.id } });
  const table = markdownTable(badHabits.reduce((array, habit) => {
    const { name, createdAt } = habit;
    return [...array, [name.substring(0, 11), moment(createdAt).format('DD.MM.YYYY HH:mm')]];
  }, [['Habit', 'Start Date']]));

  ctx.replyWithMarkdownV2(`\`\`\`\n${table}\n\`\`\``);
});
bot.start(getBadHabit);

startDB();
startBot();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

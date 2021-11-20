import { Habit } from '../db';

const start = (bot) => (context) => {
  context.reply('Welcome. Enter your bad habbit:\nДобро пожаловать! Введите свою вредную привычку:');
  bot.on('text', async (ctx) => {
    ctx.reply(`You entered: ${ctx.update.message.text}`);
    await Habit.upsert({ name: ctx.update.message.text, userId: ctx.from.id });
  });
};

export default start;

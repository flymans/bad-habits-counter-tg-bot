import { Habit } from '../db';

const getInfo = async (context) => {
  const badHabits = await Habit.findAll({ attributes: ['name'], where: { userId: context.from.id } });
  const keyboardArray = badHabits.map(({ name }) => ([{ text: name, callback_data: name }]));
  context.telegram.sendMessage(context.chat.id, 'pick your bad habbit', {
    reply_markup: {
      keyboard: keyboardArray,
      one_time_keyboard: true,
    },
  });
};

export default getInfo;

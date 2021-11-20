import { markdownTable } from 'markdown-table';
import moment from 'moment';

import { Habit } from '../db';

const list = async (ctx) => {
  const badHabits = await Habit.findAll({ attributes: ['name', 'createdAt'], where: { userId: ctx.from.id } });
  const table = markdownTable(badHabits.reduce((array, habit) => {
    const { name, createdAt } = habit;
    return [...array, [name.substring(0, 11), moment(createdAt).format('DD.MM.YYYY HH:mm')]];
  }, [['Habit', 'Start Date']]));

  ctx.replyWithHTML(`<pre>${table}</pre>`);
};

export default list;

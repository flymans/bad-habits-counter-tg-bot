import sequelizeModule from 'sequelize';

const { Sequelize, DataTypes } = sequelizeModule;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    timezone: '+03:00',
    ...(process.env.NODE_ENV === 'production' && {
      dialectOptions: {
        useUTC: false,
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
  },
);

const Habit = sequelize.define('habit', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
}, {});

Habit.sync();

export { sequelize, Habit };

import sequelizeModule from 'sequelize';

const { Sequelize, DataTypes } = sequelizeModule;

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    ...(process.env.NODE_ENV === 'production' && {
      dialectOptions: {
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

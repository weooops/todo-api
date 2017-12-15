require('dotenv').config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
  operatorsAliases: false,
  logging: false
});

const User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
});

const Todo = sequelize.define('Todo', {
  title: {
    type: Sequelize.STRING,
    unique: true
  },
  message: {
    type: Sequelize.STRING
  }
});

module.exports = {
  Sequelize,
  sequelize,
  User,
  Todo
};
require('dotenv').config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
  }
);

/**
 * User 모델
 */
const User = sequelize.define('User', {
  // 사용자 이름
  username: {
    type: Sequelize.STRING,
    unique: true, // 고유하다
    validate: {
      isAlphanumeric: true // 알파벳과 숫자만 가능
    }
  },
  // 이메일
  email: {
    type: Sequelize.STRING,
    unique: true, // 고유하다
    validate: {
      isEmail: true // 이메일 포맷만 가능
    }
  },
  password: Sequelize.STRING,
  // 회원가입 이후 이메일 검증용으로 사용
  confirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  // 페이스북 로그인 확인
  facebook: Sequelize.STRING
});

/**
 * Todo 모델
 */
const Todo = sequelize.define('Todo', {
  // 제목
  title: {
    type: Sequelize.STRING
  },
  // 메세지
  message: Sequelize.STRING,
  // 생선한 사용자 아이디
  creator_id: Sequelize.INTEGER
});

module.exports = {
  Sequelize,
  sequelize,
  User,
  Todo
};
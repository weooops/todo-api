const index = require('./');
const auth = require('./auth');
const user = require('./user');
const todo = require('./todo');

module.exports = (app) => {

  // 인덱스
  app.use('/', index);

  // 권한 관리
  app.use('/auth', auth);

  // 사용자 관리
  app.use('/users', user);

  // TODO 리스트 관리
  app.use('/todos', todo);

};
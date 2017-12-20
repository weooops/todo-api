const index = require('./');
const auth = require('./auth');
const user = require('./user');
const todo = require('./todo');

module.exports = (app) => {

  app.use('/', index);
  app.use('/auth', auth);
  app.use('/users', user);
  app.use('/todos', todo);

};
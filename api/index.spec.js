const models = require('../models')
before(() => models.sequelize.sync({ force: true }));

require('./auth/auth.spec');
require('./user/user.spec');
require('./todo/todo.spec');
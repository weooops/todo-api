const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const auth = require('./api/auth');
const todo = require('./api/todo');

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', auth);
app.use('/todos', todo);

module.exports = app;
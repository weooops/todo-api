const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./api/router');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router(app);

app.use((err, req, res, next) => {
  res.status(err.status).send(err);
})

module.exports = app;
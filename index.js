const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./api/router');

// 개발모드일 때만 로그 사용
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Access-Control-Allow-Origin(CORS) 설정
// "https://todo.ooops.kr", "http://localhost:3001" 두 개의 도메인에 대해서만 접근을 허용한다.
app.use(cors({
  origin: ['https://todo.ooops.kr', 'http://localhost:3001'],
  optionsSuccessStatus: 200
}));

// "Content-Type: application/json"
app.use(bodyParser.json());

// "Content-Type: application/x-www-form-urlencoded"
app.use(bodyParser.urlencoded({ extended: true }));

// 라우트 설정
router(app);

// 에러 처리
app.use((err, req, res, next) => {
  res.status(err.status).send(err);
})

module.exports = app;
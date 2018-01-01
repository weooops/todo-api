require('dotenv').config();
const app = require('../');
const sync = require('./sync-db');

// Seqyelize를 통해 Mysql과 동기화 작업 진행
sync().then(() => {
  console.log('Sync database');

  // http server 실행
  app.listen(process.env.PORT, () => {
    console.log(`Server is running PORT ${process.env.PORT}`);
  });
});
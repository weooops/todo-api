require('dotenv').config();
const app = require('../');
const sync = require('./sync-db');

sync().then(() => {
  console.log('Sync database');
  app.listen(process.env.PORT, () => {
    console.log(`Server is running PORT ${process.env.PORT}`);
  });
});
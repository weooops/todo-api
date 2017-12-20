const app = require('../');
const sync = require('./sync-db');

sync().then(() => {
  console.log('Sync database');
  app.listen(3000, () => {
    console.log('Server is running');
  });
});
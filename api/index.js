const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.send('login page');
});

router.get('/registration', (req, res) => {
  res.send('registration page');
});

module.exports = router;
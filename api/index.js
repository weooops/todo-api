const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.send('Login page');
});

router.get('/registration', (req, res) => {
  res.send('Registration page');
});

module.exports = router;
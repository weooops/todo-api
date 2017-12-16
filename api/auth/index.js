require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');

const service = require('./auth.service');
const ctrl = require('./auth.ctrl');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

router.get('/status', requireAuth, (req, res) => {
  res.json({ secret: process.env.JWT_SECRET });
});
router.post('/signin', requireSignin, ctrl.signin);
router.post('/signup', ctrl.signup);

module.exports = router;
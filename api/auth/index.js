require('dotenv').config();
const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const requireAuth = expressJwt({ secret: process.env.JWT_ACCESS_SECRET });

const ctrl = require('./auth.ctrl');

router.get('/secret', requireAuth, (req, res) => {
  res.json({ secret: process.env.JWT_ACCESS_SECRET });
});
router.post('/login', ctrl.login);
router.post('/registration', ctrl.registration);
router.get('/confirmation/:emailToken', ctrl.confirmation);
router.post('/facebook', ctrl.facebookLogin);

module.exports = router;
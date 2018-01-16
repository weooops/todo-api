require('dotenv').config();
const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const requireAuth = expressJwt({ secret: process.env.JWT_ACCESS_SECRET });

const ctrl = require('./user.ctrl');

router.get('/', ctrl.index);
router.get('/:id', requireAuth, ctrl.show);

module.exports = router;
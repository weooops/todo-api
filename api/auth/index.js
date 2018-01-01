require('dotenv').config();
const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const requireAuth = expressJwt({ secret: process.env.JWT_ACCESS_SECRET });

const ctrl = require('./auth.ctrl');

// 권한 체크용
router.get('/secret', requireAuth, (req, res) => {
  res.json({ secret: process.env.JWT_ACCESS_SECRET });
});

// 로그인
router.post('/login', ctrl.login);

// 회원가입
router.post('/registration', ctrl.registration);

// 이메일 검증
router.get('/confirmation/:emailToken', ctrl.confirmation);

// 페이스북 로그인
router.post('/facebook', ctrl.facebookLogin);

module.exports = router;
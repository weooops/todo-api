require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

/**
 * 7일짜리 토큰을 생성한다.
 * 사용자 API 액세스용으로 사용된다.
 * @param {User} user 유저 객체
 */
function createAccessToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: '7d',
      issuer: 'ooops.kr',
      subject: 'userInfo'
    }
  );
}

/**
 * 30일짜리 토큰을 생성한다.
 * 사용자가 토큰을 재생성하귀 위해 사용된다.
 * @param {User} user 유저 객체
 */
function createRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
      issuer: 'ooops.kr',
      subject: 'userInfo'
    }
  );
}

/**
 * 1분짜리 토큰을 생성한다.
 * 이메일 확인을 위해 사용된다.
 * @param {User} user 유저 객체
 */
function createEmailToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_EMAIL_SECRET,
    {
      expiresIn: '1m',
      issuer: 'ooops.kr',
      subject: 'userInfo'
    }
  );
}

/**
 * 비밀번호를 암호화한다.
 * @param {string} password 비밀번호
 */
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  createEmailToken,
  generateHash
};
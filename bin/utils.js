require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

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

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  createEmailToken,
  verifyToken,
  generateHash
};
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const User = require('../../models').User;

const tokenForUser = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
      issuer: 'ooops.kr',
      subject: 'userInfo'
    }
  );
};

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const signin = (req, res) => {
  res.json({ token: tokenForUser(req.user) });
};

const signup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    return res.status(400).send('You must provied username, email and password');
  }

  const passwordLen = password.length;
  if (passwordLen < 7 || passwordLen > 24) {
    return res.status(400).send('Must be between 8 and 24 characters');
  }

  User
    .findOne({ where: { username } })
    .then((existingUsername) => {
      if (existingUsername) return res.status(409).send('Username is in use');

      User
        .findOne({ where: { email } })
        .then((existingUserEmail) => {
          if (existingUserEmail) return res.status(409).send('Email is in use');

          User
            .create({ username, email, password: generateHash(password) })
            .then((newUser) => res.json({ token: tokenForUser(newUser) }))
            .catch(err => {
              const { validatorKey } = err.errors[0];
              if (validatorKey === 'isAlphanumeric') {
                return res.status(400).send('Only allow alphanumeric characters');
              } else if (validatorKey === 'isEmail') {
                return res.status(400).send('Not in email format');
              }

              res.status(500).end();
            });
        });
    });
};

module.exports = {
  signin,
  signup
};
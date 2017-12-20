require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
const axios = require('axios');

const utils = require('../../bin/utils');
const transporter = require('../../bin/transfoter');
const validations = require('../../bin/validations');
const User = require('../../models').User;

const login = (req, res) => {
  const { login_field, password } = req.body;
  if (!login_field || !password) {
    return res.status(400).send('You must provied username and password');
  }

  let loginOption = {};
  if (login_field.search('@') > 0) {
    loginOption.email = login_field;
  } else {
    loginOption.username = login_field;
  }

  User.findOne({ where: loginOption })
    .then(user => {
      if (!user) return res.status(400).end();

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).end();
        if (!isMatch) return res.status(400).end();
    
        const { id, username, email } = user;
        res.json({
          access_token: utils.createAccessToken(user),
          refresh_token : utils.createRefreshToken(user),
          user: {
            id, username, email
          }
        });
      });
    });
};

const registration = (req, res) => {
  const { username, email, password, provider, provider_id } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('You must provied username, email and password');
  }

  if (!validations.validateEmail(email)) {
    return res.status(400).send('Not in email format');
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
            .create({ username, email, password: utils.generateHash(password) })
            .then((newUser) => {
              const { id, username, email } = newUser;
              res.json({
                access_token: utils.createAccessToken(newUser),
                refresh_token : utils.createRefreshToken(newUser),
                user: {
                  id, username, email
                }
              });

              const email_token = utils.createEmailToken(newUser);
              const url = `http://localhost:3000/auth/confirmation/${email_token}`;
              transporter.sendMail({
                to: email,
                subject: 'Confirm Email',
                html: `Please click this email to confirm your email: <a href="${url}">Complete Sign-Up</a>`
              });
            })
            .catch(err => {
              if (err.errors) {
                const { validatorKey } = err.errors[0];
                if (validatorKey === 'isAlphanumeric') {
                  return res.status(400).send('Only allow alphanumeric characters');
                }
              }

              res.status(500).end();
            });
        });
    });
};

const confirmation = (req, res) => {
  const { emailToken } = req.params;
  const { id } = utils.verifyToken(emailToken, process.env.JWT_EMAIL_SECRET);

  User.update({ confirmed: true }, { where: { id } })
    .then(() => {
      res.redirect('http://localhost:3000/login');
    })
    .catch(() => {
      res.status(500).end();
    });
};

const facebookLogin = (req, res) => {
  const { access_token } = req.body;

  axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id, email, name, first_name, last_name',
        access_token: access_token
      }
    })
    .then(response => {
      const { id, email } = response.data;

      User.findOne({ where: { email } })
        .then(user => {
          if (!user) return res.status(202).send({ email, id });

          user.facebook = id;
    
          user
            .save()
            .then(() => {
              const { id, username, email } = user;
              res.json({ 
                access_token: utils.createAccessToken(user),
                refresh_token : utils.createRefreshToken(user),
                user: {
                  id, username, email
                }
              });
            })
            .catch(err => {
              res.status(500).end();
            });
        });
    })
    .catch(error => {
      res.status(error.response.status).send(error.response.data.error);
    });
};

module.exports = {
  login,
  registration,
  confirmation,
  facebookLogin
};
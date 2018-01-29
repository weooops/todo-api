require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const axios = require('axios');

const utils = require('../../bin/utils');
const transporter = require('../../bin/transfoter');
const validations = require('../../bin/validations');
const User = require('../../models').User;

/**
 * 로그인
 * "loginfield"와 "password" 필드의 값을 받아서 로그인을 시도한다.
 */
const login = (req, res) => {
  const { loginfield, password } = req.body;

  // "loginfield"와 "password" 필드는 반드시 입력해야하는 값이다.
  if (!loginfield || !password) {
    return res.status(400).send('You must provied username and password');
  }

  // "@"값이 있으면 이메일로, 없으면 사용자이름으로 선택한다.
  let loginOption = {};
  if (loginfield.search('@') > 0) {
    loginOption.email = loginfield;
  } else {
    loginOption.username = loginfield;
  }

  User.findOne({ where: loginOption })
    .then(user => {
      // 사용자가 존재하지 않으면 400을 반환한다.
      if (!user) return res.status(400).end('Please check your email or password.');

      // 이미 가입된 사용자와 로그인을 시도하려는 사용자의 비밀번호를 비교한다.
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).end();

        // 비밀번호가 매치하지 않을 시 400을 반환한다.
        if (!isMatch) return res.status(400).end('Please check your email or password.');
    
        // 비밀번호 매치 성공 시 토큰과 사용자 정보를 반환한다.
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

/**
 * 회원가입
 * "useranme", "eamil", "password" 필드의 값을 받아서 회원가입을 시도한다.
 */
const registration = (req, res) => {
  const { username, email, password, comparePassword, provider, provider_id } = req.body;

  // "username"과 "email", "password" 필드 값은 반드시 입력해야 한다.
  if (!username || !email || !password) {
    return res.status(400).send('You must provied username, email and password');
  }

  // 이메일 포맷이 아닐 경우 400을 반환한다.
  if (!validations.validateEmail(email)) {
    return res.status(400).send('Not in email format');
  }

  // 사용자 포맷이 아닐 경우 400을 반환한다.
  if (!validations.validateUsername(username)) {
    return res.status(400).send('Only allow alphanumeric characters');
  }

  // 비밀번호 포맷이 아닐 경우 400을 반환한다.
  const passwordLen = password.length;
  if (passwordLen < 7 || passwordLen > 24) {
    return res.status(400).send('Must be between 8 and 24 characters');
  }

  // password와 comparePassword 값을 비교하여 일치하지 않을 경우 400을 반환한다.
  if (password !== comparePassword) {
    return res.status(400).send('Do not match password and comparePassword');
  }

  User
    .findOne({ where: { username } })
    .then((existingUsername) => {
      // 사용자이름이 이미 존재한다면 409를 반환한다.
      if (existingUsername) return res.status(409).send('Username is in use');

      User
        .findOne({ where: { email } })
        .then((existingUserEmail) => {
          // 이메일이 이미 존재한다면 409를 반환한다.
          if (existingUserEmail) return res.status(409).send('Email is in use');

          User
            .create({ username, email, password: utils.generateHash(password) })
            .then((newUser) => {
              // 회원가입이 성공하면 "토큰"과 "사용자정보"를 반환한다.
              const { id, username, email } = newUser;
              res.json({
                access_token: utils.createAccessToken(newUser),
                refresh_token : utils.createRefreshToken(newUser),
                user: {
                  id, username, email
                }
              });

              // 가입이 완료된 사용자에게 이메일 검증 요청 메일을 보낸다.
              const email_token = utils.createEmailToken(newUser);
              const url = `http://localhost:3001/auth/confirmation/${email_token}`;
              transporter.sendMail({
                to: email,
                subject: 'Confirm Email',
                html: `Please click this email to confirm your email: <a href="${url}">Complete Sign Up</a>`
              });
            })
            .catch(() => res.status(500).end());
        })
        .catch(() => res.status(500).end());
    })
    .catch(() => res.status(500).end());
};

/**
 * 이메일 검증
 * "emailToken" 파라미터값을 받아서 검증을 완료한다.
 */
const confirmation = (req, res) => {
  const { emailToken } = req.params;

  // 토큰값이 유효할 경우 사용자 아이디를 반환한다.
  jwt.verify(emailToken, process.env.JWT_EMAIL_SECRET, (err, decoded) => {
    if (err) return res.status(400).send(err);
    if (!decoded) return res.status(401).end();

    const { id } = decoded;

    // 이메일 검증 단계를 완료한다.
    User.update({ confirmed: true }, { where: { id } })
    .then(() => {
      res.redirect('http://localhost:3000/');
    })
    .catch(() => res.status(500).end());
  });
};

/**
 * 페이스북 로그인
 * 페이스북 "access_token" 값을 받아서 로그인 또는 회원가입을 시도한다.
 */
const facebookLogin = (req, res) => {
  const { access_token } = req.body;

  // 페이스북에서 발급받은 "access_token"이 유효한지 확인한다.
  axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id, email, name, first_name, last_name',
        access_token: access_token
      }
    })
    .then(response => {
      const { id, email } = response.data;

      // 페이스북 로그인하려는 사용자가 이미 존재하는지 확인한다.
      User.findOne({ where: { email } })
        .then(user => {
          // 이메일이 존재 하지 않는다면 가입단계를 계속 진행하기 위해 확인된 "email"과 "id"를 반환한다.
          // 다음 가입단계: username(사용자이름) 값 필요.
          if (!user) return res.status(202).send({ email, id });

          user.facebook = id;
    
          // 이미 존재하는 사용자일 경우는 페이스북 확인 값을 사용자 정보에 저장한다.
          user
            .save()
            .then(() => {
              // 로그인에 필요한 모든 과정이 완료되었으므로 "토큰"과 "사용자정보"를 반환한다.
              const { id, username, email } = user;
              res.json({ 
                access_token: utils.createAccessToken(user),
                refresh_token : utils.createRefreshToken(user),
                user: {
                  id, username, email
                }
              });
            })
            .catch(() => res.status(500).end());
        })
        .catch(() => res.status(500).end());
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
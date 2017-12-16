require('dotenv').config();
const passport = require('passport');
const User = require('../../models').User;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

// Create local strategy
const localOptions = { usernameField: 'login_field' };
const localLogin = new LocalStrategy(localOptions, (login_field, password, done) => {
  let loginOption = {};
  if (login_field.search('@') > 0) {
    loginOption.email = login_field;
  } else {
    loginOption.username = login_field;
  }

  User.findOne({ where: loginOption })
    .then(user => {
      if (!user) return done(null, false);

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false);
    
        return done(null, user);
      });
    });
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.id)
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

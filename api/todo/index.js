const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const requireAuth = expressJwt({ secret: process.env.JWT_ACCESS_SECRET });

const User = require('../../models').User;
const ctrl = require('./todo.ctrl');

const requireConfirmEmail = (req, res, next) => {
  const id = req.user.id;
  User.findOne({ where: { id } })
    .then(user => {
      if (user.confirmed) {
        next();
      } else {
        next('confirmationEmail');
      }
    })
    .catch(err => {
      next(err);
    });
};

router.get('/', requireAuth, ctrl.index);
router.get('/:id', requireAuth, ctrl.show);
router.delete('/:id', requireAuth, ctrl.destroy);
router.post('/', requireAuth, ctrl.create);
router.put('/:id', requireAuth, ctrl.update);

module.exports = router;
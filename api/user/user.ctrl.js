const User = require('../../models').User;

/**
 * 사용자 리스트 조회
 */
const index = (req, res) => {
  req.query.limit = req.query.limit || 10;

  // "limit"이 숫자가 아닌경우 400을 반환한다.
  const limit = Number(req.query.limit);
  if (Number.isNaN(limit)) return res.status(400).end();

  // "limit" 값이 100보다 클 경우 400을 반환한다.
  if (limit > 100) return res.status(400).end();

  User
    .findAll({
      limit: limit
    })
    .then(users => {
      res.json(users);
    })
    .catch(() => res.status(500).end());
};

/**
 * 사용자 정보 조회
 */
const show = (req, res) => {
  const creator_id = req.user.id;
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  User
    .findOne({ where: { id }})
    .then(user => {
      if (!user) return res.status(404).end();
      
      const { id, username, email, confirmed, facebook } = user;
      res.json({
        id, username, email, confirmed, facebook
      });
    })
    .catch(() => res.status(500).end());
};

module.exports = {
  index,
  show
};
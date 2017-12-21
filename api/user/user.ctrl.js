const User = require('../../models').User;

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
  show
};
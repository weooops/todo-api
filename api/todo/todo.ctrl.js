const Todo = require('../../models').Todo;

const index = (req, res) => {
  req.query.limit = req.query.limit || 10;

  const creator_id = req.user.id;
  const limit = Number(req.query.limit);
  if (Number.isNaN(limit)) return res.status(400).end();

  Todo
    .findAll({
      where: { creator_id },
      limit: limit
    })
    .then(todos => {
      res.json(todos);
    })
    .catch(() => res.status(500).end());
};

const show = (req, res) => {
  const creator_id = req.user.id;
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  Todo
    .findOne({ where: { creator_id, id }})
    .then(todo => {
      if (!todo) return res.status(404).end();
      res.json(todo);
    })
    .catch(() => res.status(500).end());
};

const destroy = (req, res) => {
  const creator_id = req.user.id;
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  Todo
    .destroy({ where: { creator_id, id } })
    .then(() => {
      res.status(204).end();
    })
    .catch(() => res.status(500).end());
};

const create = (req, res) => {
  const creator_id = req.user.id;
  const title = req.body.title;
  if (!title) return res.status(400).end();

  const message = req.body.message || '';

  Todo
    .create({ title, message, creator_id })
    .then(todo => {
      res.status(201).json(todo);
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).end();
      res.status(500).end();
    });
};

const update = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  const title = req.body.title;
  if (!title) return res.status(400).end();

  const message = req.body.message || '';

  Todo
    .findOne({ where: { id }})
    .then(todo => {
      if (!todo) return res.status(404).end();

      todo.title = title;
      todo.message = message;

      todo
        .save()
        .then(() => {
          res.json(todo);
        })
        .catch(err => {
          if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).end();
          res.status(500).end();
        });
    })
    .catch(() => res.status(500).end());
};

module.exports = {
  index,
  show,
  destroy,
  create,
  update
};
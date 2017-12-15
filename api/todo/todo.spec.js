const request = require('supertest');
const should = require('chai').should();

const app = require('../../');
const Todo = require('../../models').Todo;
const todoTestData = require('./todo.json');

describe('GET /todos는', () => {
  before(() => Todo.sync({ force: true }));
  before(() => Todo.bulkCreate(todoTestData));

  describe('성공 시', () => {
    it('TODO 객체를 담은 배열을 응답한다', done => {
      request(app)
        .get('/todos')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        });
    });

    it('최대 limit 갯수 만큼 응답한다', done => {
      request(app)
        .get('/todos?limit=2')
        .end((err, res) => {
          res.body.should.have.lengthOf(2);
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('limit이 숫자형이 아니면 400을 응답한다', done => {
      request(app)
      .get('/todos?limit=two')
      .expect(400)
      .end(done);
    });
  });
});

describe('GET /todos/:id는', () => {
  before(() => Todo.sync({ force: true }));
  before(() => Todo.bulkCreate(todoTestData));

  describe('성공 시', () => {
    it('id가 1인 TODO 객체를 반환한다', done => {
      request(app)
        .get('/todos/1')
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('id', 1);
          done();
        })
    });
  });

  describe('실패 시', () => {
    it('id가 숫자가 아닐 경우 400을 응답한다', done => {
      request(app)
        .get('/todos/abc')
        .expect(400)
        .end(done);
    });

    it('id로 TODO를 찾을 수 없는 경우 404를 응답한다', done => {
      request(app)
        .get('/todos/999')
        .expect(404)
        .end(done);
    });
  });
});

describe('DELETE /todos/:id는', () => {
  before(() => Todo.sync({ force: true }));
  before(() => Todo.bulkCreate(todoTestData));

  describe('성공 시', () => {
    it('204를 응답한다', done => {
      request(app)
        .delete('/todos/1')
        .expect(204)
        .end(done);
    });
  });

  describe('실패 시', () => {
    it('id가 숫자가 아닐경우 400으로 응답한다', done => {
      request(app)
        .delete('/todos/abc')
        .expect(400)
        .end(done);
    });
  });
});

describe('POST /todos는', () => {
  before(() => Todo.sync({ force: true }));
  before(() => Todo.bulkCreate(todoTestData));

  const TITLE = 'title11';
  const MESSAGE = 'message11';

  describe('성공 시', () => {
    let body;
    before(done => {
      request(app)
        .post('/todos')
        .send({
          title: TITLE,
          message: MESSAGE
        })
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it('생성된 TODO 객체를 반환한다', () => {
      body.should.have.property('id');
    });

    it('입력한 title 반환한다', () => {
      body.should.have.property('title', TITLE);
    });
  });

  describe('실패 시', () => {
    it('title 파라미터 누락 시 400을 반환한다', done => {
      request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end(done);
    });

    it('title이 중복일 경우 409를 반환한다', done => {
      request(app)
        .post('/todos')
        .send({
          title: TITLE,
          message: MESSAGE
        })
        .expect(409)
        .end(done);
    });
  });
});

describe('PUT /todos/:id는', () => {
  before(() => Todo.sync({ force: true }));
  before(() => Todo.bulkCreate(todoTestData));

  const TITLE = 'title3(edit)';
  const MESSAGE = 'message3(edit)';

  describe('성공 시', () => {
    it('변경 된 title을 응답한다', done => {
      request(app)
        .put('/todos/3')
        .send({
          title: TITLE,
          message: MESSAGE
        })
        .end((err, res) => {
          res.body.should.have.property('title', TITLE);
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('정수가 아닌 id일 경우 400을 응답한다', done => {
      request(app)
        .put('/todos/abc')
        .expect(400)
        .end(done);
    });

    it('title이 없을 경우 400 응답한다', done => {
      request(app)
        .put('/todos/3')
        .send({})
        .expect(400)
        .end(done);
    });

    it('없는 TODO일 경우 404를 응답한다', done => {
      request(app)
        .put('/todos/999')
        .send({
          title: TITLE,
          message: MESSAGE
        })
        .expect(404)
        .end(done);
    });

    it('title이 중복일 경우 409를 응답한다', done => {
      request(app)
        .put('/todos/3')
        .send({ title: 'title1' })
        .expect(409)
        .end(done);
    });
  });
});
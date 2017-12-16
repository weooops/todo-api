const request = require('supertest');
const should = require('chai').should();

const app = require('../../');
const User = require('../../models').User;

describe('POST /auth/signup는', () => {
  before(() => User.sync({ force: true }));

  describe('성공 시', () => {
    it('생성 된 토큰을 반환한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'jakejoo',
          email: 'joogeunjae@gmail.com',
          password: 'qwer1234'
        })
        .end((err, res) => {
          res.body.should.be.property('token');
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('username이 없는 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          email: 'joo88tg7108@naver.com',
          password: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });

    it('username이 영숫자가 아닌 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'joo88tg7108@naver.com',
          email: 'joo88tg7108@naver.com',
          password: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });

    it('username이 중복인 경우 409를 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'jakejoo',
          email: 'qwer@gmail.com',
          password: 'qwer1234'
        })
        .expect(409)
        .end(done);
    });

    it('email이 없는 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'joo88tg7108',
          password: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });

    it('email이 이메일 형식이 아닌 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108',
          password: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });

    it('email이 중복인 경우 409를 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'qwer',
          email: 'joogeunjae@gmail.com',
          password: 'qwer1234'
        })
        .expect(409)
        .end(done);
    });

    it('password가 없는 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108@naver.com'
        })
        .expect(400)
        .end(done);
    });

    it('password가 8자 이상이 아닌 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108@naver.com',
          password: 'asdf'
        })
        .expect(400)
        .end(done);
    });

    it('password가 24자 이하가 아닌 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/signup')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108@naver.com',
          password: 'asdf1234zxcv5678qwer7890poiuqwer'
        })
        .expect(400)
        .end(done);
    });
  });
});

describe('POST /auth/signin는', () => {
  describe('성공 시', () => {
    it('username으로 로그인 시 생성 된 토큰을 반환한다', done => {
      request(app)
        .post('/auth/signin')
        .send({
          login_field: 'jakejoo',
          password: 'qwer1234'
        })
        .end((err, res) => {
          res.body.should.be.property('token');
          done();
        });
    });

    it('email로 로그인 시 생성 된 토큰을 반환한다', done => {
      request(app)
        .post('/auth/signin')
        .send({
          login_field: 'joogeunjae@gmail.com',
          password: 'qwer1234'
        })
        .end((err, res) => {
          res.body.should.be.property('token');
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('login_field 누락 시 400을 응답한다', done => {
      request(app)
        .post('/auth/signin')
        .send({
          login_field: '',
          password: 'qwer1234'
        })
        .expect(400)
        .end(done);
    });

    it('password 누락 시 400을 응답한다', done => {
      request(app)
        .post('/auth/signin')
        .send({
          login_field: 'jakejoo',
          password: ''
        })
        .expect(400)
        .end(done);
    });
  });
});

describe('GET /auth/status는', () => {
  describe('성공 시', () => {
    it('시크릿 코드를 반환한다', done => {
      request(app)
        .post('/auth/signin')
        .send({
          login_field: 'jakejoo',
          password: 'qwer1234'
        })
        .end((err, res) => {
          const token = res.body.token;

          request(app)
            .get('/auth/status')
            .set('Authorization', token)
            .end((err, res) => {
              res.body.should.be.have.property('secret');
              done();
            });
        });
    });
  });

  describe('실패 시', () => {
    it('401을 반환한다', done => {
      request(app)
      .get('/auth/status')
      .expect(401)
      .end(done);
    });
  });
});
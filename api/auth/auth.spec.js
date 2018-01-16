const request = require('supertest');
const should = require('chai').should();

const app = require('../../');
const User = require('../../models').User;

describe('POST /auth/registration는', () => {
  before(() => User.destroy({ where: {}, truncate: true }));

  describe('성공 시', () => {
    it('생성 된 토큰을 반환한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'jakejoo',
          email: 'joogeunjae@gmail.com',
          password: 'qwer1234',
          comparePassword: 'qwer1234'
        })
        .end((err, res) => {
          res.body.should.have.property('access_token');
          res.body.should.have.property('refresh_token');
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('username이 없는 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          email: 'joo88tg7108@naver.com',
          password: 'asdf1234',
          comparePassword: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });

    it('username이 영숫자가 아닌 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'joo88tg7108@naver.com',
          email: 'joo88tg7108@naver.com',
          password: 'asdf1234',
          comparePassword: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });

    it('username이 중복인 경우 409를 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'jakejoo',
          email: 'qwer@gmail.com',
          password: 'qwer1234',
          comparePassword: 'qwer1234'
        })
        .expect(409)
        .end(done);
    });

    it('email이 없는 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'joo88tg7108',
          password: 'asdf1234',
          comparePassword: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });

    it('email이 이메일 형식이 아닌 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108',
          password: 'asdf1234',
          comparePassword: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });

    it('email이 중복인 경우 409를 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'qwer',
          email: 'joogeunjae@gmail.com',
          password: 'qwer1234',
          comparePassword: 'qwer1234'
        })
        .expect(409)
        .end(done);
    });

    it('password가 없는 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108@naver.com'
        })
        .expect(400)
        .end(done);
    });

    it('password가 8자 이상이 아닌 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108@naver.com',
          password: 'asdf',
          comparePassword: 'asdf'
        })
        .expect(400)
        .end(done);
    });

    it('password가 24자 이하가 아닌 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108@naver.com',
          password: 'asdf1234zxcv5678qwer7890poiuqwer',
          comparePassword: 'asdf1234zxcv5678qwer7890poiuqwer'
        })
        .expect(400)
        .end(done);
    });

    it('password와 comparePassword가 다른 경우 400을 응답한다', done => {
      request(app)
        .post('/auth/registration')
        .send({
          username: 'joo88tg7108',
          email: 'joo88tg7108@naver.com',
          password: 'qwer1234',
          comparePassword: 'asdf1234'
        })
        .expect(400)
        .end(done);
    });
  });
});

describe('POST /auth/login는', () => {
  describe('성공 시', () => {
    it('username으로 로그인 시 생성 된 토큰을 반환한다', done => {
      request(app)
        .post('/auth/login')
        .send({
          loginfield: 'jakejoo',
          password: 'qwer1234'
        })
        .end((err, res) => {
          res.body.should.have.property('access_token');
          res.body.should.have.property('refresh_token');
          done();
        });
    });

    it('email로 로그인 시 생성 된 토큰을 반환한다', done => {
      request(app)
        .post('/auth/login')
        .send({
          loginfield: 'joogeunjae@gmail.com',
          password: 'qwer1234'
        })
        .end((err, res) => {
          res.body.should.have.property('access_token');
          res.body.should.have.property('refresh_token');
          done();
        });
    });
  });

  describe('실패 시', () => {
    it('loginfield 누락 시 400을 응답한다', done => {
      request(app)
        .post('/auth/login')
        .send({
          loginfield: '',
          password: 'qwer1234'
        })
        .expect(400)
        .end(done);
    });

    it('password 누락 시 400을 응답한다', done => {
      request(app)
        .post('/auth/login')
        .send({
          loginfield: 'jakejoo',
          password: ''
        })
        .expect(400)
        .end(done);
    });
  });
});

describe('GET /auth/secret는', () => {
  describe('성공 시', () => {
    it('시크릿 코드를 반환한다', done => {
      request(app)
        .post('/auth/login')
        .send({
          loginfield: 'jakejoo',
          password: 'qwer1234'
        })
        .end((err, res) => {
          const token = res.body.access_token;

          request(app)
            .get('/auth/secret')
            .set('Authorization', `bearer ${token}`)
            .end((err, res) => {
              res.body.should.have.property('secret');
              done();
            });
        });
    });
  });

  describe('실패 시', () => {
    it('401을 반환한다', done => {
      request(app)
      .get('/auth/secret')
      .expect(401)
      .end(done);
    });
  });
});
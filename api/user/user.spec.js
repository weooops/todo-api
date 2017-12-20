const request = require('supertest');
const should = require('chai').should();

const app = require('../../');

describe('GET /users/:id는', () => {
  let token;
  before(done => {
    request(app)
      .post('/auth/login')
      .send({
        login_field: 'jakejoo',
        password: 'qwer1234'
      })
      .end((err, res) => {
        token = `bearer ${res.body.access_token}`;
        done();
      });
  });

  describe('성공 시', () => {
    it('id가 1인 USER 객체를 반환한다', done => {
      request(app)
        .get('/users/1')
        .set('Authorization', token)
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
        .get('/users/abc')
        .set('Authorization', token)
        .expect(400)
        .end(done);
    });

    it('id로 USER를 찾을 수 없는 경우 404를 응답한다', done => {
      request(app)
        .get('/users/999')
        .set('Authorization', token)
        .expect(404)
        .end(done);
    });
  });
});
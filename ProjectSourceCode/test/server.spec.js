// ********************** Initialize server **********************************

const server = require('../src/index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
    // Sample test case given to test / endpoint.
    it('Returns the default welcome message', done => {
        chai
            .request(server)
            .get('/welcome')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals('success');
                assert.strictEqual(res.body.message, 'Welcome!');
                done();
            });
    });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

describe('Testing Register API', () => {
  it('positive: /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({ username: 'validusername', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/);
        done();
      });
  });
  it('negative: /register. Checking invalid input', done => {
    chai
      .request(server)
      .post('/register')
      .send({ username: 'invalid@username', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        res.should.be.html;
        done();
      });
  });
});

describe('Testing Login API', () => {
  it('positive: /login', done => {
    chai
      .request(server)
      .post('/testLogin')
      .send({id: 1, username: 'testuser', password: 'testpassword'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Success');
        done();
      });
  });
  it('negative: /login Checking invalid password', done => {
      chai
        .request(server)
        .post('/testLogin')
        .send({id: 1, username: 'testuser', password: 'badpass'})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equals('Incorrect password');
          done();
      });
  });
});

// ********************************************************************************
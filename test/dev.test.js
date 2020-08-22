const mongoose = require('mongoose');
const authSchema = require('../model/index');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const request = chai.request;
const app = require('../app');
const jwtSecret = require('../passport/index.json').secret;
const jwt = require('jsonwebtoken');

let server;
const mongooseConnection = mongoose.connection;
before((done)=>{
  app.then((listener)=>{
    server = listener;
    done();
  })
})

after((done)=>{
  server.close(()=>{
    console.log('Successfully closed the server');
    done();
  });
});

beforeEach((done)=>{
  mongooseConnection.db.dropDatabase((err)=>{
    if (err) return done(err);
    done();
  });
});

describe('Auth', ()=>{
  describe('/register', ()=>{
    it('POST with invalid data results in 400 and message', (done)=>{
      const payload = {
        username: 'example'
      };
      request(server)
          .post('/register')
          .send(payload)
          .end((err, res)=>{
            if (err) return done(err);
            const {
              body,
              statusCode,
            } = res;
          });
    });
  });
});
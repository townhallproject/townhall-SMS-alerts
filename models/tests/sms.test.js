'use strict';
const request = require('superagent');
const expect = require('expect');
const server = require('../../lib/server');

describe('SMS', () => {
  beforeAll(() => {
    server.start();
  });
  describe('POST /sms', () => {
    it('should respond with a 200 when there is an incoming zipcode', () => {
      let url = `http://localhost:3000/sms`;
      let incoming = 'Body=98122';
      return request.post(url)

        .send(incoming)
        .then(res => {
          expect(res.status).toEqual(200);
        });

    });
  });
  afterAll(()=>{
    server.stop();
  });
});

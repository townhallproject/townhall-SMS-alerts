'use strict';

const request = require('superagent');
const expect = require('expect');
const server = require('../../lib/server');
const SMS = require('../../routes/sms.js');

beforeAll(() => {
  server.start();
});

describe('SMS', () => {
  describe('POST /sms', () => {
    it('should respond with a 200 when there is an incoming zipcode', () => {
      let url = `http://localhost:3000/sms`;
      let incoming = '98122';
      return request.post(url)
        .set('content-type', 'text/xml')
        .send(incoming)
        .then(res => {
          console.log(`hi`);
          expect(res.status).toEqual(200);
        });

    });
  });
});

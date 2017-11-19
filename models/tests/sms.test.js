'use strict';
// require('dotenv').config();
const request = require('superagent');
const expect = require('expect');
const server = require('../../lib/server');
const xml2jsParser = require('superagent-xml2jsparser');
let url;

beforeAll(() => {
  let port = 5000;
  url = `http://localhost:${port}/sms`;
  server.start(port)
    .then(console.log);
});
afterAll(server.stop);

describe('SMS', () => {
  describe('POST /sms', () => {
    it('should respond with a 200 when there is an incoming zipcode', () => {
      let incoming = {Body: '98122'};
      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual([ 'There are not any upcoming town halls in your area.' ]);
        });

    });

    it('should respond with a 200 when there is an incoming bad zipcode but will prompt for a zip code', () => {
      let incoming = {Body: 'thisshouldfail'};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual([ 'Please send us a zipcode to get upcoming events for your reps' ]);
        });
    });

    it('should respond with a 200 when req.body is empty but will prompt for a zip code', () => {
      let incoming = {};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual([ 'Please send us a zipcode to get upcoming events for your reps' ]);
        });
    });

    it('should respond with a 200 when req.body is not present but will prompt for a zip code', () => {
      //no req.body

      return request
        .post(url)
        .type('form')
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual([ 'Please send us a zipcode to get upcoming events for your reps' ]);
        });
    });

    it('should respond with a 200 when there is an incoming bad zipcode but will prompt for a zip code', () => {
      let incoming = {Body: '99999'};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          console.log(`res.body.Response.Message`, res.body.Response.Message);
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual(['We could not find that zip code']);
        });
    });
  });
});

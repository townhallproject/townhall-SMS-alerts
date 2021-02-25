'use strict';

const request = require('superagent');
const expect = require('expect');
const server = require('../lib/server');
const scripts = require('../lib/scripts');
const constants = require('../constants');
const User = require('../models/user');

const xml2jsParser = require('superagent-xml2jsparser');
const {
  ALERT_SENT,
} = constants;

let url;

beforeAll(() => {
  jest.dontMock('firebase-admin');
  let port = 8080;
  url = `http://localhost:${port}/sms`;
  const server = require('../lib/server.js');
  const express = require('express');
  const smsRouter = require('../routes/sms');
  const app = express();
  const messaging = require('../lib/response');
  const reqTwiml = require('../middleware/session');

  app.use(reqTwiml, smsRouter);

  app.use((err, req, res, next) => {
    messaging.sendAndWrite(req, res, err.message);
    next();
  });
  server.start(app, port);
});

afterEach(() => {
  const req = {
    body: {
      From: '+1111111111',
    },
  };
  new User(req).deleteFromCache();
});

afterAll(() => {
  const req = {
    body: {
      From: '+1111111111',
    },
  };
  new User(req).deleteFromCache();
  server.stop();
});


describe('SMS', () => {
  describe('POST /sms', () => {
    test('should respond with a 200 when there is an incoming zipcode', (done) => {
      let incoming = {Body: '98122', From: '+1111111111'};
      request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res_1 => {

          console.log(res_1.status);
          expect(res_1.status).toEqual(200);
          expect(Array.isArray(res_1.body.Response.Message)).toBe(true);
          done();
        });
    });

    test('should respond with a 200 when there is an incoming bad zipcode but will prompt for a zip code.', (done) => {
      let incoming = { Body: 'thisshouldfail', From: '+1111111111'};

      request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res_1 => {

          expect(res_1.status).toEqual(200);
          expect(res_1.body.Response.Message).toEqual([scripts.default]);
          done();
        });
    });

    test('should respond with a 200 when there is an incoming bad zipcode but will prompt for a zip code', (done) => {
      let incoming = { Body: '99999', From: '+1111111111'};

      request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res_1 => {

          expect(res_1.status).toEqual(200);
          expect(res_1.body.Response.Message).toEqual([scripts.zipLookupFailed]);
          done();
        });
    });
    test('should return message from an array', (done) => {
      let incoming = { Body: '27278', From: '+1111111111'};

      request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res_1 => {

          expect(Array.isArray(res_1.body.Response.Message)).toBe(true);
          done();
        });
    });

    test('it should thank the person for attending ', () => {
      let req = {
        body: {
          From:'+1111111111',
        },
        zipcode: '27278',
      };
      let incoming = { Body: 'Yeah', From: '+1111111111' };
      const userToCache = new User(req);
      return userToCache.updateCache({
        sessionType: ALERT_SENT,
        eventId: 'eventId',
        stateDistrict: 'Senate',
      })
        .then(() => request
          .post(url)
          .type('form')
          .send(incoming)
          .parse(xml2jsParser)
          .then(res => {
            expect(res.body.Response.Message).toEqual([scripts.isAttending]);
          }));

    });
  });
});

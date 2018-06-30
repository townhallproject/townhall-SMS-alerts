'use strict';

const request = require('superagent');
const expect = require('expect');
const server = require('../lib/server');
const scripts = require('../lib/scripts');

const User = require('../models/user');

const xml2jsParser = require('superagent-xml2jsparser');
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
    console.log('err', err.message);
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

afterAll(server.stop);


describe('SMS', () => {
  describe('POST /sms', () => {
    test('should respond with a 200 when there is an incoming zipcode', () => {
      let incoming = {Body: '98122', From: '+1111111111'};
      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(Array.isArray(res.body.Response.Message)).toBe(true);
        });

    });

    test('should respond with a 200 when there is an incoming bad zipcode but will prompt for a zip code.', () => {
      let incoming = { Body: 'thisshouldfail', From: '+1111111111'};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual([scripts.default]);
        });
    });

    test('should respond with a 200 when there is an incoming bad zipcode but will prompt for a zip code', () => {
      let incoming = { Body: '99999', From: '+1111111111'};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.Response.Message).toEqual([scripts.zipLookupFailed]);
        });
    });
    test('should return message from an array', ()=>{
      let incoming = { Body: '27278', From: '+1111111111'};

      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          expect(Array.isArray(res.body.Response.Message)).toBe(true);
        });
    });
  });
});

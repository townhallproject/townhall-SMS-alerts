'use strict';

const request = require('superagent');
const expect = require('expect');
const server = require('../lib/server');
const scripts = require('../lib/scripts');

const xml2jsParser = require('superagent-xml2jsparser');
let url;

beforeAll(() => {
  jest.dontMock('firebase-admin');
  let port = 8080;
  url = `http://localhost:${port}/voice`;
  const server = require('../lib/server.js');
  const express = require('express');
  const voiceRouter = require('../routes/voice');
  const app = express();
  const messaging = require('../lib/response');
  const reqTwiml = require('../middleware/session');

  app.use(reqTwiml, voiceRouter);

  app.use((err, req, res, next) => {
    console.log('err', err.message);
    messaging.sendAndWrite(req, res, err.message);
    next();
  });
  server.start(app, port);
});

afterAll(server.stop);


describe('voice', () => {
  describe('POST /voice', () => {
    test('should respond with a 200', () => {
      let incoming = {Body: '98122', From: '+1111111111'};
      return request
        .post(url)
        .type('form')
        .send(incoming)
        .parse(xml2jsParser)
        .then(res => {
          let returned = res.body;
          expect(res.status).toEqual(200);
          expect(returned.Response.Say[0]['_']).toBe(scripts.voiceMessage);
        });
    });
  });
});

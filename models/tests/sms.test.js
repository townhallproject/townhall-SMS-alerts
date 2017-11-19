'use strict';

const request = require('superagent');
const expect = require('expect');
const server = require('../../lib/server');
const xml2jsParser = require('superagent-xml2jsparser');

beforeAll(() => {
  server.start();
});

describe('SMS', () => {
  describe('POST /sms', () => {
    it('should respond with a 200 when there is an incoming zipcode', () => {
      let url = `http://localhost:3000/sms`;
      let incoming = { ToCountry: 'US',
        ToState: 'WA',
        SmsMessageSid: 'SMff4054c7b835f97f98e97d3cf0244764',
        NumMedia: '0',
        ToCity: '',
        FromZip: '98110',
        SmsSid: 'SMff4054c7b835f97f98e97d3cf0244764',
        FromState: 'WA',
        SmsStatus: 'received',

        FromCity: 'SEATTLE',
        Body: '98122',
        FromCountry: 'US',
        To: '+14252150661',
        ToZip: '',
        NumSegments: '1',
        MessageSid: 'SMff4054c7b835f97f98e97d3cf0244764',
        AccountSid: 'AC997dbe0246b58a4b61f97b51e66d692e',
        From: '+12066976356',
        ApiVersion: '2010-04-01' };

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
  });
});

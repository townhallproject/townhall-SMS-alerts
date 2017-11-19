'use strict';
const request = require('superagent');
const expect = require('expect');
const server = require('../../lib/server');
const twilio = require('twilio');
let client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

describe('SMS', () => {
  beforeAll(() => {
    server.start();
  });
  describe('POST /sms', () => {
    it('should respond with a 200 when there is an incoming zipcode', () => {
      let url = `http://localhost:3000/sms`;
      // let incoming = '{"ToCountry": "US","ToState": "WA","SmsMessageSid": "SM255fa2e1aa1cca21ded93f61805c4478","NumMedia": "0","ToCity": "","FromZip": "98109","SmsSid": "SM255fa2e1aa1cca21ded93f61805c4478","FromState": "WA","SmsStatus": "received","FromCity": "SEATTLE","Body": "98122","FromCountry": "US","To": "+14252305377","ToZip": "","NumSegments": "1","MessageSid": "SM255fa2e1aa1cca21ded93f61805c4478","AccountSid": "AC4c65499dcd25742554db001888640acb","From": "+12064783243","ApiVersion": "2010-04-01"}';
      let incoming = 'Body:98122'
      return request.post(url)
        // .set('Content-Type', 'application/json')
        .send('Body=98122')
        .then(res => {
          expect(res.status).toEqual(200);
        });

    });
  });
  afterAll(()=>{
    server.stop();
  });
});

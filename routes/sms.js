'use strict';
const express = require('express');
const bodyParser = require('body-parser').urlencoded({
  extended: false,
});
const smsRouter = module.exports = express.Router();

const messaging = require('../lib/response');

const townHallHandler = require('./townHallMiddleware');
const getEvents = require('./getEventsMiddleware');
const checkSubscribe = require('./checkSubscribeMiddleware');
const makeUser = require('./makeUserMiddleware');

// const twilioAccountSid = process.env.TWILIO_ACCOUNT_ID;
// const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(twilioAccountSid, twilioAuthToken);
// const myTwilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const jsonParser = require('body-parser').json();

smsRouter.post('/sms',
  bodyParser,
  checkSubscribe,
  townHallHandler.checkZip,
  townHallHandler.getDistricts,
  getEvents,
  (req, res) => {
    if(req.subscribe === true){
      console.log('reached subscribe true call');
      makeUser(req, res);
    }
    if(req.subscribe === false){
      console.log('reached subscribe false call');
      if (req.townHalls.length > 0) {
        req.townHalls.forEach((townhall) => {
          req.twiml.message(townhall.print());
        });
        req.twiml.message('That\'s all the events we have for your reps. Send subscribe <zip code> to get reoccuring updates.');
        return messaging.end(res, req.twiml);
      }
      messaging.sendAndWrite(req, res, 'There are not any upcoming town halls in your area. Send subscribe <zip code> to get reoccuring updates.');
    }
  });

// smsRouter.post('/broadcast',
//   jsonParser,
//   (req, res) => {
//
//     req.body.users.forEach((user) => {
//
//       client.messages.create({
//         body: req.body.message,
//         to: user.phoneNumber,
//         from: myTwilioPhoneNumber,
//       })
//         .then((message) => process.stdout.write(message.sid));
//     });
//     res.send('Successfully Sent');
//
//   });

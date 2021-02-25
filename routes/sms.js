'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const textBodyParser = bodyParser.urlencoded({
  extended: false,
});

const smsRouter = module.exports = express.Router();
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');

const User = require('../models/user');

const townHallHandler = require('../middleware/townHallLookup');
const getLatLng = require('../middleware/getLatLng');
const getEvents = require('../middleware/getEvents');
const checkSubscribe = require('../middleware/checkSubscribe');
const getUserFromCache = require('../middleware/getUserFromCache');

const production = process.env.NODE_ENV === 'production';

smsRouter.post('/sms',
  textBodyParser,
  getUserFromCache,
  checkSubscribe,
  townHallHandler.checkZip,
  townHallHandler.getDistricts,
  getLatLng,
  getEvents,
  (req, res) => {
    if (req.townHalls.length > 0) {
      req.townHalls.forEach((townhall) => {
        const message = townhall.print();
        if (message) {
          req.twiml.message(message);
        }
      });
      req.twiml.message('That\'s all the events we have for your reps. Do you want to sign up to get a text when your rep is holding a town hall? (Y/N)');
    } else {
      req.twiml.message(scripts.noEvents);
    }
    req.hasbeenasked = true;
    new User(req).updateCache(req);
    messaging.end(res, req.twiml);
  });

smsRouter.post('/send-message', 
  textBodyParser,
  bodyParser.json(),
  (req, res) => {
    console.log('got message', req.body.to, req.body.body);
    const { body } = req;
    if (!body.to) {
      return res.status(406).send('need to send an phone number');
    }
    if (!body.body) {
      return res.status(406).send('need to send an message');
    }
    User.getUserFromCache(body.to)
      .then(userData => {
        const user = new User(userData);
        const sendTo = production ? body.to : process.env.TESTING_NUMBER;
        messaging.newMessage(body.body, sendTo)
          .then(() => user.updateCacheWithMessageInConvo(req.body.body, false, user.sessionType)
            .then((sentMessage) => {
              res.status(200).send(sentMessage);
            }));
      });

  });

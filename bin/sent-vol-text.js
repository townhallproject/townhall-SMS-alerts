#!/usr/bin/env node

const messaging = require('../lib/response');
const User = require('../models/user');
const firebasedb = require('../lib/firebaseinit');
const constants = require('../constants');

const {
  VOL_RECRUIT,
} = constants;

const body = `Hi! This is Nathan with Town Hall Project. Our mission to hold our elected leaders accountable to the people they work for (the people!) is only possible with our volunteers.
We're less than a month away from a 5-week Congressional recess -- when most of the town halls for the entire year are held, and we need YOUR help!
Can you volunteer just 1 hour / week to help us make sure Americans are informed of crucial opportunities to Show Up and Speak Out.
If you're interested, please contact us via this short form: bit.ly/2J3kQMD.
With your help, we can take back our democracy and make this the country we know it can be.`;
/* eslint-enable */

const sendMessageAndSave = (user) => {
  messaging.newMessage(body, 'testing number')
    .then(() => {
      user.updateCache({
        sessionType: VOL_RECRUIT,
        messages: [{
          body,
          from_user: false,
        }],
      });
    });
};

firebasedb.ref('/sms-users/all-users')
  .then((snapshot) => {
    snapshot.forEach((userSnap, index) => {
      if (index < 10 ) {
        let user = new User({
          phoneNumber: userSnap.key,
        });
        setTimeout(() => {
          sendMessageAndSave(user);
        }, 1000 * index);
      }

    });
  });

#!/usr/bin/env node
const server = require('../lib/server.js');
const express = require('express');

const PORT =  5000;
const app = express();

const messaging = require('../lib/response');
const User = require('../models/user');
const firebasedb = require('../lib/firebaseinit');
const constants = require('../constants');

const {
  VOL_RECRUIT,
} = constants;

const body = `Hi! Nathan here with Town Hall Project. A 5-week Congressional recess is almost here--when hundreds of town halls are held, and we need YOUR help!
Can you volunteer just 1 hour / week from your own home to help us make sure Americans are informed of crucial opportunities to Show Up and Speak Out?
There’s no easier way to play a powerful part in holding our elected officials accountable. To learn more, please reply back with YES.`;

const sendMessageAndSave = (user) => {
  User.getUserFromCache(user.phoneNumber)
    .then(cachedUser => {
      // already sent alert to this user 
      if (cachedUser.sessionType === VOL_RECRUIT) {
        return;
      }
      messaging.newMessage(body, user.phoneNumber)
        .then(() => {
          user.updateCacheWithMessageInConvo(body, false, VOL_RECRUIT);
        })
        .catch((e) => console.log('ERROR SENDING MESSAGES', e));
    });
};

const getUsers = () => {
  firebasedb.ref('/sms-users/all-users').once('value')
    .then((snapshot) => {
      let index = 0;
      snapshot.forEach((userSnap) => {
        if (index < 250 ) {
          let user = new User({
            phoneNumber: userSnap.key,
          });
          setTimeout(() => {
            sendMessageAndSave(user);
          }, 1000 * index);
        }
        index++;
      });
    })
    .catch(console.log);
};

server.start(app, PORT)
  .then(console.log)
  .then(() => {
    console.log('getting users');
    return getUsers();
  })
  .catch((e) => {
    console.log(e);
  });

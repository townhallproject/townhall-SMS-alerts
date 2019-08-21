#!/usr/bin/env node
const server = require('../lib/server.js');
const express = require('express');
const uniq = require('lodash').uniq;

const PORT =  5000;
const app = express();

const messaging = require('../lib/response');
const User = require('../models/user');
const firebasedb = require('../lib/firebaseinit');
const constants = require('../constants');

const {
  VOL_RECRUIT,
} = constants;

const body = `Hi! This is Jenita with Town Hall Project. 
We're in the midst of a month-long Congressional--when hundreds of town halls are held, and we need YOUR help! Can you volunteer just 1 hour / week from your own home to help us make sure Americans are informed of crucial opportunities to Show Up and Speak Out? There’s no easier way to play a powerful part in holding our elected officials accountable. To learn more, please reply back with YES.`;

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
const states = [
  'AZ',
  'CO',
  'FL',
  'ME',
  'MD',
  'MI',
  'NV',
  'NC',
  'OR',
  'PA',
  'VA',
];
const getUsers = () => {

  const promises = states.map(state => firebasedb.ref(`/sms-users/${state}`).once('value'));
  Promise.all(promises)
    .then(values => {
      const allNumbers = [];
      values.forEach(stateSnapshot => {
        stateSnapshot.forEach(district => {
          district.forEach(user => {
            allNumbers.push(user.key);
          });
        });
      });
      console.log(allNumbers);
      return allNumbers;
    }).then((allNumbers) => {
      const deDupedNumbers = uniq(allNumbers);
      console.log(deDupedNumbers);
      deDupedNumbers.forEach((number, index) => {
        let user = new User({
          phoneNumber: number,
        });
        setTimeout(() => {
          sendMessageAndSave(user);
        }, 1000 * index);
      });
    });
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

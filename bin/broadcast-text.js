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
  OPT_IN,
} = constants;

const body = `Hi! As you may have heard, Town Hall Project is joining Indivisible! You're enrolled in town hall alerts - would you still like to receive updates? Reply YES and we'll keep sending alerts when there's a town hall near you. If you don't reply, we'll stop messaging after 3/8/21.`

const sendMessageAndSave = (user) => {
  User.getUserFromCache(user.phoneNumber)
    .then(cachedUser => {
      // already sent alert to this user 
      console.log(user.phoneNumber);
      if (cachedUser.sessionType === OPT_IN) {
        console.log('already sent to this user', cachedUser.sessionType);
        return;
      }
      messaging.newMessage(body, user.phoneNumber)
        .then(() => {
          user.updateCacheWithMessageInConvo(body, false, OPT_IN);
        })
        .catch((e) => {
          console.log('ERROR SENDING MESSAGES', e);
          if (e.message === 'The message From/To pair violates a blacklist rule.') {
            user.deleteUser();
            user.deleteFromCache();
          }
        });
    }).catch(console.log);
};
// const states = [
//   'AL',
//   'MA',
//   'AK',
//   'CT',
//   'DE',
//   'GA',
//   'ID',
//   'RI',
//   'IL',
//   'IN',
//   'LA',
//   'IA',
//   'KS',
//   'KY',
//   'MN',
//   'MS',
//   'MO',
//   'WV',
//   'WI',
//   'WY',
//   'MT',
//   'NE',
//   'NH',
//   'NJ',
//   'NM',
//   'NY',
//   'ND',
//   'OH',
//   'OK',
//   'SD',
//   'TN',
//   'TX',
//   'UT',
//   'VT',
//   'AR',
//   'CA',
//   'OR',
//   'HI',
//   'WA',
// ];
const getUsers = () => {

  // const promises = states.map(state => firebasedb.ref(`/sms-users/${state}`).once('value'));
  // Promise.all(promises)
  //   .then(values => {
  //     const allNumbers = [];
  //     values.forEach(stateSnapshot => {
  //       stateSnapshot.forEach(district => {
  //         district.forEach(user => {
  //           allNumbers.push(user.key);
  //         });
  //       });
  //     });
  //     console.log(allNumbers);
  //     return allNumbers;
  return firebasedb.ref('/sms-users/all-users').once('value')
    .then((snapshot) => {
      const allNumbers = [];
      console.log(snapshot.numChildren());
      snapshot.forEach(person => {
        allNumbers.push(person.key);
      });
      return allNumbers;
    }).then((allNumbers) => {
      const deDupedNumbers = uniq(allNumbers);
      console.log(allNumbers, deDupedNumbers);
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

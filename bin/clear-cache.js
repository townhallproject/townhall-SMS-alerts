#!/usr/bin/env node
const moment = require('moment');

const firebasedb = require('../lib/firebaseinit');

firebasedb.ref('sms-users/cached-users').once('value').then((snapshot) => {
  snapshot.forEach((message) => {
    let user = message.val();
    if (moment().diff(moment(user.last_updated), 'm') > 10 && !user.sessionType) {
      let ref = firebasedb.ref(`sms-users/cached-users/${message.key}`);
      ref.remove();
    }
  });
});

#!/usr/bin/env node
const firebasedb = require('../lib/firebaseinit');
const messaging = require('../lib/response');

firebasedb.ref('sms-queue').once('value').then((snapshot) => {
  snapshot.forEach((message) => {
    let messageData = message.val();
    messaging.newMessage(messageData.body, messageData.phoneNumber, messageData.url);
  });
});

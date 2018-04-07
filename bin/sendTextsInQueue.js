#!/usr/bin/env node
const moment = require('moment');
const firebasedb = require('../lib/firebaseinit');
const messaging = require('../lib/response');

// firebasedb.ref('sms-queue').once('value').then((snapshot) => {
//   snapshot.forEach((message) => {
//     let messageData = message.val();
//     if (moment(messageData.dateObj).isAfter()){
//       messaging.newMessage(messageData.body, messageData.phoneNumber)
//         .then((message) => {
//           process.stdout.write(message.sid);
//           //TODO: delete from queue
//           firebasedb.ref(`sms-queue/${messageData.key}`).remove();
//         });
//     } else {
//       firebasedb.ref(`sms-queue/${messageData.key}`).remove();
//     }
//   });
// });

#!/usr/bin/env node
const moment = require('moment');
const CronJob = require('cron').CronJob;
const firebasedb = require('../lib/firebaseinit');
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');
const User = require('../models/user');

const sendFromQueue = () => {
  firebasedb.ref('sms-queue').once('value').then((snapshot) => {
    snapshot.forEach((message) => {
      let messageData = message.val();
      // is the event happening in less than 2 days? rounded to the nearest hour
      if (moment(messageData.dateObj).isBefore()) {
        console.log('in the past', moment(messageData.dateObj).format('MM/DD/YY, hh:mm A'));
        firebasedb.ref(`sms-queue/${messageData.key}`).remove();
      } else if (moment(messageData.dateObj).isSameOrBefore(moment().add(24, 'hours'), 'hour') && !messageData.sent) {
        console.log(messageData.key, moment(messageData.dateObj).format('MM/DD/YY, hh:mm A'));
        let toNumber = process.env.TESTING_NUMBER;
        messaging.newMessage(messageData.body, toNumber)
          .then(() => {
            console.log('sent alert', moment(messageData.dateObj).format('MM/DD/YY, hh:mm A'));
            firebasedb.ref(`sms-queue/${messageData.key}`).update({sent: true});
            messaging.newMessage(scripts.afterAlertIsSent, toNumber)
              .then(()=> {
                const newUser = new User({body: {From: toNumber}, zipcode: ''});
                newUser.updateCache({ alertSent: true, eventId: messageData.eventId, stateDistrict: messageData.type});

              })
              .catch(e => {
                console.log(e);
              });
          });
      } 
    });
  });
};

const checkQueue = new CronJob({
  cronTime: '00 * 9-17 * * *',
  onTick: function () {
    sendFromQueue();
    // messaging.newMessage('checking', process.env.TESTING_NUMBER)
    // .then((message) => {
    console.log('checked');
    // });
  },
  start: false,
  timeZone: 'America/Los_Angeles',
});

module.exports = checkQueue;

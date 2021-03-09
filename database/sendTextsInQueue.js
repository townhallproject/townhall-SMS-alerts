#!/usr/bin/env node
const moment = require('moment');
const CronJob = require('cron').CronJob;
const firebasedb = require('../lib/firebaseinit');
const Text = require('../models/texts');

const sendFromQueue = () => {
  firebasedb.ref('sms-queue').once('value').then((snapshot) => {
    let index = 0;
    snapshot.forEach((message) => {
      let messageData = new Text(message.val());
      if (moment(messageData.dateObj).isBefore()) {
        console.log('in the past', moment(messageData.dateObj).format('MM/DD/YY, hh:mm A'));
        messageData.remove();
      } else if (messageData.timeToSend() && !message.val().sent) {
        index++;
        setTimeout(() => {
          messageData.sendAlert();
        }, 1000 * index);
      } 
    });
  })
    .catch(e => {
      console.log(e);
    });
};

const checkQueue = new CronJob({
  cronTime: '00 * 9-17 * * *',
  onTick: function () {
    sendFromQueue();
    console.log('checked');
  },
  start: false,
  timeZone: 'America/Los_Angeles',
});

module.exports = checkQueue;

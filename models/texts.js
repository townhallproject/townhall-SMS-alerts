'use strict';
const moment = require('moment');
const firebasedb = require('../lib/firebaseinit');
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');
const User = require('../models/user');

const testing = process.env.NODE_ENV !== 'production';

module.exports = class Text {
  constructor (user, townhall) {
    this.eventId = townhall.eventId;
    this.dateObj = townhall.dateObj;
    this.phoneNumber = user.phoneNumber;
    this.type = `${townhall.state}-${townhall.district}`;
    this.body = `Upcoming town hall: ${townhall.print()}`;
  }

  timeToSend(){
    if (moment(this.dateObj).isSameOrBefore(moment().add(48, 'hours'), 'hour') &&
      moment(this.dateObj).isAfter(moment().add(2, 'hours'), 'hour')) {
      return true;
    }
    return false;
  }

  remove(){
    return firebasedb.ref(`sms-queue/${this.key}`).remove();
  }

  markAsSent(){
    console.log('sent alert', moment(this.dateObj).format('MM/DD/YY, hh:mm A'));
    return firebasedb.ref(`sms-queue/${this.key}`).update({
      sent: true,
    });
  }

  updateCacheWithAlertData(toNumber) {
    const newUser = new User({
      body: {
        From: toNumber,
      },
      zipcode: '',
    });
    const update = {
      alertSent: true,
      eventId: this.eventId,
      stateDistrict: this.type,
    };
    return newUser.updateCache(update)
      .then(() => {
        return update;
      });
  }
  
  sendAlert(testingNumber){
    let sendingNumber = testing ? process.env.TESTING_NUMBER : this.phoneNumber;
    let cacheNumber = testingNumber || sendingNumber;
    const thisAlert = this;
    return User.getUserFromCache(cacheNumber)
      .then(cachedUser => {
        if (cachedUser && cachedUser.alertSent) {
          return Promise.resolve({
            alertSent: false,
          });
        }

        return messaging.newMessage(this.body, sendingNumber)
          .then(() => {
            thisAlert.markAsSent();
          })
          .then(() => {
            return messaging.newMessage(scripts.afterAlertIsSent, sendingNumber)
              .then(() => {
                return thisAlert.updateCacheWithAlertData(cacheNumber);
              })
              .catch(e => {
                console.log(e);
              });
          });
      });
  }
  
  writeToFirebase(mockref) {
    let firebaseref = mockref || firebasedb.ref();
    let path = `sms-queue/`;
    let newPostKey = `${this.phoneNumber}${this.eventId}`;
    this.key = newPostKey;
    return firebaseref.child(path + newPostKey).update(this);
  }
};

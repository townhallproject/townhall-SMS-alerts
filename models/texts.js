'use strict';
const moment = require('moment');
const firebasedb = require('../lib/firebaseinit');
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');
const User = require('../models/user');

const testing = process.env.NODE_ENV !== 'production';

module.exports = class Text {
  constructor (opts, townhall) {
    this.eventId = opts.eventId || townhall.eventId;
    this.dateObj = opts.dateObj || townhall.dateObj;
    this.phoneNumber = opts.phoneNumber;
    this.type = opts.type || `${townhall.state}-${townhall.district}`;
    this.body = opts.body || `Upcoming town hall: ${townhall.print()}`;
    this.key = opts.key || null;
    this.sent = opts.sent || false;
  }

  timeToSend(){
    if (moment(this.dateObj).isSameOrBefore(moment().add(48, 'hours'), 'hour') &&
      moment(this.dateObj).isAfter(moment().add(2, 'hours'), 'hour')) {
      return true;
    }
    return false;
  }

  remove() {
    if (!this.key){
      return Promise.reject('no key');
    }
    return firebasedb.ref(`sms-queue/${this.key}`).remove();
  }

  markAsSent() {
    if (!this.key) {
      return Promise.reject('no key');
    }
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
    // let sendingNumber = testing ? process.env.TESTING_NUMBER : this.phoneNumber;
    let sendingNumber = process.env.TESTING_NUMBER;
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
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e =>{
        console.log(e);
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

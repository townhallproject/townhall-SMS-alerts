'use strict';
const firebasedb = require('../lib/firebaseinit');

module.exports = class Text {
  constructor (user, townhall) {
    this.eventId = townhall.eventId;
    this.dateObj = townhall.dateObj;
    this.phoneNumber = user.phoneNumber;
    this.type = `${townhall.state}-${townhall.district}`;
    this.body = `Upcoming town hall: ${townhall.print()}`;
  }
  
  writeToFirebase(mockref) {
    let firebaseref = mockref || firebasedb.ref();
    let path = `sms-queue/`;
    let newPostKey = `${this.phoneNumber}${this.eventId}`;
    this.key = newPostKey;
    return firebaseref.child(path + newPostKey).update(this);
  }
};

'use strict';
const firebasedb = require('../lib/firebaseinit');

module.exports = class Text {
  constructor (user, townhall) {
    this.eventId = townhall.eventId;
    this.phoneNumber = user.phoneNumber;
    this.body = townhall.print();
  }
  writeToFirebase(mockref) {
    let updates = {};
    let firebaseref = mockref || firebasedb.ref();
    let path = `sms-queue/`;
    let newPostKey = this.eventId;
    updates[path + newPostKey] = this;
    return firebaseref.update(updates);
  }
};

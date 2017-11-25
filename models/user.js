'use strict';

const firebasedb = require('../lib/firebaseinit');

module.exports = class User {
  constructor (req){
    this.phoneNumber = req.body.From;
    this.zipcode = req.zipcode;

  }

  writeToFirebase() {
    console.log('reached write to firebase');

    let newPostKey = firebasedb.ref('sms-users').push().key;

    let updates = {};
    updates['/sms-users/' + newPostKey] = this;
    return firebasedb.ref().update(updates);
  }
};

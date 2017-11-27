'use strict';

const firebasedb = require('../lib/firebaseinit');

module.exports = class User {
  constructor (req){
    console.log('calling user');
    this.phoneNumber = req.body.From;
    this.zipcode = req.session.zipcode;
  }

  writeToFirebase() {

    let newPostKey = firebasedb.ref('sms-users').push().key;

    let updates = {};
    updates['/sms-users/' + newPostKey] = this;
    return firebasedb.ref().update(updates);
  }
};

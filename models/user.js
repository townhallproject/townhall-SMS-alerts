'use strict';

const firebasedb = require('../lib/firebaseinit');
module.exports = class User {
  constructor (phoneNumber, zipcode){
    this.phoneNumber = phoneNumber;
    this.zipcode = zipcode;
    this.name = 'john';
  }


  writeToFirebase() {

    let newPostKey = firebasedb.ref('sms-users').push().key;

    let updates = {};
    updates['/sms-users/' + newPostKey] = this;
    return firebasedb.ref().update(updates);
  }
};

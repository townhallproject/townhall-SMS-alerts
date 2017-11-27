'use strict';

const firebasedb = require('../lib/firebaseinit');

module.exports = class User {
  constructor (req){
    this.phoneNumber = req.body.From;
    this.zipcode = req.session.zipcode;
  }

  writeToFirebase(req) {
    req.session.districtObj.districts.forEach(district => {
      let newPostKey = firebasedb.ref(`sms-users/${req.session.districtObj.states[0]}/${district}/`).push().key;

      let updates = {};
      updates[`sms-users/${req.session.districtObj.states[0]}/${district}/` + newPostKey] = this;
      return firebasedb.ref().update(updates);
    });


  }
};

'use strict';

const firebasedb = require('../lib/firebaseinit');

module.exports = class User {
  constructor (req){
    this.phoneNumber = req.body.From;
    this.zipcode = req.session.zipcode;
    this.districts = req.districtObj.districts;
  }

  writeToFirebase(req) {

    this.districts.forEach(district => {
      let newPostKey = firebasedb.ref(`sms-users/${req.districtObj.states[0]}/${district}/`).push().key;

      let updates = {};
      updates[`sms-users/${req.districtObj.states[0]}/${district}/` + newPostKey] = this;
      return firebasedb.ref().update(updates);
    });


  }
};

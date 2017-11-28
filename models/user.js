'use strict';

const firebasedb = require('../lib/firebaseinit');

module.exports = class User {
  constructor (req){
    this.phoneNumber = req.body.From;
    this.zipcode = req.session.zipcode;
  }

  writeToFirebase(req) {
    let updates = {};
    req.session.districts.forEach(district => {
      let path = `sms-users/${district.state}/${district.district}/`;
      let newPostKey = `${this.phoneNumber}-${this.zipcode}`;
      updates[path + newPostKey] = this;
    });
    return firebasedb.ref().update(updates);
  }
};

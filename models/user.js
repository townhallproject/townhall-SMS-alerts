'use strict';
const moment = require('moment');
const firebasedb = require('../lib/firebaseinit');

module.exports = class User {
  static getLatLng(user) {
    return firebasedb.ref(`zips/${user.zipcode}`)
      .once('value')
      .then((latlngObj) => {
        if (!latlngObj.exists()) {
          return;
        }
        const latlng = latlngObj.val();
        user.location = { lat: latlng.LAT, lng: latlng.LNG };
        return user;
      });
  }
  
  constructor (req){
    this.phoneNumber = req.body.From;
    this.zipcode = req.zipcode;
  }

  writeToFirebase(req, firebasemock) {
    let updates = {};
    let user = {};
    let userDistricts = req.userDistricts || {districts: []};

    let userPath = 'sms-users/all-users/';
    let userPostKey = `${this.phoneNumber}`;

    let firebaseref = firebasemock || firebasedb.ref();
    if (!req.districts){
      return Promise.reject('no districts');
    }
    req.districts.forEach(district => {
      let path = `sms-users/${district.state}/${district.district}/`;
      let newPostKey = `${this.phoneNumber}`;
      updates[path + newPostKey] = this;

      userDistricts.districts.push(district);
      
    });
    user[userPath + userPostKey] = userDistricts;

    firebaseref.update(user);
    return firebaseref.update(updates);
  }

  updateCache(req){
    let userPath = 'sms-users/cached-users';
    if (req.districts) {
      let userDistricts = req.userDistricts || { districts: [] };
      req.districts.forEach(district => {
        userDistricts.districts.push(district);

      });
      this.districts = userDistricts.districts;
    } 
    this.hasbeenasked = req.hasbeenasked || false;
    this.last_updated = moment().format();
    firebasedb.ref(`${userPath}/${this.phoneNumber}`).update(this);
  }

  deleteFromCache() {
    let userPath = 'sms-users/cached-users';
    const ref = firebasedb.ref(`${userPath}/${this.phoneNumber}`);
    ref.remove();
  }
};

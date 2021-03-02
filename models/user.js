'use strict';
const map = require('lodash').map;
const moment = require('moment');
const firebasedb = require('../lib/firebaseinit');
const constants = require('../constants');
const {
  VOL_RECRUIT,
} = constants;

module.exports = class User {
  static getLatLng(user) {
    return firebasedb.ref(`zips/${user.zipcode}`)
      .once('value')
      .then((latlngObj) => {
        if (!latlngObj.exists()) {
          return user;
        }
        const latlng = latlngObj.val();
        user.location = { lat: latlng.LAT, lng: latlng.LNG };
        return user;
      });
  }

  static getUserFromCache(phoneNumber) {
    return firebasedb.ref(`sms-users/cached-users/`).child(phoneNumber).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          let user = snapshot.val();
          if (!user.phoneNumber) {
            user.phoneNumber = snapshot.key;
          }
          user.messageCount = snapshot.child('messages').numChildren();
          user.messages = map(user.messages);
          return user;
        }
        return {};
      });
  }

  constructor (req){
    this.phoneNumber = req.phoneNumber || req.body.From;
    this.zipcode = req.zipcode || null;
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

  updateAttending(req, firebasemock) {
    let userPath = `sms-users/all-users/${this.phoneNumber}`;
    let firebaseref = firebasemock || firebasedb.ref(userPath);
    if (req.eventId) {
      return firebaseref.child('attending').push(req.eventId);
    }
    return Promise.resolve();
  }

  updateCache(req, firebasemock) {
    /* 
      req: {
        districts (optional): district[],
        hasbeenasked (optional): boolean,
        sessionType (optional): 'alertSent' | 'volRecruit',
        eventId (optional): string,
        stateDistrict (optional): string,
        messages (optional): message[],
      }
    */
    let userPath = 'sms-users/cached-users';
    if (req.districts) {
      let userDistricts = req.userDistricts || { districts: [] };
      req.districts.forEach(district => {
        userDistricts.districts.push(district);
      });
      this.districts = userDistricts.districts;
    } 
    this.hasbeenasked = req.hasbeenasked || false;
    this.sessionType = req.sessionType || null;

    this.eventId = req.eventId || false;
    this.stateDistrict = req.stateDistrict || false;
    this.last_updated = moment().format();
    let firebaseref = firebasemock || firebasedb.ref(`${userPath}/${this.phoneNumber}`);
    return firebaseref.update(this);
  }

  updateCacheWithMessageInConvo(response, fromUser, sessionType, firebasemock) {
    let userPath = 'sms-users/cached-users';

    let message = {
      body: response,
      from_user: fromUser,
      time_stamp: moment().format(),
    };

    const firebaseRef = firebasemock || firebasedb.ref(`${userPath}/${this.phoneNumber}`);

    return firebaseRef.child('messages').push(message)
      .then(() => firebaseRef.update({
        sessionType: sessionType || VOL_RECRUIT,
        last_updated: moment().format(),
      }).then(() => ({
        sentTo: this.phoneNumber,
        message,
      })));
  }

  storeNewPotentialVol(firebasemock) {
    let userPath = 'sms-users/potential-vols';
    let firebaseref = firebasemock || firebasedb.ref(`${userPath}/${this.phoneNumber}`);
    const toSave = Object.assign({}, this);
    toSave.respondedOn = moment().format();
    return firebaseref.update(toSave);
  }

  optInConfirm(firebasemock) {
    let phoneNumber = this.phoneNumber;
    let firebaseref = firebasemock || firebasedb.ref(`sms-users/all-users/${phoneNumber}`);

    return firebaseref.update({
      [constants.OPT_IN]: true,
    });
  }

  deleteFromCache() {
    let userPath = 'sms-users/cached-users';
    const ref = firebasedb.ref(`${userPath}/${this.phoneNumber}`);
    return ref.remove();
  }

  deleteUser() {
    let districts = [];
    let phoneNumber = this.phoneNumber;
    firebasedb.ref(`sms-users/all-users/${phoneNumber}`).child('districts').once('value', function (snapshot) {
      if (!snapshot.exists()) {
        return Promise.reject('not a user');
      }
      districts = snapshot.val();
      return districts;
    })
      .then((districts) => {
        let firebaseref = firebasedb.ref();

        districts.forEach(district => {
          let disPath = `sms-users/${district.state}/${district.district}/${phoneNumber}`;
          firebaseref.child(disPath).remove();
        });
        return firebaseref.child(`sms-users/all-users/${phoneNumber}`).remove();
      });
  }
};

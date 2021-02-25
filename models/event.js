'use strict';
const moment = require('moment');
const lodash = require('lodash');
const firebasedb = require('../lib/firebaseinit');
const geometry = require('spherical-geometry-js');
const User = require('./user');
const Text = require('./texts');

const maxMeters = 100 * 1609.34;
const includeEventType = ['Tele-Town Hall', 'Campaign Tele-Town Hall'];
const includeIconFlags = ['mfol'];

const zeroPadDistrict = (district) => {
  const zeroPadding = '00';
  return zeroPadding.slice(0, zeroPadding.length - district.length) + district;
};

module.exports = class TownHall {
  
  constructor (fbtownhall) {
    this.moc = fbtownhall.Member || fbtownhall.displayName;
    this.district = fbtownhall.district ? zeroPadDistrict(fbtownhall.district.toString()) : 'Senate';
    this.state = fbtownhall.state;
    this.link= fbtownhall.link || `https://townhallproject.com?eventId=${fbtownhall.eventId}`;
    this.eventId = fbtownhall.eventId;
    this.eventName = fbtownhall.eventName;
    this.address = fbtownhall.address;
    this.meetingType = fbtownhall.meetingType;
    this.iconFlag = fbtownhall.iconFlag;
    this.rsvpLink = fbtownhall.RSVP || null;
    this.location = fbtownhall.Location || null;
    this.date = fbtownhall.dateString;
    this.dateObj = fbtownhall.dateObj;
    this.time = fbtownhall.Time;
    this.lat = fbtownhall.lat;
    this.lng = fbtownhall.lng;
    this.zoneId = fbtownhall.zoneString;
  }

  includeTownHall (districts, location) {
    let townhall = this;
    let include = false;
    
    if(!this.moc || !this.meetingType || !this.time || !this.date || !this.address) {
      return false;
    }
    if (districts.length === 0) {
      throw new Error('The requested state not found');
    }

    if (!lodash.includes(includeEventType, townhall.meetingType)){
      return false;
    }
    if (!moment(this.dateObj).isAfter()){
      return false;
    }
    let curLocation = new geometry.LatLng(Number(location.lat), Number(location.lng));
    districts.forEach((district) => {
      if (district.state === townhall.state) {
        if (townhall.district === 'Senate') {
          if (location.lat && townhall.lat) {
            const curDistance = geometry.computeDistanceBetween(
              curLocation,
              new geometry.LatLng(Number(townhall.lat), Number(townhall.lng))
            );
            include = curDistance < maxMeters? true: false;
          } else {
            console.log('no location data', townhall.eventId);
            include = true;
          }
        } else {
          if ((townhall.state === district.state) && (townhall.district === district.district)) {
            include = true;
          }
        }
      }
    });
    return include;
  }

  checkSenateDistance(location){
    let curLocation = new geometry.LatLng(Number(location.lat), Number(location.lng));
    const curDistance = geometry.computeDistanceBetween(
      curLocation,
      new geometry.LatLng(Number(this.lat), Number(this.lng))
    );
    return curDistance < maxMeters;
  }

  includeInQueue() {
    let include = false;
    if (!lodash.includes(includeEventType, this.meetingType) && !(lodash.includes(includeIconFlags, this.iconFlag))) {
      return false;
    }
    if (!this.moc || !this.meetingType || !this.time || !this.date || !this.address) {
      return false;
    }
    if (moment(this.dateObj).isAfter()) {
      include = true;
    }
    return include;
  }

  addToQueue(user){
    let newText = new Text(user, this);
    newText.writeToFirebase();
  }

  lookupUsersAndAddToQueue() {
    let townhall = this;
    console.log(townhall.state, townhall.district);
    if (townhall.district === 'Senate') {
      return firebasedb.ref(`sms-users/${townhall.state}`).once('value').then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((district) => {
            district.forEach((user) => {
              User.getLatLng(user.val())
                .then((updatedUser) => {
                  if (updatedUser.location) {
                    const { location } = updatedUser;
                    if (townhall.checkSenateDistance(location)) {
                      //make a new text to send, add to queue
                      townhall.addToQueue(updatedUser);
                    }
                  }
                });
            });
          });
        }
      });
    } else {
      return firebasedb.ref(`sms-users/${townhall.state}/${townhall.district}`).once('value')
        .then((response) => lodash.values(response.val()))
        .then((users) => {
          if (users.length > 0) {
            users.forEach(user => {
              // make a new text to send, add to queue
              townhall.addToQueue(user);
            });
          }
        }).catch((e) => {
          console.log(e);
        });
    }
  }

  removeFromQueue() {
    let townhall = this;
    return firebasedb.ref('sms-queue/')
      .once('value').then((snapshot) => {
        snapshot.forEach((ele) => {
          let text = new Text(ele.val());
          if (text.eventId === townhall.eventId) {
            text.remove();
          }
        });
      });
  }

  print () {
    let message = '';
    let title = this.iconFlag === 'mfol' ? 'Town Hall For Our Lives. ' : '';
    if (!this.moc) {
      return;
    }
    if (this.meetingType === 'Empty Chair Town Hall') {
      message = `${title} Members of your community have organized an ${this.meetingType} and invited ${this.moc} to speak with their constituents at ${this.time}, ${this.date}. Address: ${this.address}.`;
    } else if (this.meetingType === 'Tele-Town Hall') {
      message = `${title} ${this.moc} is holding a ${this.meetingType} at ${this.time}, ${this.date}. Connect: ${this.phoneNumber ? this.phoneNumber : this.link}`;
    } else {
      message = `${title} ${this.moc} is holding a ${this.meetingType} at ${this.time}, ${this.date}. Address: ${this.address}.`;
    }
    return message;
  }
};

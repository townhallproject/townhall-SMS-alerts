'use strict';
const moment = require('moment');
const lodash = require('lodash');
const firebasedb = require('../lib/firebaseinit');
const geometry = require('spherical-geometry-js');

const maxMeters = 100 * 1609.34;
const includeEventType = ['Town Hall', 'Campaign Town Hall', 'Empty Chair Town Hall']
const includeIconFlags = ['mfol'];

module.exports = class TownHall {
  
  constructor (fbtownhall){
    this.moc = fbtownhall.Member;
    this.district = fbtownhall.district || 'Senate';
    this.state = fbtownhall.state;
    this.link= fbtownhall.link || `https://townhallproject.com?eventId=${fbtownhall.eventId}`;
    this.eventId = fbtownhall.eventId;
    this.eventName = fbtownhall.eventName;
    this.address = fbtownhall.address;
    this.meetingType = fbtownhall.meetingType;
    this.iconFlag = fbtownhall.iconFlag;
    this.rsvpLink = fbtownhall.RSVP || null;
    this.location = fbtownhall.Location || null;
    this.date = fbtownhall.Date;
    this.dateObj = fbtownhall.dateObj;
    this.time = fbtownhall.Time;
    this.lat = fbtownhall.lat;
    this.lng = fbtownhall.lng;
  }

  includeTownHall (districts, location) {
    let townhall = this;
    let include = false;
    if (districts.length === 0) {
      throw new Error('The requested state not found');
    }

    if (!lodash.includes(includeEventType, townhall.meetingType) && !(lodash.includes(includeIconFlags, townhall.iconFlag))){
      return false;
    }
    
    let curLocation = new geometry.LatLng(Number(location.lat), Number(location.lng));
    districts.forEach((district) => {
      if (district.state === townhall.state) {
        if (townhall.district === 'Senate') {
          if (location.lat && townhall.lat) {
            const curDistance = geometry.computeDistanceBetween(
              curLocation,
              new geometry.LatLng(Number(townhall.lat), Number(townhall.lng)),
            );
            include = curDistance < maxMeters? true: false;
          } else {
            console.log('no location data', townhall.eventId)
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

  includeInQueue() {
    let include = false;
    if (this.iconFlag === 'in-person' || this.meetingType === 'Town Hall') {
      if (moment(this.dateObj).isAfter()) {
        include = true;
      }
    }
    return include;
  }

  lookupUsers() {
    let townhall = this;
    if (townhall.district === 'Senate') {
      let users = [];
      return new Promise(function(resolve, reject) {
        firebasedb.ref(`sms-users/${townhall.state}`).once('value').then((snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((district) => {
              district.forEach((user) => {
                users.push(user);
              });
            });
            resolve (users);
          } else {
            reject('no users for this townhall');
          }
        });
      });
    }
    return firebasedb.ref(`sms-users/${townhall.state}/${townhall.district}`).once('value');
  }

  print () {
    let message = ''
    let title = this.iconFlag === 'mfol' ? 'Town Hall For Our Lives. ' : '';
    if (this.meetingType === 'Empty Chair Town Hall'){
      message = `${title} Members of your commuity have organized an ${this.meetingType} and invited ${this.moc} to speak with their constituents at ${this.time}, ${this.date}. Address: ${this.address}.`
    } else {
      message = `${title} ${this.moc} is holding a ${this.meetingType} at ${this.time}, ${this.date}. Address: ${this.address}.`
    }
    return message;
  }
};

'use strict';
const moment = require('moment');
const firebasedb = require('../lib/firebaseinit');

module.exports = class TownHall {
  constructor (fbtownhall){
    this.moc = fbtownhall.Member;
    this.district = fbtownhall.district || 'Senate';
    this.state = fbtownhall.state;
    this.link= fbtownhall.link || `https://townhallproject.com?eventId=${fbtownhall.eventId}`;
    this.eventId = fbtownhall.eventId;
    this.address = fbtownhall.address;
    this.meetingType = fbtownhall.meetingType;
    this.iconFlag = fbtownhall.iconFlag;
    this.rsvpLink = fbtownhall.RSVP || null;
    this.location = fbtownhall.Location || null;
    this.date = fbtownhall.Date;
    this.dateObj = fbtownhall.dateObj;
    this.time = fbtownhall.Time;
  }

  includeTownHall (districts) {
    let townhall = this;
    let include = false;
    if (districts.length === 0) {
      throw new Error('The requested state not found');
    }

    districts.forEach((district) => {
      if (district.state === townhall.state) {
        if (townhall.district === 'Senate') {
          include = true;
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
    return `${this.moc} is holding a townhall at ${this.time}, ${this.date}. Address: ${this.address}.`;
  }
};

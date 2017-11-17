'use strict';

module.exports = class TownHall {
  constructor (fbtownhall){
    this.moc = fbtownhall.Member;
    this.district = fbtownhall.District;
    this.state = fbtownhall.state;
    this.link= fbtownhall.link || `https://townhallproject.com?eventId=${fbtownhall.eventId}`;
    this.eventId = fbtownhall.eventId;
    this.address = fbtownhall.address;
    this.meetingType = fbtownhall.meetingType;
    this.rsvpLink = fbtownhall.RSVP || null;
    this.location = fbtownhall.Location || null;
    this.date = fbtownhall.Date;
    this.time = fbtownhall.Time;
  }

  include (districtObj) {
    districtObj.states.forEach((state) => {
      if (state === this.state) {
        if (this.district === 'Senate') {
          return true;
        }
        districtObj.districts.forEach((district) => {
          if (this.district === district) {
            return true;
          }
        });
        return false;
      }
      return false;
    });
  }
};

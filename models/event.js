'use strict';

module.exports = class TownHall {
  constructor (fbtownhall){
    this.moc = fbtownhall.Member;
    this.district = fbtownhall.District;
    this.state = fbtownhall.state || fbtownhall.District.split('-')[0];
    this.link= fbtownhall.link || `https://townhallproject.com?eventId=${fbtownhall.eventId}`;
    this.eventId = fbtownhall.eventId;
    this.address = fbtownhall.address;
    this.meetingType = fbtownhall.meetingType;
    this.rsvpLink = fbtownhall.RSVP || null;
    this.location = fbtownhall.Location || null;
    this.date = fbtownhall.Date;
    this.time = fbtownhall.Time;
  }

  includeTownHall (districtObj) {
    let townhall = this;
    let include = false;

    districtObj.states.forEach((state) => {
      if (state === townhall.state) {
        if (townhall.district === 'Senate') {
          include = true;
        }
        districtObj.districts.forEach((district) => {
          if (townhall.district === district) {
            include = true;
          }
        });
      }
    });
    
    return include;
  }
};

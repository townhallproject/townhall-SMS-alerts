'use strict';

class TownHall {
  constructor (fbtownhall){
    this.moc = fbtownhall.Member;
    this.district = fbtownhall.District;
    this.state = fbtownhall.State;
    this.link= fbtownhall.link || `https://townhallproject.com?eventId=${fbtownhall.eventId}`;
    this.eventId = fbtownhall.eventId;
    this.address = fbtownhall.address;
    this.meetingType = fbtownhall.meetingType;
    this.rsvpLink = fbtownhall.RSVP || null;
    this.location = fbtownhall.Location || null;
    this.date = fbtownhall.Date;
    this.time = fbtownhall.Time;
  }
}

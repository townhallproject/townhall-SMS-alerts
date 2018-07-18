'use strict';

const Text = require('../texts');
const TownHall = require('../event');
const townhalldata = require('./mockTownHall');

let firebasemock = {
  update: jest.fn(() => {
    return true;
  }),
  child: function() {
    return this;
  },
};

describe('Text class', () => {
  describe('Text constructor', () => {
    test('it takes a user and a townhall and creates an object', () => {
      let user = {
        phoneNumber: 'number',
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      expect(newtext).toEqual({
        'body': 'Upcoming town hall:  Marc Veasey is holding a Town Hall at 9:30 AM, Fri, Nov 17, 2017. Address: TCC South Campus Recital Hall, 5301 Campus Dr, Fort Worth, TX 76119.', 'dateObj': 1510932600000, 'eventId': 'fb_149229795682973', 'phoneNumber': 'number', 'type': 'TX-33',    
      });
    });
  });

  describe('time and date check', () => {
    test('if the time is not 2 hours away, will return false', () => {
      let user = {
        phoneNumber: 'number',
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      newtext.dateObj = Date.now();
      let shouldSned = newtext.timeToSend();
      expect(shouldSned).toEqual(false);
    });

    test('if the time is great than 2 days away, will return false', () => {
      let user = {
        phoneNumber: 'number',
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      let date = new Date();
      let duration = 3; //In Days
      newtext.dateObj = date.setTime(date.getTime() + (duration * 24 * 60 * 60 * 1000));
      let shouldSned = newtext.timeToSend();
      expect(shouldSned).toEqual(false);
    });

    test('if the time is less than 2 days away, will return true', () => {
      let user = {
        phoneNumber: 'number',
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      let date = new Date();
      let duration = 1; //In Days
      newtext.dateObj = date.setTime(date.getTime() + (duration * 24 * 60 * 60 * 1000));
      let shouldSned = newtext.timeToSend();
      expect(shouldSned).toEqual(true);
    });
  });

  describe('Write to firebase', () => {
    test('it saves a text to the sms-queue', () => {
      let user = {
        phoneNumber: 'number',
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      let testing = newtext.writeToFirebase(firebasemock);
      expect(testing).toEqual(true);
    });
  });
});

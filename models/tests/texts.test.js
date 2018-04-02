'use strict';

const Text = require('../texts');
const TownHall = require('../event');
const townhalldata = require('./mockTownHall');

let firebasemock = {
  update: jest.fn(() => {
    return true;
  }),
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
        'body': ' Marc Veasey is holding a Town Hall at 9:30 AM, Fri, Nov 17, 2017. Address: TCC South Campus Recital Hall, 5301 Campus Dr, Fort Worth, TX 76119.', 'eventId': 'fb_149229795682973', 'phoneNumber': 'number',    
      });
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

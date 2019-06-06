'use strict';

const User = require('../user');
let req;

let firebasemock = {
  update: jest.fn((arg) => arg),
  child: function() {return this;},
  push: jest.fn((arg) => arg),
};

let resetMocks = () => {
  req = {
    body: {},
  };
};

describe('User class ', () =>{
  beforeEach(() => {
    resetMocks();
  });
  describe('write user to firebase ', () => {

    test('it should return the key with users phone number and zipcode', () => {
      req.body.From = '1504997866';
      req.zipcode = '98122';
      req.districts = [
        {
          state: 'CA',
          district: '09',
        },
      ];
      let newUser = new User(req);
      let testing = newUser.writeToFirebase(req, firebasemock);
      let key = `sms-users/${req.districts[0].state}/${req.districts[0].district}/${req.body.From}`;
      let result = { [key]: { phoneNumber: `${req.body.From}`, zipcode: `${req.zipcode}` }};
      expect(testing).toEqual(result);
    });
  });

  describe( 'User constructor', () => {
    test('it should return an instance of the User Model', () => {
      req.body.From = '1504997866';
      req.zipcode = '98122';
      let userObject = new User(req);
      expect(userObject).toEqual({'phoneNumber':'1504997866','zipcode':'98122'});
    });
  });

  describe('update attending method', () => {
    test('it should update firebase with event id if it exists', () => {
      req.body.From = '1504997866';
      req.zipcode = '98122';
      req.eventId = 'eventId';
      let userObject = new User(req);
      let testing = userObject.updateAttending(req, firebasemock);
      expect(testing).toEqual(req.eventId);
    });
  });

  describe('update attending method', () => {
    test('it should return resolved promise if no eventId', () => {
      req.body.From = '1504997866';
      req.zipcode = '98122';
      let userObject = new User(req);
      let testing = userObject.updateAttending(req, firebasemock);
      expect(testing).toEqual(Promise.resolve());
    });
  });

  describe('update cache method', () => {
    test('it update the cache with a new user and settings', () => {
      req.body.From = '1504997866';
      req.zipcode = '98122';
      req.hasbeenasked = true;
      let userObject = new User(req);
      let testing = userObject.updateCache(req, firebasemock);

      expect(testing.hasbeenasked).toEqual(true);
      expect(testing.stateDistrict).toEqual(false);
      expect(testing.eventId).toEqual(false);

    });
  });
});

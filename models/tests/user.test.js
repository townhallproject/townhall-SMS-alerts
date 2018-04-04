'use strict';

const User = require('../user');
let req;

let firebasemock = {
  update: jest.fn(() => true),
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
      expect(testing).toEqual(true);
    });
  });

  describe( 'User constructor', () =>{
    test('it should return an instance of the User Model', () => {
      req.body.From = '1504997866';
      req.zipcode = '98122';
      let userObject = new User(req);
      expect(userObject).toEqual({'phoneNumber':'1504997866','zipcode':'98122'});
    });
  });
});
